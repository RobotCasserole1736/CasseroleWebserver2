package frc.lib.miniNT4;

import java.util.Set;

import frc.lib.miniNT4.topics.Topic;

public abstract class BaseClient {

    Set<Subscription> subscriptions;
    Set<Topic> publishedTopics;

    /**
     * Creates a new subscription off of provided patterns and registers it with the server
     * @param patterns
     * @return the newly created and server-regiestered subscription object
     */
    public Subscription subscribe(Set<String> patterns){
        Subscription newSub = new Subscription();
        newSub.clientRef = this;
        //Todo - register with the server

        return newSub;
    }

    public void unSubscribe(Subscription deadSub){
        //TODO - remove given description
    }

    public void publish(Topic newTopic){
        //TODO - register topic with server

    }

    public void unpublish(Topic deadTopic){
        //TODO - unregister topic with server

    }

    public abstract void onAnnounce(Topic newTopic);
    public abstract void onUnannounce(Topic deadTopic);







    
}
