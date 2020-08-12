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
    this.add.image(400, 300, 'sky');
    scoreText = this.add.text(16, 16, `Score: 0`, { fontSize: '32px', fill: '#FFF' });

    player = this.physics.add.sprite(400, 100, 'truck');
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    asteroids = this.physics.add.group();
    trash = this.physics.add.group();

    let particles = this.add.particles('blue');

    emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 0.5, end: 0.25 },
        blendMode: 'ADD',
        angle: {min: 15, max: 90}
    });
    
    timer = this.time.addEvent({
        timer: Phaser.Timer, 
        delay: Phaser.Math.Between(1000, 3000), 
        loop: true, 
        callback: createAsteroids
    }); 

    trashCreate = this.time.addEvent({
        timer: Phaser.Timer,
        delay: Phaser.Math.Between(500, 2000),
        loop: true,
        callback: createTrash
    })

    this.physics.add.collider(player, asteroids, hitAsteroid, null, this);
    this.physics.add.collider(player, trash, eatTrash, null, this);
    
}
function createAsteroids() {
    let instance = asteroids.create(Phaser.Math.Between(0, 800), 0, 'asteroid');
    instance.setVelocityY(Phaser.Math.Between(100, 400));
    emitter.startFollow(instance);
}
function hitAsteroid (player, asteroid) {
    this.physics.pause();
    gameOver = true;
}
function createTrash() {
    let instance = trash.create(0, Phaser.Math.Between(0, 600), trashArr[Phaser.Math.Between(0, trashArr.length-1)]);
    instance.setVelocityX(Phaser.Math.Between(50, 300));
}
function eatTrash(player, trashInstance) {
    trashInstance.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}

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
        trashCreate.paused = true;
        this.add.text(200, 200, 'GAME OVER', { fontSize: '64px', fill: '#FFF'})
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