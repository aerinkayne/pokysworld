import { btnStart, btnPause, levelData } from "./levelData.js";
import { Button } from './projectFunc_p5.js';
import { Player } from './playerClass_p5.js';
import { GameScreen } from './screenClass_p5.js';

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
		this.levelData = levelData;
		this.paused = false;
		this.setup = false;
		this.gameState = "start";
		//might need to pass game
		/*
		this.btnStart = new Button(p5, btnStart, ()=> {
			this.gameState = "inGame";
		});
		this.btnPause = new Button(p5, btnPause, ()=> {
			(!this.paused) ? btnPause.txt = "➤" : btnPause.txt = "❚❚";
			(!this.paused) ? btnPause.txtColor = [200,255,255] : btnPause.txtColor = [0,0,0];
			(!this.paused) ? this.paused = true : this.paused = false;
		});*/
	}
	removeMap() {
		this.mapTiles = [];
		this.movingTiles = [];
	}
	gameCamera(p5) {
		p5.translate(-this.player.T.x, -this.player.T.y);
	}

	manageScenes(p5) {
		if (this.gameState === "start") {
			p5.background(150);
			this.btnStart.draw();
		}
		
		if (this.gameState === "inGame") {
			if(!this.setup){
				this.loadLevelMap(this.currentLevel);
				this.gameScreen.populateArrays(this);
			}	

			this.gameScreen.shadeSky(this);
			this.gameScreen.drawBackgrounds(this);
			this.gameCamera(p5);
			this.gameScreen.updatePosition(this.player.T); //needs to be after cam to track properly
   
			this.player.manageUpdates(this);


			this.gameScreen.drawArrObjects(this, this.gameScreen.backgroundObjects);
			this.filterTiles();
			this.updateMovingTiles();
			this.drawTiles();

			this.gameScreen.drawArrObjects(this, this.gameScreen.foregroundObjects);
			
			//for effects using screen opacity changes
			if (this.gameScreen.opacity){
				this.gameScreen.drawScreen(); 
			}
			
			p5.resetMatrix();
			this.player.healthBar();
			this.player.manaBar();
			this.btnPause.draw();
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
				x = j*S;
				y = i*S;

				if(t==="00 ") continue;  //easier to read than spaces
				else if(t==="01 "){
					this.player.P = p5.createVector(x,y);
					this.player.updateTranslation(this); 
					this.gameScreen.updatePosition(this.player.T);
				}
				else if(t==="d1 "){
					this.mapTiles.push(new DirtTile(x,y,S,S, this.sprites.dirt1));
				}
				else if(t==="CL "){
					this.mapTiles.push(new CloudTile(x,y,S,S, [this.sprites.CloudL1, this.sprites.cloudL2]));
				}
				else if(t==="CR "){
					this.mapTiles.push(new CloudTile(x,y,S,S, [this.sprites.CloudR1, this.sprites.cloudR2]));
				}
				else if(t==="CM "){
					this.mapTiles.push(new CloudTile(x,y,S,S, [this.sprites.CloudM1, this.sprites.cloudM2]));
				}
				else if(t==="i1 "){
					this.mapTiles.push(new IceTile(x,y,S,S, this.sprites.iceT1));
				}
				else if(t==="i2 "){
					this.mapTiles.push(new IceTile(x,y,S,S, this.sprites.iceT2));
				}
				else if(t==="i3 "){
					this.mapTiles.push(new IceTile(x,y,S,S, this.sprites.ice1));
				}
				else if(t==="i4 "){
					this.mapTiles.push(new IceTile(x,y,S,S, this.sprites.ice2));
				}
				else if(t==="0L "){
					backTiles.push(new LavaTile(x,y+S/4,S,3/4*S));
				}
				else if(t==="0H "){
					frontTiles.push(new HealthSpringTile(x,y+S/4,S,3/4*S));
				}
				else if(t==="0m "){
					let M = new IceMover(x, y+S, 4/3*S, S/2, 0.5,0);
					this.mapTiles.push(M);
					this.movingTiles.push(M);
				}
				else if(t==="cm "){
					let M = new CloudMover(x, y, 7/5*S, 4/5*S, 0, 0.5);
					this.mapTiles.push(M);
					this.movingTiles.push(M);
				}
				else if(t==="0w "){
					frontTiles.push(new WaterTile(x,y,S,S,false));
				}
				else if(t==="0W "){
					frontTiles.push(new WaterTile(x,y+S/4,S,3/4*S, true));
				}
				else if(t==="V0 "){
					this.mapTiles.unshift(new ClimbTile(x,y,S,S, this.sprites.vine1));
				}
				else if(t==="Vt "){
					this.mapTiles.unshift(new ClimbTile(x,y,S,S, this.sprites.vineT));
				}	
				else if(t==="0h "){
					this.mapTiles.push(new Heart(x+S/3,y+S/3,S/3,S/3));
				}
				else if(t==="g1 "){
					frontTiles.push(new GrassTile(x,y+3/4*S,S,S/4));
				}
				else if(t==="cl "){
					frontTiles.push(new CloverTile(x,y+S/2,S,S/2));
				}
			}
		}
		//      1           2          3         4    player     5            6 
		//   unshift      push      unshift     push          unshift       push
		//        [backtiles]           [maptiles]                [frontTiles]
		//              6 additional layers without sorting.
		this.mapTiles.push(this.player);
		this.mapTiles = [...backTiles, ...this.mapTiles, ...frontTiles]; 
		this.setup = true;
	}
	filterTiles(){
		this.onScreenTiles = this.mapTiles.filter(tile => this.gameScreen.isOnScreen(tile));  
		this.collisionTiles = this.onScreenTiles.filter(tile => getDistance(tile, this.player) < 2*this.tileSize && tile !== this.player);
	}
	//update even if offscreen
	updateMovingTiles(){
		if(!this.paused){
			this.movingTiles.forEach(tile => {tile.updatePosition();});
		}
	}
	drawTiles(){
		this.onScreenTiles.forEach(tile =>{tile.draw();});
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