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
let timer;
let trash;
let gameOver = false;

function preload ()
{
    this.load.image('sky', imgFilePath + 'assets/images/space2.png');
    this.load.image('truck', imgFilePath + 'assets/images/alienbusters.png');
    this.load.image('asteroid', imgFilePath + 'assets/images/red_ball.png');
    this.load.image('apple', imgFilePath + 'assets/images/apple.png');
    console.log('host = ' + host);
}

function create ()
{
    this.add.image(400, 300, 'sky');

    player = this.physics.add.sprite(400, 100, 'truck');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    asteroids = this.physics.add.group();
    trash = this.physics.add.group();
    
    timer = this.time.addEvent({
        timer: Phaser.Timer, 
        delay: Phaser.Math.Between(1000, 3000), 
        loop: true, 
        callback: createAsteroids
    }); 
    //add trash event
    //add trash collider
    //add scoreboard

    this.physics.add.collider(player, asteroids, hitAsteroid, null, this);
    console.log(gameOver);
    
}
function createAsteroids() {
    let instance = asteroids.create(Phaser.Math.Between(0, 600), 0, 'asteroid');
    instance.setVelocityY(Phaser.Math.Between(100, 400));
}
function hitAsteroid (player, asteroid) {
    this.physics.pause();
    gameOver = true;
}
// function createTrash() {
//     let instance = trash
// }

function update() {
    if(!gameOver) {
        if (cursors.up.isDown) {
            player.y -= 10;
            console.log("up key");
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

    if(gameOver) {
        timer.paused = true;
    }
}

// asteroids = this.physics.add.group({ 
    //     key: 'asteroid', 
    //     repeat: 11, 
    //     setXY: { x: 0, y: Phaser.Math.Between(0, 600)},
    //     stepY: 70 
    // })

    //let emitter = new Phaser.Events.EventEmitter();
    //emitter.on('addAsteroid', creatAsteroids, this);
    //emitter.emit('addAsteroid');