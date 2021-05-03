class GameScreen {
	constructor(p5){  
	this.P = p5.createVector(0, 0);  
	this.backgroundObjects = [];
	this.foregroundObjects = [];
	this.opacity = 0; 
 	this.color = [0,0,0]; 
	}

	isOnScreen(p5, obj){
		return  obj.P.x < this.P.x + p5.width && obj.P.x + obj.w > this.P.x &&
				obj.P.y < this.P.y + p5.height && obj.P.y + obj.h > this.P.y;
	}
	
	updatePosition(T){  //vector of player translation values 
		this.P.x = T.x; 
		this.P.y = T.y;		
	}
	
	drawScreen(p5){  
		p5.push();
		p5.translate(this.P.x, this.P.y);
		p5.fill(this.color[0], this.color[1], this.color[2], this.opacity);
		p5.rect(0,0,p5.width, p5.height);
		p5.pop();
	}

	shadeSky(p5, game){
		let rectColor;
		let H = p5.height/40;
		let num = p5.height/H;
  		let C1 = p5.color(game.levelData[game.currentLevel].skyStart);
  		let C2 =p5.color(game.levelData[game.currentLevel].skyEnd);
  		p5.noStroke();
		for (let i = 0; i < num; i++){
			rectColor = p5.lerpColor(C1, C2, i/num);
			p5.fill(rectColor);
			p5.rect(0,i*H,p5.width,H);
		}
	}

	drawBackgrounds(p5, game){
		game.levelData[game.currentLevel].levelBackgroundImages.forEach(config => {
			//x coord, y coord, width, total height onscreen
			let bg = config.img.get(config.rate*game.player.T.x, 0, p5.width, p5.ceil(p5.min(p5.height-config.Y+config.rate*game.player.T.y, config.img.height)));
			p5.image(bg, 0, config.Y-config.rate*game.player.T.y, bg.width, bg.height);

			/*noFill();  //uncomment to check get values and img draw locations
			strokeWeight(4);
			stroke(255);
			rect(0, config.Y-config.rate*game.player.T.y, bg.width, bg.height);
			strokeWeight(1);
			noStroke();//*/
		});
	} 

	//call at game setup and new level load.
	populateArrays(p5, game){  
		let tempArrB = [];
		let tempArrF = [];
		let obj;
		game.levelData[game.currentLevel].levelEffects.forEach((effect, index) => {  
			let numB = game.levelData[game.currentLevel].numBGEffects[index];
			let numF = game.levelData[game.currentLevel].numFGEffects[index];
			
			if (effect ==="snow"){obj = Snowflake;}
			else if (effect ==="rain"){obj = Raindrop;}

			while(numB > 0){
				tempArrB.push(new obj(this.P.x + p5.random(p5.width), this.P.y + p5.random(p5.height), 0.5, 1));
				numB--;
			}
			while(numF > 0){
				tempArrF.push(new obj(this.P.x + p5.random(p5.width), this.P.y + p5.random(p5.height), 1, 1));
				numF--;
			}
		}); 

		tempArrB.sort((a, b) => (a.w > b.w ? 1 : -1));
		this.backgroundObjects = this.backgroundObjects.concat(tempArrB);
		this.foregroundObjects = this.foregroundObjects.concat(tempArrF);
	}

	drawArrObjects(game, arr){
		arr.forEach(obj => {  
			obj.draw();
			if(!game.paused){
				obj.updatePosition(this);
				obj.checkBounds(this);
			}
		});
	}
}



class Snowflake{
	constructor(p5, x,y, scaleMin, scaleMax){
	this.P = p5.createVector(x,y);
	this.scale = p5.random(scaleMin, scaleMax);
	this.V = p5.createVector(p5.random(-1,1), 2*this.scale);
	p5.width = p5.ceil(5*this.scale);  //max size
	p5.height = p5.ceil(5*this.scale);
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
		p5.ellipse(0,0,p5.width/2 + p5.random(p5.width/2), p5.height/2 + p5.random(p5.height/2));
		p5.pop();
	}
	checkBounds(p5, gameScreen){  
  		if (this.P.x + p5.width < gameScreen.P.x){
			this.P.x = gameScreen.P.x + gameScreen.w + p5.width;
		}
		if (this.P.x - p5.width > gameScreen.P.x + gameScreen.w){
			this.P.x = gameScreen.P.x - p5.width;
		}
		if (this.P.y + p5.height < gameScreen.P.y){
			this.P.y = gameScreen.P.y + gameScreen.h + p5.height;
		}
		if (this.P.y - p5.height > gameScreen.P.y + gameScreen.h){
			this.P.y = gameScreen.P.y - p5.height;
		}
	}
}

class Raindrop extends Snowflake{
	constructor(p5, x, y, scaleMin, scaleMax){
		super(x,y, scaleMin, scaleMax);
		this.V = p5.createVector(1.5*this.scale, 10*this.scale);
		p5.width = p5.ceil(2*this.V.x);
		p5.height = p5.ceil(2*this.V.y);
		this.opacity = 120*this.scale;
	}
	draw(p5){
		p5.stroke(175,235,255,this.opacity);
		p5.strokeWeight(this.scale);
		p5.push();
		p5.translate(this.P.x, this.P.y);
		p5.line(0,0, p5.width, p5.height);
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