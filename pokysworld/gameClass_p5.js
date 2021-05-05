import { MapTile, MovingTile, IceTile, CloudTile, LavaTile, HealthSpringTile, 
		CloudMover, WaterTile, ClimbTile, Heart, ImageTile} from './MapTiles.js';
import { Player } from './playerClass_p5.js';
import { GameScreen } from './screenClass_p5.js';


//distance between the center of two block objects
function getDistance (p5, obj1, obj2) {
	return  p5.sqrt(p5.sq(obj1.P.x + obj1.w/2 -(obj2.P.x + obj2.w/2)) + 
					p5.sq(obj1.P.y + obj1.h/2 -(obj2.P.y + obj2.h/2))); 
}

export default class Game { 
	constructor(sprites, p5) {
		this.sprites = sprites;
		this.player = new Player(p5);
		this.gameScreen = new GameScreen(p5);  
		this.mapCodeLength = 3;  //2 chars for coding + 1 space
		this.tileSize = 40;
		this.mapTiles = [];
		this.onScreenTiles = [];
		this.collisionTiles = [];
		this.movingTiles = [];
		this.currentLevel = 0;
		this.numLevels = 2; //update later
		//this.levelData = levelData;
		this.paused = false;
		this.setup = false;
		this.gameState = "start";
	}
	removeMap() {
		this.mapTiles = [];
		this.movingTiles = [];
	}
	gameCamera(p5) {
		p5.translate(-this.player.T.x, -this.player.T.y);
	}

	manageScenes(p5, btnStart, btnPause) {
		if (this.gameState === "start") {
			p5.background(100,100,125);
			btnStart.draw(p5);
			//console.log('calling');
		}
		
		if (this.gameState === "inGame") {
			if(!this.setup){
				this.loadLevelMap(p5, this.currentLevel);
				this.gameScreen.populateArrays(p5, this);
				this.setup = true;
			}	
			//not currently used
			//this.gameScreen.shadeSky(p5, this);

			
			this.gameScreen.drawBackgrounds(p5, this);
			this.gameCamera(p5);
			this.gameScreen.updatePosition(this.player.T); //needs to be after cam to track properly
   
			this.player.manageUpdates(p5, this);


			this.gameScreen.drawArrObjects(p5, this, this.gameScreen.backgroundObjects);
			this.filterTiles(p5);
			this.updateMovingTiles();
			this.drawTiles(p5);

			this.gameScreen.drawArrObjects(p5, this, this.gameScreen.foregroundObjects);
			
			//for effects using screen opacity changes
			if (this.gameScreen.opacity){
				this.gameScreen.drawScreen(); 
			}
			
			p5.resetMatrix();
			this.player.healthBar(p5);
			this.player.manaBar(p5);
			btnPause.draw(p5);
			
		}
	}
	loadLevelMap(p5){
		if (this.mapTiles.length) {
			this.removeMap();
		}
		let S = this.tileSize;
		let L = this.mapCodeLength;
		let numRows = this.levelData[this.currentLevel].levelMap.length;
		let numCols = this.levelData[this.currentLevel].levelMap[0].length;
		
		this.levelW = S*numCols/L;
		this.levelH = S*numRows;

		let t, x, y;
		let frontTiles = [];
		let backTiles = [];
		
		for (let i = 0; i < numRows; i++){
			for (let j = 0; j < numCols; j++){
				t = this.levelData[this.currentLevel].levelMap[i].slice(L*j, L*(j+1));
				x = j * S; //x pos of tile top left corner
				y = i * S; //y pos of tile

				if(t==="00 ") continue;  //easier to read than spaces
				else if(t==="01 "){
					this.player.P = p5.createVector(x,y);
					this.player.updateTranslation(p5, this); 
					this.gameScreen.updatePosition(this.player.T);
				}
				else if(t==="d1 "){
					this.mapTiles.push(new MapTile(p5, x,y,S,S, this.sprites.dirt1));
				}
				else if(t==="d2 "){
					this.mapTiles.push(new MapTile(p5, x,y,S,S, this.sprites.dirt2));
				}
				else if(t==="d3 "){
					this.mapTiles.push(new MapTile(p5, x,y,S,S, this.sprites.dirt3));
				}
				else if(t==="d4 "){
					this.mapTiles.push(new MapTile(p5, x,y,S,S, this.sprites.dirt4));
				}
				else if(t==="CL "){
					this.mapTiles.push(new CloudTile(p5,x,y,S,S, [this.sprites.cloudL1, this.sprites.cloudL2]));
				}
				else if(t==="CR "){
					this.mapTiles.push(new CloudTile(p5,x,y,S,S, [this.sprites.cloudR1, this.sprites.cloudR2]));
				}
				else if(t==="CM "){
					this.mapTiles.push(new CloudTile(p5,x,y,S,S, [this.sprites.cloudM1, this.sprites.cloudM2]));
				}
				else if(t==="i1 "){
					this.mapTiles.push(new IceTile(p5,x,y,S,S, this.sprites.iceT1));
				}
				else if(t==="i2 "){
					this.mapTiles.push(new IceTile(p5,x,y,S,S, this.sprites.iceT2));
				}
				else if(t==="i3 "){
					this.mapTiles.push(new IceTile(p5,x,y,S,S, this.sprites.ice1));
				}
				else if(t==="i4 "){
					this.mapTiles.push(new IceTile(p5,x,y,S,S, this.sprites.ice2));
				}
				else if(t==="0L "){
					backTiles.push(new LavaTile(p5,x,y+S/4,S,3/4*S));
				}
				else if(t==="0H "){
					frontTiles.push(new HealthSpringTile(p5,x,y+S/4,S,3/4*S));
				}
				else if(t==="0m "){
					let M = new MovingTile(p5, x, y+S, 4/3*S, S/2, this.sprites.moveIce, 0.5, 0);
					this.mapTiles.push(M);
					this.movingTiles.push(M);
				}
				else if(t==="cm "){
					let M = new CloudMover(p5, x, y, 7/5*S, 4/5*S, this.sprites.moveCloud, 0, 0.5);
					this.mapTiles.push(M);
					this.movingTiles.push(M);
				}
				else if(t==="0w "){
					frontTiles.push(new WaterTile(p5,x,y,S,S,false));
				}
				else if(t==="0W "){
					frontTiles.push(new WaterTile(p5,x,y+S/4,S,3/4*S, true));
				}
				else if(t==="V0 "){
					this.mapTiles.unshift(new ClimbTile(p5,x,y,S,S, this.sprites.vine1));
				}
				else if(t==="Vt "){
					this.mapTiles.unshift(new ClimbTile(p5,x,y,S,S, this.sprites.vineT));
				}	
				else if(t==="0h "){
					this.mapTiles.push(new Heart(p5,x+S/3,y+S/3,S/3,S/3, [this.sprites.heart1, this.sprites.heart2]));
				}
				else if(t==="g1 "){
					frontTiles.push(new ImageTile(p5,x,y+3/4*S,S,S/4, this.sprites.grass2));
				}
				else if(t==="cl "){
					frontTiles.push(new ImageTile(p5,x,y+S/2,S,S/2, this.sprites.clover1));
				}
			}
		}
		//      1           2          3         4    player     5            6 
		//   unshift      push      unshift     push          unshift       push
		//        [backtiles]           [maptiles]                [frontTiles]
		//              6 additional layers without sorting.
		this.mapTiles.push(this.player);
		this.mapTiles = [...backTiles, ...this.mapTiles, ...frontTiles]; 
	}
	filterTiles(p5){
		this.onScreenTiles = this.mapTiles.filter(tile => this.gameScreen.isOnScreen(tile));  
		this.collisionTiles = this.onScreenTiles.filter(tile => getDistance(p5, tile, this.player) < 2*this.tileSize && tile !== this.player);
	}
	//update even if offscreen
	updateMovingTiles(){
		if(!this.paused){
			this.movingTiles.forEach(tile => {tile.updatePosition();});
		}
	}
	drawTiles(p5){
		this.onScreenTiles.forEach(tile =>{tile.draw(p5);});
	}
	
	mapCollision(XorY){
		switch(XorY){
			case "X":
				this.collisionTiles.forEach(tile => {
					/*/  //uncomment to visualize distance call check
					stroke(200,0,0);
					strokeWeight(2);    
					line(tile.P.x+tile.w/2, tile.P.y+tile.h/2, 
						this.player.P.x+this.player.w/2, this.player.P.y+this.player.h/2); //*/
					if(tile.collide(this.player)){ 
						tile.collideEffect(this.player, this.player.V.x, 0);
					}
				}); 
				break;
			case "Y":	
				this.collisionTiles.forEach(tile => {
					if(tile.collide(this.player)){ 
						tile.collideEffect(this.player, 0, this.player.V.y);
					}
				});
				break;
			default: return;
		}
	}
}	