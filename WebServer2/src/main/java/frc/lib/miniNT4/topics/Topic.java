package frc.lib.miniNT4.topics;

import java.util.HashSet;
import java.util.Set;

import frc.lib.miniNT4.Subscription;
import frc.lib.miniNT4.samples.TimestampedValue;

abstract public class Topic{
    public int id;
    public String name;    
    public boolean isPersistant = false;

    TimestampedValue curValue;

    Set<Subscription> subscriptionRefs = new HashSet<Subscription>();

    public Topic(String name_in, TimestampedValue default_in){
        default_in.timestamp_us = 0; //ensure we are storing default as the default
        curValue = default_in;
        name = name_in;
    }

    /**
     * Submit a new value to the server
     * @param newSample new value for this topic
     */
    public void submitNewValue(TimestampedValue newSample){
        curValue = newSample;
        for(Subscription sub : subscriptionRefs){
            sub.onNewValue(this, newSample);
        }
    }

    public long getLastChange(){
        return curValue.timestamp_us;
    }

    public void addSubscriptionRef(Subscription sub){
        subscriptionRefs.add(sub);
    }

    public void removeSubscriptionRef(Subscription sub){
        subscriptionRefs.remove(sub);
    }

    public abstract String getTypestring();
    public abstract int getTypeInt();


}