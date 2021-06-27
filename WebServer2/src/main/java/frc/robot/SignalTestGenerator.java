package frc.robot;

import edu.wpi.first.wpilibj.Timer;
import frc.lib.Signal.Annotations.Signal;

public class SignalTestGenerator {

    @Signal(units = "RPM")
    double testSin1;

    @Signal(units = "V")
    double testSin2;

    @Signal(units = "RPM")
    double testSquare1;

    public SignalTestGenerator(){

    }

    public void update(){
        double curTimeSec = Timer.getFPGATimestamp();
        testSin1 = 5.0 * Math.sin(2 * Math.PI * 0.25 * curTimeSec);
        testSin2 = 3.0 * Math.cos(2 * Math.PI * 0.33 * curTimeSec);
        testSquare1 = (curTimeSec % 10 > 5) ? 3.0 : 0.25;
    }
    
}
