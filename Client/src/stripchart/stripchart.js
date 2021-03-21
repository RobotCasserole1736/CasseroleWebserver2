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
import { Sample } from './sample.js';
import { SignalDAQ } from '../signalDaq/signalDAQ.js';

var plotsContainer = document.getElementById("plotsContainer");
var plotList = [];
var plotUniqueIdIdx = 0; //Used to ensure every newly added plot has a unique id

var LOCAL_STORAGE_KEY_NAME = "CasseroleStripchartConfig";

var local_storage_available = false;
if (typeof(Storage) !== "undefined") {
    local_storage_available = true;
} 

var allSignalsMap = new Map();
var signalSelector = new SignalSelector(document.getElementById("selectableSignalContainer"))

var mainDAQ = new SignalDAQ(onSignalAnnounce,
                            onSignalUnAnnounce,
                            onNewSampleData,
                            onConnect,
                            onDisconnect
                            );


//Attach resize callback to window changing size
window.addEventListener("resize", resizeAll);
//Add our first plot
addPlot();

/////////////////////////////////////////////////////////////
//Utility Functions


function addPlot(){

    var newPlotContainer = document.createElement('plot');
    newPlotContainer.id = "plot" + plotUniqueIdIdx.toString();
    plotUniqueIdIdx++;
    newPlotContainer.classList.add("outlined");

    plotsContainer.appendChild(newPlotContainer);

    var plotToAdd = new Plot(newPlotContainer, signalFromName);
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
    saveCurrentConfig();
    mainDAQ.clearSignalList();
    signalSelector.getSelectedSignalList().forEach(sig => mainDAQ.addSignal(sig.name));
    allSignalsMap.forEach(sig => sig.clearValues());
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
    saveCurrentConfig();
}

window.filterChangeHandler = filterChangeHandler;
function filterChangeHandler(filterSpec_in){
    signalSelector.setFilterSpec(filterSpec_in);
}

/////////////////////////////////////////////////////////////
//Data Event Handlers

function onConnect(){
    allSignalsMap.clear();

}

function onDisconnect(){

}

function onSignalAnnounce(name, units){
    var newSignal = new Signal(name, units);
    allSignalsMap[name] = newSignal;
    signalSelector.addSignal(newSignal);
    restoreConfig(); 
}

function onSignalUnAnnounce(name){
    var sigToRemove = allSignalsMap[name];
    signalSelector.removeSignal(sigToRemove);
    allSignalsMap.delete(name);
}

function onNewSampleData(name, timestamp, units){
    allSignalsMap[name].addSample(new Sample(timestamp, units));
    plotList.forEach(plot => plot.updateDisplayedValues());
}

function signalFromName(name_in){
    return allSignalsMap[name_in];
}

/////////////////////////////////////////////////////////////
//Save/Recal config handlers
function saveCurrentConfig(){
    if(local_storage_available){
        var lsData = new Map();

        var ls_sel_signals = [];
        signalSelector.getSelectedSignalList().forEach(selSig =>{
            ls_sel_signals.push(selSig.name);
        });

        lsData["selSigList"] = ls_sel_signals;

        localStorage.setItem(SignalSelector.LOCAL_STORAGE_KEY_NAME, JSON.stringify(lsData));
    }
}


function restoreConfig(){
    var lsData = new Map();
    var ls_sel_signals = [];
    if(local_storage_available == true){
        lsData = JSON.parse(localStorage.getItem(SignalSelector.LOCAL_STORAGE_KEY_NAME))

        var ls_sel_signals = lsData["selSigList"];

        if(ls_sel_signals == null){
            ls_sel_signals = [];
        }
    }

    ls_sel_signals.forEach(sigName => {
        signalSelector.selectSignalByName(sigName);
    });
}