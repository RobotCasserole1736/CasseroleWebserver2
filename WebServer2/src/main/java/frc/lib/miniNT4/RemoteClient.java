package frc.lib.miniNT4;

import frc.lib.miniNT4.samples.TimestampedValue;
import frc.lib.miniNT4.topics.Topic;

import java.util.Set;

import org.eclipse.jetty.websocket.api.Session;

public class RemoteClient extends BaseClient{

    Session sess;

    public RemoteClient(Session sess_in){
        super();
        sess = sess_in;
    }

    void onDisconnect(){
        NT4Server.getInstance().unRegisterClient(this);
    }

    @Override
    public void onAnnounce(Topic newTopic) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void onUnannounce(Topic deadTopic) {
        // TODO Auto-generated method stub
        
    }

    public void setTopicProperties(String name, boolean isPersistant){
        Set<Topic> matchedTopics = NT4Server.getInstance().getTopics(name);
        for(Topic t : matchedTopics){
            t.isPersistant = isPersistant;
        }
    }

    @Override
    public void onValueUpdate(Topic topic, TimestampedValue newVal) {
        // TODO send info over websockets with new value
        
    }
    
}
