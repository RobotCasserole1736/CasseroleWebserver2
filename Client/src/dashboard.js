import { CircularGauge } from './circularGauge.js'
import { Icon } from './icon.js'

//////////////////////////////////////////////////
// Logic to run on page load
//////////////////////////////////////////////////

// Instantiate all widgets
var widget1 = new CircularGauge('widget1', 'Test', 0,100,75,95);
var widget2 = new CircularGauge('widget2', 'Shooter RPM', -100,0,-90,-10);
var widget3 = new Icon('widget3', 'warning', "#FF0000", null, 'icons/warning.svg');
var widget4 = new Icon('widget4', 'battery', "#FFFF00", "#555555", 'icons/battery.svg');
var widget5 = new Icon('widget5', 'vision',  "#00FF00", null, 'icons/vision.svg');
var widget6 = new Icon('widget6', 'power',   "#55AAFF", "#555555", 'icons/power.svg');


// Start up rendering (never returns)
mainRenderLoop();


//////////////////////////////////////////////////
// Render & Animation Loop Functions
//////////////////////////////////////////////////

function mainRenderLoop(){

    var testSin1 = 50+50*Math.sin( Date.now()/1000.0 * 2 * Math.PI * 0.1);

    widget1.setVal(testSin1); 
    widget2.setVal(-1.0 * testSin1);

    if(testSin1 > 35.0){
        widget3.setVal(Icon.kBLINK);
    } else {
        widget3.setVal(Icon.kOFF);
    }

    if(testSin1 < 50.0){
        widget4.setVal(Icon.kON);
    } else {
        widget4.setVal(Icon.kOFF);
    }

    if(testSin1 > 50.0){
        widget5.setVal(Icon.kON);
    } else {
        widget5.setVal(Icon.kOFF);
    }

    if(testSin1 > 43.0){
        widget6.setVal(Icon.kBLINK);
    } else {
        widget6.setVal(Icon.kOFF);
    }
    
    widget1.render();
    widget2.render();
    widget3.render();
    widget4.render();
    widget5.render();
    widget6.render();

    requestAnimationFrame(mainRenderLoop);
}