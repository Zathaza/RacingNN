var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            maxVelocity: 0.1,
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var car;
var cursors;
var maxAcceleration = 100;
var accelerate;
var currentDirection = 0;
var currentVelocity;
var turn;
var maxTurn = 3; //angle
var turnAngle;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('gtacar', 'images/Miara-GTA2.png');
    this.load.image('sky', 'images/sky.png');
}

function create()
{
    //car

    car = new Car();
    car = this.physics.add.sprite( car.x, car.y, 'gtacar').setScale(.2).setAngle(180);
    car.setCollideWorldBounds(true);
    car.setBounce(0.2);

    //walls

    walls = this.physics.add.staticGroup();
    walls.create(400, 300, 'sky').setScale(0.2).refreshBody();
    walls.create(240, 300, 'sky').setScale(0.2).refreshBody();
    walls.create(400, 180, 'sky').setScale(0.2).refreshBody();

    this.physics.add.collider(car, walls, lose, null, this);

    cursors = this.input.keyboard.createCursorKeys();
}

function lose() 
{
    car.disableBody(true, true);
}

function update ()
{

    if (cursors.left.isDown)
    {
        turn = 1;
    }
    if (cursors.right.isDown)
    {
        turn = -1;
    }
    if (!(cursors.left.isDown || cursors.right.isDown))
    {
        turn = 0;
    }

    if (cursors.up.isDown)
    {
        accelerate = 1;
    }
    else if (cursors.down.isDown)
    {
        accelerate = -1;
    }
    else if (car.body.velocity.x < 0.25 && car.body.velocity.y < 0.25)
    {
        accelerate = 0;
        car.body.velocity.x = 0;
        car.body.velocity.y = 0;
    }
    else if (car.body.velocity.x > 0 || car.body.velocity.y > 0)
    {
        accelerate = -0.25;
    }

    /*var NNoutput = NN();
    turn = NNoutput[0];
    accelerate = NNoutput[1];
    if (accelerate < 0) {
        accelerate *= 10;
    }*/

    if (car.body.velocity.x > 0 && car.body.velocity.y < 0)
    {
        currentDirection = Math.atan(Math.abs(car.body.velocity.y/car.body.velocity.x)) * (180 / Math.PI);
    }
    else if (car.body.velocity.x > 0 && car.body.velocity.y > 0)
    {
        currentDirection = 360 - Math.atan(Math.abs(car.body.velocity.y/car.body.velocity.x)) * (180 / Math.PI);
    }
    else if (car.body.velocity.x < 0 && car.body.velocity.y < 0)
    {
        currentDirection = 180 - Math.atan(Math.abs(car.body.velocity.y/car.body.velocity.x)) * (180 / Math.PI);
    }
    else if (car.body.velocity.x < 0 && car.body.velocity.y > 0)
    {
        currentDirection = 180 + Math.atan(Math.abs(car.body.velocity.y/car.body.velocity.x)) * (180 / Math.PI);
    } // ab hier ist mega dumm
    else if (car.body.velocity.x < 0)
    {
        currentDirection = 180;
    }
    else if (car.body.velocity.x > 0)
    {
        currentDirection = 0;
    }
    else if (car.body.velocity.y < 0)
    {
        currentDirection = 90;
    }
    else if (car.body.velocity.y > 0)
    {
        currentDirection = 270; 
    }

    turnAngle = (currentDirection + turn * maxTurn) % 360;
    currentVelocity = Math.sqrt(car.body.velocity.x * car.body.velocity.x + car.body.velocity.y * car.body.velocity.y);
    console.log("x velocity", car.body.velocity.x);
    console.log("y velocity", car.body.velocity.y);
    console.log(currentDirection);

 //   accelerate();

    if (turnAngle <= 90)
    {
        car.setVelocityY(-1 * Math.sin(turnAngle * (Math.PI / 180)) * currentVelocity);
        car.setVelocityX(Math.cos(turnAngle * (Math.PI / 180)) * currentVelocity);

        car.setAccelerationY(-1 * Math.sin(turnAngle * (Math.PI / 180)) * accelerate * maxAcceleration);
        car.setAccelerationX(Math.cos(turnAngle * (Math.PI / 180)) * accelerate * maxAcceleration);
    }
    else if (turnAngle <= 180)
    {
        car.setVelocityY(-1 * Math.sin((180 - turnAngle) * (Math.PI / 180)) * currentVelocity);
        car.setVelocityX(-1 * Math.cos((180 - turnAngle) * (Math.PI / 180)) * currentVelocity);

        car.setAccelerationY(-1 * Math.sin((180 - turnAngle) * (Math.PI / 180)) * accelerate * maxAcceleration);
        car.setAccelerationX(-1 * Math.cos((180 - turnAngle) * (Math.PI / 180)) * accelerate * maxAcceleration);
    }
    else if (turnAngle <= 270)
    {
        car.setVelocityY(Math.sin((turnAngle - 180) * (Math.PI / 180)) * currentVelocity);
        car.setVelocityX(-1 * Math.cos((turnAngle - 180) * (Math.PI / 180)) * currentVelocity);

        car.setAccelerationY(Math.sin((turnAngle - 180) * (Math.PI / 180)) * accelerate * maxAcceleration);
        car.setAccelerationX(-1 * Math.cos((turnAngle - 180) * (Math.PI / 180)) * accelerate * maxAcceleration);
    }
    else
    {
        car.setVelocityY(Math.sin((360 - turnAngle) * (Math.PI / 180)) * currentVelocity);
        car.setVelocityX(Math.cos((360 - turnAngle) * (Math.PI / 180)) * currentVelocity);

        car.setAccelerationY(Math.sin((360 - turnAngle) * (Math.PI / 180)) * accelerate * maxAcceleration);
        car.setAccelerationX(Math.cos((360 - turnAngle) * (Math.PI / 180)) * accelerate * maxAcceleration);
    }

    car.setAngle(180 - currentDirection);
    accelerate = 0;

}