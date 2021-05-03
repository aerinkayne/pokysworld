export default class Ball{
    constructor(p5, r){
        this.P = p5.createVector(p5.width/2, p5.height/2)
        this.V = p5.createVector(-3,3);
        this.r = r;
        this.d = 2*r;
    }
    show(p5){
        p5.color(255)
        p5.ellipse(this.P.x, this.P.y, this.d, this.d)
    }
    move(p5){
        this.P.add(this.V);
        this.checkBounds(p5);
    }
    checkBounds(p5){
        if (this.P.x - this.r <= 0 || this.P.x + this.r >= p5.width){
            this.V.x *= -1;
        }
        if (this.P.y - this.r <= 0 || this.P.y + this.r >= p5.height){
            this.V.y *= -1;
        }
    }
}