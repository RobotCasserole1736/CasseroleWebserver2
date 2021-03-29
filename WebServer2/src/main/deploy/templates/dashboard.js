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
${WIDGETS_INSTANTIATE}
/*
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
*/

// Start up rendering (never returns)
mainRenderLoop();


//////////////////////////////////////////////////
// Render & Animation Loop Functions
//////////////////////////////////////////////////

function mainRenderLoop(){

    ${WIDGETS_UPDATE}

    requestAnimationFrame(mainRenderLoop);
}

${WIDGETS_CALLBACK}