package frc.lib.miniNT4;

import java.util.HashMap;
import java.util.Set;

import frc.lib.miniNT4.samples.TimestampedValue;
import frc.lib.miniNT4.topics.Topic;

public abstract class BaseClient {

    public String friendlyName = "";

    HashMap<Integer, Subscription> subscriptions = new HashMap<Integer, Subscription>();
    HashMap<String, Topic> publishedTopics = new HashMap<String, Topic>();

    public BaseClient(){
        NT4Server.getInstance().registerClient(this);
    }

    /**
     * Creates a new subscription off of provided patterns and registers it with the server
     * @param patterns
     * @return the newly created and server-registered subscription object
     */
    public Subscription subscribe(Set<String> patterns, int subuid){
        Subscription newSub = new Subscription(patterns, subuid);
        newSub.clientRef = this;
        subscriptions.put(subuid, newSub);

        return newSub;
    }

    public void unSubscribe(int deadSubId){
        Subscription oldSub = subscriptions.remove(deadSubId);
        if(oldSub != null){
            oldSub.stop();
        }
    }

    public void publish(Topic newTopic){
        publishedTopics.put( newTopic.name, newTopic);
        NT4Server.getInstance().broadcastAnnounce(newTopic);
    }

    public void unpublish(Topic deadTopic){
        publishedTopics.remove(deadTopic.name);
        NT4Server.getInstance().broadcastUnannounce(deadTopic);
    }

    public abstract void onAnnounce(Topic newTopic);
    public abstract void onUnannounce(Topic deadTopic);
    public abstract void onValueUpdate(Topic topic, TimestampedValue newVal);
}
