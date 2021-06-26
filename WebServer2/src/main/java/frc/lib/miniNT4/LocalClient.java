package frc.lib.miniNT4;

import java.util.List;

import frc.lib.miniNT4.topics.Topic;

public abstract class LocalClient extends BaseClient{


    public LocalClient(){
        super();
    }

    /**
     * 
     * @return list of all available topics on the server
     */
    public List<Topic> getCurTopicsList(){
        return null;//TODO
    }

    /**
     * 
     * @param pattern Regex pattern to match topic names
     * @return list of names matching the given regex pattern.
     */
    public List<Topic> getCurTopicsList(String pattern){
        return null;//TODO
    }

}
