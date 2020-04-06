var canvas = {};
var snow   = [];
var count  =  0;
var overlay= {};
            
window.addEventListener("load", function() {
    canvas.obj = document.querySelector("canvas#overlay");
    canvas.context = canvas.obj.getContext("2d");
    canvas.obj.width  = window.innerWidth;
    canvas.obj.height = window.innerHeight;
    
    setInterval( updateOverlay.bind( overlay ),16 );
});


function updateOverlay( ){
    
    this.spawnRate = 80;
    
    if( snow.length < 7 && count % this.spawnRate === 0 ){
        snow.push( new Snowflake() );
    }
    
    if( this.spawnRate!= 35 && count > this.spawnRate*7 ){
        this.spawnRate = 35;
    }
    
    count++;
    canvas.context.clearRect(0,0,canvas.obj.width,canvas.obj.height)
    
    snow.forEach(o=>{
       
        o.draw.call(o);
        o.update.call(o);
        
    });
    
}