//distance between the center of two objects
export function getDistance (p5, obj1, obj2) {
	return  p5.sqrt(p5.sq(obj1.P.x + obj1.w/2 -(obj2.P.x + obj2.w/2)) + 
			p5.sq(obj1.P.y + obj1.h/2 -(obj2.P.y + obj2.h/2))); 
}

/*takes a refBox obj, and another obj (or array of objs), and returns true if they are overlapping, 
refBox and the obj(s) being tested have a position vector property P */
export const areColliding = (refBox, obj) => {
	if (obj.length){  //if 2nd param is an array, check if refBox is colliding with any of them
		return obj.some(ele => refBox.P.x < ele.P.x + ele.w && refBox.P.x + refBox.w > ele.P.x &&
								refBox.P.y < ele.P.y + ele.h && refBox.P.y + refBox.h > ele.P.y)
	}
	else {
		return  refBox.P.x < obj.P.x + obj.w && refBox.P.x + refBox.w > obj.P.x &&
				refBox.P.y < obj.P.y + obj.h && refBox.P.y + refBox.h > obj.P.y; 
		}
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






//map blocks

export class MapTile {  
	constructor(p5, x, y, w, h, img = null){  
		this.P = p5.createVector(x,y);
		this.w = w;
		this.h = h;
		this.img = img;
		this.cycleTime = 250;
		this.drawTimer = 0;
		this.frictionVal = 1;   //same as intial values of character class 
		this.jumpVal = 11; 
		this.accelerationVal = 0.5;
		this.maxSpeedVal = 3.5;
	}
	conferProperties(obj){
		obj.jumpForce = this.jumpVal;
		obj.friction = this.frictionVal;
		obj.acceleration = this.accelerationVal;
		obj.maxSpeed = this.maxSpeedVal;
	}
	collide(obj){  //TODO: use expression outside class.
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
          this.P.y < obj.P.y + obj.h && this.P.y + this.h > obj.P.y;
	}
	collideEffect(obj, Vx, Vy){ 
		if(Vy > 0){
			obj.V.y = 0;
			obj.P.y = this.P.y - obj.h;  
			obj.canJump = true;
			obj.canSwim = false;
			this.conferProperties(obj);
		}
		if(Vy < 0){
			obj.V.y = 0;
			obj.P.y = this.P.y + this.h;
		}
		if(Vx < 0){
			obj.V.x = 0;
			obj.P.x = this.P.x + this.w;
		}
		if(Vx > 0){
			obj.V.x = 0;
			obj.P.x = this.P.x-obj.w;
		}
	}
	updateDrawTimer(){
		this.drawTimer++;
		if (this.drawTimer >= this.cycleTime){
			this.drawTimer = 0;
		}
	}
	draw(p5) {
		p5.push();
		p5.translate(this.P.x, this.P.y);
		if(this.img.length > 1){
			let numSprites = this.img.length;
			let timePerSprite = this.cycleTime/numSprites;
			let i = p5.floor(this.drawTimer/timePerSprite);
			p5.image(this.img[i], 0, 0, this.w+1, this.h+1); 
			this.updateDrawTimer();
		} else {
			p5.image(this.img, 0, 0, this.w+1, this.h+1); //1px overlap covers right and bottom outline
		} 
		p5.pop();
	}  
}

export class MovingTile extends MapTile{
	constructor(p5, x, y, w, h, img=0, vx, vy){
		super(p5, x, y, w, h, img);
		this.V = p5.createVector(vx, vy);
		this.Vhold = p5.createVector(0,0);
		this.cycleTime = 600;
		this.holdTime = 100;
		this.offset = p5.floor(p5.random(this.holdTime, this.cycleTime));
		this.timer = this.offset;
		this.P.x += (this.timer-this.holdTime)*this.V.x;  //move location to correspond to timer value
		this.P.y += (this.timer-this.holdTime)*this.V.y; 
	}
	collide(obj){
		return  this.P.x < obj.P.x + obj.w && this.P.x + this.w > obj.P.x &&
          this.P.y < obj.P.y + obj.h && this.P.y + this.h/4 > obj.P.y+obj.h/4;
	}
	collideEffect(obj){ 
		if(obj.V.y > 0){
			obj.V.y = 0;
			obj.P.y = this.P.y - obj.h;  
			obj.canJump = true;
			obj.canSwim = false;
			this.conferProperties(obj);
		}
		if (this.timer > this.holdTime){
			obj.P.x += this.V.x;
		}
	}
	updatePosition(){
		this.timer++;
		(this.timer <= this.holdTime) ? this.P.add(this.Vhold) : this.P.add(this.V);
		if(this.timer === this.cycleTime){
			this.timer = 0;
			this.V.mult(-1);
		}
	}
}

/* keep in case decide to change friction
export class IceMover extends MovingTile{
	constructor(x,y,w,h,img,vx,vy){
	super(x,y,w,h,img,vx,vy);
	}
}*/
export class CloudMover extends MovingTile{
	constructor(p5, x,y,w,h,img=null,vx,vy){
		super(p5,x,y,w,h,img,vx,vy);
		this.jumpVal = 15;
	}
}

export class CloudTile extends MapTile{
	constructor(p5,x,y,w,h, img=null){
		super(p5,x,y,w,h, img);
		this.jumpVal = 15;
	}
}
export class IceTile extends MapTile{
	constructor(p5,x,y,w,h, img=null){
		super(p5,x,y,w,h, img);
		this.frictionVal = 0.05;   
		this.accelerationVal = 0.1;
		this.maxSpeedVal = 5;
	}
}
export class ClimbTile extends MapTile{
	constructor(p5,x,y,w,h, img=null){
		super(p5,x,y,w,h, img);
	}
	collideEffect(obj){
		obj.canClimb = true;
		this.conferProperties(obj);
	}
}
export class WaterTile extends MapTile{
	constructor(p5,x,y,w,h,hasSurface){
		super(p5,x,y,w,h);
		this.hasSurface = hasSurface;
		this.fatigue = 1;
		this.jumpVal = 8;
		this.color = [60,95,205, 140];
		this.surfaceColor = [220,230,255];
	}
	collideEffect(obj){
		obj.canSwim = true;  
		if(obj.V.y > 0){
			obj.canJump = true;
		}
		if(obj.V.y > 1.5){
			obj.V.y = 1.5;
		}
		if(obj.fatigueTimer === obj.fatigueDelay){  
			obj.takeFatigue(this.fatigue);
		}
		this.conferProperties(obj);
		
	}	
	draw(p5) {
		p5.noStroke();
		p5.fill(this.color);
		p5.push();
		p5.translate(this.P.x, this.P.y);
		if(this.hasSurface){
			let alt = 2;
			p5.rect(0,alt*p5.sin(p5.radians(p5.frameCount)), this.w, this.h-alt*p5.sin(p5.radians(p5.frameCount)));
			p5.fill(this.surfaceColor);
			p5.beginShape();
			p5.curveVertex(0, 1.5*alt*p5.sin(p5.radians(p5.frameCount))+alt*p5.sin(p5.radians(p5.frameCount)));
			for (let i=0; i <=4; i++){
				p5.curveVertex(i*this.w/4, 1.5*alt*p5.sin(p5.radians(p5.frameCount)) + alt*p5.sin(p5.radians(p5.frameCount) + i*p5.PI/2));
			}
			for (let i=4; i>0; i--){
				p5.curveVertex(i*this.w/4, 1.5*alt*p5.sin(p5.radians(p5.frameCount)) - alt*p5.sin(p5.radians(p5.frameCount) + i*p5.PI/2));
			}
			p5.curveVertex(0, 1.5*alt*p5.sin(p5.radians(p5.frameCount))-alt*p5.sin(p5.radians(p5.frameCount)));
			p5.endShape(p5.CLOSE);
		}
		else{p5.rect(0,0,this.w,this.h);}
		p5.pop();
	}
}

export class LavaTile extends MapTile{
	constructor(p5,x,y,w,h){
		super(p5,x,y,w,h);
		this.alt = 4;
		this.damage = 5;
		this.color = [225,50,10];
	}
	collideEffect(obj){
		if(obj.V.y > 0 && obj.P.y + obj.h > this.P.y + 3/4*this.h){
			obj.V.y = 0;
			obj.P.y = this.P.y + 3/4*this.h - obj.h;  
			obj.canJump = true;
			if(obj.damageTimer === obj.damageDelay){
				obj.takeDamage(this.damage);
			}
			this.conferProperties(obj);
		}
	}	
	draw(p5) {
		p5.fill(this.color);
		p5.noStroke();
		p5.push();
		p5.translate(this.P.x, this.P.y);

		p5.beginShape();

		for (let i=0; i<11; i++){
			p5.vertex(i*this.w/10, this.alt*p5.sin(p5.radians(2*p5.frameCount)));
			this.alt*=-1;
		}
		p5.vertex(this.w, this.h);
		p5.vertex(0, this.h);
		p5.vertex(0,-this.alt*p5.sin(p5.radians(2*p5.frameCount)));
		this.alt*=-1;
		p5.endShape();
		p5.pop();
	}
}

export class HealthSpringTile extends LavaTile{
	constructor(p5,x,y,w,h){
		super(p5,x,y,w,h);
		this.alt = 1.5;
		this.damage = -5;
		this.color = [0,200,225, 125];
	}
	collideEffect(obj){
		if(obj.damageTimer === obj.damageDelay){
			obj.takeDamage(this.damage);
		}
	}
}

//*************************************

export class Collectable extends MapTile{
	constructor(p5,x,y,w,h, img=null){
	super(p5,x,y,w,h, img);
	this.collected = false;
	}
	/*
	modHealth(obj){
		
	}
	modMana(obj){
		
	}
	modInventory(obj){
		
	}*/
	collideEffect(obj){
		console.log(obj)  //TODO:
		this.collected = true;
	}
	draw(p5) {
		if (!this.collected){
			p5.push();
			p5.translate(this.P.x, this.P.y);
			//cycle if array
			if(this.img.length > 1){
				let numSprites = this.img.length;
				let timePerSprite = this.cycleTime/numSprites;
				let i = p5.floor(this.drawTimer/timePerSprite);
				p5.image(this.img[i], 0, 0, this.w, this.h); 
				this.updateDrawTimer();
			//otherwise just draw the image
			} else {
				p5.image(this.img, 0, 0, this.w, this.h);
			} 
			p5.pop();
		}
	} 
}
export class Heart extends Collectable{
	constructor(p5,x,y,w,h, img=null){
	super(p5,x,y,w,h, img);	
	this.cycleTime = 50;
	this.numberVal = 10;
	}
	collideEffect(obj){
		if(!this.collected && obj.health < obj.maxHealth){
			this.collected = true;
			obj.health += this.numberVal;
			if(obj.health > obj.maxHealth){
				obj.health = obj.maxHealth;
			}
		}
	}
}
export class ImageTile extends MapTile{
	constructor(p5,x,y,w,h, img=null){
		super(p5,x,y,w,h, img);	
	}
	collide(){
		return 0;  //TODO: remove own collide from blocks, might not need sep class 
	}
}
