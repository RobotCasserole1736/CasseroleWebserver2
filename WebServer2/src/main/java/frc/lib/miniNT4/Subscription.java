package frc.lib.miniNT4;

import java.util.List;
import java.util.Set;

import frc.lib.miniNT4.topics.Topic;

public class Subscription{

    Set<String> topicPatterns;
    BaseClient clientRef;
    Set<Topic> topics;

    public Subscription(Set<String> patterns){

    }

    public Subscription(){

    }

}