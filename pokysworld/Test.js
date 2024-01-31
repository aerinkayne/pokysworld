// background code.  for fixing.
// workflow test

const drawBackgrounds = (p5, game) => {
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