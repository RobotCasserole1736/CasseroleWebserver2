import { Plot } from './plot.js'

var plotsTable = document.getElementById("plotsTable");
var numPlots = 0;
var plotList = [];

function addPlot(){
    numPlots++;
    var row = plotsTable.insertRow(-1);
    row.id = "plot"+numPlots.toString();
    row.class = "outlined"
    var plotToAdd = new Plot(row.id);
    plotList[numPlots-1] = plotToAdd;
}

function removePlot(){
    if(numPlots > 0){
        var plotToRemove = numPlots; // assume last plot removed.
        delete plotList[plotToRemove];
        plotList[plotToRemove] = null;
        plotsTable.deleteRow(plotToRemove-1);
        numPlots--;
    }
    
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