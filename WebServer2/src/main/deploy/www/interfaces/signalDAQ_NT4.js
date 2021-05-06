/////////////////////////////////////////////////////////////////////////
// SignalDAQ - wrapper around NT4 to specifically extract signal information
// and allow clients to request one or more signals
//
// Mirroring (I assume) NT4 architecture, it's heavily callback driven
/////////////////////////////////////////////////////////////////////////

import { NT4_Client } from "./dummy_NT4.js";

export class SignalDAQNT4 {


    constructor(onSignalAnnounce_in,   //Gets called when server announces enough topics to form a new signal
                onSignalUnAnnounce_in, //Gets called when server unannounces any part of a signal
                onNewSampleData_in,    //Gets called when any new data is available
                onConnect_in,          //Gets called once client completes initial handshake with server
                onDisconnect_in,        //Gets called once client detects server has disconnected
                statusTextCallback_in) {
        this.onSignalAnnounce = onSignalAnnounce_in;
        this.onSignalUnAnnounce = onSignalUnAnnounce_in;
        this.onNewSampleData = onNewSampleData_in;
        this.onConnect = onConnect_in;
        this.onDisconnect = onDisconnect_in;
        this.statusTextCallback = statusTextCallback_in;

        this.signalList = new Set(); //start assuming no signals.

        this.daqRunning = false;

        this.rxCount = 0;

        this.nt4Client = new NT4_Client("todo server addr", 
                                        this.topicAnnounceHandler.bind(this), 
                                        this.topicUnannounceHandler.bind(this),
                                        this.valueUpdateHandler.bind(this),
                                        this.onConnect.bind(this),
                                        this.onDisconnect.bind(this)
                                        );
        this.statusTextCallback("NT4 Connected.");
    }

    topicAnnounceHandler(name, defaultValue){
        if(this.isSignalUnitsTopic(name)){
            var sigName = this.unitsTopicToSigName(name);
            var sigUnits = this.nt4Client.getMostRecentValue(name);
            this.onSignalAnnounce(sigName, sigUnits); //announce on units announcement....todo is this ok?
        } else {
            // ignore
        }
    }

    topicUnannounceHandler(name){
        //todo
    }

    valueUpdateHandler(name, timestamp, value){
        var sigName = this.valueTopicToSigName(name);
        this.onNewSampleData(sigName, timestamp, value);
        this.rxCount++;
        this.statusTextCallback("DAQ Running. RX Count: " + this.rxCount.toString());
    }

    //Request a signal get added to the DAQ
    addSignal(signalNameIn){
        this.signalList.add(signalNameIn);
    }

    //Call to remove a signal from the DAQ
    removeSignal(signalNameIn){
        this.signalList.delete(signalNameIn);
    }

    clearSignalList(){
        this.signalList.clear();
    }

    //Request RIO start sending periodic updates with data values
    startDAQ(){
        this.daqRunning = true;
        this.signalList.forEach(sigName => {
            this.nt4Client.subscribe(this.sigNameToValueTopic(sigName));
        });
        this.statusTextCallback("DAQ Running.");
        this.rxCount = 0;
    }

    //Request RIO stop sending periodic updates
    stopDAQ(){
        this.nt4Client.clearAllSubscriptions();
        this.daqRunning = false;
        this.statusTextCallback("DAQ Stopped.");

    }

    sigNameToValueTopic(name){
        return "Signals/" + name + "/Value"
    }

    valueTopicToSigName(topic){
        var tmp = topic;
        tmp = tmp.replace(/^Signals\//, '');
        tmp = tmp.replace(/\/Value/, '');
        return tmp;
    }

    isSignalValueTopic(topic){
        return topic.match(/Signals\/[a-zA-Z0-9\._]+\/Value/);
    }

    sigNameToUnitsTopic(name){
        return "Signals/" + name + "/Units"
    }

    unitsTopicToSigName(topic){
        var tmp = topic;
        tmp = tmp.replace(/^Signals\//, '');
        tmp = tmp.replace(/\/Units/, '');
        return tmp;
    }

    isSignalUnitsTopic(topic){
        return topic.match(/Signals\/[a-zA-Z0-9\._]+\/Units/);
    }


}