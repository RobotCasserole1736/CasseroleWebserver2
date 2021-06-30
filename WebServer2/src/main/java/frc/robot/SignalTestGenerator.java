package frc.robot;

import edu.wpi.first.wpilibj.Timer;
import frc.lib.Signal.Annotations.Signal;

public class SignalTestGenerator {

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

    public SignalTestGenerator(){

    }

    public void update(){
        double curTimeSec = Timer.getFPGATimestamp();
        testSin1 = 50 + 20 * Math.sin(2 * Math.PI * 0.25 * curTimeSec);
        testSin2 = 30 + 25.0 * Math.cos(2 * Math.PI * 0.75 * curTimeSec);
        testSin3 = 10 + 50 * Math.cos(2 * Math.PI * 2.1 * curTimeSec);
        testSquare1 = (curTimeSec % 10 > 5) ? 1.0 : 0;
        testSquare2 = (curTimeSec % 7 > 3) ? 1.0 : 0;
    }
    
}
