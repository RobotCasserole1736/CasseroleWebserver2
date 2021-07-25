package frc.robot;

import edu.wpi.first.wpilibj.Timer;
import frc.lib.Calibration.Calibration;
import frc.lib.Signal.Annotations.Signal;
import frc.lib.miniNT4.LocalClient;
import frc.lib.miniNT4.NT4Server;
import frc.lib.miniNT4.NT4TypeStr;
import frc.lib.miniNT4.samples.TimestampedString;
import frc.lib.miniNT4.samples.TimestampedValue;
import frc.lib.miniNT4.topics.StringTopic;
import frc.lib.miniNT4.topics.Topic;

public class SignalTestGenerator extends LocalClient {

    @Signal(units = "RPM", name = "TestSlowSin")
    double testSin1;

    @Signal(units = "V", name = "TestFastSin1")
    double testSin2;

    @Signal(units = "V", name = "TestFastSin2")
    double testSin3;

    @Signal(units = "RPM", name = "TestSquare")
    double testSquare1;

    @Signal(units = "RPM", name = "AnotherTestSquare")
    double testSquare2;

    Calibration freq1 = new Calibration("Frequency1", "Hz", 0.5);
    Calibration freq2 = new Calibration("Frequency2", "Hz", 1.0, 0.0, 50.0);
    Calibration freq3 = new Calibration("Frequency3", "Hz", 2.0, 0.0, 50.0);

    Topic testStrTopic;

    public SignalTestGenerator(){
         testStrTopic = NT4Server.getInstance().publishTopic("/testText", NT4TypeStr.STR, this);
    }

    public void update(){
        double curTimeSec = Timer.getFPGATimestamp();
        testSin1 = 50 + 20 * Math.sin(2 * Math.PI * freq1.get() * curTimeSec);
        testSin2 = 30 + 25.0 * Math.cos(2 * Math.PI * freq2.get() * curTimeSec);
        testSin3 = 10 + 50 * Math.cos(2 * Math.PI * freq3.get() * curTimeSec);
        testSquare1 = (curTimeSec % 10 > 5) ? 1.0 : 0;
        testSquare2 = (curTimeSec % 7 > 3) ? 1.0 : 0;

        testStrTopic.submitNewValue(new TimestampedString((curTimeSec % 5 > 3)?"Peas":"Carrots", NT4Server.getInstance().getCurServerTime()));
    }

    @Override
    public void onAnnounce(Topic newTopic) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void onUnannounce(Topic deadTopic) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void onValueUpdate(Topic topic, TimestampedValue newVal) {
        // TODO Auto-generated method stub
        
    }
    
}
