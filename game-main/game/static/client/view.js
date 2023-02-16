'use strict';
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

// var data;

document.addEventListener('DOMContentLoaded', function() {
  socket.on("game full", data => {
    console.log("userImage", data.message,)
    window.location.href='https://shattereddisk.github.io/rickroll/rickroll.mp4';
  })
});

// console.log(data)

let app = new PIXI.Application({
  width: controller.width,
  height: controller.height,
  antialias: true,
  transparent: false,
  resolution: 1
}
);

let userImages = {};

let images = [
  "static/client/sprites/red-ball.png",
  "static/client/sprites/blue-ball.jpg",
];
let imageIndex = Math.floor(Math.random() * images.length);
userImages = images;


let imageUser = `<img style="width: 100px; height: 100px;" src="${userImages}" />`;

PIXI.loader
.add("static/client/sprites/grass.png")

.add(userImages)
.add("static/client/sprites/revolver.png")
.add("static/client/sprites/bullet.png")
.add("static/client/sprites/dead.png")
.load(setup);
function setup() {
controller.newPlayer();
controller.emitInput();
controller.listenToUpdate();
controller.listenToDeath();
app.ticker.add(delta => gameLoop(delta));
}



function gameLoop(delta){
app.stage.removeChildren();
if (controller.mode == 'dead')
{
  let deadSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/dead.png'].texture);
  deadSprite.position.set(0,0);
  app.stage.addChild(deadSprite);
  return;
}

for (let i = 0; i < 17; i++) {
  for (let j = 0; j < 21; j++) {
    let square = new PIXI.Sprite(PIXI.loader.resources[gameMap.square[i][j].path].texture);
    square.x=controller.squareWidthInPixels*j-currentPlayer.xAbsolute%50;
    square.y=controller.squareHeightInPixels*i-currentPlayer.yAbsolute%50;
    app.stage.addChild(square);
  }
}
for (let id in players) {
  let player = players[id];
  // Assuming userImages is an array with two elements, the first for red team and the second for blue team
let userTeam = player.teamname; // Or 'blue', depending on the user's team

// Determine which image to use based on user's team
let userImageIndex = userTeam === 'red' ? 0 : 1;

// Create player sprite with the appropriate texture

  let playerSprite = new PIXI.Sprite(PIXI.loader.resources[userImages[userImageIndex]].texture);

  playerSprite.width = 100;
  playerSprite.height = 100;
    playerSprite.anchor.set(0.5,0.5);
  playerSprite.position.set(player.x,player.y);
  app.stage.addChild(playerSprite);

// console.log(player.teamname)

  // let weaponSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/'+player.weapon.spriteName].texture);
  // weaponSprite.anchor.set(0.5,0.5);
  // weaponSprite.rotation = player.direction;
  // weaponSprite.x=player.x+10*Math.cos(player.direction);
  // weaponSprite.y=player.y+10*Math.sin(player.direction);
  // app.stage.addChild(weaponSprite);

  // Player Team name
  let teamname = new PIXI.Text(player.teamname);
  teamname.style = {fill: 'white', stroke: 'black', strokeThickness: 5};
  teamname.anchor.set(0.5,0.5);
  teamname.position.set(player.x, player.y-55);
  app.stage.addChild(teamname);



  let name = new PIXI.Text(player.name);
  name.style = {fill: 'white', stroke: 'black', strokeThickness: 2};
  name.anchor.set(0.5,0.5);
  name.position.set(player.x, player.y-55);
  app.stage.addChild(name);

  let redBar = new PIXI.Graphics();
  redBar.lineStyle(1, 0x000000, 1);
  redBar.beginFill(0xFF0000);
  redBar.drawRect(player.x-40, player.y-40, 80, 10);
  redBar.endFill();
  app.stage.addChild(redBar);

  let greenBar = new PIXI.Graphics();
  greenBar.lineStyle(1, 0x000000, 1);
  greenBar.beginFill(0x008111);
  greenBar.drawRect(player.x-40, player.y-40, Math.max(0,player.health*(80/1000)), 10);
  greenBar.endFill();
  app.stage.addChild(greenBar);
}



// let len = items.length;
// for (let i=0; i<len; i++){
//   let itemSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/' + items[i].spriteName].texture);

//   itemSprite.anchor.set(0.5,0.5);
//   itemSprite.x = items[i].x-currentPlayer.xAbsolute+500;
//   itemSprite.y = items[i].y-currentPlayer.yAbsolute+400;
//   app.stage.addChild(itemSprite);
// }

let length = bullets.length;
for (let i=0; i<length; i++){
  let bulletSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/bullet.png'].texture);

  bulletSprite.anchor.set(0.5,0.5);
  bulletSprite.x = bullets[i].x-currentPlayer.xAbsolute+500;
  bulletSprite.y = bullets[i].y-currentPlayer.yAbsolute+400;
  app.stage.addChild(bulletSprite);
}

let miniMap = new PIXI.Graphics();
miniMap.lineStyle(1, 0x000000, 1);
miniMap.beginFill('black', 0.5);
miniMap.drawRect(680, 680, 100, 100);
miniMap.endFill();
app.stage.addChild(miniMap);
for (let id in players) {
  let player = players[id];
  let pointPlayer = new PIXI.Graphics();

  if(player.x == 500 && player.y == 400)
    pointPlayer .beginFill(0x008111);
  else
    pointPlayer .beginFill(0xFF0000);
  pointPlayer.drawCircle(680+(player.x+currentPlayer.xAbsolute-500)/5000*100, 680+(player.y+currentPlayer.yAbsolute-400)/5000*100, 3);
  pointPlayer.endFill();
  app.stage.addChild(pointPlayer);
}

let leaderboardBackground = new PIXI.Graphics();
leaderboardBackground.lineStyle(2, 0x000000, 0.7);
leaderboardBackground.beginFill('black', 0.3);
leaderboardBackground. drawRoundedRect(590, 10, 200, 200, 10);
leaderboardBackground.endFill();
app.stage.addChild(leaderboardBackground);

let leaderboardVerticalLine = new PIXI.Graphics();

leaderboardVerticalLine.beginFill(0x000000, 0.7);
leaderboardVerticalLine.drawRect(730, 20, 2, 180);
leaderboardVerticalLine.endFill();
app.stage.addChild(leaderboardVerticalLine);

let leaderboardHorizontalLine = new PIXI.Graphics();

leaderboardHorizontalLine.beginFill(0x000000, 0.7);
leaderboardHorizontalLine.drawRect(600, 40, 180, 2);
leaderboardHorizontalLine.endFill();
app.stage.addChild(leaderboardHorizontalLine);


// console.log(leaderboard);

  let leaderboardTitle = new PIXI.Text("NICK              KILLS");
  leaderboardTitle.style = {fill: 'white', strokeThickness: 0, fontSize: 15};
  leaderboardTitle.position.set(650, 20);
  app.stage.addChild(leaderboardTitle);

    for (let i=0; i<leaderboard.length; i++ ) {
      let entryName = new PIXI.Text(i+1+". " + leaderboard[i].teamname);
      entryName.anchor.set(0.5,0.5);
      entryName.style = {fill: 'white', strokeThickness: 0, fontSize: 15};
      entryName.position.set(660, 55+i*20);
      app.stage.addChild(entryName);

      let entryKills = new PIXI.Text(leaderboard[i].score);
      entryKills.anchor.set(0.5,0.5);
      entryKills.style = {fill: 'white', strokeThickness: 0, fontSize: 15};
      entryKills.position.set(760, 55+i*20);
      app.stage.addChild(entryKills);

      if(i>=7)
        break;
    }
}
