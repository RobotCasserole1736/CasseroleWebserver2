import { Plot } from './plot.js'

var plotsTable = document.getElementById("plotsTable");
var numPlots = 0;
var plotList = [];

function addPlot(){
    numPlots++;
    var row = plotsTable.insertRow(-1);
    row.id = "plot"+numPlots.toString();
    var plotToAdd = new Plot(row.id);
    plotList[numPlots-1] = plotToAdd;
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

}

window.handleZoomFullBtnClick = handleZoomFullBtnClick;
function handleZoomFullBtnClick(){

}