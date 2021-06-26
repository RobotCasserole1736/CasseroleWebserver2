package frc.lib.miniNT4;

import java.util.Set;

import frc.lib.miniNT4.samples.TimestampedValue;
import frc.lib.miniNT4.topics.Topic;

public class Subscription{

    Set<String> topicPatterns;
    BaseClient clientRef;

    boolean isImmedeate;
    double periodicTxRate_sec;
    boolean isLogging;

    public Subscription(Set<String> patterns_in){
        topicPatterns = patterns_in;
    }

    public void updateTopicSet(){
        //Based on the current set of patterns, find topics that exist
        //For each topic, add a subscription reference.
        // Every time the value is updated, this subscription will be notified.
        for(Topic t :NT4Server.getInstance().getTopics(topicPatterns)){
            t.addSubscriptionRef(this);
        }
    }

    public void onNewValue(Topic topic, TimestampedValue newVal){
        if(isImmedeate){
            clientRef.onValueUpdate(topic, newVal);
        }
    }

}