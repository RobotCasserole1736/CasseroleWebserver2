import "./msgpack/msgpack.js";

export class NT4_Subscription{
    prefixes = new Set();
    options = NT4_SubscriptionOptions();
    uid = -1;

    toSubscribeObj(){
        return {
            "prefixes": this.prefixes,
            "options": this.options.toObj(),
            "subid": this.uid,
        };
    }

    toUnSubscribeObj(){
        return {
            "subid": this.uid,
        };
    }
}

export class NT4_SubscriptionOptions {
    immedeate = false;
    logging = false;
    periodicRate_s = 0.1;

    toObj(){
        return {
            "immediate": this.immedeate,
            "periodic": this.periodicRate_s,
            "logging": this.logging,
        };
    }
}

export class NT4_Topic{
    name = "";
    type = "";
    id = 0;
    properties = new NT4_TopicProperties();

    toPublishObj(){
        return {
            "name": this.name,
            "type": this.type,
        }
    }

    toUnPublishObj(){
        return {
            "name": this.name,
        }
    }

    toPropertiesObj(){
        return {
            "name": this.name,
            "update": this.properties.toUpdateObj(),
        }
    }
}

export class NT4_TopicProperties{
    isPersistant = false;

    toUpdateObj(){
        return {
            "persistent": this.isPersistant,
        }
    }
}

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

        this.subscriptions = new Map();
        this.subscription_uid_counter = 0;

        this.clientPublishedTopics = new Map();
        this.serverTopics = new Map();

        // WS Connection State (with defaults)
        this.serverBaseAddr = serverAddr; 
        this.clientIdx = 0;
        this.useSecure = false;
        this.serverAddr = "";
        this.serverConnectionActive = false;
        this.serverTimeOffset_us = 0;

        // Add default time topic
        var timeTopic = new NT4_Topic();
        timeTopic.name = "Time";
        timeTopic.id = -1;
        timeTopic.type = 2; //int ?
        this.serverTopics.set(timeTopic.id, timeTopic);
    }

    //////////////////////////////////////////////////////////////
    // PUBLIC API

    // Add a new subscription. Returns a subscription object
    subscribeImmedeate(topicPatterns){
        var newSub = NT4_Subscription();
        newSub.uid = this.getNewSubUID();
        newSub.options.immedeate = true;
        newSub.options.periodicRate_s = 0;
        newSub.prefixes = topicPatterns;
        newSub.options.logging = false;

        this.subscriptions.set(newSub.uid, newSub);
        if(this.serverConnectionActive){
            this.ws_subscribe(newSub);
        }
        return newSub;
    }

    // Add a new subscription. Returns a subscription object
    subscribePeriodic(topicPatterns, period){
        var newSub = NT4_Subscription();
        newSub.uid = this.getNewSubUID();
        newSub.options.immedeate = false;
        newSub.options.periodicRate_s = period;
        newSub.prefixes = topicPatterns;
        newSub.options.logging = false;

        this.subscriptions.set(newSub.uid, newSub);
        if(this.serverConnectionActive){
            this.ws_subscribe(newSub);
        }
        return newSub;
    }

    // Add a new subscription. Returns a subscription object
    subscribeLogging(topicPatterns){
        var newSub = NT4_Subscription();
        newSub.uid = this.getNewSubUID();
        newSub.options.immedeate = false;
        newSub.options.periodicRate_s = 0;
        newSub.prefixes = topicPatterns;
        newSub.options.logging = true;

        this.subscriptions.set(newSub.uid, newSub);
        if(this.serverConnectionActive){
            this.ws_subscribe(newSub);
        }
        return newSub;
    }

    // Given an existing subscription, unsubscribe from it.
    unSubscribe(sub){
        this.subscriptions.delete(sub.uid);
        if(this.serverConnectionActive){
            this.ws_unsubscribe(sub);
        }
    }

    // Unsubscribe from all current subscriptions
    clearAllSubscriptions(){
        for(var sub in this.subscriptions.values()){
            this.unSubscribe(sub);
        }
    }
    
    // Set the properties of a particular topic
    setProperties(topic, isPersistant){
        topic.properties.isPersistant = isPersistant;
        if(this.serverConnectionActive){
            this.ws_setproperties(topic);
        }
    }

    // Publish a new topic from this client with the provided name and type
    publishNewTopic(name, type){
        var newTopic = NT4_Topic()
        newTopic.name = name;
        newTopic.type = type;

        this.clientPublishedTopics.set(newTopic.name, newTopic);
        if(this.serverConnectionActive){
            this.ws_publish(newTopic);
        }

        return newTopic;
    }

    // UnPublish a previously-published topic from this client.
    unPublishTopic(oldTopic){
        this.clientPublishedTopics.delete(oldTopic.name);
        if(this.serverConnectionActive){
            this.ws_unpublish(oldTopic);
        }
    }

    // Send some new value to the server
    // Timestamp is whatever the current time is.
    addSample(topic, value){
        var timestamp = this.getServerTime_us();
        this.addSample(topic, timestamp, value);
    }

    // Send some new timestamped value to the server
    addSample(topic, timestamp, value){
        if(this.ws.readyState == WebSocket.OPEN){
            var id = topic.id;
            // TODO - generate type idx
            // TODO - make msgpack 
            // TODO - send msgpack
        }
    }

    //////////////////////////////////////////////////////////////
    // Server/Clinet Time Sync Handling

    getClientTime_us(){
        return new Date().getTime()*1000;
    }

    getServerTime_us(){
        return this.getClientTime_us() + this.serverTimeOffset_us;
    }

    ws_sendTimestamp(){
        var timeTopic = this.serverTopics.get(-1);
        this.addSample(timeTopic, 0, this.getClientTime_us());
    }

    ws_handlRecieveTimestamp(serverTimestamp, clientTimestamp){
        var rxTime = this.getClientTime_us();

        //Recalculate server/client offset based on round trip time
        var rtt = rxTime - clientTimestamp;
        var serverTimeAtRx = serverTimestamp - rtt/2.0;
        this.serverTimeOffset_us = rxTime - serverTimeAtRx;

        //Start the cycle over after five seconds
        setTimeout(this.ws_sendTimestamp.bind(this), 5000);
    }

    //////////////////////////////////////////////////////////////
    // Websocket Message Send Handlers

    ws_subscribe(sub){
        this.ws_sendJSON("subscribe", sub.toSubscribeObj());
    }

    ws_unsubscribe(sub){
        this.ws_sendJSON("unsubscribe", sub.toUnSubscribeObj());
    }

    ws_publish(topic){
        this.ws_sendJSON("publish", topic.toPublishObj());
    }

    ws_unpublish(topic){
        this.ws_sendJSON("unpublish", topic.toUnPublishObj());
    }

    ws_setproperties(topic){
        this.ws_sendJSON("setproperties", topic.toPropertiesObj());
    }

    ws_sendJSON(method, params){
        if(this.ws.readyState == WebSocket.OPEN){
            var txObj = {
                "method": method,
                "params": params
            }
            var txJSON = JSON.stringify(txObj);
            this.ws.send(txJSON);
        }
    }

    //////////////////////////////////////////////////////////////
    // Websocket connection Maintainence

    ws_onOpen() {

        //Publish any existing topics
        for(var topic in this.clientPublishedTopics.values()){
            this.ws_publish(topic);
            this.ws_setproperties(topic);
        }

        //Subscribe to existing subscriptions
        for(var sub in this.subscriptions.values()){
            this.ws_subscribe(sub);
        }

        // Set the flag allowing general server communication
        this.serverConnectionActive = true;

        // Start the time-sync process
        this.ws_sendTimestamp();

        // User connection-opened hook
        this.onConnect();
    }

    ws_onClose(e) {
        //Clear flags to stop server communication
        this.ws = null;
        this.serverConnectionActive = false;

        // User connection-closed hook
        this.onDisconnect();

        //Clear out any local cache of server state
        this.serverTopics.clear();

        console.log('Socket is closed. Reconnect will be attempted in 0.5 second.', e.reason);
        setTimeout(this.ws_connect.bind(this), 500);

        if(!e.wasClean){
            console.error('Socket encountered error!');
            // TODO - based on error, handle the expected ones (secure failure, 409 conflict, etc.) by updating internal state before the next reconnect.
        }

    }

    ws_onError(e){
        this.ws.close();
    }

    ws_onMessage(e){
        if(typeof e.data === 'string'){
            //JSON Message
            var msg = JSON.parse(e.data); 

            //Validate proper format of message
            if(typeof msg !== 'object'){
                console.log("Ignoring text message, JSON parsing did not produce an object.");
                return;
            }
                
            if( !("method" in msg) || !("params" in msg)){
                console.log("Ignoring text message, JSON parsing did not find all required fields."); 
                return;
            }

            var method = msg["method"];
            var params = msg["params"];
            
            if(typeof method !== 'string'){
                console.log("Ignoring text message, JSON parsing found \"method\", but it wasn't a string.");
                return;
            }
                        
            if(typeof params === 'object'){
                console.log("Ignoring text message, JSON parsing found \"params\", but it wasn't an object.");
                return;
            }

            // Message validates reasonably, switch based on supported methods
            if(method == "announce"){
                var newTopic = NT4_Topic();
                newTopic.name = params.name;
                newTopic.id = params.id;
                newTopic.type = params.type;
                newTopic.properties.isPersistant = params.properties.persistent;
                this.serverTopics.set(newTopic.id, newTopic);
                this.onTopicAnnounce(newTopic);

            } else if (method == "unannounce"){
                var removedTopic = this.serverTopics.get(params.id);
                this.serverTopics.delete(removedTopic.id);
                this.onTopicUnAnnounce(removedTopic);

            } else {
                console.log("Ignoring text message - unknown method " + method);
                return;
            }


        } else {
            //MSGPack
            var unpackedData = msgpack.deserialize(e.data, {multiple:true}); //TODO - does this actully work like this? not sure....
            var topicID = unpackedData[0];
            var timestamp_us = unpackedData[1];
            var typeIdx = unpackedData[2];
            var value   = unpackedData[3];

            if(topicID >= 0){
                var topic = this.serverTopics.get(topicID);
                this.onNewTopicData(topic, timestamp_us, value);
            } else if (topicID == -1){
                this.ws_handlRecieveTimestamp(timestamp_us, value);
            } else {
                console.log("Ignoring binary data - invalid topic id " + topicID.toString());
            }

        }
    }

    ws_connect() {

        this.clientIdx = 0;

        var port = 5810; //fallback - unsecured
        var prefix = "ws://";
        if(this.useSecure){
            prefix = "wss://"; //Use secure if requested.
            port = 5811;
        }

        this.serverAddr = prefix + this.serverBaseAddr + ":" + port.toString() + "/nt/" + "CasseroleWS2_" + this.clientIdx.toString();

        this.ws = new WebSocket(this.serverAddr, "networktables.first.wpi.edu");
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.ws_onOpen.bind(this);
        this.ws.onmessage = this.ws_onMessage.bind(this);
        this.ws.onclose = this.ws_onClose.bind(this);
        this.ws.onerror = this.ws_onError.bind(this);
    }
    


    //////////////////////////////////////////////////////////////
    // General utilties
    
    getNewSubUID(){
        this.subscription_uid_counter++;
        return this.subscription_uid_counter;
    }


}
