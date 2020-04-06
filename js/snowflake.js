class Snowflake {
    
    constructor( ){
        this.size = 20;
        this.y = -this.size;
        this.x = Math.random() * canvas.obj.width;
        this.func = Math.random() > .5 ? Math.sin : Math.cos;
        this.speed = Math.random() * 8 + 5;
    }
    
    update( ){
        this.x += this.func(count/this.speed) * canvas.obj.width/200;
        this.y +=  Math.random() * canvas.obj.height/200;
        if
        ( 
            (this.x >= window.innerWidth )||
            (this.y >= window.innerHeight)||
            (this.x <= 0 )
        ){
            snow.splice(snow.indexOf( this ),1);
        }
    }
    
    draw( ){
        canvas.context.drawImage(images.snow, this.x,this.y, this.size,this.size);
    }
    
}