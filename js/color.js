var colors = [
    "rgba(   0, 120, 215, .88 )",
    "rgba( 255, 185,   0, .88 )",
    "rgba( 232,  17,  35, .88 )",
    "rgba( 136,  23, 152, .88 )"
];
var activecolor;

setInterval( ()=>{
    activecolor = colors[~~( Math.random() * colors.length )];
    document.querySelectorAll("div.rainbow").forEach((o)=>o.style.background = activecolor);
}, 1000);