'use strict';


class Terrain {
  constructor(speedArg, typeArg, damageArg, isPassableArg) {
    this.speed = speedArg;
    this.type=typeArg;
    this.damage = damageArg;
    this.isPassable = isPassableArg;
  }
}



let grass = new Terrain (5, 'grass', 0, 1);

class Point {
  constructor(xArg, yArg) {
    this.x=xArg;
    this.y=yArg;
  }
}

class Map {
  constructor() {
    this.square = [];
    this.heightInSquares = 100;
    this.widthInSquares = 100;
    for (let i = 0; i < this.heightInSquares; i++) {
      this.square[i] = [];
      for (let j = 0; j < this.widthInSquares; j++) {
        if (i==0 || j==0 || i==99 || j==99)
        this.square[i][j]=grass;
        else
        this.square[i][j]=grass;

      }
    }

  }


  createArea(center, size, randomness, type) { ///using a DFS algorithm
    let queue = [];
    queue.push(center);
    let currentSize=0;
    while (queue.length!=0 && currentSize<size)
    {
      let current=queue.shift();
      if (this.square[current.y][current.x] === type)
      continue;
      this.square[current.y][current.x]=type;
      currentSize++;

      if (Math.random()<=randomness && current.x+1 >=1 && current.x+1 <=98 && current.y >= 1 && current.y <=98 && this.square[current.x+1][current.y] !== type) {
        let currentNew = new Point(current.x+1, current.y);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x >=1 && current.x <=98 && current.y+1 >= 1 && current.y+1 <=98 && this.square[current.x][current.y+1].type !== type) {
        let currentNew = new Point(current.x, current.y+1);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x-1 >=1 && current.x-1 <=98 && current.y >= 1 && current.y <=98 && this.square[current.x-1][current.y].type !== type) {
        let currentNew = new Point(current.x-1, current.y);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x >=1 && current.x <=98 && current.y-1 >= 1 && current.y-1 <=98 && this.square[current.x][current.y-1].type !== type) {
        let currentNew = new Point(current.x, current.y-1);
        queue.push(currentNew);
      }
    }
  }

  // createBuilding(x, y, width, height, numberOfDoors ) {

  //   this.createWall(x,y,width,"horizontally");
  //   this.createWall(x,y+height-1,width,"horizontally");
  //   this.createWall(x,y,height,"vertically");
  //   this.createWall(x+width-1,y,height,"vertically");

  //   while(numberOfDoors--)
  //   {
  //     let doorsX, doorsY;
  //     switch (Math.floor(Math.random()*4)) {
  //       case 0://east
  //         doorsX = x+width-1;
  //         doorsY = y+Math.floor(Math.random()*(height-4))+1;
  //         this.square[doorsY][doorsX] = floor;
  //         this.square[doorsY+1][doorsX] = floor;
  //         break;

  //       case 1://north
  //         doorsX = x+Math.floor(Math.random()*(width-4))+1;
  //         doorsY = y;
  //         this.square[doorsY][doorsX] = floor;
  //         this.square[doorsY][doorsX+1] = floor;

  //         break;

  //       case 2://west
  //         doorsX = x;
  //         doorsY = y+Math.floor(Math.random()*(height-4))+1;
  //         this.square[doorsY][doorsX] = floor;
  //         this.square[doorsY+1][doorsX] = floor;
  //         break;

  //       case 3://south
  //         doorsX = x+Math.floor(Math.random()*(width-4))+1;
  //         doorsY = y+height-1;
  //         this.square[doorsY][doorsX] = floor;
  //         this.square[doorsY][doorsX+1] = floor;
  //         break;
  //     }

  //   }//numberOfDoors is changed now

  //   for (let i=1;i<height-1;i++) {
  //     for (let j=1;j<width-1;j++) {
  //       this.square[y+i][x+j] = floor;
  //     }
  //   }
  // }

  // createBridge(x, y, size) {
  //   this.createWall(x,y,size,"vertically");
  //   this.createWall(x+size-1,y,size,"vertically");
  //   for (let i=1;i<size-1;i++) {
  //     for (let j=1;j<size-1;j++) {
  //       this.square[x+i][y+j] = floor;
  //     }
  //   }
  // }

  // createWall(x,y,length, direction) {
  //   for (let i=0; i<length; i++)
  //   {
  //     if(this.square[y][x+i] != floor && direction == 'horizontally') {
  //       this.square[y][x+i] = brick;
  //       continue;
  //     }
  //     if(this.square[y+i][x] != floor && direction == 'vertically') {
  //       this.square[y+i][x] = brick;
  //     }
  //   }
  // }
}
// class TeamManager {
//   constructor() {
//     this.teams = {}; // object to store teams and their players
//     this.playerCount = 0;
//   }

//   addPlayer(player) {
//     // check if team exists or create new team
//     if (this.teams[player.teamname]) {
//       if (this.teams[player.teamname].length >= 4) {
//         console.log("Team is full. Please join another team.");
//         return false;
//       }
//       this.teams[player.teamname].push(player);
//     } else {
//       this.teams[player.teamname] = [player];
//     }

//     this.playerCount++;
//     return true;
//   }
// }



class Player {

  constructor(xArg, yArg, healthArg, directionArg, nameArg, randomTeam, ) {

    this.x = xArg;
    this.y = yArg;
    this.health = healthArg;
    this.teamname = randomTeam;
    this.direction = directionArg;
    this.name = nameArg;
    this.weapon = new Revolver();
    this.score = 0;
    this.killedBy = "notAPlayer";
  }

  // joinTeam() {
  //   return this.teamManager.addPlayer(this);
  // }
}



class Bullet {
  constructor(xArg, yArg, directionArg, damageArg, ownerArg) {
    this.x = xArg;
    this.y = yArg;
    this.direction = directionArg;
    this.speed = 20;
    this.range = 800;
    this.distanceTraveled = 0;
    this.damage = damageArg;
    this.owner = ownerArg;
  };

}

class BulletPhysics {
  constructor () {
    this.bullets = [];
  }

  update(map) {
    for (let i=0; i<this.bullets.length; i++){
      this.bullets[i].x += this.bullets[i].speed * Math.cos(this.bullets[i].direction);
      this.bullets[i].y += this.bullets[i].speed * Math.sin(this.bullets[i].direction);
      this.bullets[i].distanceTraveled += this.bullets[i].speed;
      if (!map.square[Math.floor((this.bullets[i].y)/50)]?.[Math.floor((this.bullets[i].x)/50)]?.isPassable) {
        this.bullets.splice(i,1);
        i--;
      }
    }
  }

  checkRange() {
    let length = this.bullets.length;
    for (let i=0; i<length; i++) {
      if (this.bullets[i].distanceTraveled>=this.bullets[i].range) {
        this.bullets.splice(i,1);
        length--;
        i--;
      }

    }
  }

  checkHits(players) {
    for (let id in players)
    {
      let player=players[id];
      for (let i=0; i<this.bullets.length; i++) {
        if (this.bullets[i].x>=player.x-20 && this.bullets[i].x<=player.x+20 && this.bullets[i].y>=player.y-20 && this.bullets[i].y<=player.y+20) {
          player.health -= this.bullets[i].damage;
          if (player.health<=0)
            player.killedBy = this.bullets[i].owner;
          this.bullets.splice(i,1);
          i--;
        }
      }
    }
  }
}

class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Items {
  constructor(mapSquares) {
    this.array = [];
    this.generateItems(100, mapSquares);
  };


  generateItems(amount, mapSquares) {
    for (let i=0; i<amount; i++)
    {
      let item = new Item();
      switch( Math.floor(Math.random()*2) ) {
      }
      let newX, newY;
    do {
         newX = Math.random()*5000;
         newY = Math.random()*5000;
      }   while (!mapSquares[Math.floor(newX/50)][Math.floor(newY/50)].isPassable );

      item.x=newX;
      item.y=newY;

      this.array.push(item);
    }
  }
}




class Weapon extends Item {
  constructor(dmg, acc, fRate) {
    super();
    this.damage = dmg;
    this.accuracy = acc;
    this.spriteName = "null";
    this.triggered = 0;
    this.lastShot = new Date();
    this.fireRate = fRate; // in miliseconds
  };

  setBulletStats(bullet) {
    bullet.damage = this.damage;
  }
}


class SemiAutomaticWeapon extends Weapon {
  constructor(dmg, acc, fireRate) {
    super(dmg, acc, fireRate);
  };

  shoot (x, y, direction, bulletPhysics, shooter)
  {
    let time = new Date();
    if(!this.triggered && time - this.lastShot >= this.fireRate) {
      this.lastShot = time;
      let spread = (Math.random() - 0.5)*Math.PI*(100-this.accuracy)/100;
      let bullet = new Bullet(x +30*Math.cos(direction), y+30*Math.sin(direction), direction+spread, this.damage, shooter);
      this.setBulletStats(bullet);
      bulletPhysics.bullets.push(bullet);
      this.triggered = 1;
    }
  }
}



class Revolver extends SemiAutomaticWeapon {
  constructor() {
    super(600, 100, 500);
    this.spriteName = "revolver.png";
    this.spriteWidth = 30;
    this.spriteHeight = 18;
  }
}



class Entry {
  constructor(name, socketId, score, randomTeam) {
    this.Name = name;
    this.socketId = socketId;
    this.score = score;
    this.teamname = randomTeam;
    console.log(randomTeam);
  }
}

class Leaderboard {
  constructor() {
    this.array = [];
  }

  addEntry(name, socketId, score, teamname) {
    this.array.push(new Entry(name, socketId, score, teamname));
    this.sort();
  }

  addPoint(socketId) {
    for (let i=0; i<=this.array.length; i++ ) {
      if (this.array[i].socketId == socketId) {
      console.log("added");
        this.array[i].score++;
        break;
      }
    }
    this.sort();
  }

  sort() {
    this.array.sort(function(a, b) {
      return a.score < b.score;
    });
  }
}

class Model {
  constructor() {
    this.map = new Map();
    this.items = new Items(this.map.square);
    this.leaderboard = new Leaderboard();
  };

  getLeaderboard() {
    return this.leaderboard;
  }

  getMap() {
    return this.map;
  }
  getItems() {
    return this.items;
  }


  getNewPlayer(xArg, yArg, healthArg, directionArg, nameArg, randomTeam) {
    return new Player(xArg, yArg, healthArg, directionArg, nameArg, randomTeam);
  }

  getBulletPhysics(){
    return new BulletPhysics();
  }

  getBullet(xArg, yArg, directionArg){
    return new Bullet(xArg, yArg, directionArg);
  }

}


module.exports = Model;
