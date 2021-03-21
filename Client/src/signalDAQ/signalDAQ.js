/////////////////////////////////////////////////////////////////////////
// SignalDAQ - wrapper around NT4 to specifically extract signal information
// and allow clients to request one or more signals
//
// Mirroring (I assume) NT4 architecture, it's heavily callback driven
/////////////////////////////////////////////////////////////////////////

export class SignalDAQ {


    constructor(onSignalAnnounce_in,   //Gets called when server announces enough topics to form a new signal
                onSignalUnAnnounce_in, //Gets called when server unannounces any part of a signal
                onData_in,             //Gets called when any new data is available
                onConnect_in,          //Gets called once client completes initial handshake with server
                onDisconnect_in) {     //Gets called once client detects server has disconnected
        this.onSignalAnnounce = onSignalAnnounce_in;
        this.onSignalUnAnnounce = onSignalUnAnnounce_in;
        this.onData = onData_in;
        this.onConnect = onConnect_in;
        this.onDisconnect = onDisconnect_in;

        this.signalList = []; //start assuming no signals.

        this.daqRunning = false;

        //TEST ONLY - fake data source loop and events
        setTimeout(this.testConnect.bind(this),500);
        setTimeout(this.testAnnounceSignals.bind(this),750);
        setInterval(this.testDataSourceLoop.bind(this), 50);
    }

    //Request a signal get added to the DAQ
    addSignal(signalNameIn){
        this.signalList.push(signalNameIn);
    }

    //Call to remove a signal from the DAQ
    removeSignal(signalNameIn){
        for(var idx = 0; idx < this.signalList.length; idx++){
            if(signalNameIn == this.signalList[idx]){
                this.signalList.splice(idx, 1); //remove that signal and splice the list back together so we don't have null entries the middle
            }
        }
    }

    clearSignalList(){
        this.signalList = [];
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


    // TEST ONLY - this is a periodic loop which simulates
    // a NT server with signals and data in it
    testDataSourceLoop(){
        var curTimeSec = window.performance.now()/1000.0;

        //Calculate values for each signal
        var testSlowSin1 = 50+50*Math.sin( curTimeSec/1000.0 * 2 * Math.PI * 0.1);
        var testFastSin1 = 50+30*Math.sin( curTimeSec/1000.0 * 2 * Math.PI * 1.0);
        var testFastSin2 = 20*Math.sin( (curTimeSec/1000.0 + 0.2 )* 2 * Math.PI * 1.0);
        var testSquare1 = (Math.round(curTimeSec*1000) % 1000 > 500);

        if(this.daqRunning){
            //DAQ is running, announce values for signals in the signalList.
            this.signalList.forEach(sigName => {
                if(sigName == "TestFastSin1"){
                    this.onData(sigName, curTimeSec, testFastSin1);
                } else if(sigName == "TestFastSin2"){
                    this.onData(sigName, curTimeSec, testFastSin2);
                } else if(sigName == "TestSquare1"){
                    this.onData(sigName, curTimeSec, testSquare1);
                } else if(sigName == "TestSlowSin1"){
                    this.onData(sigName, curTimeSec, testSlowSin1);
                } else {
                    console.log("Error! Unknown signal " + sigName + " requested!");
                }
            })
        }

    }

    testAnnounceSignals(){
        this.onSignalAnnounce("TestFastSin1", "RPM");
        this.onSignalAnnounce("TestFastSin2", "");
        this.onSignalAnnounce("TestSlowSin1", "A");
        this.onSignalAnnounce("TestSquare1", "V");
    }

    testConnect(){
        this.onConnect();
    }




}