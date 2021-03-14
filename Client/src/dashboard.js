import { CircularGauge } from './circularGauge.js'
import { Icon } from './icon.js'
import { Camera } from './camera.js'
import { LineGauge } from './lineGauge.js'

//////////////////////////////////////////////////
// Logic to run on page load
//////////////////////////////////////////////////

// Instantiate all widgets
var widget1 = new CircularGauge('widget1', 'Test', 0,100,75,95);
var widget2 = new CircularGauge('widget2', 'Shooter RPM', 0,5000,2000,3000);
var widget3 = new Icon('widget3', 'warning', "#FF0000", null, 'icons/warning.svg');
var widget4 = new Icon('widget4', 'battery', "#FFFF00", "#555555", 'icons/battery.svg');
var widget5 = new Icon('widget5', 'vision',  "#00FF00", null, 'icons/vision.svg');
var widget6 = new Icon('widget6', 'power',   "#55AAFF", "#555555", 'icons/camera_fault.svg');
var widget7 = new Camera('widget7', "Vision Cam", 'http://photonvision.local:1192/stream.mjpg');
var widget8 = new LineGauge('widget8', 'Shooter RPM', 0,100,20,60);


// Start up rendering (never returns)
mainRenderLoop();


//////////////////////////////////////////////////
// Render & Animation Loop Functions
//////////////////////////////////////////////////

function mainRenderLoop(){

    var testSinSlow = 50+50*Math.sin( Date.now()/1000.0 * 2 * Math.PI * 0.1);
    var testSinFast = 50+30*Math.sin( Date.now()/1000.0 * 2 * Math.PI * 1.0);

    widget1.setVal(testSinSlow); 
    widget2.setVal(50 * testSinFast);

    if(testSinSlow > 35.0){
        widget3.setVal(Icon.kBLINK);
    } else {
        widget3.setVal(Icon.kOFF);
    }

    if(testSinSlow < 50.0){
        widget4.setVal(Icon.kON);
    } else {
        widget4.setVal(Icon.kOFF);
    }

    if(testSinFast > 50.0){
        widget5.setVal(Icon.kON);
    } else {
        widget5.setVal(Icon.kOFF);
    }

    if(testSinSlow > 43.0){
        widget6.setVal(Icon.kBLINK);
    } else {
        widget6.setVal(Icon.kOFF);
    }

    widget8.setVal(testSinSlow)
    
    widget1.render();
    widget2.render();
    widget3.render();
    widget4.render();
    widget5.render();
    widget6.render();
    widget8.render();

    requestAnimationFrame(mainRenderLoop);
}