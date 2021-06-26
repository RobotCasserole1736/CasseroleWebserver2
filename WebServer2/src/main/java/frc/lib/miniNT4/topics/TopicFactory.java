package frc.lib.miniNT4.topics;

import frc.lib.miniNT4.NT4TypeStr;

public class TopicFactory {
    
    public static Topic make(String name, String type){
        switch(type){
            case NT4TypeStr.FLOAT_64:
                return new DoubleTopic(name, 0);
            case  NT4TypeStr.STR:
                return new StringTopic(name, "");
            default:
                throw new IllegalArgumentException("Unrecognized topic type " + type);
            
        }
    }

}
