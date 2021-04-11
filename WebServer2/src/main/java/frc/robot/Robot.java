/*----------------------------------------------------------------------------*/
/* Copyright (c) 2018-2020 FIRST. All Rights Reserved.                        */
/* Open Source Software - may be modified and shared by FRC teams. The code   */
/* must be accompanied by the FIRST BSD license file in the root directory of */
/* the project.                                                               */
/*----------------------------------------------------------------------------*/

package frc.robot;

import java.util.ArrayList;

import edu.wpi.first.wpilibj.TimedRobot;
import frc.lib.Signal.SignalWrangler;
import frc.lib.Signal.Annotations.Signal;
import frc.lib.Webserver2.Webserver2;

/**
 * The VM is configured to automatically run this class, and to call the
 * functions corresponding to each mode, as described in the TimedRobot
 * documentation. If you change the name of this class or the package after
 * creating this project, you must also update the build.gradle file in the
 * project.
 */
public class Robot extends TimedRobot {

  @Signal(units = "count")
  int loopCounter = 0;

  Webserver2 testServer;

  @Override
  public void robotInit() {

    testServer = new Webserver2();

    ArrayList<String> autoModes = new ArrayList<String>();
    autoModes.add("Do Nothing");
    autoModes.add("Drive Forward");
    autoModes.add("Drive Backward");
    autoModes.add("Spin Left");
    autoModes.add("Win Match");

    ArrayList<String> delayModes = new ArrayList<String>();
    delayModes.add("0 sec");
    delayModes.add("3 sec");
    delayModes.add("6 sec");
    delayModes.add("9 sec");
    delayModes.add("12 sec");

    testServer.dashboard.addCircularGauge("Signals/TestSlowSin/Value",  "Left DT Torque", "Nm", 0, 100, 75, 90, 5, 5, 1.0);
    testServer.dashboard.addCircularGauge("Signals/TestFastSin1/Value", "Right DT Torque", "Nm", 0, 100, 25, 99, 5, 45, 1.0);
    testServer.dashboard.addText("Autonomous/curValDelay", "Blah", 5, 82.5, 1.0);

    testServer.dashboard.addIcon("Signals/TestSquare/Value", "Test Icon", "#FF0000", "icons/warning.svg", 30, 5, 1.0);
    testServer.dashboard.addIcon("Signals/TestSquare/Value", "Test Icon", "#00FF00", "icons/gear.svg", 38, 5, 1.0);
    testServer.dashboard.addIcon("Signals/AnotherTestSquare/Value", "Test Icon", "#BBBB00", "icons/cameraFault.svg", 48.5, 5, 1.0);
    testServer.dashboard.addIcon("Signals/TestSquare/Value", "Test Icon", "#4444FF", "icons/vision.svg", 57, 5, 1.0);
    testServer.dashboard.addIcon("Signals/TestSquare/Value", "Test Icon", "#FF00FF", "icons/camera.svg", 65, 5, 1.0);
    testServer.dashboard.addCamera("Signals/TestSlowSin/Value", "Main Driver Camera", "http://photonvision.local:1192/stream.mjpg", 30, 17, 1.0);
    testServer.dashboard.addAutoChooser("Autonomous/curVal", "Autonomous/desVal", "Auto Mode", autoModes, 30, 75, 1.0);
    testServer.dashboard.addAutoChooser("Autonomous/curValDelay", "Autonomous/desValDelay", "Auto Delay", delayModes, 30, 87, 1.0);

    testServer.dashboard.addLineGauge("Signals/TestFastSin2/Value", "Speed", "RPM", -30, 30, -20, 5, 75, 5, 1.0);
    testServer.dashboard.addLineGauge("Autonomous/curVal", "Auto Idx", "RPM", -1, 5, -100, 100, 75, 20, 1.0);
    testServer.dashboard.addLineGauge("Autonomous/curValDelay", "Delay Idx", "RPM", -1, 5, -100, 100, 75, 35, 1.0);
    testServer.dashboard.addText("testText", "Blah", 75, 50, 1.0);
    testServer.dashboard.addLineGauge("Signals/AnotherTestSquare/Value", "Turret Mode", "RPM", -30, 30, -20, 5, 75, 65, 1.0);


    //testServer.dashboard.addSound("Signals/TestSquare/Value", "Evil Sound", "sfx/alarm1.mp3", false);


    SignalWrangler.getInstance().registerSignals(this);

    testServer.startServer();
  }

  @Override
  public void robotPeriodic() {
    loopCounter++;
    SignalWrangler.getInstance().sampleAllSignals();
  }

  @Override
  public void autonomousInit() {
    SignalWrangler.getInstance().logger.startLoggingAuto();
  }

  @Override
  public void autonomousPeriodic() {
  }

  @Override
  public void teleopInit() {
    SignalWrangler.getInstance().logger.startLoggingTeleop();
  }

  @Override
  public void teleopPeriodic() {
  }

  @Override
  public void disabledInit() {

    SignalWrangler.getInstance().logger.stopLogging();
  }

  @Override
  public void disabledPeriodic() {
  }

  @Override
  public void testInit() {
  }

  @Override
  public void testPeriodic() {
  }

}
