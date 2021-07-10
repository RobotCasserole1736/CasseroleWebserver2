package frc.robot.Autonomous;

import java.util.ArrayList;
import java.util.TreeMap;

import frc.robot.Autonomous.Modes.AutoMode;

public class AutoModeList {

    private TreeMap<String, AutoMode> modeList = new TreeMap<String, AutoMode>();
    private ArrayList<String> orderedModeNameList = new ArrayList<String>(); //Helps keep track of the order the modes were added in, to ensure they end up ordered that same way in the web UI.

    //private Topic modeTopic = new Topic();

    public void add(AutoMode in){
        in.idx = modeList.size();
        modeList.put(in.humanReadableName, in);
        orderedModeNameList.add(in.humanReadableName);
    }

    public AutoMode get(String name){
        return modeList.get(name);
    }

    public AutoMode get(int idx){
        return this.get(orderedModeNameList.get(idx));
    }

    public ArrayList<String> getNameList(){
        return orderedModeNameList;
    }

    public AutoMode getDefault(){
        return modeList.get(orderedModeNameList.get(0)); //TBD - just the first thing added?
    }
    
}
