/////////////////////////////////////////////////////////////////////////
// Calibration - wrapper around NT4 to specifically extract cal information
// and allow clients to interact with one or more calibrations
//
// Mirroring (I assume) NT4 architecture, it's heavily callback driven
/////////////////////////////////////////////////////////////////////////

import { NT4_Client } from "./dummy_NT4.js";


export class Calibration_NT4 {

    constructor(onCalibrationAnnounce_in,   //Gets called when server announces enough topics to form a new calilbration
                onCalibrationUnAnnounce_in, //Gets called when server unannounces any part of a calibration
                onCalCurValueChanged_in,       //Gets called when any calibration has its value updated
                onConnect_in,               //Gets called once client completes initial handshake with server
                onDisconnect_in) {          //Gets called once client detects server has disconnected
        this.onCalAnnounce = onCalibrationAnnounce_in;
        this.onCalUnAnnounce = onCalibrationUnAnnounce_in;
        this.onCalCurValueChanged = onCalCurValueChanged_in;
        this.onConnect = onConnect_in;
        this.onDisconnect = onDisconnect_in;


        this.nt4Client = new NT4_Client("todo server addr", 
                                        this.topicAnnounceHandler.bind(this), 
                                        this.topicUnannounceHandler.bind(this),
                                        this.valueUpdateHandler.bind(this),
                                        this.onConnect.bind(this),
                                        this.onDisconnect.bind(this)
                                        );


    }

    topicAnnounceHandler(name, defaultValue){
        if(this.isCalUnitsTopic(name)){
            var calName = this.unitsTopicToCalName(name);
            var calUnits = this.nt4Client.getMostRecentValue(name);
            var calMin = this.nt4Client.getMostRecentValue(this.calNameToMinTopic(calName));
            var calMax = this.nt4Client.getMostRecentValue(this.calNameToMaxTopic(calName));
            var calDefault = this.nt4Client.getMostRecentValue(this.calNameToDefaultTopic(calName));
            this.onCalAnnounce(calName, calUnits, calMin, calMax, calDefault); //announce on units announcement....todo is this ok?
            this.nt4Client.subscribe(this.calNameToValueTopic(calName));
        } else {
            // ignore
        }
    }

    topicUnannounceHandler(name){
        //todo
    }

    
    valueUpdateHandler(name, timestamp, value){
        var calName = this.valueTopicToCalName(name);
        this.onCalCurValueChanged(calName, value); 
    }

    //Submit a new calibration value
    setCalibrationValue(name, value){
        var valTopic = this.calNameToValueTopic(name);
        this.nt4Client.addSample(valTopic, this.nt4Client.getServerTime_us(), value);
    }



    calNameToValueTopic(name){
        return "Calibrations/" + name + "/Value"
    }

    valueTopicToCalName(topic){
        var tmp = topic;
        tmp = tmp.replace(/^Calibrations\//, '');
        tmp = tmp.replace(/\/Value/, '');
        return tmp;
    }

    isCalValueTopic(topic){
        return topic.match(/Calibrations\/[a-zA-Z0-9\._]+\/Value/);
    }

    calNameToUnitsTopic(name){
        return "Calibrations/" + name + "/Units"
    }
    calNameToMinTopic(name){
        return "Calibrations/" + name + "/Min"
    }
    calNameToMaxTopic(name){
        return "Calibrations/" + name + "/Max"
    }
    calNameToDefaultTopic(name){
        return "Calibrations/" + name + "/Default"
    }



    unitsTopicToCalName(topic){
        var tmp = topic;
        tmp = tmp.replace(/^Calibrations\//, '');
        tmp = tmp.replace(/\/Units/, '');
        return tmp;
    }

    isCalUnitsTopic(topic){
        return topic.match(/Calibrations\/[a-zA-Z0-9\._]+\/Units/);
    }




}