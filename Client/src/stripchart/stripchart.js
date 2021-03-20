/////////////////////////////////////////////////////////////////////////
// Stripchart - top-level entrypoint for the stripcharts view
// Does... ummm... all the things:
// 1) Handlers for GUI interactions
// 2) Initializing first plot for the user (Presumably they want at least one.)
// 3) Synchronizes X axes between all plots
// 4) Synchronizes cursor positions between all plots
/////////////////////////////////////////////////////////////////////////

import { Plot } from './plot.js'

var plotsContainer = document.getElementById("plotsContainer");
var numPlots = 0;
var plotList = [];

var plottedSignalsList = [];


//Attach resize callback to window changing size
window.addEventListener("resize", resizeAll);
//Add our first plot
addPlot()



function addPlot(){
    numPlots++;
    var newPlotContainer = document.createElement('plot');
    newPlotContainer.id = "plot" + numPlots.toString();
    newPlotContainer.classList.add("outlined");


    plotsContainer.appendChild(newPlotContainer);

    var plotToAdd = new Plot(newPlotContainer);
    plotList[numPlots-1] = plotToAdd;

    resizeAll();

}

function removePlot(){
    if(numPlots > 1){
        var remIdx = numPlots-1  // assume last plot removed.

        plotsContainer.removeChild(plotList[remIdx].drawDiv);
        delete plotList[remIdx];
        plotList[remIdx] = null;

        numPlots--;
    }

    resizeAll();
    
}

window.handleStartBtnClick = handleStartBtnClick;
function handleStartBtnClick(){

}

window.handleStopBtnClick = handleStopBtnClick;
function handleStopBtnClick(){

}

window.handleAddChartBtnClick = handleAddChartBtnClick;
function handleAddChartBtnClick(){
    addPlot();
}

window.handleRmChartBtnClick = handleRmChartBtnClick;
function handleRmChartBtnClick(){
    removePlot();
}

window.handleZoomFullBtnClick = handleZoomFullBtnClick;
function handleZoomFullBtnClick(){

}

function resizeAll(){
    for(var i = 0; i < numPlots; i++){
        plotList[i].resize();
    }
}