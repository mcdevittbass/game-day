const host = window.location.hostname;
let imgFilePath;
if (host === 'localhost') {
    imgFilePath = '';
} else {
    imgFilePath = '/game-day/';
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 300 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let cursors;
let player;
let asteroids;
let asteroidCreate;
let trashCreate;
let trash;
let emitter;
let gameOver = false;
let score = 0;
let scoreText;
const trashArr = ['apple', 'cokecan', 'crate', 'poo'];

function preload ()
{
    this.load.image('sky', imgFilePath + 'assets/images/space2.png');
    this.load.image('truck', imgFilePath + 'assets/images/alienbusters.png');
    this.load.image('asteroid', imgFilePath + 'assets/images/blue_ball.png');
    this.load.image('apple', imgFilePath + 'assets/images/apple-core.png');
    this.load.image('cokecan', imgFilePath + 'assets/images/cokecan.png');
    this.load.image('crate', imgFilePath + 'assets/images/crate.png');
    this.load.image('poo', imgFilePath + 'assets/images/poo.png');
    this.load.image('blue', imgFilePath + 'assets/images/blue.png');
    console.log('host = ' + host);
}

function create ()
{
    //render background image
    this.add.image(400, 300, 'sky');
    //render scoreboard
    scoreText = this.add.text(16, 16, `Score: 0`, { fontSize: '32px', fill: '#FFF' });
    //add player sprite
    player = this.physics.add.sprite(400, 100, 'truck');
    player.setBounce(0);
    player.setCollideWorldBounds(true);
    //create cursor keys for arrow usage
    cursors = this.input.keyboard.createCursorKeys();
    //create groups of sprites 
    asteroids = this.physics.add.group();
    trash = this.physics.add.group();
    //give asteroids trails
    let particles = this.add.particles('blue');

    emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 0.5, end: 0.25 },
        blendMode: 'ADD',
        angle: {min: 15, max: 90}
    });
    //create asteroid instances over time
    asteroidCreate = this.time.addEvent({
        timer: Phaser.Timer, 
        delay: Phaser.Math.Between(1000, 3000), 
        loop: true, 
        callback: createAsteroids
    }); 
    //create trash instances over time
    trashCreate = this.time.addEvent({
        timer: Phaser.Timer,
        delay: Phaser.Math.Between(500, 2000),
        loop: true,
        callback: createTrash
    })
    //create collider functionality
    this.physics.add.collider(player, asteroids, hitAsteroid, null, this);
    this.physics.add.collider(player, trash, eatTrash, null, this);
    
}

function update() {
    //create movement with arrow presses
    if (!gameOver) {
        if (cursors.up.isDown) {
            player.y -= 10;
        }
        else if (cursors.down.isDown) {
            player.y += 10;
        }
        else if (cursors.left.isDown) {
            player.x -= 10;
        }
        else if (cursors.right.isDown) {
            player.x += 10;
        } 
    }
    //end game
    if(gameOver) {
        asteroidCreate.paused = true;
        trashCreate.paused = true;
        this.add.text(200, 200, 'GAME OVER', { fontSize: '64px', fill: '#FFF'})
    }
}

//create instance of asteroid and set placement and velocity randomly
function createAsteroids() {
    let instance = asteroids.create(Phaser.Math.Between(0, 800), 0, 'asteroid');
    instance.setVelocityY(Phaser.Math.Between(100, 400));
    emitter.startFollow(instance);
}
//end game if collision with asteroid
function hitAsteroid (player, asteroid) {
    this.physics.pause();
    gameOver = true;
}
//create instance of trash and set placement, image, and velocity randomly
function createTrash() {
    let instance = trash.create(0, Phaser.Math.Between(0, 600), trashArr[Phaser.Math.Between(0, trashArr.length-1)]);
    instance.setVelocityX(Phaser.Math.Between(50, 300));
}
//add points for collision with trash and remove that instance
function eatTrash(player, trashInstance) {
    trashInstance.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}
