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

var sensorStraight;
var sensorLeft;
var sensorRight;
var car;
var cursors;
var maxAcceleration = 100;
var accelerate;
var currentDirection = 0;
var currentVelocity;
var turn;
var maxTurn = 3; //angle
var turnAngle;

var straightX;
var straightY;
var leftX;
var leftY;
var rightX;
var rightY;
var distStraight;
var distLeft;
var distRight;

var counter = 0; // 0 to 19
var scores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('gtacar', 'images/Miara-GTA2.png');
    this.load.image('sky', 'images/sky.png');
    this.load.image('green', 'images/green.png');
}

function create()
{
    //car

    car = new Car();
    car = this.physics.add.sprite(car.x, car.y, 'gtacar').setScale(.2).setAngle(180);
    car.setCollideWorldBounds(true);
    car.setBounce(0.2);

    //walls

    walls = this.physics.add.staticGroup();
    walls.create(400, 300, 'sky').setScale(0.2).refreshBody();
    walls.create(240, 300, 'sky').setScale(0.2).refreshBody();
    walls.create(400, 180, 'sky').setScale(0.2).refreshBody();
    walls.create(400, 600, 'sky').setScale(2, 0.2).refreshBody();
    walls.create(0, 300, 'sky').setScale(0.2, 2).refreshBody();
    walls.create(800, 300, 'sky').setScale(0.2, 2).refreshBody();
    walls.create(400, 0, 'sky').setScale(2, 0.2).refreshBody();
    walls.create(120, 330, 'sky').setScale(0.1).refreshBody();
    walls.create(320, 390, 'sky').setScale(0.2, 0.1).refreshBody();
    walls.create(480, 390, 'sky').setScale(0.2, 0.1).refreshBody();
    walls.create(400, 435, 'sky').setScale(0.2, 0.05).refreshBody();

    this.physics.add.collider(car, walls, lose, null, this);

    //end zone
    goal = this.physics.add.staticSprite(120, 270, 'green').setScale(0.27, 0.2).refreshBody();

    this.physics.add.collider(car, goal, win, null, this);

    //sensor particles
    sensorStraight = this.physics.add.sprite(100, 400, 'gtacar').setScale(.2).setAngle(180);
    this.physics.add.collider(sensorStraight, walls, sensorStraightPos, null, this);
    sensorStraight.setBounce(0);
    sensorStraightVel();

    sensorLeft = this.physics.add.sprite(100, 400, 'gtacar').setScale(.2).setAngle(150);
    this.physics.add.collider(sensorLeft, walls, sensorLeftPos, null, this);
    sensorLeft.setBounce(0);
    sensorLeftVel();

    sensorRight = this.physics.add.sprite(100, 400, 'gtacar').setScale(.2).setAngle(210);
    this.physics.add.collider(sensorRight, walls, sensorRightPos, null, this);
    sensorRight.setBounce(0);
    sensorRightVel();

    //controls
    cursors = this.input.keyboard.createCursorKeys();
}

function sensorRightPos()
{
    //sensorStraight.setVelocity(500);
    rightX = sensorRight.body.position.x;
    rightY = sensorRight.body.position.y;
    sensorRight.body.position.x = car.body.position.x;
    sensorRight.body.position.y = car.body.position.y;
    sensorRight.setAngle(210 - currentDirection);
    sensorRightVel();
}

function sensorRightVel()
{
    turnAngle = (currentDirection-30) % 360;
    /*var y = Math.pow(Math.sin(turnAngle), 2)*2000;
    var x = Math.pow(Math.cos(turnAngle), 2)*2000;*/
    var y = 2000;
    var x = 2000;
    if (turnAngle <= 90)
    {
        sensorRight.setVelocityY(-1 * Math.sin(turnAngle * (Math.PI / 180)) * y);
        sensorRight.setVelocityX(Math.cos(turnAngle * (Math.PI / 180)) * x);
    }
    else if (turnAngle <= 180)
    {
        sensorRight.setVelocityY(-1 * Math.sin((180 - turnAngle) * (Math.PI / 180)) * y);
        sensorRight.setVelocityX(-1 * Math.cos((180 - turnAngle) * (Math.PI / 180)) * x);
    }
    else if (turnAngle <= 270)
    {
        sensorRight.setVelocityY(Math.sin((turnAngle - 180) * (Math.PI / 180)) * y);
        sensorRight.setVelocityX(-1 * Math.cos((turnAngle - 180) * (Math.PI / 180)) * x);
    }
    else
    {
        sensorRight.setVelocityY(Math.sin((360 - turnAngle) * (Math.PI / 180)) * y);
        sensorRight.setVelocityX(Math.cos((360 - turnAngle) * (Math.PI / 180)) * x);
    }
}

function sensorLeftPos()
{
    //sensorStraight.setVelocity(500);
    leftX = sensorLeft.body.position.x;
    leftY = sensorLeft.body.position.y;
    sensorLeft.body.position.x = car.body.position.x;
    sensorLeft.body.position.y = car.body.position.y;
    sensorLeft.setAngle(150 - currentDirection);
    sensorLeftVel();
}

function sensorLeftVel()
{
    turnAngle = (currentDirection+30) % 360;
    /*var y = Math.pow(Math.sin(turnAngle), 2)*2000;
    var x = Math.pow(Math.cos(turnAngle), 2)*2000;*/
    var y = 2000;
    var x = 2000;
    if (turnAngle <= 90)
    {
        sensorLeft.setVelocityY(-1 * Math.sin(turnAngle * (Math.PI / 180)) * y);
        sensorLeft.setVelocityX(Math.cos(turnAngle * (Math.PI / 180)) * x);
    }
    else if (turnAngle <= 180)
    {
        sensorLeft.setVelocityY(-1 * Math.sin((180 - turnAngle) * (Math.PI / 180)) * y);
        sensorLeft.setVelocityX(-1 * Math.cos((180 - turnAngle) * (Math.PI / 180)) * x);
    }
    else if (turnAngle <= 270)
    {
        sensorLeft.setVelocityY(Math.sin((turnAngle - 180) * (Math.PI / 180)) * y);
        sensorLeft.setVelocityX(-1 * Math.cos((turnAngle - 180) * (Math.PI / 180)) * x);
    }
    else
    {
        sensorLeft.setVelocityY(Math.sin((360 - turnAngle) * (Math.PI / 180)) * y);
        sensorLeft.setVelocityX(Math.cos((360 - turnAngle) * (Math.PI / 180)) * x);
    }
}

function sensorStraightPos()
{
    //sensorStraight.setVelocity(500);
    straightX = sensorStraight.body.position.x;
    straightY = sensorStraight.body.position.y;
    sensorStraight.body.position.x = car.body.position.x;
    sensorStraight.body.position.y = car.body.position.y;
    sensorStraight.setAngle(180 - currentDirection);
    sensorStraightVel();
}

function sensorStraightVel()
{
    turnAngle = (currentDirection) % 360;
    /*var y = Math.pow(Math.sin(turnAngle), 2)*2000;
    var x = Math.pow(Math.cos(turnAngle), 2)*2000;*/
    var y = 2000;
    var x = 2000;
    if (turnAngle <= 90)
    {
        sensorStraight.setVelocityY(-1 * Math.sin(turnAngle * (Math.PI / 180)) * y);
        sensorStraight.setVelocityX(Math.cos(turnAngle * (Math.PI / 180)) * x);
    }
    else if (turnAngle <= 180)
    {
        sensorStraight.setVelocityY(-1 * Math.sin((180 - turnAngle) * (Math.PI / 180)) * y);
        sensorStraight.setVelocityX(-1 * Math.cos((180 - turnAngle) * (Math.PI / 180)) * x);
    }
    else if (turnAngle <= 270)
    {
        sensorStraight.setVelocityY(Math.sin((turnAngle - 180) * (Math.PI / 180)) * y);
        sensorStraight.setVelocityX(-1 * Math.cos((turnAngle - 180) * (Math.PI / 180)) * x);
    }
    else
    {
        sensorStraight.setVelocityY(Math.sin((360 - turnAngle) * (Math.PI / 180)) * y);
        sensorStraight.setVelocityX(Math.cos((360 - turnAngle) * (Math.PI / 180)) * x);
    }
}

function update ()
{
    distStraight = Math.sqrt(Math.pow((car.body.position.x - straightX), 2) + Math.pow((car.body.position.y - straightY), 2));
    distLeft = Math.sqrt(Math.pow((car.body.position.x - leftX), 2) + Math.pow((car.body.position.y - leftY), 2));
    distRight = Math.sqrt(Math.pow((car.body.position.x - rightX), 2) + Math.pow((car.body.position.y - rightY), 2));

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
    else if (Math.abs(car.body.velocity.x) < 0.25 && Math.abs(car.body.velocity.y) < 0.25)
    {
        accelerate = 0;
        car.body.velocity.x = 0;
        car.body.velocity.y = 0;
    }
    else if (Math.abs(car.body.velocity.x) > 0 || Math.abs(car.body.velocity.y) > 0)
    {
        accelerate = -0.25;
    }

    /*var NNoutput = NN(distStraight, distLeft, distRight, counter);
    turn = NNoutput[0];
    accelerate = NNoutput[1];
    */

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
    /*console.log("x velocity", car.body.velocity.x);
    console.log("y velocity", car.body.velocity.y);
    console.log(currentDirection);*/

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

function score()
{
    var currScore = 0;
    //scoring
    scores[counter] = currScore;
}

function win()
{
    //yai
    score();
    counter++;
    if (counter >= 20)
    {
        counter = 0;
        //evolution(scores);
    }
    car.body.position.x = 100;
    car.body.position.y = 400;
    car.body.velocity.x = 0;
    car.body.velocity.y = 0;
    currentDirection = 0;
}

function lose() 
{
    //nai
    score();
    counter++;
    if (counter >= 20)
    {
        counter = 0;
        //evolution(scores);
    }
    car.body.position.x = 100;
    car.body.position.y = 400;
    car.body.velocity.x = 0;
    car.body.velocity.y = 0;
    currentDirection = 0;
}