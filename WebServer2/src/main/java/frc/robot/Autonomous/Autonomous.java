package frc.robot.Autonomous;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import edu.wpi.first.wpilibj.geometry.Pose2d;
import frc.lib.AutoSequencer.AutoSequencer;
import frc.lib.miniNT4.LocalClient;
import frc.lib.miniNT4.NT4Server;
import frc.lib.miniNT4.TimeserverClient;
import frc.lib.miniNT4.samples.TimestampedInteger;
import frc.lib.miniNT4.samples.TimestampedValue;
import frc.lib.miniNT4.topics.IntegerTopic;
import frc.lib.miniNT4.topics.Topic;
import frc.robot.Autonomous.Modes.AutoDelayMode;
import frc.robot.Autonomous.Modes.AutoMode;
import frc.robot.Autonomous.Modes.AutoModeDoNothing;
import frc.robot.Autonomous.Modes.AutoModeDriveFig8;
import frc.robot.Autonomous.Modes.AutoModeDriveForward3Sec;

public class Autonomous extends LocalClient {
    
    // Driver-selectable autonomous mode lists
    AutoModeList delayModes;
    AutoModeList mainModes;

    AutoMode curDelayMode = null;
    AutoMode prevDelayMode = null;
    AutoMode curMainMode = null;
    AutoMode prevMainMode = null;

    public IntegerTopic curDelayModeTopic = null;
    public IntegerTopic curMainModeTopic = null;
    public IntegerTopic desDelayModeTopic = null;
    public IntegerTopic desMainModeTopic = null;

    AutoSequencer seq;

    public Autonomous(){

        seq = new AutoSequencer("Auto Event Sequencer");

        delayModes = new AutoModeList();
        mainModes = new AutoModeList();

        //Available Delay Modes
        delayModes.add(new AutoDelayMode(0.0)); //First is default
        delayModes.add(new AutoDelayMode(3.0));
        delayModes.add(new AutoDelayMode(6.0));
        delayModes.add(new AutoDelayMode(9.0));
        delayModes.add(new AutoDelayMode(12.0));

        //Available Main Modes
        mainModes.add(new AutoModeDriveFig8()); //First is default
        mainModes.add(new AutoModeDriveForward3Sec()); 
        mainModes.add(new AutoModeDoNothing());

        // Create and subscribe to NT4 topics
        curDelayModeTopic = new IntegerTopic("/Autonomous/curValDelay", 0);
        curMainModeTopic = new IntegerTopic("/Autonomous/curVal", 0);
        desDelayModeTopic = new IntegerTopic("/Autonomous/desValDelay", 0);
        desMainModeTopic = new IntegerTopic("/Autonomous/desVal", 0);
        this.publish(curDelayModeTopic);
        this.publish(curMainModeTopic);
        this.subscribe(Set.of(desDelayModeTopic.name, desMainModeTopic.name), 0).start();

        reset();
    }

    public void loadSequencer(){
        System.out.println("Loading new autonomous routines...");
        System.out.println("DELAY: " + curDelayMode.humanReadableName);
        System.out.println("MAIN: " + curMainMode.humanReadableName);

        seq.clearAllEvents();

        curDelayMode.addStepsToSequencer(seq);
        curMainMode.addStepsToSequencer(seq);

        System.out.println("Finished loading new auto routines!");
    }

    public void modeUpdate(){

        if(curDelayMode != prevDelayMode || curMainMode != prevMainMode){
            loadSequencer();
        }

        curMainModeTopic.submitNewValue(new TimestampedInteger(curMainMode.idx, TimeserverClient.getCurServerTime()));
        curDelayModeTopic.submitNewValue(new TimestampedInteger(curDelayMode.idx, TimeserverClient.getCurServerTime()));

        prevDelayMode = curDelayMode;
        prevMainMode = curMainMode;
    }

    public void sequencerUpdate(){
        seq.update();
    }

    public void reset(){
        curDelayMode = delayModes.getDefault();
        curMainMode = mainModes.getDefault();
        loadSequencer();
    }

    public void stop(){
        seq.stop();
        sequencerUpdate();
    }

    public void start(){
        seq.start();
        sequencerUpdate();
    }

    public boolean isActive(){
        return seq.isRunning();
    }

	public Pose2d getStartPose() {
		return curMainMode.getInitialPose();
    }
    
    public ArrayList<String> getMainModeNames(){
        return mainModes.getNameList();
    }

    public ArrayList<String> getDelayModeNames(){
        return delayModes.getNameList();
    }

    @Override
    public void onAnnounce(Topic newTopic) {} //do nothing

    @Override
    public void onUnannounce(Topic deadTopic) {} //do nothing

    @Override
    public void onValueUpdate(Topic topic, TimestampedValue newVal) {
        if(topic.name.equals(desDelayModeTopic.name)){
            curDelayMode = delayModes.get((Integer) newVal.getVal());
        } else if(topic.name.equals(desMainModeTopic.name)){
            curMainMode = mainModes.get((Integer) newVal.getVal());;
        } 
    }
}
