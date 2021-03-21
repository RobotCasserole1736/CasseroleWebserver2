/////////////////////////////////////////////////////////////////////////
// Stripchart - top-level entrypoint for the stripcharts view
// Does... ummm... all the things?
// 1) Handlers for GUI interactions
// 2) Initializing first plot for the user (Presumably they want at least one.)
// 3) Synchronizes X axes between all plots
// 4) Synchronizes cursor positions between all plots
/////////////////////////////////////////////////////////////////////////

import { Plot } from './plot.js'
import { SignalSelector } from './signalSelector.js';
import { Signal } from './signal.js';
import { SignalDAQ } from '../signalDaq/signalDAQ.js';

var plotsContainer = document.getElementById("plotsContainer");
var plotList = [];
var plotUniqueIdIdx = 0; //Used to ensure every newly added plot has a unique id

var signalSelector = new SignalSelector(document.getElementById("selectableSignalContainer"))

var mainDAQ = new SignalDAQ( onSignalAnnounce,
                             onSignalUnAnnounce,
                             onData,
                             onConnect,
                             onDisconnect
                            );

//Attach resize callback to window changing size
window.addEventListener("resize", resizeAll);
//Add our first plot
addPlot()


//TEMP TEST ONLY
signalSelector.addSignal();
signalSelector.addSignal(new Signal("Other Test Signal", "V"));
signalSelector.addSignal(new Signal("Yet Another Test Signal", ""));
signalSelector.addSignal(new Signal("TestSig2", "A"));
signalSelector.addSignal(new Signal("class.otherclass.shooterRPM", "RPM"));
signalSelector.attemptSignalSelectionRestore();
//END TEST STUFF INJECTION

/////////////////////////////////////////////////////////////
//Utility Functions


function addPlot(){

    var newPlotContainer = document.createElement('plot');
    newPlotContainer.id = "plot" + plotUniqueIdIdx.toString();
    plotUniqueIdIdx++;
    newPlotContainer.classList.add("outlined");

    plotsContainer.appendChild(newPlotContainer);

    var plotToAdd = new Plot(newPlotContainer);
    plotList.push(plotToAdd); //Assume add to end

    resizeAll();

}

function removePlot(){
    if(plotList.length > 1){
        var remIdx = plotList.length-1;  // assume last plot removed.

        plotsContainer.removeChild(plotList[remIdx].drawDiv);
        delete plotList[remIdx];
        plotList.splice(remIdx, 1);
    }

    resizeAll();
    
}

function resizeAll(){
    plotList.forEach(plot => plot.resize());
}


/////////////////////////////////////////////////////////////
//User Button Handlers

window.handleStartBtnClick = handleStartBtnClick;
function handleStartBtnClick(){
    signalSelector.disableUserInteraction();
    signalSelector.updateStoredSignalSelection();
    mainDAQ.clearSignalList();
    signalSelector.getSelectedSignalList().forEach(sig => mainDAQ.addSignal(sig.name));
    signalSelector.getSelectedSignalList().forEach(sig => sig.clearValues());
    mainDAQ.startDAQ();
}

window.handleStopBtnClick = handleStopBtnClick;
function handleStopBtnClick(){
    mainDAQ.stopDAQ();
    signalSelector.enableUserInteraction();
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

window.unselectAllBtnClick = unselectAllBtnClick;
function unselectAllBtnClick(){
    signalSelector.clearSelection();
    signalSelector.updateStoredSignalSelection();
}

window.filterChangeHandler = filterChangeHandler;
function filterChangeHandler(filterSpec_in){
    signalSelector.setFilterSpec(filterSpec_in);
}

/////////////////////////////////////////////////////////////
//Data Event Handlers

function onConnect(){
    signalSelector.clearSignalList();
    //TODO - change some status indicator about being connected.
}

function onDisconnect(){
    signalSelector.updateStoredSignalSelection();
    //TODO - put some status marker out about disconnect.
}

function onSignalAnnounce(name, units){
    signalSelector.addSignal(new Signal(name, units));
}

function onSignalUnAnnounce(name){
    //TODO
}

function onData(name, timestamp, value){

}