export class NT4_Client {


    constructor(serverAddr,
                onTopicAnnounce_in,    //Gets called when server announces enough topics to form a new signal
                onTopicUnAnnounce_in,  //Gets called when server unannounces any part of a signal
                onNewTopicData_in,     //Gets called when any new data is available
                onConnect_in,          //Gets called once client completes initial handshake with server
                onDisconnect_in) {     //Gets called once client detects server has disconnected

        this.onTopicAnnounce = onTopicAnnounce_in;
        this.onTopicUnAnnounce = onTopicUnAnnounce_in;
        this.onNewTopicData = onNewTopicData_in;
        this.onConnect = onConnect_in;
        this.onDisconnect = onDisconnect_in;

        this.subscriptions = new Set();


        //TEST ONLY - fake data source loop and events
        setTimeout(this.testConnect.bind(this),500);
        setTimeout(this.testAnnounceSignals.bind(this),750);
        this.loopCount = 0;

    }

    announceTopic(name, defaultVal){
        this.testTopicsMap.set(name, defaultVal);
        this.onTopicAnnounce(name, defaultVal);
    }

    unAnnounceTopic(name){
        this.testTopicsMap.delete(name);
        this.onTopicUnAnnounce(name);
    }

    sendDataValue(name, timestamp, value){
        this.testTopicsMap.set(name, value);
        this.onNewTopicData(name, timestamp, value);
    }

    subscribe(topicPattern){
        this.subscriptions.add(topicPattern);
    }

    unSubscribe(topicPattern){
        this.subscriptions.delete(topicPattern);
    }

    clearAllSubscriptions(){
        this.subscriptions.clear();
    }

    getMostRecentValue(name){
        if(this.testTopicsMap.has(name)){
            return this.testTopicsMap.get(name);
        } else {
            return null;
        }
    }


    // TEST ONLY - this is a periodic loop which simulates
    // a NT server with signals and data in it
    testDataSourceLoop(){
        var curWallTime = window.performance.now()/1000.0;
        var curTimeSec = this.loopCount * 0.020; //20ms robot code;


        while(curTimeSec < curWallTime){
            //Calculate values for each signal
            var testSlowSin1 = 50+50*Math.sin( curTimeSec * 2 * Math.PI * 0.1);
            var testFastSin1 = 50+30*Math.sin( curTimeSec* 2 * Math.PI * 1.0);
            var testFastSin2 = 20*Math.sin( (curTimeSec + 0.2 )* 2 * Math.PI * 1.0);
            var testSquare1 = (Math.round(curTimeSec*1000) % 1000 > 500) ? 1.0 : 0.0;
            var testSquare2 = (Math.round(curTimeSec*743) % 1000 > 200) ? 2.0 : 1.0;
            
            this.testPublishNewTopicData("Signals/TestFastSin1/Value", curTimeSec, testFastSin1);
            this.testPublishNewTopicData("Signals/TestFastSin2/Value", curTimeSec, testFastSin2);
            this.testPublishNewTopicData("Signals/TestSlowSin/Value", curTimeSec, testSlowSin1);
            this.testPublishNewTopicData("Signals/TestSquare/Value", curTimeSec, testSquare1);
            this.testPublishNewTopicData("Signals/AnotherTestSquare/Value", curTimeSec, testSquare2);

            this.loopCount++;
            curTimeSec = this.loopCount * 0.020;
        }

    }

    testPublishNewTopicData(name, timestamp, value){
        this.testTopicsMap.set(name, value); //Update "most-recent" value

        //If subscribed, broadcast the data with timestamp
        this.subscriptions.forEach(subPattern => {
            if(name.includes(subPattern)){
                this.onNewTopicData(name, timestamp, value);
            }
        })
    }

    testAnnounceSignals(){
        this.testTopicsMap.forEach((value,name) => {
            this.onTopicAnnounce(name);
        })
    }

    testConnect(){

        this.testTopicsMap = new Map();
        this.testTopicsMap.set("Signals/TestFastSin1/Value", 0);
        this.testTopicsMap.set("Signals/TestFastSin1/Units", "RPM");
        this.testTopicsMap.set("Signals/TestFastSin2/Value", 0);
        this.testTopicsMap.set("Signals/TestFastSin2/Units", "V");
        this.testTopicsMap.set("Signals/TestSlowSin/Value", 0);
        this.testTopicsMap.set("Signals/TestSlowSin/Units", "");
        this.testTopicsMap.set("Signals/TestSquare/Value", 0);
        this.testTopicsMap.set("Signals/TestSquare/Units", "A");
        this.testTopicsMap.set("Signals/AnotherTestSquare/Value", 0);
        this.testTopicsMap.set("Signals/AnotherTestSquare/Units", "A");
        this.testTopicsMap.set("Calibrations/ShooterSetpoint/Value", 1000);
        this.testTopicsMap.set("Calibrations/ShooterSetpoint/Units", "RPM");
        this.testTopicsMap.set("Calibrations/ShooterSetpoint/Min", 500);
        this.testTopicsMap.set("Calibrations/ShooterSetpoint/Max", 2500);
        this.testTopicsMap.set("Calibrations/ShooterSetpoint/Default", 1000);

        setInterval(this.testDataSourceLoop.bind(this), 50);

        this.onConnect();
    }



}
