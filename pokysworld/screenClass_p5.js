export class GameScreen {
	constructor(p5){  
		this.P = p5.createVector(0, 0); 
		this.w = p5.width;
		this.h = p5.height; 
		this.backgroundObjects = [];
		this.foregroundObjects = [];
		this.opacity = 0; 
		this.color = [0,0,0]; 
	}

	isOnScreen(obj){
		return  obj.P.x < this.P.x + this.w && obj.P.x + obj.w > this.P.x &&
				obj.P.y < this.P.y + this.h && obj.P.y + obj.h > this.P.y;
	}
	
	updatePosition(T){  //vector of player translation values 
		this.P.x = T.x; 
		this.P.y = T.y;	
	}
	
	drawScreen(p5){  
		p5.push();
		p5.translate(this.P.x, this.P.y);
		p5.fill(this.color[0], this.color[1], this.color[2], this.opacity);
		p5.rect(0,0,this.w, this.h);
		p5.pop();
	}

	shadeSky(p5, game){
		let rectColor;
		let H = this.h/40;
		let num = this.h/H;
		let C1 = p5.color(game.levelData[game.currentLevel].skyStart);
		let C2 =p5.color(game.levelData[game.currentLevel].skyEnd);
		p5.noStroke();
		for (let i = 0; i < num; i++){
			rectColor = p5.lerpColor(C1, C2, i/num);
			p5.fill(rectColor);
			p5.rect(0, i*H, this.w, H);
		}
	}


	drawBackgrounds(p5, game){
		p5.image(game.levelData[game.currentLevel].backgroundImage, 0, 0, this.w, this.h);
		game.levelData[game.currentLevel].parallaxImages.forEach((background, i) => { 
			let {img, rate, initialY} = background;
			 
			let getX = rate * this.P.x; //x, y, width, height to get. 
			let getY = p5.max(0, rate * this.P.y - initialY); //screen.P.y can be negative.
			let getW = this.w 	//all images are currently full width  
			//lesser of:  (lesser of: height of canvas vs height of onscreen image)  vs  height of image 
			let getH = p5.ceil(p5.min(p5.min(this.h, this.h - initialY + rate * this.P.y), img.height));
			
			//where to place the image (X location is always 0).
			let placeY = initialY + getY - rate * this.P.y;
			let bg = img.get(getX, getY, getW, getH);

			if (bg.width > 0 && bg.height > 0){  //don't try to render an image with w or h < 1
				p5.image(bg, 0, placeY, bg.width, bg.height);

				/*  //uncomment to check img draw locations
				p5.noFill();  
				p5.strokeWeight(9 - 3*i);
				i === 0 ? p5.stroke(255,100,100) : i === 1 ? p5.stroke(100,255,100) : p5.stroke(100,100,255)
				p5.rect(0, placeY, bg.width, bg.height);
				p5.strokeWeight(1);
				p5.noStroke(); //*/
			}
		});
	} 

	//call at game setup and new level load.
	populateArrays(p5, game){  
		let tempArrB = [];
		let tempArrF = [];
		let obj = null;
		game.levelData[game.currentLevel].levelEffects.forEach((effect, index) => {  
			let numB = game.levelData[game.currentLevel].numBGEffects[index];
			let numF = game.levelData[game.currentLevel].numFGEffects[index];
			
			if (effect ==="snow"){obj = Snowflake;}
			else if (effect ==="rain"){obj = Raindrop;}

			while(numB > 0){
				tempArrB.push(new obj(p5, this.P.x + p5.floor(p5.random(this.w)), 
								this.P.y + p5.floor(p5.random(this.h)), 0.5, 1));
				numB--;
			}
			while(numF > 0){
				tempArrF.push(new obj(p5, this.P.x + p5.floor(p5.random(this.w)), 
								this.P.y + p5.floor(p5.random(this.h)), 1, 1));
				numF--;
			}
		}); 

		tempArrB.sort((a, b) => (a.w > b.w ? 1 : -1));
		this.backgroundObjects = this.backgroundObjects.concat(tempArrB);
		this.foregroundObjects = this.foregroundObjects.concat(tempArrF);
	}

	drawArrObjects(p5, game, arr){
		arr.forEach(obj => {  
			obj.draw(p5);
			if(!game.paused){
				obj.updatePosition(this);
				obj.checkBounds(p5, this);
			}
		});
	}
}



export class Snowflake{
	constructor(p5, x, y, scaleMin, scaleMax){
		this.P = p5.createVector(x,y);
		this.scale = p5.random(scaleMin, scaleMax);
		this.V = p5.createVector(p5.random(-1,1), 2*this.scale);
		this.w = p5.ceil(5*this.scale);  //max size
		this.h = p5.ceil(5*this.scale);
		this.opacity = 130 + 250*this.scale/2;
	}
	updatePosition(){
		this.P.add(this.V);
	}
	draw(p5){
		p5.noStroke();
		p5.fill(255,255,255,this.opacity);
		p5.push();
		p5.translate(this.P.x, this.P.y);
		p5.ellipse(0,0,this.w/2 + p5.random(this.w/2), this.h/2 + p5.random(this.h/2));
		p5.pop();
	}
	checkBounds(p5, gameScreen){  
		if (this.P.x + this.w < gameScreen.P.x){
			this.P.x = gameScreen.P.x + gameScreen.w + this.w;
		}
		if (this.P.x - this.w > gameScreen.P.x + gameScreen.w){
			this.P.x = gameScreen.P.x - this.w;
		}
		if (this.P.y + this.h < gameScreen.P.y){
			this.P.y = gameScreen.P.y + gameScreen.h + this.h;
		}
		if (this.P.y - this.h > gameScreen.P.y + gameScreen.h){
			this.P.y = gameScreen.P.y - this.h;
		}
	}
}

export class Raindrop extends Snowflake{
	constructor(p5, x, y, scaleMin, scaleMax){
		super(p5, x,y, scaleMin, scaleMax);
		this.V = p5.createVector(1.5*this.scale, 10*this.scale);
		this.w = p5.ceil(2*this.V.x);
		this.h = p5.ceil(2*this.V.y);
		this.opacity = 120*this.scale;
	}
	draw(p5){
		p5.stroke(175,235,255,this.opacity);
		p5.strokeWeight(this.scale);
		p5.push();
		p5.translate(this.P.x, this.P.y);
		p5.line(0,0, this.w, this.h);
		p5.pop();
		p5.noStroke();
	}
}

/*
class Bird extends Snowflake(){
 	constructor(x,y, scaleMin, scaleMax){
		super(x,y, scaleMin, scaleMax);
 }
 draw(){
  push();
  stroke(0,0,0, this.opacity);
  point(0,0);
  pop();
 }
}
*/

