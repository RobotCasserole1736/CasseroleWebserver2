/*----------------------------------------------------------------------------*/
/* Copyright (c) 2018-2020 FIRST. All Rights Reserved.                        */
/* Open Source Software - may be modified and shared by FRC teams. The code   */
/* must be accompanied by the FIRST BSD license file in the root directory of */
/* the project.                                                               */
/*----------------------------------------------------------------------------*/

package frc.robot;

import java.util.ArrayList;

import edu.wpi.first.wpilibj.TimedRobot;
import frc.lib.Logging.SignalFileLogger;
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
    autoModes.add("Spin Left");

    testServer.dashboard.addCamera("Main Driver Camera", "http://photonvision.local:1192/stream.mjpg", 30, 10, 1.0);
    testServer.dashboard.addCircularGauge("Test Gauge", "Nm", 0, 100, 75, 90, 5, 5, 1.0);
    testServer.dashboard.addAutoChooser("Auto Mode", autoModes, 30, 70, 1.0);
    testServer.dashboard.addIcon("Test Icon", "#FF0000", "#222222", "icons/speed.svg", 5, 50, 1.0);
    testServer.dashboard.addLineGauge("Speed", "RPM", -500, 500, -100, 100, 75, 10, 1.0);
    testServer.dashboard.addSound("Evil Sound", "sfx/alarm1.mp3", false);
    testServer.dashboard.addText("Blah", 75, 30, 1.0);

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
