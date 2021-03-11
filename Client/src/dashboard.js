import { CircularGauge } from './circularGauge.js'

//////////////////////////////////////////////////
// Logic to run on page load
//////////////////////////////////////////////////

// Instantiate all widgets
var widget1 = new CircularGauge('widget1', 'Test', 0,100,75,95);


// Start up rendering (never returns)
mainRenderLoop();


//////////////////////////////////////////////////
// Render & Animation Loop Functions
//////////////////////////////////////////////////

function mainRenderLoop(){

    var testSin1 = 50+50*Math.sin( Date.now()/1000.0 * 2 * Math.PI * 0.1);

    widget1.setVal(testSin1); 
    widget1.render();

    requestAnimationFrame(mainRenderLoop);
}