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

var NNoutput = [0, 0]; // NNoutput[0]: turn, NNoutput[1]: accelerate

var C1X = 630;
var C1Y = 470;
var C2X = 600;
var C2Y = 100;
var C3X = 180;
var C3Y = 150;

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
var distStraight = 0;
var distLeft = 0;
var distRight = 0;

var won = false;
var counter = 0; // 0 to 19
var scores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sorted = [];

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('gtacar', 'images/Miara-GTA2.png');
    this.load.image('sky', 'images/sky.png');
    this.load.image('green', 'images/green.png');
    this.load.image('flag', 'images/flag.png');
}

function create()
{
    initNeat();
    nextGenome();

    //car

    car = new Car();
    car = this.physics.add.sprite(car.x, car.y, 'gtacar').setScale(.2).setAngle(180);
    car.setCollideWorldBounds(true);
    car.setBounce(0.2);

    //walls

    walls = this.physics.add.staticGroup();
    walls.create(400, 300, 'sky').setScale(0.2).refreshBody();
    walls.create(240, 300, 'sky').setScale(0.2).refreshBody();
    
    walls.create(400, 600, 'sky').setScale(2, 0.2).refreshBody();
    walls.create(0, 300, 'sky').setScale(0.2, 2).refreshBody();
    walls.create(800, 300, 'sky').setScale(0.2, 2).refreshBody();
    walls.create(400, 0, 'sky').setScale(2, 0.2).refreshBody();
    walls.create(120, 330, 'sky').setScale(0.1).refreshBody();

    walls.create(440, 237, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440, 237-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440, 237-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440, 237-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440, 237-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440, 237-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440, 237-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440, 237-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440, 237-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440, 237-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440, 237-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-1, 237-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-2, 237-6-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-4, 237-6-6-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-7, 237-6-6-6-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-11, 237-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-16, 237-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-22, 237-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-29, 237-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-37, 237-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-46, 237-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(440-56, 237-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304, 111, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-5, 111+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-5-5, 111+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-5-5-5, 111+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-5-5-5-5, 111+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-5-5-5-5-5, 111+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-5-5-5-5-5-5, 111+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-5-5-5-5-5-5-5, 111+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-5-5-5-5-5-5-5-5, 111+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-5-5-5-5-5-5-5-5-5, 111+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-5-5-5-5-5-5-5-5-5-5, 111+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-50-5, 111+60+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-50-5-5, 111+60+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-50-5-5-5, 111+60+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-50-5-5-5-5, 111+60+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-50-5-5-5-5-5, 111+60+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-50-5-5-5-5-5-5, 111+60+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-50-5-5-5-5-5-5-5, 111+60+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-50-5-5-5-5-5-5-5-5, 111+60+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-50-5-5-5-5-5-5-5-5-5, 111+60+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(304-50-5-5-5-5-5-5-5-5-5-5, 111+60+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(200, 111+60+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();

    walls.create(150, 63, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5, 63+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5-5, 63+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5-5-5, 63+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5-5-5-5, 63+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5-5-5-5-5, 63+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5-5-5-5-5-5, 63+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5-5-5-5-5-5-5, 63+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5-5-5-5-5-5-5-5, 63+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5-5-5-5-5-5-5-5-5, 63+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5-5-5-5-5-5-5-5-5-5, 63+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(150-5-5-5-5-5-5-5-5-5-5-5, 63+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95, 129, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95-5, 129+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95-5-5, 129+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95-5-5-5, 129+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95-5-5-5-5, 129+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95-5-5-5-5-5, 129+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95-5-5-5-5-5-5, 129+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95-5-5-5-5-5-5-5, 129+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95-5-5-5-5-5-5-5-5, 129+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95-5-5-5-5-5-5-5-5-5, 129+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(95-5-5-5-5-5-5-5-5-5-5, 129+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();

    walls.create(210, 363, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220, 369, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220+10, 369+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220+10+10, 369+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220+10+10+10, 369+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220+10+10+10+10, 369+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220+10+10+10+10+10, 369+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220+10+10+10+10+10+10, 369+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220+10+10+10+10+10+10+10, 369+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220+10+10+10+10+10+10+10+10, 369+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220+10+10+10+10+10+10+10+10+10, 369+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(220+10+10+10+10+10+10+10+10+10+10, 369+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400, 429, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10, 429-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10+10, 429-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10+10+10, 429-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10+10+10+10, 429-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10+10+10+10, 429-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10+10+10+10, 429-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10+10+10+10, 429-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10+10+10+10, 429-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10+10+10+10, 429-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10+10+10+10, 429-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(400+10+10+10+10, 429-6-6-6-6-6-6-6-6-6-6-6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(360, 435, 'sky').setScale(0.1, 0.01).refreshBody();

    walls.create(560, 63, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+40, 63+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+40+30, 63+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+70+20, 63+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+100, 63+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+105, 63+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110, 63+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5, 63+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5, 63+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5, 63+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5+5+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5+5+5+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5+5+5+5+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5+5+5+5+5+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5+5+5+5+5+5+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+5+5+5+5+5+5+5+5+5+5+5+5+5+5, 63+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+40+5+5+5+5+5+5+5, 63+30+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+40+5+5+5+5+5+5+5+5, 63+30+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();
    walls.create(560+110+40+5+5+5+5+5+5+5+5+5, 63+30+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6+6, 'sky').setScale(0.1, 0.01).refreshBody();


    walls.create(520, 534, 'sky').setScale(0.5, 0.02).refreshBody();
    walls.create(560, 525, 'sky').setScale(0.4, 0.01).refreshBody();
    walls.create(664, 519, 'sky').setScale(0.14, 0.01).refreshBody();
    walls.create(680, 513, 'sky').setScale(0.10, 0.01).refreshBody();
    walls.create(692, 507, 'sky').setScale(0.07, 0.01).refreshBody();
    walls.create(700, 501, 'sky').setScale(0.05, 0.01).refreshBody();
    walls.create(704, 495, 'sky').setScale(0.04, 0.01).refreshBody();
    walls.create(708, 489, 'sky').setScale(0.03, 0.01).refreshBody();
    walls.create(712, 483, 'sky').setScale(0.02, 0.01).refreshBody();
    walls.create(716, 465, 'sky').setScale(0.01, 0.05).refreshBody();

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

    //cp flags
    flag1 = this.add.sprite(C1X, C1Y, 'flag').setScale(0.1);
    flag2 = this.add.sprite(C2X, C2Y, 'flag').setScale(0.1);
    flag3 = this.add.sprite(C3X, C3Y, 'flag').setScale(0.1);

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
    distRight = Math.sqrt(Math.pow((car.body.position.x - rightX), 2) + Math.pow((car.body.position.y - rightY), 2));
    NNoutput = NNact();
    turn = NNoutput[0];
    accelerate = NNoutput[1];
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
    distLeft = Math.sqrt(Math.pow((car.body.position.x - leftX), 2) + Math.pow((car.body.position.y - leftY), 2));
    NNoutput = NNact();
    turn = NNoutput[0];
    accelerate = NNoutput[1];
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
    distStraight = Math.sqrt(Math.pow((car.body.position.x - straightX), 2) + Math.pow((car.body.position.y - straightY), 2));
    NNoutput = NNact();
    turn = NNoutput[0];
    accelerate = NNoutput[1];
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

    turn = NNoutput[0];
    accelerate = NNoutput[1];

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
    if (currentVelocity > 175) currentVelocity = 175;

    /*console.log("straight", distStraight);
    console.log("left", distLeft);
    console.log("right", distRight);*/

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
    //accelerate = 0;

}

function scoring()
{
    //scores current run
    if (won == true)
    {
        scores[counter] = 1000000; // 1m for win
    }
    else
    {
        var distC1 = Math.sqrt(Math.pow((car.body.position.x - C1X), 2) + Math.pow((car.body.position.y - C1Y), 2));
        var distC2 = Math.sqrt(Math.pow((car.body.position.x - C2X), 2) + Math.pow((car.body.position.y - C2Y), 2));
        var distC3 = Math.sqrt(Math.pow((car.body.position.x - C3X), 2) + Math.pow((car.body.position.y - C3Y), 2));
        //console.log(distC1, distC2, distC3);

        if (Math.sqrt(Math.pow((car.body.position.y - C3Y), 2)) < 100) //cp3 is relevant
        {
            if (distC3 < 5)
            {
                scores[counter] = 150;
            }
            else
            {
                scores[counter] = 100 + (1/distC3);
            }
        }
        else if (Math.sqrt(Math.pow((car.body.position.x - C2X), 2)) < 100) //cp2 is relevant
        {
            if (distC2 < 5)
            {
                scores[counter] = 15;
            }
            else
            {
                scores[counter] = 10 + (1/distC2);
            }
        }
        else    //cp1 is relevant
        {
            if (distC1 < 5)
            {
                scores[counter] = 1.5;
            }
            else
            {
                scores[counter] = (1/distC1);
            }
        }

        //scores[counter] = 100000*((1/Math.pow(distC1, 1.8)) + (1/Math.pow(distC2, 1.8))*5 + (1/Math.pow(distC3, 1.8))*25);

        //scores[counter] = -1 * (Math.pow(distC1, 1.2) + Math.pow(distC2, 1.2) + Math.pow(distC3, 1.2));
    }
}

function sorting()
{
    //uses scores[] to sort the sorted[] array
    sorted = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < neat.popsize; i++)
    {
        var tempMax = 0;
        var tempPos;
        for (var j = 0; j < neat.popsize; j++)
        {
            if (scores[j] > tempMax)
            {
                tempMax = scores[j];
                tempPos = j;
            }
        }
        sorted[i] = tempPos;
        scores[tempPos] = 0;
    }
}

function win()
{
    //yai
    won = true;
    scoring();
    won = false;
    counter++;
    console.log("car: ", counter-1);
    console.log("score: ", scores[counter-1]);
    if (counter >= neat.popsize)
    {
        sorting();
        counter = 0;
        evolution(); //makes next gen
    }
    car.body.position.x = 100;
    car.body.position.y = 400;
    car.body.velocity.x = 0;
    car.body.velocity.y = 0;
    currentDirection = 0;
    nextGenome();
}

function lose() 
{
    //nai
    scoring();
    counter++;
    console.log("car: ", counter-1);
    console.log("score: ", scores[counter-1]);
    if (counter >= neat.popsize)
    {
        sorting();
        counter = 0;
        evolution(); //makes next gen
    }
    car.body.position.x = 100;
    car.body.position.y = 400;
    car.body.velocity.x = 0;
    car.body.velocity.y = 0;
    currentDirection = 0;
    nextGenome();
}