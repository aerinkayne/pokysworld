//game file imports from pokyworld
import { levelData } from './pokysworld/levelData.js'
import Ball from './pokysworld/Ball.js'

//asset variables
let pokyGame;

let spritesheet1, background1;
//blocks and items
let sprGrass1, sprGrass2, sprGrass3, sprRockT1, sprRockT2, sprRock1, sprRock2, sprBricks, sprDirt1, sprDirt2, sprDirt3, sprDirt4, sprIceT1, sprIceT2, sprIce1, sprIce2, sprVine1, sprVineT, sprCloudL1, sprCloudR1, sprCloudM1, sprCloudL2, sprCloudR2, sprCloudM2, sprMoveIce, sprHeart1, sprHeart2, sprWood1, sprWood2, sprClover1, sprBeam, sprWindow, sprMoveCloud;

//char animations
let pokyRunR1, pokyRunR2, pokyRunL1, pokyRunL2, pokyJumpR, pokyJumpL, pokyClimb1, pokyClimb2, pokySwimR1, pokySwimL1, pokySwimR2, pokySwimL2;


//test
let ball;


//p5 script is in header, will work.
new p5(p5 => {

    p5.preload = () => {
        spritesheet1 = p5.loadImage("./assets/sprites/sprites1.png");
        background1 = p5.loadImage("./assets/sprites/pexels-pixabay-414171_filtered.jpg");
    }

    p5.setup = () => {
        p5.createCanvas(600,400);
        ball = new Ball(p5, 30);
        //backgrounds
        levelData[0].levelBackgroundImages[0].img = background1;

        //sprites
        sprGrass1 = spritesheet1.get(0,0,50,15); 
        sprGrass2 = spritesheet1.get(50,0,50,15);
        sprGrass3 = spritesheet1.get(100,0,50,15);
        sprDirt1 = spritesheet1.get(0,50,50,50);
        sprDirt2 = spritesheet1.get(50,50,50,50);
        sprDirt3 = spritesheet1.get(100,50,50,50);
        sprDirt4 = spritesheet1.get(150,50,50,50);
        sprRockT1 = spritesheet1.get(150,150,50,50);
        sprRockT2 = spritesheet1.get(200,150,50,50);
        sprRock1 = spritesheet1.get(150,200,50,50);
        sprRock2 = spritesheet1.get(200,200,50,50);
        sprIceT1 = spritesheet1.get(0,100,50,50);
        sprIceT2 = spritesheet1.get(50,100,50,50);
        sprIce1 = spritesheet1.get(0,150,50,50);
        sprIce2 = spritesheet1.get(50,150,50,50);
        sprVine1 = spritesheet1.get(250,0,50,50);
        sprVineT = spritesheet1.get(300,0,50,50);
        sprCloudL1 = spritesheet1.get(0,200,50,50);
        sprCloudM1 = spritesheet1.get(50,200,50,50);
        sprCloudR1 = spritesheet1.get(100,200,50,50);
        sprCloudL2 = spritesheet1.get(0,250,50,50);
        sprCloudM2 = spritesheet1.get(50,250,50,50);
        sprCloudR2 = spritesheet1.get(100,250,50,50);
        sprBricks = spritesheet1.get(100,150,50,50);
        sprClover1 = spritesheet1.get(350,225,50,25);
        sprWood1 = spritesheet1.get(100,100,50,50);
        sprWood2 = spritesheet1.get(100,150,50,50);
        sprBeam = spritesheet1.get(200,0,25,50);
        sprWindow = spritesheet1.get(225,0,25,50);
        sprMoveIce = spritesheet1.get(0,30,75,20);
        sprMoveCloud = spritesheet1.get(350,0,70,40);
        sprHeart1 = spritesheet1.get(80,18,33,30);
        sprHeart2 = spritesheet1.get(115,18,33,30);
        
        pokyRunR1 = spritesheet1.get(207,100, 40,50);
        pokyRunR2 = spritesheet1.get(252,100, 40,50);
        pokyRunL1 = spritesheet1.get(207,50, 40,50);
        pokyRunL2 = spritesheet1.get(252,50, 40,50);
        pokyJumpR = spritesheet1.get(297,100, 40,50);
        pokyJumpL = spritesheet1.get(297,50, 40,50);
        pokySwimR1 = spritesheet1.get(350,104, 47,42);
        pokySwimL1 = spritesheet1.get(400,104, 47,42);
        pokySwimR2 = spritesheet1.get(350,149, 47,42);
        pokySwimL2 = spritesheet1.get(400,149, 47,42);
        pokyClimb1 = spritesheet1.get(342,50, 40,50);
        pokyClimb2 = spritesheet1.get(385,50, 40,50);

    }
    p5.draw = () => {
        
        p5.background(35);
        //p5.image(background1, 0, 0);
        p5.image(pokyRunR1, p5.width/2, p5.height/2);
        ball.show(p5)
        ball.move(p5)
    }
});