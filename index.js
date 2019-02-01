var $settings = {
    cards: 16,
    time: 1500 //how long you can watch wrong cards until they turn back
};


function newImage( src ){
    let i = new Image();
    i.src = src;
    return i;
}

var $cards  = [];
var $active = [];
var $pairs  = [];
var gamemode= '';
var turnCount= 0;
var scores=[0,0];
var $toggle=false;
var images  = {
    snow : newImage("img/snow.png"),
    cards: []
}

for(let i=1; i<=$settings.cards/2; i++){
    images.cards[i-1] = {
        img:newImage(`img/${i}.png`),
        isUsed:false,
        url:`img/${i}.png`
    };
}



function start( gamemode ){
    
    if( gamemode.singleplayer ){ 
        window.gamemode = 'singlePlayer';
        document.querySelectorAll("div.score" ).forEach(o=>o.style.display = "none");
        document.querySelectorAll("div.player").forEach(o=>o.classList.add("invisible"));
        document.querySelector("div#game").classList.add("singlePlayer")
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
    
    document.querySelector("div#player_2").classList.add("invisible");
    
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
            // random image which is not used yet
            let img=~~(Math.random()*images.cards.length);
            while( images.cards[img].isUsed ) img=~~(Math.random()*images.cards.length);
            images.cards[img].isUsed = true;
            // set image
            a[rand].e.style.backgroundImage = `url(${images.cards[img].url})`;
            a[rand].p.style.backgroundImage = `url(${images.cards[img].url})`;
        }
    });
    console.log($pairs)
}


function handleCardClick( ){
    if( $active.length  <  2 && !this.classList.contains( "turned" )){
        this.classList.add( "turned" );
        $active.push( this );
    } else {
        return;
    }
    if( $active.length === 2 ){
        let isCorrect = checkActive();
        if( isCorrect && gamemode == 'multiPlayer' ){
            let player = turnCount%2;
            document.querySelector("div.score#score_"+(player+1)).innerText = ++scores[player];
        } else {
            turnCount++;
            $toggle = true;
        }
        $active.forEach(o=>o.classList.add(isCorrect.toString()));
        
        if( checkEnd( )) end();
        
        if( ! isCorrect ){
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
                if($toggle && window.gamemode == 'multiPlayer') document.querySelectorAll("div.player").forEach((o,i,a)=>{o.classList.toggle("invisible")});
                $toggle = false;
            },$settings.time );
        } else {
            $active = [];
        }
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

function checkEnd( ){
    if( $cards.length == 0 ) return false;
    let r = true;
    $cards.forEach(( o,i,a )=>{
        if( ! o.classList.contains( "true" )) r = false;
    });
    return r;
}

function end( ){
    let text = (gamemode == 'multiPlayer'
             ? (
                    scores[0] == scores[1]
                    ? "Unentschieden!"
                    : scores[0]>scores[1]
                        ? "Elsa hat gewonnen!"
                        : "Anna hat gewonnen!"
                )
             : "Du hast gewonnen!"
            )+ "\n\n Klicke um noch mal zu spielen!"
    ;
    let e = document.getElementById( "end" );
    e.style.display = "initial";
    e.innerText = text;
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
    document.querySelectorAll("div.rainbow").forEach((o)=>o.style.background = activecolor);
},1000);


// Overlay //
var canvas = {};
var snow   = [];
var count  =  0;
var overlay= {};
            
window.onload=()=>{
    canvas.obj = document.querySelector("canvas#overlay");
    canvas.context = canvas.obj.getContext("2d");
    canvas.obj.width  = window.innerWidth;
    canvas.obj.height = window.innerHeight;
    
    setInterval( updateOverlay.bind( overlay ),16 );
    
}


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
