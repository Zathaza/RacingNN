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

var turn1;
var accelerate1;
var turnAngle1;
var currentVelocity1;
var currentDirection1 = 0;

var straightX1;
var straightY1;
var leftX1;
var leftY1;
var rightX1;
var rightY1;
var distStraight1 = 0;
var distLeft1 = 0;
var distRight1 = 0;

var done1 = false;
var done = false;

//var NNoutput = [0, 0]; // NNoutput[0]: turn, NNoutput[1]: accelerate, 2nd dimension car nr
var NNoutput = [
    [0, 0],
    [0, 1],
  ];
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
    counter++;
    nextGenome1();

    //car

    car = new Car();
    car = this.physics.add.sprite(car.x, car.y, 'gtacar').setScale(.2).setAngle(180);
    car.setCollideWorldBounds(true);
    car.setBounce(0);
    car.counter = 0;

    car1 = new Car();
    car1 = this.physics.add.sprite(car1.x, car1.y, 'gtacar').setScale(.2).setAngle(180);
    car1.setCollideWorldBounds(true);
    car1.setBounce(0);
    car1.counter = 1;

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
    this.physics.add.collider(car1, walls, lose1, null, this);

    //end zone
    goal = this.physics.add.staticSprite(120, 270, 'green').setScale(0.27, 0.2).refreshBody();

    this.physics.add.collider(car, goal, win, null, this);
    this.physics.add.collider(car1, goal, win1, null, this);

    //sensor particles
    sensorStraight = this.physics.add.sprite(100, 400, 'gtacar').setScale(.2).setAngle(180);
    this.physics.add.collider(sensorStraight, walls, sensorStraightPos, null, this);
    sensorStraight.setBounce(0);
    sensorStraight.visible = false;
    sensorStraightVel();

    sensorLeft = this.physics.add.sprite(100, 400, 'gtacar').setScale(.2).setAngle(150);
    this.physics.add.collider(sensorLeft, walls, sensorLeftPos, null, this);
    sensorLeft.setBounce(0);
    sensorLeft.visible = false;
    sensorLeftVel();

    sensorRight = this.physics.add.sprite(100, 400, 'gtacar').setScale(.2).setAngle(210);
    this.physics.add.collider(sensorRight, walls, sensorRightPos, null, this);
    sensorRight.setBounce(0);
    sensorRight.visible = false;
    sensorRightVel();
    //car1:
    sensorStraight1 = this.physics.add.sprite(100, 400, 'gtacar').setScale(.2).setAngle(180);
    this.physics.add.collider(sensorStraight1, walls, sensorStraightPos1, null, this);
    sensorStraight1.setBounce(0);
    sensorStraight1.visible = false;
    sensorStraightVel1();

    sensorLeft1 = this.physics.add.sprite(100, 400, 'gtacar').setScale(.2).setAngle(150);
    this.physics.add.collider(sensorLeft1, walls, sensorLeftPos1, null, this);
    sensorLeft1.setBounce(0);
    sensorLeft1.visible = false;
    sensorLeftVel1();

    sensorRight1 = this.physics.add.sprite(100, 400, 'gtacar').setScale(.2).setAngle(210);
    this.physics.add.collider(sensorRight1, walls, sensorRightPos1, null, this);
    sensorRight1.setBounce(0);
    sensorRight1.visible = false;
    sensorRightVel1();

    //cp flags
    flag1 = this.add.sprite(C1X, C1Y, 'flag').setScale(0.1);
    flag2 = this.add.sprite(C2X, C2Y, 'flag').setScale(0.1);
    flag3 = this.add.sprite(C3X, C3Y, 'flag').setScale(0.1);

    //controls
    cursors = this.input.keyboard.createCursorKeys();
}

function sensorRightPos(){
    //sensorStraight.setVelocity(500);
    rightX = sensorRight.body.position.x;
    rightY = sensorRight.body.position.y;
    sensorRight.body.position.x = car.body.position.x;
    sensorRight.body.position.y = car.body.position.y;
    sensorRight.setAngle(210 - currentDirection);
    distRight = Math.sqrt(Math.pow((car.body.position.x - rightX), 2) + Math.pow((car.body.position.y - rightY), 2));
    NNoutput = NNact(distStraight, distLeft, distRight, 0);
    sensorRightVel();
}

function sensorRightVel(){
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

function sensorLeftPos(){
    //sensorStraight.setVelocity(500);
    leftX = sensorLeft.body.position.x;
    leftY = sensorLeft.body.position.y;
    sensorLeft.body.position.x = car.body.position.x;
    sensorLeft.body.position.y = car.body.position.y;
    sensorLeft.setAngle(150 - currentDirection);
    distLeft = Math.sqrt(Math.pow((car.body.position.x - leftX), 2) + Math.pow((car.body.position.y - leftY), 2));
    NNoutput = NNact(distStraight, distLeft, distRight, 0);
    sensorLeftVel();
}

function sensorLeftVel(){
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

function sensorStraightPos(){
    //sensorStraight.setVelocity(500);

    straightX = sensorStraight.body.position.x;
    straightY = sensorStraight.body.position.y;
    sensorStraight.body.position.x = car.body.position.x;
    sensorStraight.body.position.y = car.body.position.y;
    sensorStraight.setAngle(180 - currentDirection);
    distStraight = Math.sqrt(Math.pow((car.body.position.x - straightX), 2) + Math.pow((car.body.position.y - straightY), 2));
    NNoutput = NNact(distStraight, distLeft, distRight, 0);
    sensorStraightVel();
}

function sensorStraightVel(){
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

function sensorRightPos1(){
    //sensorStraight.setVelocity(500);
    rightX1 = sensorRight1.body.position.x;
    rightY1 = sensorRight1.body.position.y;
    sensorRight1.body.position.x = car1.body.position.x;
    sensorRight1.body.position.y = car1.body.position.y;
    sensorRight1.setAngle(210 - currentDirection1);
    distRight1 = Math.sqrt(Math.pow((car1.body.position.x - rightX1), 2) + Math.pow((car1.body.position.y - rightY1), 2));
    NNoutput = NNact(distStraight1, distLeft1, distRight1, 1);
    sensorRightVel1();
}

function sensorRightVel1(){
    turnAngle1 = (currentDirection1-30) % 360;
    /*var y = Math.pow(Math.sin(turnAngle), 2)*2000;
    var x = Math.pow(Math.cos(turnAngle), 2)*2000;*/
    var y = 2000;
    var x = 2000;
    if (turnAngle1 <= 90)
    {
        sensorRight1.setVelocityY(-1 * Math.sin(turnAngle1 * (Math.PI / 180)) * y);
        sensorRight1.setVelocityX(Math.cos(turnAngle1 * (Math.PI / 180)) * x);
    }
    else if (turnAngle1 <= 180)
    {
        sensorRight1.setVelocityY(-1 * Math.sin((180 - turnAngle1) * (Math.PI / 180)) * y);
        sensorRight1.setVelocityX(-1 * Math.cos((180 - turnAngle1) * (Math.PI / 180)) * x);
    }
    else if (turnAngle1 <= 270)
    {
        sensorRight1.setVelocityY(Math.sin((turnAngle1 - 180) * (Math.PI / 180)) * y);
        sensorRight1.setVelocityX(-1 * Math.cos((turnAngle1 - 180) * (Math.PI / 180)) * x);
    }
    else
    {
        sensorRight1.setVelocityY(Math.sin((360 - turnAngle1) * (Math.PI / 180)) * y);
        sensorRight1.setVelocityX(Math.cos((360 - turnAngle1) * (Math.PI / 180)) * x);
    }
}

function sensorLeftPos1(){
    //sensorStraight.setVelocity(500);
    leftX1 = sensorLeft1.body.position.x;
    leftY1 = sensorLeft1.body.position.y;
    sensorLeft1.body.position.x = car1.body.position.x;
    sensorLeft1.body.position.y = car1.body.position.y;
    sensorLeft1.setAngle(150 - currentDirection1);
    distLeft1 = Math.sqrt(Math.pow((car1.body.position.x - leftX1), 2) + Math.pow((car1.body.position.y - leftY1), 2));
    NNoutput = NNact(distStraight1, distLeft1, distRight1, 1);
    sensorLeftVel1();
}

function sensorLeftVel1(){
    turnAngle1 = (currentDirection1+30) % 360;
    /*var y = Math.pow(Math.sin(turnAngle), 2)*2000;
    var x = Math.pow(Math.cos(turnAngle), 2)*2000;*/
    var y = 2000;
    var x = 2000;
    if (turnAngle1 <= 90)
    {
        sensorLeft1.setVelocityY(-1 * Math.sin(turnAngle1 * (Math.PI / 180)) * y);
        sensorLeft1.setVelocityX(Math.cos(turnAngle1 * (Math.PI / 180)) * x);
    }
    else if (turnAngle1 <= 180)
    {
        sensorLeft1.setVelocityY(-1 * Math.sin((180 - turnAngle1) * (Math.PI / 180)) * y);
        sensorLeft1.setVelocityX(-1 * Math.cos((180 - turnAngle1) * (Math.PI / 180)) * x);
    }
    else if (turnAngle1 <= 270)
    {
        sensorLeft1.setVelocityY(Math.sin((turnAngle1 - 180) * (Math.PI / 180)) * y);
        sensorLeft1.setVelocityX(-1 * Math.cos((turnAngle1 - 180) * (Math.PI / 180)) * x);
    }
    else
    {
        sensorLeft1.setVelocityY(Math.sin((360 - turnAngle1) * (Math.PI / 180)) * y);
        sensorLeft1.setVelocityX(Math.cos((360 - turnAngle1) * (Math.PI / 180)) * x);
    }
}

function sensorStraightPos1(){
    //sensorStraight.setVelocity(500);

    straightX1 = sensorStraight1.body.position.x;
    straightY1 = sensorStraight1.body.position.y;
    sensorStraight1.body.position.x = car1.body.position.x;
    sensorStraight1.body.position.y = car1.body.position.y;
    sensorStraight1.setAngle(180 - currentDirection1);
    distStraight1 = Math.sqrt(Math.pow((car1.body.position.x - straightX1), 2) + Math.pow((car1.body.position.y - straightY1), 2));
    NNoutput = NNact(distStraight1, distLeft1, distRight1, 1);
    sensorStraightVel1();
}

function sensorStraightVel1(){
    turnAngle1 = (currentDirection1) % 360;
    /*var y = Math.pow(Math.sin(turnAngle), 2)*2000;
    var x = Math.pow(Math.cos(turnAngle), 2)*2000;*/
    var y = 2000;
    var x = 2000;
    if (turnAngle1 <= 90)
    {
        sensorStraight1.setVelocityY(-1 * Math.sin(turnAngle1 * (Math.PI / 180)) * y);
        sensorStraight1.setVelocityX(Math.cos(turnAngle1 * (Math.PI / 180)) * x);
    }
    else if (turnAngle1 <= 180)
    {
        sensorStraight1.setVelocityY(-1 * Math.sin((180 - turnAngle1) * (Math.PI / 180)) * y);
        sensorStraight1.setVelocityX(-1 * Math.cos((180 - turnAngle1) * (Math.PI / 180)) * x);
    }
    else if (turnAngle1 <= 270)
    {
        sensorStraight1.setVelocityY(Math.sin((turnAngle1 - 180) * (Math.PI / 180)) * y);
        sensorStraight1.setVelocityX(-1 * Math.cos((turnAngle1 - 180) * (Math.PI / 180)) * x);
    }
    else
    {
        sensorStraight1.setVelocityY(Math.sin((360 - turnAngle1) * (Math.PI / 180)) * y);
        sensorStraight1.setVelocityX(Math.cos((360 - turnAngle1) * (Math.PI / 180)) * x);
    }
}

function update ()
{
    if (done == false) acceleration();
    if (done1 == false) acceleration1();

}

function acceleration1()
{
    turn1 = NNoutput[0][1];
    //accelerate1 = NNoutput[1][1];
    accelerate1 = 0.5;

    if (car1.body.velocity.x > 0 && car1.body.velocity.y < 0)
    {
        currentDirection1 = Math.atan(Math.abs(car1.body.velocity.y/car1.body.velocity.x)) * (180 / Math.PI);
    }
    else if (car1.body.velocity.x > 0 && car1.body.velocity.y > 0)
    {
        currentDirection1 = 360 - Math.atan(Math.abs(car1.body.velocity.y/car1.body.velocity.x)) * (180 / Math.PI);
    }
    else if (car1.body.velocity.x < 0 && car1.body.velocity.y < 0)
    {
        currentDirection1 = 180 - Math.atan(Math.abs(car1.body.velocity.y/car1.body.velocity.x)) * (180 / Math.PI);
    }
    else if (car1.body.velocity.x < 0 && car1.body.velocity.y > 0)
    {
        currentDirection1 = 180 + Math.atan(Math.abs(car1.body.velocity.y/car1.body.velocity.x)) * (180 / Math.PI);
    } // ab hier ist mega dumm
    else if (car1.body.velocity.x < 0)
    {
        currentDirection1 = 180;
    }
    else if (car1.body.velocity.x > 0)
    {
        currentDirection1 = 0;
    }
    else if (car1.body.velocity.y < 0)
    {
        currentDirection1 = 90;
    }
    else if (car1.body.velocity.y > 0)
    {
        currentDirection1 = 270; 
    }

    turnAngle1 = (currentDirection1 + turn1 * maxTurn) % 360;
    currentVelocity1 = Math.sqrt(car1.body.velocity.x * car1.body.velocity.x + car1.body.velocity.y * car1.body.velocity.y);
    if (currentVelocity1 > 175) currentVelocity1 = 175;
    if (currentVelocity1 < 25) currentVelocity1 = 25;

    /*console.log("straight", distStraight);
    console.log("left", distLeft);
    console.log("right", distRight);*/

 //   accelerate();

    if (turnAngle1 <= 90)
    {
        car1.setVelocityY(-1 * Math.sin(turnAngle1 * (Math.PI / 180)) * currentVelocity1);
        car1.setVelocityX(Math.cos(turnAngle1 * (Math.PI / 180)) * currentVelocity1);

        car1.setAccelerationY(-1 * Math.sin(turnAngle1 * (Math.PI / 180)) * accelerate1 * maxAcceleration);
        car1.setAccelerationX(Math.cos(turnAngle1 * (Math.PI / 180)) * accelerate1 * maxAcceleration);
    }
    else if (turnAngle1 <= 180)
    {
        car1.setVelocityY(-1 * Math.sin((180 - turnAngle1) * (Math.PI / 180)) * currentVelocity1);
        car1.setVelocityX(-1 * Math.cos((180 - turnAngle1) * (Math.PI / 180)) * currentVelocity1);

        car1.setAccelerationY(-1 * Math.sin((180 - turnAngle1) * (Math.PI / 180)) * accelerate1 * maxAcceleration);
        car1.setAccelerationX(-1 * Math.cos((180 - turnAngle1) * (Math.PI / 180)) * accelerate1 * maxAcceleration);
    }
    else if (turnAngle1 <= 270)
    {
        car1.setVelocityY(Math.sin((turnAngle1 - 180) * (Math.PI / 180)) * currentVelocity1);
        car1.setVelocityX(-1 * Math.cos((turnAngle1 - 180) * (Math.PI / 180)) * currentVelocity1);

        car1.setAccelerationY(Math.sin((turnAngle1 - 180) * (Math.PI / 180)) * accelerate1 * maxAcceleration);
        car1.setAccelerationX(-1 * Math.cos((turnAngle1 - 180) * (Math.PI / 180)) * accelerate1 * maxAcceleration);
    }
    else
    {
        car1.setVelocityY(Math.sin((360 - turnAngle1) * (Math.PI / 180)) * currentVelocity1);
        car1.setVelocityX(Math.cos((360 - turnAngle1) * (Math.PI / 180)) * currentVelocity1);

        car1.setAccelerationY(Math.sin((360 - turnAngle1) * (Math.PI / 180)) * accelerate1 * maxAcceleration);
        car1.setAccelerationX(Math.cos((360 - turnAngle1) * (Math.PI / 180)) * accelerate1 * maxAcceleration);
    }

    car1.setAngle(180 - currentDirection1);
    //accelerate = 0;
}

function acceleration()
{
    turn = NNoutput[0][0];
    //accelerate = NNoutput[1][0];
    accelerate = 0.5;

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
    if (currentVelocity < 25) currentVelocity = 25;

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
        scores[car.counter] = 1000000; // 1m for win
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
                scores[car.counter] = 150;
            }
            else
            {
                scores[car.counter] = 100 + (1/distC3);
            }
        }
        else if (Math.sqrt(Math.pow((car.body.position.x - C2X), 2)) < 100) //cp2 is relevant
        {
            if (distC2 < 5)
            {
                scores[car.counter] = 15;
            }
            else
            {
                scores[car.counter] = 10 + (1/distC2);
            }
        }
        else    //cp1 is relevant
        {
            if (distC1 < 5)
            {
                scores[car.counter] = 1.5;
            }
            else
            {
                scores[car.counter] = (1/distC1);
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
    if (done == false)
    {
        won = true;
        scoring();
        won = false;
        counter++;
        console.log("car: ", car.counter);
        console.log("score: ", scores[car.counter]);
        if (counter >= neat.popsize)
        {
            //other car ready ??
            if (done1 == false)
            {
                done = true;
                car.body.position.x = 100;
                car.body.position.y = 400;
                car.body.velocity.x = 0;
                car.body.velocity.y = 0;
                currentDirection = 0;
                return;
            }
            else
            {
                done = false;
                done1 = false;
                sorting();
                counter = 0;
                car.counter = 0;
                car1.counter = 0;
                evolution(); //makes next gen
                car1.body.position.x = 100;
                car1.body.position.y = 400;
                car1.body.velocity.x = 0;
                car1.body.velocity.y = 0;
                currentDirection1 = 0;
                nextGenome1();
                counter++;
            }
        }
        car.body.position.x = 100;
        car.body.position.y = 400;
        car.body.velocity.x = 0;
        car.body.velocity.y = 0;
        currentDirection = 0;
        nextGenome();
        car.counter = counter;
    }
}

function lose() 
{
    //nai
    if (done == false)
    {
        scoring();
        counter++;
        console.log("car: ", car.counter);
        console.log("score: ", scores[car.counter]);
        if (counter >= neat.popsize)
        {  
            //other car ready ??
            if (done1 == false)
            {
                done = true;
                car.body.position.x = 100;
                car.body.position.y = 400;
                car.body.velocity.x = 0;
                car.body.velocity.y = 0;
                currentDirection = 0;
                return;
            }
            else
            {
                done = false;
                done1 = false;
                sorting();
                counter = 0;
                car.counter = 0;
                car1.counter = 0;
                evolution(); //makes next gen
                car1.body.position.x = 100;
                car1.body.position.y = 400;
                car1.body.velocity.x = 0;
                car1.body.velocity.y = 0;
                currentDirection1 = 0;
                nextGenome1();
                counter++;
            }
        }
        car.body.position.x = 100;
        car.body.position.y = 400;
        car.body.velocity.x = 0;
        car.body.velocity.y = 0;
        currentDirection = 0;
        nextGenome();
        car.counter = counter;
    }
}

function lose1()
{
    //nai
    if (done1 == false)
    {
        scoring1();
        counter++;
        console.log("car1: ", car1.counter);
        console.log("score: ", scores[car1.counter]);
        if (counter >= neat.popsize)
        {  
            //other car ready ??
            if (done == false)
            {
                done1 = true;
                car1.body.position.x = 100;
                car1.body.position.y = 400;
                car1.body.velocity.x = 0;
                car1.body.velocity.y = 0;
                currentDirection1 = 0;
                return;
            }
            else
            {
                done = false;
                done1 = false;
                sorting();
                counter = 0;
                car.counter = 0;
                car1.counter = 0;
                evolution(); //makes next gen
                car.body.position.x = 100;
                car.body.position.y = 400;
                car.body.velocity.x = 0;
                car.body.velocity.y = 0;
                currentDirection = 0;
                nextGenome();
                counter++;
            }
        }
        car1.body.position.x = 100;
        car1.body.position.y = 400;
        car1.body.velocity.x = 0;
        car1.body.velocity.y = 0;
        currentDirection1 = 0;
        nextGenome1();
        car1.counter = counter;
    }
}

function win1()
{
    //yai
    if (done1 == false)
    {
        won = true;
        scoring1();
        won = false;
        counter++;
        console.log("car1: ", car1.counter);
        console.log("score: ", scores[car1.counter]);
        if (counter >= neat.popsize)
        {
            //other car ready ??
            if (done == false)
            {
                done1 = true;
                car1.body.position.x = 100;
                car1.body.position.y = 400;
                car1.body.velocity.x = 0;
                car1.body.velocity.y = 0;
                currentDirection1 = 0;
                return;
            }
            else
            {
                done = false;
                done1 = false;
                sorting();
                counter = 0;
                car.counter = 0;
                car1.counter = 0;
                evolution(); //makes next gen
                car.body.position.x = 100;
                car.body.position.y = 400;
                car.body.velocity.x = 0;
                car.body.velocity.y = 0;
                currentDirection = 0;
                nextGenome();
                counter++;
            }
        }
        car1.body.position.x = 100;
        car1.body.position.y = 400;
        car1.body.velocity.x = 0;
        car1.body.velocity.y = 0;
        currentDirection1 = 0;
        nextGenome1();
        car1.counter = counter;
    }
}

function scoring1()
{
    //scores current run
    if (won == true)
    {
        scores[car1.counter] = 1000000; // 1m for win
    }
    else
    {
        var distC11 = Math.sqrt(Math.pow((car1.body.position.x - C1X), 2) + Math.pow((car1.body.position.y - C1Y), 2));
        var distC21 = Math.sqrt(Math.pow((car1.body.position.x - C2X), 2) + Math.pow((car1.body.position.y - C2Y), 2));
        var distC31 = Math.sqrt(Math.pow((car1.body.position.x - C3X), 2) + Math.pow((car1.body.position.y - C3Y), 2));
        //console.log(distC1, distC2, distC3);

        if (Math.sqrt(Math.pow((car1.body.position.y - C3Y), 2)) < 100) //cp3 is relevant
        {
            if (distC31 < 5)
            {
                scores[car1.counter] = 150;
            }
            else
            {
                scores[car1.counter] = 100 + (1/distC31);
            }
        }
        else if (Math.sqrt(Math.pow((car1.body.position.x - C2X), 2)) < 100) //cp2 is relevant
        {
            if (distC21 < 5)
            {
                scores[car1.counter] = 15;
            }
            else
            {
                scores[car1.counter] = 10 + (1/distC21);
            }
        }
        else    //cp1 is relevant
        {
            if (distC11 < 5)
            {
                scores[car1.counter] = 1.5;
            }
            else
            {
                scores[car1.counter] = (1/distC11);
            }
        }

        //scores[counter] = 100000*((1/Math.pow(distC1, 1.8)) + (1/Math.pow(distC2, 1.8))*5 + (1/Math.pow(distC3, 1.8))*25);

        //scores[counter] = -1 * (Math.pow(distC1, 1.2) + Math.pow(distC2, 1.2) + Math.pow(distC3, 1.2));
    }
}





/*  player movement:
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
    */