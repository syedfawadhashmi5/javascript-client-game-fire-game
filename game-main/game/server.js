'use strict';

let Model =  require ('./static/server/Model.js');
let model = new Model();
let express = require('express');
let http = require('http');
let path = require('path');
let socketIO = require('socket.io');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('port', 54070);
app.use('/static', express.static(__dirname + '/static'));


// Routing
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../index.html'));

});

app.get('/menu.css', function(req, res) {
  res.sendFile(path.join(__dirname + '/../menu.css'));
});

app.get('/help.html', function(req, res) {
  res.sendFile(path.join(__dirname + '/../help.html'));
});

app.get('/img/mouse.png', function(req, res) {
  res.sendFile(path.join(__dirname + '/../img/mouse.png'));
});

app.get('/img/wasd.jpg', function(req, res) {
  res.sendFile(path.join(__dirname + '/../img/wasd.jpg'));
});

app.post('/goGame', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
  console.log(req.body);
  playersInQueue.push(req.body.nick);
});

// Working code
server.listen(3000, "0.0.0.0", function(){
  console.log('listening on *:3000');
});

// server.listen(80, "119.73.97.35", function(){
//   console.log('listening on *:3000');
// });

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})


let bulletPhysics = model.getBulletPhysics();
let players = {};
let playersInQueue = [];
let redTeam = []; // array to store users on the red team
let blueTeam = [];


io.on('connection', function(socket) {
  socket.on('new player', function() {


    let randomTeam = Math.floor(Math.random() * 2); // 0 or 1

    // Add the user to the corresponding team array
    if (randomTeam === 0) {
      redTeam.push(socket.id);
    } else {
      blueTeam.push(socket.id);
    }
    
    // Convert the randomTeam variable to a color name
    randomTeam = (randomTeam === 0) ? 'red' : 'blue';
    
    let x, y;
    if (playersInQueue.length > 0) {
      do {
        x = Math.floor(Math.random() * 5000);
        y = Math.floor(Math.random() * 5000);
      } while (!model.map.square[Math.floor(y / 50)][Math.floor(x / 50)].isPassable);
      players[socket.id] = model.getNewPlayer(x, y, 1000, 0, playersInQueue.shift(), randomTeam);
    } else {
      players[socket.id] = model.getNewPlayer(500, 500, 0, 0, 'noName', randomTeam);
    }

    console.log("Player connected: " + players[socket.id].name + " " + socket.id + " " + randomTeam);
    if(players[socket.id].length > 4){
      console.log('stop')
    }else {
      socket.emit('randomTeam', randomTeam);
    model.leaderboard.addEntry(players[socket.id].name, socket.id, 0, randomTeam);
    }
  });

  socket.on('disconnect', function() {
    for (let i=0; i<model.leaderboard.array.length; i++) {
      if  (model.leaderboard.array[i].socketId == socket.id) {
        model.leaderboard.array.splice(i,1);
        break;
      }

    }
    delete players[socket.id];
  });

  socket.on('input', function(input) {
    let player = players[socket.id] || {};

    if (isNaN(player.y)) {
      player.y = 0;
    }
    
    if (isNaN(player.x)) {
      player.x = 0;
    }


    // Code by chatgpt
    
    let speed = 0; // default speed value
    if (model.map.square && model.map.square[Math.floor((player.y)/50)] && model.map.square[Math.floor((player.y)/50)][Math.floor((player.x)/50)]) {
      speed = model.map.square[Math.floor((player.y)/50)][Math.floor((player.x)/50)].speed;
    }
    let oldX = player.x;
    let oldY = player.y;
    player.direction=input.direction;
    // calculate new player position
    let newX = player.x + speed * (input.right - input.left);
    let newY = player.y + speed * (input.down - input.up);
    // check if new position is passable
    let playerSquareX = Math.floor(newX / 50);
    let playerSquareY = Math.floor(newY / 50);
    if (
      model.map.square &&
      model.map.square[playerSquareY] &&
      model.map.square[playerSquareY][playerSquareX] &&
      model.map.square[playerSquareY][playerSquareX].isPassable
    ) {
      // update player position if new position is passable
      player.x = newX;
      player.y = newY;
    }
    // update player health and direction
    const square = model.map.square[playerSquareY]?.[playerSquareX];
    if (square && square.damage !== undefined) {
      player.health -= square.damage;
    }
    // player.health -= model.map.square[playerSquareY][playerSquareX].damage;
    player.direction = input.direction;
    // handle collisions with adjacent walls
    if (
      !model.map.square[playerSquareY] ||
      !model.map.square[playerSquareY][Math.floor(oldX / 50)] ||
      !model.map.square[playerSquareY][playerSquareX] ||
      !model.map.square[playerSquareY][playerSquareX].isPassable ||
      !model.map.square[playerSquareY][Math.floor(oldX / 50)].isPassable ||
      !model.map.square[playerSquareY][Math.floor(player.x / 50)].isPassable
    ) {
      // restore previous position if collision detected
      player.x = oldX;
      player.y = oldY;
    }
    if (
      !model.map.square ||
      !model.map.square[Math.floor(oldY / 50)] ||
      !model.map.square[playerSquareY] ||
      !model.map.square[playerSquareY][Math.floor(player.x / 50)] ||
      !model.map.square[Math.floor(oldY / 50)][Math.floor(player.x / 50)] ||
      !model.map.square[Math.floor(oldY / 50)][Math.floor(player.x / 50)].isPassable ||
      !model.map.square[playerSquareY][Math.floor(player.x / 50)].isPassable
    ) {
      player.y = oldY;
    }

    if (input.LMB == true)
      player.weapon.shoot( player.x, player.y, player.direction, bulletPhysics, socket.id);
    else
    
    if (!player.weapon) {
      player.weapon = {};
    }

      player.weapon.triggered = 0;
  });


});

let playerMap=[];//used to send map to players, they get only 21x17 squares
for (let i = 0; i < 17; i++) {
  playerMap[i] = [];
  for (let j = 0; j < 21; j++) {
    playerMap[i][j]='grass';
  }
}

setInterval(function() {
  bulletPhysics.checkRange();
  bulletPhysics.update(model.getMap());
  bulletPhysics.checkHits(players);
  // model.getItems().checkColissions(players);


  for (let key in players) {
    let thisPlayer=players[key];
    let thisPlayerAbsolute=thisPlayer;
    let emitPlayers = JSON.parse(JSON.stringify(players));
    // console.log(emitPlayers);
    for (let key2 in emitPlayers) {
      emitPlayers[key2].x=emitPlayers[key2].x - thisPlayer.x + 500;
      emitPlayers[key2].y=emitPlayers[key2].y - thisPlayer.y + 400;
    }

    if (io.sockets.connected[key] && thisPlayer.health <= 0) {
      if (io.sockets.connected[thisPlayer.killedBy]) {
        model.leaderboard.addPoint(thisPlayer.killedBy);
        }
      // thisPlayer.dropItem(model.getItems().array);
      io.to(key).emit('death');
      io.sockets.connected[key].disconnect();
      continue;
    }

    /////////////////////////////////////////////////////////////////////////////////////

    io.on('connection', (socket) => {    
      // Add the limitedplayer() function here
      function limitedplayer() {
        socket.on('new player', function(newPlayer) {
          // check if the number of players exceeds 4 and send a message back to the client
          console.log(Object.keys(io.sockets.connected))
          if (Object.keys(io.sockets.connected).length > 4) {
            socket.emit('game full', { message: 'The game is full' });
            socket.disconnect();
          }
        });
      }
    
      limitedplayer();
    
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
    


    for (let i = 0; i < 17; i++) {
      for (let j = 0; j < 21; j++) {
        playerMap[i][j]=model.map.square[Math.min(Math.max(Math.floor(players[key].y/50)-8+i , 0) , 99)]
        [Math.min(Math.max(Math.floor(players[key].x/50)-10+j , 0) , 99)].type;
      }
    }

    io.to(key).emit('update', emitPlayers, thisPlayer, thisPlayerAbsolute, playerMap, bulletPhysics.bullets, model.getItems().array, model.leaderboard.array);
  }}, 1000 / 60);





  ////////////////////////////////////////////////////////////////////////////////
