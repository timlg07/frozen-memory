var $settings = {
    
    cards: 16,
    
};

var $cards  = [];
var $active = [];
var $pairs  = [];


function start( ){
    
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





