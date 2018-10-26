var $settings = {
    
    cards: 16,
    
};

var $cards  = [];
var $active = [];
var $pairs  = [];
var gamemode= '';
var turnCount= 1;
var scores=[0,0];
var images  = {
    snow: newImage("snow.png")
}

function newImage( src ){
    let i = new Image();
    i.src = src;
    return i;
}


function start( gamemode ){
    
    if( gamemode.singleplayer ){ 
        window.gamemode = 'singlePlayer';
        document.querySelectorAll("div.score").forEach(o=>o.style.display = "none");
    } else {
        window.gamemode = 'multiPlayer' ;
    }
    
    var gameContainer = document.querySelector( "div#game" );
    for(let i=0; i<$settings.cards; i++){
        $cards[i] = document.createElement( "div" );
        $cards[i] . classList.add( "card" );
        $cards[i] . addEventListener( "click",handleCardClick.bind( $cards[i] ));
        $cards[i] . setAttribute( "id",""+i );
        gameContainer.appendChild( $cards[i] );
    }
    
    makePairs();
    
    document.querySelector( "div#startpage" ).style.top = "-"+Math.max( screen.width,screen.height )+"px";
    setTimeout(()=>{
        document.querySelector( "div#startpage" ).style.display = "none";
    },1400);
    
}



function makePairs( ){
    
    // transform array
    $cards.forEach(( o,i,a )=>{
        $pairs[i] = { e:o,p:false };
    });
    
    $pairs.forEach(( o,i,a )=>{
        // if no pair is found jet, find one
        if( ! o.p ){
            // random index with no pair
            let rand=~~(Math.random()*a.length);
            while( a[rand].p || rand===i ) rand=~~(Math.random()*a.length);
            // connect with each other
            a[rand].p = a[i   ].e ;
            a[i   ].p = a[rand].e ;
        }
    });
    console.log($pairs)
}


function handleCardClick( ){
    if( $active.length  <  2 && !this.classList.contains( "turned" )){
        this.classList.add( "turned" );
        $active.push( this );
    }
    if( $active.length === 2 ){
        let isCorrect = checkActive();
       if( isCorrect && gamemode == 'multiPlayer' ){
           let player = turnCount%2;
           document.querySelector("div.score#score_"+(player+1)).innerText = ++scores[player];
           
           
       }
        turnCount++;
        $active.forEach(o=>o.classList.add(isCorrect.toString()));
        setTimeout(()=>{
            $active.forEach(o=>{
                if( o.classList.contains( "false" )){
                    o.classList.remove(   "turned" );
                    o.classList.remove(   "false"  );
                }
                if( o.classList.contains( "turned" )&& 
                  ! o.classList.contains( "true"   )){
                    o.classList.remove(   "turned"  );
                }
            });
            $active = [];
        },800 );
    }
}


function checkActive( ){
    let r = false;
    $pairs.forEach(( o,i,a )=>{
        if( $active[0] == o.e && $active[1] == o.p ){
            r = true;
            return;
        }
    });
    return r;
}

// COLOR //

var colors = [
    "rgba(   0, 120, 215, .88 )",
    "rgba( 255, 185,   0, .88 )",
    "rgba( 232,  17,  35, .88 )",
    "rgba( 136,  23, 152, .88 )"
];
var activecolor = colors[~~( Math.random() * colors.length )];

setInterval( ()=>{
    activecolor = colors[~~( Math.random() * colors.length )];
    document.querySelectorAll("div.score").forEach((o)=>o.style.background = activecolor);
},1000);


// Overlay //
var canvas = {};
var snow   = [];
var count  =  0;
            
window.onload=()=>{
    canvas.obj = document.querySelector("canvas#overlay");
    canvas.context = canvas.obj.getContext("2d");
    canvas.obj.width  = window.innerWidth;
    canvas.obj.height = window.innerHeight;
    
    setInterval( updateOverlay,16 );
    
}


function updateOverlay( ){
    
    if( snow.length < 7 && count%60 === 0 ){
        snow.push( new Snowflake() );
    }
    
    count++;
    canvas.context.clearRect(0,0,canvas.obj.width,canvas.obj.height)
    
    snow.forEach(o=>{
       
        o.update.call(o);
        o.draw.call(o);
        
    });
    
}

class Snowflake {
    
    constructor( ){
        this.size = 20;
        this.y = -this.size;
        this.x = Math.random() * canvas.obj.width;
        this.func = Math.random()>.5?Math.sin:Math.cos;
        this.speed = Math.random()*8+5;
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
        canvas.context.drawImage(images.snow,this.x,this.y,this.size,this.size);
    }
}
