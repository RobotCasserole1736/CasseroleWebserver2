/////////////////////////////////////////////////////////////////////////
// SignalDAQ - wrapper around NT4 to specifically extract signal information
// and allow clients to request one or more signals
//
// Mirroring (I assume) NT4 architecture, it's heavily callback driven
/////////////////////////////////////////////////////////////////////////

export class Logs_NT4 {


    constructor(onLogFileAnnounce_in,    //Gets called when server announces enough topics to form a new log file
                onLogUnFileAnnounce_in,  //Gets called when server unannounces any part of a calibration
                onConnect_in,            //Gets called once client completes initial handshake with server
                onDisconnect_in) {       //Gets called once client detects server has disconnected
        this.onLogFileAnnounce = onLogFileAnnounce_in;
        this.onLogUnFileAnnounce = onLogUnFileAnnounce_in;
        this.onConnect = onConnect_in;
        this.onDisconnect = onDisconnect_in;

        //TEST ONLY - fake data source loop and events
        setTimeout(this.testConnect.bind(this),500);
        setTimeout(this.testAnnounceLogs.bind(this),750);
        setInterval(this.testDataSourceLoop.bind(this), 50);
    }

    //Submit a new calibration value
    downloadLogFile(name){
        //TODO
    }

    requestAllFileDownload(){
        //TODO .... ummm need time for RIO to zip all files up.... and submit it back?
        // Special HTTP request that triggers RIO to zip up all files and return the zip
        // Maybe need some keep-alive style response to make sure the browser is kept alive?
    }

    // TEST ONLY - this is a periodic loop which simulates
    // a NT server calibration interaction
    testDataSourceLoop(){
        //TODO
    }

    testAnnounceLogs(){
        //TODO
    }

    testConnect(){
        this.onConnect();
    }




}