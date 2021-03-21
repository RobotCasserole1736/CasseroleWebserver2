/////////////////////////////////////////////////////////////////////////
// SignalDAQ - wrapper around NT4 to specifically extract signal information
// and allow clients to request one or more signals
//
// Mirroring (I assume) NT4 architecture, it's heavily callback driven
/////////////////////////////////////////////////////////////////////////

import { Signal } from "../stripchart/signal";

export class SignalDAQ {


    constructor(onSignalListUpdated_in, //Gets called whenever the all-signal list itself has been updated.
                onConnect_in,          //Gets called once client completes initial handshake with server
                onDisconnect_in) {     //Gets called once client detects server has disconnected
        this.onSignalAnnounce = onSignalAnnounce_in;
        this.onSignalUnAnnounce = onSignalUnAnnounce_in;
        this.onSignalListUpdated = onSignalListUpdated_in;
        this.onData = onData_in;
        this.onConnect = onConnect_in;
        this.onDisconnect = onDisconnect_in;

        this.capturingSignalsList = []; //start assuming no signals.
        this.allSignalsList = []; //start assuming no signals.

        this.daqRunning = false;

        //TEST ONLY - fake data source loop and events
        setTimeout(this.testConnect,0.5)
        setTimeout(this.testAnnounceSignals,0.75)
        setInterval(this.testDataSourceLoop, 50);
    }

    //Request a signal get added to the DAQ
    addSignal(signalIn){
        this.capturingSignalsList.push(signalIn);
    }

    //Call to remove a signal from the DAQ
    removeSignal(signalIn){
        for(var idx = 0; idx < this.capturingSignalsList.length; idx++){
            if(signalIn.name == this.capturingSignalsList[idx].name){
                this.capturingSignalsList.splice(idx, 1); //remove that signal and splice the list back together so we don't have null entries the middle
            }
        }
    }

    clearSignalList(){
        this.capturingSignalsList = [];
    }

    //Request RIO start sending periodic updates with data values
    startDAQ(){
        this.daqRunning = true;
        //TODO: Map to the NT4 Subscribe operation
    }

    //Request RIO stop sending periodic updates
    stopDAQ(){
        //TODO: Map to the NT4 UnSubscribe operation
        this.daqRunning = false;
    }

    getAllAvailableSignals(){
        return this.allSignalsList;
    }

    onSignalAnnounce(name, units){
        this.allSignalsList.push(new Signal(name, units));
    }

    onSignalUnAnnounce(name){
        //Remove signal from all signal-containing lists.
        for(var idx = 0; idx < this.allSignalsList.length; idx++){
            if(name == this.allSignalsList[idx].name){
                this.allSignalsList.splice(idx, 1); //remove that signal and splice the list back together so we don't have null entries the middle
            }
        }

        for(var idx = 0; idx < this.capturingSignalsList.length; idx++){
            if(name == this.capturingSignalsList[idx].name){
                this.capturingSignalsList.splice(idx, 1); //remove that signal and splice the list back together so we don't have null entries the middle
            }
        }
    }

    // TEST ONLY - this is a periodic loop which simulates
    // a NT server with signals and data in it

    testConnect(){
        this.onConnect();
    }

    testAnnounceSignals(){
        this.onSignalAnnounce(new Signal("TestFastSin1", "RPM"));
        this.onSignalAnnounce(new Signal("TestFastSin2", ""));
        this.onSignalAnnounce(new Signal("TestSlowSin1", "A"));
    }


    testDataSourceLoop(){
        var curTimeSec = window.performance.now();

        //Calculate values for each signal
        var testSlowSin1Val = 50+50*Math.sin( curTimeSec/1000.0 * 2 * Math.PI * 0.1);
        var testFastSin1Val = 50+30*Math.sin( curTimeSec/1000.0 * 2 * Math.PI * 1.0);
        var testFastSin2Val = 20*Math.sin( (curTimeSec/1000.0 + 0.2 )* 2 * Math.PI * 1.0);

        if(this.daqRunning){
            //DAQ is running, announce values for signals in the signalList.
            this.capturingSignalsList.forEach(sig => {
                var sigName = sig.name;
                if(sigName == "TestFastSin1"){
                    this.onData(sigName, curTimeSec, testFastSin1Val);
                } else if(sigName == "TestFastSin2") {
                    this.onData(sigName, curTimeSec, testFastSin2Val);
                } else if(sigName == "TestSlowSin1") {
                    this.onData(sigName, curTimeSec, testSlowSin1Val);
                }
            })
        }

    }




}