import { CircularGauge } from './circularGauge.js'
import { Icon } from './icon.js'
import { Camera } from './camera.js'
import { LineGauge } from './lineGauge.js'
import { Text } from './text.js'
import { AutoChooser } from './autoChooser.js'
import { Sound } from './sound.js'

//////////////////////////////////////////////////
// Logic to run on page load
//////////////////////////////////////////////////

// Instantiate all widgets
var widget1 = new CircularGauge('widget1', 'Test', 0,100,75,95);
var widget2 = new CircularGauge('widget2', 'Shooter RPM', 0,5000,2000,3000);
var widget3 = new Icon('widget3', 'warning', "#FF2222", "#222222", 'icons/warning.svg');
var widget4 = new Icon('widget4', 'battery', "#FFFF00", "#222222", 'icons/battery.svg');
var widget5 = new Icon('widget5', 'vision',  "#22DD22", "#222222", 'icons/vision.svg');
var widget6 = new Icon('widget6', 'power',   "#2244FF", "#222222", 'icons/camera_fault.svg');
var widget7 = new Camera('widget7', "Vision Cam", 'http://photonvision.local:1192/stream.mjpg');
var widget8 = new LineGauge('widget8', 'Another Test', 0,100,20,60);
var widget9 = new LineGauge('widget9', 'Puppy', -1000,0,-9999,9999);
var widget10 = new Text('widget10', 'Test1', -1000,0,-9999,9999);
var widget11 = new Text('widget11', 'Test2', -1000,0,-9999,9999);
var widget12 = new AutoChooser('widget12', 'Auto Mode', ['Do Nothing', 'Drive Forward', 'Win Match', 'Victory Spins'],onAuto1NewSelectedValue);

var soundWidget1 = new Sound("test1", "sfx/alarm2.mp3", true);

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
    widget9.setVal(-10*testSinFast)

    widget10.setVal("Hello World%@");
    widget11.setVal(testSinSlow.toPrecision(4) + " Nm");

    //soundWidget1.setVal((testSinSlow > 75)); // zomg my earballs
    
    widget1.render();
    widget2.render();
    widget3.render();
    widget4.render();
    widget5.render();
    widget6.render();
    widget8.render();
    widget9.render();
    widget10.render();
    widget11.render();
    widget12.render();
    soundWidget1.render();


    requestAnimationFrame(mainRenderLoop);
}

function onAuto1NewSelectedValue(newAutoIdx){
    //Temp - after a delay update the actual-display.
    window.setTimeout(widget12.setActualState.bind(widget12), 400, newAutoIdx);

}