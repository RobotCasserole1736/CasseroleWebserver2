export class NT4_Client {

    constructor(serverAddr,
                onTopicAnnounce_in,    //Gets called when server announces enough topics to form a new signal
                onTopicUnAnnounce_in,  //Gets called when server unannounces any part of a signal
                onNewTopicData_in,     //Gets called when any new data is available
                onConnect_in,          //Gets called once client completes initial handshake with server
                onDisconnect_in) {     //Gets called once client detects server has disconnected

    }

    announceTopic(name){

    }

    unAnnounceTopic(name){

    }

    sendDataValue(name, timestamp, value){

    }

    subscribe(topicPattern){

    }

    unSubscribe(topicPattern){
        
    }


}
