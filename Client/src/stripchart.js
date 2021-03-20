import { Plot } from './plot.js'

var plotsContainer = document.getElementById("plotsContainer");
var numPlots = 0;
var plotList = [];


//Attach resize callback to window changing size
window.addEventListener("resize", resizeAll);
//Add our first plot
addPlot()



function addPlot(){
    numPlots++;
    var newPlotContainer = document.createElement('plot');
    newPlotContainer.id = "plot" + numPlots.toString();

    plotsContainer.appendChild(newPlotContainer);

    var plotToAdd = new Plot(newPlotContainer);
    plotList[numPlots-1] = plotToAdd;

    resizeAll();

}

function removePlot(){
    if(numPlots > 1){
        var plotToRemove = numPlots; // assume last plot removed.

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