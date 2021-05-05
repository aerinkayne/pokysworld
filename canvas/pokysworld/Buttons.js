//distance between the center of two objects
export const getDistance = (p5, obj1, obj2) => {
	return  p5.sqrt(p5.sq(obj1.P.x + obj1.w/2 -(obj2.P.x + obj2.w/2)) + 
					p5.sq(obj1.P.y + obj1.h/2 -(obj2.P.y + obj2.h/2))); 
}

export const mouseIsOver = (mouseX, mouseY) => {
	return (mouseX > this.P.x && mouseX < this.P.x + this.w &&
			mouseY > this.P.y && mouseY < this.P.y + this.h);
}


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
		p5.rect(this.P.x, this.P.y, this.w, this.h, this.r);
		p5.textAlign(p5.CENTER,p5.CENTER);
		p5.textSize(this.txtSize);
		p5.fill(this.txtColor);
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