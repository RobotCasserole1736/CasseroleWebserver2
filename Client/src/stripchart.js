import { Plot } from './plot.js'

var plotsTable = document.getElementById("plotsTable");
var numPlots = 0;
var plotList = [];

//Attach resize callback to window changing size
window.addEventListener("resize", resizeAll);
//Add our first plot
addPlot()



function addPlot(){
    numPlots++;
    var tableCell = plotsTable.insertRow(-1).insertCell(0);

    var hcDiv = document.createElement('div');
    hcDiv.id = "plot"+numPlots.toString();
    tableCell.appendChild(hcDiv);

    var plotToAdd = new Plot(hcDiv);
    plotList[numPlots-1] = plotToAdd;

    resizeAll();

}

function removePlot(){
    if(numPlots > 1){
        var plotToRemove = numPlots; // assume last plot removed.
        delete plotList[plotToRemove];
        plotList[plotToRemove] = null;
        plotsTable.deleteRow(plotToRemove-1);
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

    if(numPlots > 0){
        var pageWidth = document.getElementById('plotsTable').clientWidth * 0.98;
        var plotHeight = document.getElementById("plotsTable").clientHeight / numPlots;
        plotHeight = Math.min(plotHeight, 600);
        plotHeight = Math.max(plotHeight, 250);

        for(var i = 0; i < numPlots; i++){
            plotList[i].resize(plotHeight, pageWidth);
        }
    }
}