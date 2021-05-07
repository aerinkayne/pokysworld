import { width, height } from './levelData.js'

export class Button{
	constructor(p5, config, callback){
		this.P = p5.createVector(config.x, config.y);
		this.w = config.w;
		this.h = config.h;
		this.r = config.r;  //border radius for rectangles
		this.txt = config.txt;
		this.txtSize = config.txtSize;
		this.txtColor = config.txtColor;
		this.btnColor = config.btnColor;
		this.btnBorder = config.btnBorder || config.btnColor
		this.clickTimer = 0;
		this.clickDelay = 20;
		this.onClick = callback;
	}
	checkClicks(p5){  //called in draw.  timer used to limit calls.  works ontouch
		if (this.clickTimer < this.clickDelay) {this.clickTimer++;}
		if (this.mouseIsOver(p5.mouseX,p5.mouseY) && this.clickTimer === this.clickDelay && p5.mouseIsPressed){
			this.onClick();
			this.clickTimer=0;
		}
	}
	draw(p5){
		p5.fill(this.btnColor);
		p5.stroke(this.btnBorder);
		p5.rect(this.P.x, this.P.y, this.w, this.h, this.r);
		p5.textAlign(p5.CENTER,p5.CENTER);
		p5.textSize(this.txtSize);
		p5.fill(this.txtColor);
		p5.noStroke();
		p5.text(this.txt,this.P.x+this.w/2, this.P.y+this.h/2);
		this.checkClicks(p5);
	}
	mouseIsOver(mouseX, mouseY){
		return (mouseX > this.P.x && mouseX < this.P.x + this.w &&
				mouseY > this.P.y && mouseY < this.P.y + this.h);
	}
}

export class LevelSelectButton extends Button{
	constructor(config, callback, number){
		super(config, callback);
		this.accessLevel = number-1;
		this.txt = `This path leads to ${number}`;
	}
}

//*******button configs **********
export const btnStart = {
	x: width/2 - width/8,
	y: height/2 - height/16,
	w: width/4,
	h: height/8,
	r: 3,
	txt: "Click to Start",
	txtSize: 16,
	txtColor: [0,0,0],
	btnColor: [0,200,200], 
	btnBorder: [0,0,0]
}
export const btnPause = {
	w: width/16,
	h: height/20,
	x: 5,
	y: height-5 - height/20,
	r: 2,
	txt: "❚❚",
	txtSize: 10,
	txtColor: [0,0,0],
	btnColor: [0,200,150],
	btnBorder: [0,0,0]
}
export const btnGoToLevel = {
	x: width/50,
	y: height-height/18,
	w: width/16,
	h: height/25,
	r: 2,
	accessLevel: 1,
	txt: "❚❚",
	txtSize: 10,
	txtColor: [0,0,0],
	btnColor: [0,200,150]
	/*
	onClick: ()=> {
		if (this.accessLevel >=0 && this.accessLevel < pokyGame.numLevels){
			pokyGame.level = this.accessLevel;
			pokyGame.loadLevel(this.accessLevel);
		}
	}
	*/
}