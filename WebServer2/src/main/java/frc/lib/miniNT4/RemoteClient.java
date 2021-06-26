package frc.lib.miniNT4;

import frc.lib.miniNT4.samples.TimestampedValue;
import frc.lib.miniNT4.topics.Topic;

import java.util.Set;

public class RemoteClient extends BaseClient{

    Socket parentSocket;

    public RemoteClient(Socket ps_in, String name){
        super();
        parentSocket = ps_in;
        friendlyName = name;
    }

    void onDisconnect(){

        //Implicit unsubscribe from all topics
        for(int id : this.subscriptions.keySet()){
            unSubscribe(id);
        }

        //Implicit unannounce of all signals
        for(Topic t : this.publishedTopics.values()){
            unpublish(t);
        }

        NT4Server.getInstance().unRegisterClient(this);
    }

    @Override
    public void onAnnounce(Topic newTopic) {
        parentSocket.sendAnnounce(newTopic);
    }

    @Override
    public void onUnannounce(Topic deadTopic) {
        parentSocket.sendAnnounce(deadTopic);
    }

    public void setTopicProperties(String name, boolean isPersistant){
        Set<Topic> matchedTopics = NT4Server.getInstance().getTopics(name);
        for(Topic t : matchedTopics){
            t.isPersistant = isPersistant;
        }
    }

    @Override
    public void onValueUpdate(Topic topic, TimestampedValue newVal) {
        parentSocket.sendValueUpdate(topic, newVal);
    }
    
}
