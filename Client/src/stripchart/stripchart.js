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

var recordingStartTime = null;
var recordingEndTime = null;
var recordingRunning = false;

//Add our first plot
addPlot();

//Start main animation loop
mainAnimationLoop();

/////////////////////////////////////////////////////////////
//Utility Functions


function addPlot(){

    var newPlotContainer = document.createElement('plot');
    newPlotContainer.id = "plot" + plotUniqueIdIdx.toString();
    plotUniqueIdIdx++;
    newPlotContainer.classList.add("outlined");

    plotsContainer.appendChild(newPlotContainer);

    var plotToAdd = new Plot(newPlotContainer, signalFromName);
    plotToAdd.chart.mouseoverAtTimeCallback = onChartMouseOver; //Install our mouseover handler for cursor purposes
    plotList.push(plotToAdd); //Assume add to end

}

function removePlot(){
    if(plotList.length > 1){
        var remIdx = plotList.length-1;  // assume last plot removed.

        plotsContainer.removeChild(plotList[remIdx].drawDiv);
        delete plotList[remIdx];
        plotList.splice(remIdx, 1);
    }    
}

function startRecording(){
    signalSelector.disableUserInteraction();
    saveCurrentConfig();
    mainDAQ.clearSignalList();
    signalSelector.getSelectedSignalList().forEach(sig => mainDAQ.addSignal(sig.name));
    allSignalsMap.forEach(sig => sig.clearValues());
    recordingStartTime = null;
    recordingEndTime = null;
    recordingRunning = true;
    mainDAQ.startDAQ();
}

function stopRecording(){
    mainDAQ.stopDAQ();
    recordingRunning = false;
    signalSelector.enableUserInteraction();
    plotList.forEach(plot=>plot.setDrawRange(recordingStartTime, recordingEndTime));
    plotList.forEach(plot=>plot.setViewRange(recordingStartTime, recordingEndTime));

}


/////////////////////////////////////////////////////////////
//User Button Handlers

window.handleStartBtnClick = handleStartBtnClick;
function handleStartBtnClick(){
    startRecording();
}

window.handleStopBtnClick = handleStopBtnClick;
function handleStopBtnClick(){
    stopRecording();
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
    plotList.forEach(plot=>plot.setViewRange(recordingStartTime, recordingEndTime));
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
    stopRecording();
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

    //Save off incoming sample timing stats
    //TODO - does NT4 expose a better way to do this?
    if(recordingStartTime == null){
        recordingStartTime = timestamp;
    }
    recordingEndTime = timestamp;
}

function signalFromName(name_in){
    return allSignalsMap[name_in];
}

///////////////////////////
// Mouse Events

function onChartMouseOver(timeAtMouse){
    plotList.forEach(plot=>plot.setCursorPos(timeAtMouse));
}


///////////////////////////
// Animation Loop

function mainAnimationLoop(){
    if(recordingRunning){
        plotList.forEach(plot=>plot.setDrawRange(recordingEndTime - 10.0, recordingEndTime));
        plotList.forEach(plot=>plot.setViewRange(recordingEndTime - 10.0, recordingEndTime));
    } 
    plotList.forEach(plot=>plot.mainAnimationLoop());
    window.requestAnimationFrame(mainAnimationLoop);
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

        localStorage.setItem(LOCAL_STORAGE_KEY_NAME, JSON.stringify(lsData));
    }
}


function restoreConfig(){
    var lsData = new Map();
    var ls_sel_signals = [];
    if(local_storage_available == true){
        lsData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NAME))

        var ls_sel_signals = []
        if(lsData != null){
            var ls_sel_signals = lsData["selSigList"];
        }
    }

    ls_sel_signals.forEach(sigName => {
        signalSelector.selectSignalByName(sigName);
    });
}