package frc.robot.Autonomous.Modes;

import edu.wpi.first.wpilibj.geometry.Pose2d;
import frc.lib.AutoSequencer.AutoSequencer;

public class AutoModeDriveFig8 extends AutoMode {

    //AutoEventDriveFig8 driveEvent = null;

    public AutoModeDriveFig8(){
        humanReadableName = "Drive Figure 8";
    }

    @Override
    public void addStepsToSequencer(AutoSequencer seq){
        //driveEvent = new AutoEventDriveFig8();
        //seq.addEvent(driveEvent);
    }

    @Override
    public Pose2d getInitialPose(){
        //if(driveEvent != null){
        //    return driveEvent.getStartPose();
        //} else {
        //    return Constants.DFLT_START_POSE;
        //}
        return new Pose2d();
    }

    
}
