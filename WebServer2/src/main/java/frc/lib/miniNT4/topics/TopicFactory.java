package frc.lib.miniNT4.topics;

import frc.lib.miniNT4.NT4TypeStr;

public class TopicFactory {
    
    public static Topic make(String name, String type){
        switch(type){
            case NT4TypeStr.FLOAT_64:
            case NT4TypeStr.FLOAT_32:
                return new DoubleTopic(name, 0);
            case NT4TypeStr.INT:
                return new IntegerTopic(name, 0);
            case NT4TypeStr.BOOL:
                return new BooleanTopic(name, false);
            case  NT4TypeStr.STR:
            case  NT4TypeStr.JSON:
                return new StringTopic(name, "");
            default:
                throw new IllegalArgumentException("Unsupported topic type " + type);
            
        }
    }

}
