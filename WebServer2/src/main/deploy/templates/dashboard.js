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