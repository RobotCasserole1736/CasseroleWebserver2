/////////////////////////////////////////////////////////////////////////
// Calibration - wrapper around NT4 to specifically extract cal information
// and allow clients to interact with one or more calibrations
//
// Mirroring (I assume) NT4 architecture, it's heavily callback driven
/////////////////////////////////////////////////////////////////////////

import { NT4_Client } from "./nt4.js";
import { CalObj } from "./calobj.js";


export class NT4_CalInf {

    constructor(onCalibrationAnnounce_in,   //Gets called when server announces enough topics to form a new calilbration
                onCalibrationUnAnnounce_in, //Gets called when server unannounces any part of a calibration
                onCalCurValueChanged_in,    //Gets called when any calibration has its value updated
                onConnect_in,               //Gets called once client completes initial handshake with server
                onDisconnect_in) {          //Gets called once client detects server has disconnected
        this.onCalAnnounce = onCalibrationAnnounce_in;
        this.onCalUnAnnounce = onCalibrationUnAnnounce_in;
        this.onCalCurValueChanged = onCalCurValueChanged_in;
        this.onConnect = onConnect_in;
        this.onDisconnect = onDisconnect_in;

        this.allCals = new Map();


        this.nt4Client = new NT4_Client("localhost", 
                                        this.topicAnnounceHandler.bind(this), 
                                        this.topicUnannounceHandler.bind(this),
                                        this.valueUpdateHandler.bind(this),
                                        this.onConnect.bind(this),
                                        this.onDisconnect.bind(this)
                                        );

        //this.statusTextCallback("Starting connection...");
        this.nt4Client.ws_connect();
        //this.statusTextCallback("NT4 Connected.");


    }

    topicAnnounceHandler(topicName){

        if(this.isCalTopic(topicName)){
            var calName = topicToCalName();

            //we got something announced with a new calibration...

            //ensure we've got an object for this cal
            if(!this.allCals.has(calName)){
                var newCal = new CalObj();
                newCal.name = calName;
                this.allCals.set(calName, newCal);
            }

            if(this.isCalTopic(topicName, "Value")){
                //We should subscribe to the value
                this.nt4Client.subscribe(topicName);
            } else {
                //get the value of this particular calibration sub-topic, just once.
                this.nt4Client.getValues(topicName);
            }

        }
    }

    topicUnannounceHandler(topic){
        if(this.isCalTopic(topicName, "Value")){
            var oldTopic = this.allCals.get(this.topicToCalName(topic));
            this.allCals.delete(this.topicToCalName(topic));
            this.onCalUnAnnounce(oldTopic);
        }
    }

    
    valueUpdateHandler(name, timestamp, value){
        if(this.isCalTopic(topicName, "Value")){
            var calName = this.valueTopicToCalName(name);
            this.onCalCurValueChanged(calName, value); 
        } else {
            if() //TODO - handle cal init values
        }
    }

    //Submit a new calibration value
    setCalibrationValue(name, value){
        var valTopic = this.calNameToValueTopic(name);
        this.nt4Client.addSample(valTopic, this.nt4Client.getServerTime_us(), value);
    }

    calNameToTopic(name, suffix){
        return "Calibrations/" + name + "/" + suffix;
    }

    isCalTopic(topic, suffix){
        if(suffix === null){
            suffix = "";
        }
        var replace = "Calibrations\/[a-zA-Z0-9\._]+\/"+suffix;
        var re = new RegExp(replace,"g");
        return re.test(topic.name);
    }

    topicToCalName(topic){
        var replace = "Calibrations\/([a-zA-Z0-9\._]+)\/"+suffix;
        var re = new RegExp(replace,"g");
        var arr = re.exec(topic.name);
        return arr[1];
    }



}