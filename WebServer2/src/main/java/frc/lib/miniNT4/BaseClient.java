package frc.lib.miniNT4;

import java.util.HashMap;
import java.util.Set;

import frc.lib.miniNT4.samples.TimestampedValue;
import frc.lib.miniNT4.topics.Topic;

public abstract class BaseClient {

    HashMap<Integer, Subscription> subscriptions = new HashMap<Integer, Subscription>();
    HashMap<String, Topic> publishedTopics = new HashMap<String, Topic>();

    public BaseClient(){
        NT4Server.getInstance().registerClient(this);
    }

    /**
     * Creates a new subscription off of provided patterns and registers it with the server
     * @param patterns
     * @return the newly created and server-regiestered subscription object
     */
    public Subscription subscribe(Set<String> patterns, int subid){
        Subscription newSub = new Subscription(patterns);
        newSub.clientRef = this;
        subscriptions.put(subid, newSub);

        return newSub;
    }

    public void unSubscribe(int deadSubId){
        subscriptions.remove(deadSubId);
    }

    public void publish(Topic newTopic){
        publishedTopics.put( newTopic.name, newTopic);
    }

    public void unpublish(Topic deadTopic){
        publishedTopics.remove(deadTopic.name);
    }

    public abstract void onAnnounce(Topic newTopic);
    public abstract void onUnannounce(Topic deadTopic);
    public abstract void onValueUpdate(Topic topic, TimestampedValue newVal);
}
