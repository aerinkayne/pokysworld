//game file imports from pokyworld
import { levelData, btnStart, btnPause } from './pokysworld/levelData.js'
import {Button} from './pokysworld/projectFunc_p5.js'
import Ball from './pokysworld/Ball.js'
import Game from './pokysworld/gameClass_p5.js';


//asset variables
let game = null;
let startBtn = null;
let pauseBtn = null;

let spritesheet1, background1;
//blocks and items
let sprites = {};


//test
let ball;


//p5 script is in header, will work.
new p5(p5 => {

    p5.preload = () => {
        spritesheet1 = p5.loadImage("./assets/images/sprites1.png");
        background1 = p5.loadImage("./assets/images/pexels-pixabay-414171_filtered.jpg");
    }

    p5.setup = () => {
        let c = p5.createCanvas(600,400);
        c.parent('canvas-parent');
        p5.frameRate(60);

        ball = new Ball(p5, 30);
        //backgrounds
        levelData[0].levelBackgroundImages[0].img = background1;

        //sprites
        sprites.grass1 = spritesheet1.get(0,0,50,15); 
        sprites.grass2 = spritesheet1.get(50,0,50,15);
        sprites.grass3 = spritesheet1.get(100,0,50,15);
        sprites.dirt1 = spritesheet1.get(0,50,50,50);
        sprites.dirt2 = spritesheet1.get(50,50,50,50);
        sprites.dirt3 = spritesheet1.get(100,50,50,50);
        sprites.dirt4 = spritesheet1.get(150,50,50,50);
        sprites.rockT1 = spritesheet1.get(150,150,50,50);
        sprites.rockT2 = spritesheet1.get(200,150,50,50);
        sprites.rock1 = spritesheet1.get(150,200,50,50);
        sprites.rock2 = spritesheet1.get(200,200,50,50);
        sprites.iceT1 = spritesheet1.get(0,100,50,50);
        sprites.iceT2 = spritesheet1.get(50,100,50,50);
        sprites.ice1 = spritesheet1.get(0,150,50,50);
        sprites.ice2 = spritesheet1.get(50,150,50,50);
        sprites.vine1 = spritesheet1.get(250,0,50,50);
        sprites.vineT = spritesheet1.get(300,0,50,50);
        sprites.cloudL1 = spritesheet1.get(0,200,50,50);
        sprites.cloudM1 = spritesheet1.get(50,200,50,50);
        sprites.cloudR1 = spritesheet1.get(100,200,50,50);
        sprites.cloudL2 = spritesheet1.get(0,250,50,50);
        sprites.cloudM2 = spritesheet1.get(50,250,50,50);
        sprites.cloudR2 = spritesheet1.get(100,250,50,50);
        sprites.bricks = spritesheet1.get(100,150,50,50);
        sprites.clover1 = spritesheet1.get(350,225,50,25);
        sprites.wood1 = spritesheet1.get(100,100,50,50);
        sprites.wood2 = spritesheet1.get(100,150,50,50);
        sprites.beam = spritesheet1.get(200,0,25,50);
        sprites.window = spritesheet1.get(225,0,25,50);
        sprites.moveIce = spritesheet1.get(0,30,75,20);
        sprites.moveCloud = spritesheet1.get(350,0,70,40);
        sprites.heart1 = spritesheet1.get(80,18,33,30);
        sprites.heart2 = spritesheet1.get(115,18,33,30);
        
        sprites.pokyRunR1 = spritesheet1.get(207,100, 40,50);
        sprites.pokyRunR2 = spritesheet1.get(252,100, 40,50);
        sprites.pokyRunL1 = spritesheet1.get(207,50, 40,50);
        sprites.pokyRunL2 = spritesheet1.get(252,50, 40,50);
        sprites.pokyJumpR = spritesheet1.get(297,100, 40,50);
        sprites.pokyJumpL = spritesheet1.get(297,50, 40,50);
        sprites.pokySwimR1 = spritesheet1.get(350,104, 47,42);
        sprites.pokySwimL1 = spritesheet1.get(400,104, 47,42);
        sprites.pokySwimR2 = spritesheet1.get(350,149, 47,42);
        sprites.pokySwimL2 = spritesheet1.get(400,149, 47,42);
        sprites.pokyClimb1 = spritesheet1.get(342,50, 40,50);
        sprites.pokyClimb2 = spritesheet1.get(385,50, 40,50);

        game = new Game(sprites, p5);

        

        startBtn = new Button(p5, btnStart, ()=> {
            game.gameState = "inGame";
            console.log(game.gameState);
		});
        pauseBtn = new Button(p5, btnPause, ()=> {
			(!game.paused) ? btnPause.txt = "➤" : btnPause.txt = "❚❚";
			(!game.paused) ? btnPause.txtColor = [200,255,255] : btnPause.txtColor = [0,0,0];
			(!game.paused) ? game.paused = true : game.paused = false;
		});

        console.log(startBtn, pauseBtn);

    }

    p5.keyPressed = (ev) => {
        let { keyCode } = ev;
        if (game !== null && game.player.movements.hasOwnProperty(keyCode)){
            game.player.movements[keyCode] = true;  
        }
        return false;  //prevent default
    }		
    p5.keyReleased = (ev) => {
        let { keyCode } = ev;
        if (game !== null && game.player.movements.hasOwnProperty(keyCode)){
            game.player.movements[keyCode] = false;
        }
        return false;
    }


    p5.draw = () => {
        
        p5.background(35);
        startBtn.draw(p5)
        //p5.image(background1, 0, 0);
        //p5.image(sprites.grass1, p5.width/2, p5.height/2);
        ball.show(p5)
        ball.move(p5)
    }
});