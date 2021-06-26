package frc.lib.miniNT4.topics;

import java.util.List;
import java.util.Set;

import frc.lib.miniNT4.Subscription;
import frc.lib.miniNT4.samples.TimestampedValue;

abstract public class Topic{
    int id;
    String name;    

    List<TimestampedValue> values;

    Set<Subscription> subscriptionRefs;

    public Topic(TimestampedValue default_in){
        default_in.timestamp_us = 0; //ensure we are storing default as the default
        values.add(default_in);
    }

    /**
     * Submit a new value to the server
     * @param topic topic being submitted
     * @param newSample new value for that topic
     */
    public void submitNewValue(TimestampedValue newSample){
        values.add(newSample);
    }

    public long getLastChange(){
        return values.get(values.size()-1).timestamp_us;
    }

    abstract String getTypestring();
    abstract int getTypeInt();


}