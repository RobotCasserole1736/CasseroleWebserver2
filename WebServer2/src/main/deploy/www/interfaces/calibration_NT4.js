/////////////////////////////////////////////////////////////////////////
// SignalDAQ - wrapper around NT4 to specifically extract signal information
// and allow clients to request one or more signals
//
// Mirroring (I assume) NT4 architecture, it's heavily callback driven
/////////////////////////////////////////////////////////////////////////

export class Calibration_NT4 {


    constructor(onCalibrationAnnounce_in,   //Gets called when server announces enough topics to form a new calilbration
                onCalibrationUnAnnounce_in, //Gets called when server unannounces any part of a calibration
                onCalValueChanged_in,       //Gets called when any calibration has its value updated
                onConnect_in,               //Gets called once client completes initial handshake with server
                onDisconnect_in) {          //Gets called once client detects server has disconnected
        this.onCalAnnounce = onCalibrationAnnounce_in;
        this.onCalUnAnnounce = onCalibrationUnAnnounce_in;
        this.onCalValueChanged = onCalValueChanged_in;
        this.onConnect = onConnect_in;
        this.onDisconnect = onDisconnect_in;

        //TEST ONLY - fake data source loop and events
        setTimeout(this.testConnect.bind(this),500);
        setTimeout(this.testAnnounceCalibrations.bind(this),750);
        setInterval(this.testDataSourceLoop.bind(this), 50);
    }

    //Submit a new calibration value
    setCalibrationValue(name, value){
        this.onCalValueChanged(name, value); //Immedeate update to sample data.
    }


    // TEST ONLY - this is a periodic loop which simulates
    // a NT server calibration interaction
    testDataSourceLoop(){
        //TODO
    }

    testAnnounceCalibrations(){
        this.onCalAnnounce("Test Cal 1", "RPM", -500, 500, 100);
        this.onCalAnnounce("Test Cal 2", "V", 0, 12, 12);
    }

    testConnect(){
        this.onConnect();
    }




}