import msgpack from "./msgpack/msgpack";

importScripts("msgpack/msgpack.js");

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

        this.topicValMap = new Map();
        this.subscriptions = new Set();

        // WS Connection Defaults
        this.serverBaseAddr = serverAddr; 
        this.clientIdx = 0;
        this.useSecure = true;
        this.serverAddr = "";


    }

    announceTopic(name, defaultVal){
        this.topicValMap.set(name, defaultVal);
        this.onTopicAnnounce(name, defaultVal);
    }

    unAnnounceTopic(name){
        this.topicValMap.delete(name);
        this.onTopicUnAnnounce(name);
    }

    sendDataValue(name, timestamp, value){
        this.topicValMap.set(name, value);
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

    //Gets a timestamp in the NT4 time scaling & domain
    // I have no idea ift his will be useful going forward but..
    getCurTimestamp(){
        return new Date().getTime();
    }

    //////////////////////////////////////////////////////////////
    // Websocket connection Maintainence

    ws_onOpen() {

    }

    ws_onClose(e) {
        this.ws = null;

        console.log('Socket is closed. Reconnect will be attempted in 0.5 second.', e.reason);
        setTimeout(this.ws_connect.bind(this), 500);
    }

    ws_onError(err){
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        this.ws.close();
        // TODO - based on error, handle the expected ones (secure failure, 409 conflict, etc.) by updating internal state before the next reconnect.
    }

    ws_onMessage(e){
        if(typeof e.data === 'string'){
            //JSON Message
            var msg = JSON.parse(e.data); 
            if(typeof msg === 'object'){
                if( !("method" in msg) || !("params" in msg)){
                    var method = msg["method"];
                    var params = msg["params"];
                    if(typeof method === 'string'){
                        if(typeof params === 'object'){
                            if(method == "announce"){

                            } else if (method == "unannounce"){

                            } else {
                                console.log("Ignoring text message - unknown method " + method);
                            }

                        } else {
                            console.log("Ignoring text message, JSON parsing found \"params\", but it wasn't an object.");
                        }
                    } else {
                        console.log("Ignoring text message, JSON parsing found \"method\", but it wasn't a string.");
                    }
                } else {
                    console.log("Ignoring text message, JSON parsing did not find all required fields."); 
                }
            } else {
                console.log("Ignoring text message, JSON parsing did not produce an object.");
            }

        } else {
            //MSGPack
            var unpackedData = msgpack.deserialize(e.data);
        }
    }

    ws_connect() {

        this.serverBaseAddr = serverAddr; 
        this.clientIdx = 0;

        var port = 5810; //fallback - unsecured
        var prefix = "ws://";
        if(this.useSecure){
            prefix = "wss://"; //Use secure if requested.
            port = 5810;
        }

        this.serverAddr = prefix + this.serverBaseAddr + ":" + port.toString() + "/ns/" + "CasseroleWS2_" + this.clientIdx.toString();

        this.ws = new WebSocket(this.serverAddr, "networktables.first.wpi.edu");
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.ws_onOpen.bind(this);
        this.ws.onmessage = this.ws_onMessage.bind(this);
        this.ws.onclose = this.ws_onClose.bind(this);
        this.ws.onerror = this.ws_onError.bind(this);
    }
    




}
