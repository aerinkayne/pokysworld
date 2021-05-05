export class Player{
	constructor(p5){
		this.P = p5.createVector(0,0);  //x,y
		this.T = p5.createVector(0,0);
		this.V = p5.createVector(0,0);
		this.w = 30;
		this.h = 35;
		this.acceleration = 0.5; //check tile modifications
		this.friction = 1;	     //check tile modifications
		this.gravity = .5;       //check tile modifications
		this.maxSpeed = 3.5;     //check tile modifications
		this.MAXFALLSPEED = 12;
		this.maxHealth = 100;
		this.health = this.maxHealth;
		this.maxMana = 100;
		this.mana = this.maxMana;
		this.canJump = false;
		this.canClimb = false;
		this.canSwim = false;
		this.movements = {81:false, 69:false, 87: false, 32:false}; //q e w space
		this.jumpForce = 10;
		this.sprites = null; //[pokyRunR1];
		this.damageDelay = 30; //for damage and health regen
		this.damageTimer = this.damageDelay;
		this.fatigueDelay = 30; 
		this.fatigueTimer = this.fatigueDelay;
		this.baseCycleTime = 40;
		this.animationCycleTime = this.baseCycleTime;
		this.drawTimer = 0;
	}

	updateDrawTimer(){
		this.drawTimer++;
		this.updateCycleTime();
		if (this.drawTimer >= this.animationCycleTime){
			this.drawTimer = 0;
		}
	}
	updateDamageTimer(){
		if (this.damageTimer < this.damageDelay){
			this.damageTimer++;
		}
		if (this.fatigueTimer < this.fatigueDelay){
			this.fatigueTimer++;
		}
	}
	updateCycleTime() {
		this.animationCycleTime = this.baseCycleTime - 2 * this.V.mag();
	}
	setSize(w,h){
		this.w = w;
		this.h = h;
	}
	draw(p5){
		let numSprites = this.sprites.length;
		p5.push();
		p5.translate(this.P.x, this.P.y);
		if(numSprites > 1){
			let timePerSprite = this.animationCycleTime/numSprites;
			let i = p5.floor(this.drawTimer/timePerSprite);
			p5.image(this.sprites[i], 0, 0, this.w, this.h); 
			this.updateDrawTimer();
		}
		else {
			p5.image(this.sprites[0], 0, 0, this.w, this.h);
		}
		p5.pop();
	}
	manageSprites(sprites){
		if(this.sprites == null) {
			this.sprites = [sprites.pokyRunR1]
		}
		//falling, swimming, climbing, canClimb
		//todo  w/87 for up, decrease speed while swimming.  simplify
		(this.canSwim) ? this.setSize(35,35) : this.setSize(30,35);
		
		if(this.V.x > 0 && this.canJump){
			(this.canSwim) ? this.sprites = [sprites.pokySwimR1, sprites.pokySwimR2] 
							: this.sprites = [sprites.pokyRunR2, sprites.pokyRunR1];
		}
		if(this.V.x < 0 && this.canJump){
			(this.canSwim) ? this.sprites = [sprites.pokySwimL1, sprites.pokySwimL2] 
							: this.sprites = [sprites.pokyRunL2, sprites.pokyRunL1];
		}
		if(this.V.x > 0 && !this.canJump){this.sprites = [sprites.pokyJumpR];}
		if(this.V.x < 0 && !this.canJump){this.sprites = [sprites.pokyJumpL];}
		if(this.V.x===0 && this.canJump){
			if (this.sprites[0]===sprites.pokyRunR2 || this.sprites[0]===sprites.pokyJumpR) {
				this.sprites = [sprites.pokyRunR1];
			}
			if (this.sprites[0]===sprites.pokyRunL2 || this.sprites[0]===sprites.pokyJumpL) {
				this.sprites = [sprites.pokyRunL1];
			}
		}
		if(this.V.x===0 && !this.canJump){
			if (this.sprites[0]===sprites.pokyRunR1) {this.sprites = [sprites.pokyJumpR];}
			if (this.sprites[0]===sprites.pokyRunL1) {this.sprites = [sprites.pokyJumpL];}
		}
		if(this.V.x===0 && this.canSwim){
			if (this.sprites[0]===sprites.pokyRunR1) {this.sprites = [sprites.pokySwimR1];}
			if (this.sprites[0]===sprites.pokyRunL1) {this.sprites = [sprites.pokySwimL1];}
		}
		if(this.V.x===0 && !this.canSwim){
			if (this.sprites[0]===sprites.pokySwimR1) {this.sprites = [sprites.pokyRunR1];}
			if (this.sprites[0]===sprites.pokySwimL1) {this.sprites = [sprites.pokyRunL1];}
		}
		if(this.canClimb && this.movements['87']){this.sprites = [sprites.pokyClimb1, sprites.pokyClimb2];}
	}
	bound(p5, game){
		this.P.x= p5.constrain(this.P.x, 0, game.levelW-this.w);
		this.P.y= p5.constrain(this.P.y, -p5.height, game.levelH-this.h);
	}
 
	manageUpdates(p5, game){
		if (!game.paused){
			this.move();
			this.manageSprites(game.sprites);
			this.updatePosition(game);
			this.updateTranslation(p5, game);
			this.updateDamageTimer();
			this.bound(p5, game);
		}
	}
	
	move(){
		if (this.movements['81']){ //q
			this.V.x -= this.acceleration;
			if (this.V.x < -this.maxSpeed){
				this.V.x = -this.maxSpeed;
				}
			}
		if (this.movements['69']){  //e
			this.V.x += this.acceleration;
			if (this.V.x > this.maxSpeed){
				this.V.x = this.maxSpeed;
				}
			}
		if (this.movements['32'] && this.canJump){
			this.jump();
		}   //space
		if (this.movements['87'] && this.canClimb){
			this.climb();
		}  //w
	}
	jump(){
		this.V.y -= this.jumpForce;
		this.canJump = false;
		this.canClimb = false;
	}
	climb(){
		this.V.y = -1.5;
	}
	takeDamage(dmg){
		this.health -= dmg;
		this.damageTimer = 0;
		if(this.health < 0){this.health = 0;}
		if(this.health > this.maxHealth){this.health = this.maxHealth;}
	}
	takeFatigue(ftg){
		this.mana -= ftg;
		this.fatigueTimer = 0;
		if(this.mana < 0){this.mana = 0;}
		if(this.mana > this.maxMana){this.mana = this.maxMana;}
	}
	healthBar(p5){
		p5.push();
		p5.fill(0);
		p5.stroke(0);
		p5.rect(5, 5, p5.width/8, p5.height/50, 2);
		p5.fill(255,50,175);
		p5.noStroke();
		p5.rect(5, 5, p5.map(this.health, 0, this.maxHealth, 0, p5.width/8), p5.height/50, 2);
		p5.pop();
	}
	manaBar(p5){
		p5.push();
		p5.fill(0);
		p5.stroke(0);
		p5.rect(5, 10 + p5.height/50, p5.width/8, p5.height/50, 2);
		p5.fill(50,225,255);
		p5.noStroke();
		p5.rect(5, 10 + p5.height/50, p5.map(this.mana, 0, this.maxMana, 0, p5.width/8), p5.height/50, 2);
		p5.pop();
	}
	addFriction(){           //q                      e
		if (!this.movements['81'] && !this.movements['69']){
			if(this.V.x < 0){
				this.V.x += this.friction;
				if (this.V.x > 0){this.V.x = 0;}
			}
			if(this.V.x > 0){
				this.V.x -= this.friction;
				if (this.V.x < 0){this.V.x = 0;}
			}
		}
	}
	updatePosition(game){
		this.canJump = false;
		this.addFriction();
		
		this.P.x += this.V.x;
		game.mapCollision("X");
		
		if (!this.canJump && !(this.canClimb && this.movements['87'])){
			this.V.y += this.gravity;
		}
			
		if (this.V.y > this.MAXFALLSPEED){this.V.y = this.MAXFALLSPEED;}
		this.P.y+=this.V.y;
		
		this.canClimb = false;
		this.canSwim = false;
		game.mapCollision("Y");
	}
	updateTranslation(p5, game){
		//console.log(game)
		this.T.x = (this.P.x + this.w/2 >= game.levelW - p5.width/2) ? game.levelW - p5.width  
									: p5.round(p5.max(0, this.P.x + this.w/2 - p5.width/2));
		this.T.y = (this.P.y + this.h/2 >= game.levelH - p5.height/2)? game.levelH - p5.height 
									: p5.round(this.P.y + this.h/2 - p5.height/2);  //no upper bound
	}
}	