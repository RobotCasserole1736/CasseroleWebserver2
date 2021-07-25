/*----------------------------------------------------------------------------*/
/* Copyright (c) 2018-2020 FIRST. All Rights Reserved.                        */
/* Open Source Software - may be modified and shared by FRC teams. The code   */
/* must be accompanied by the FIRST BSD license file in the root directory of */
/* the project.                                                               */
/*----------------------------------------------------------------------------*/

package frc.robot;

import edu.wpi.first.wpilibj.TimedRobot;
import frc.lib.Signal.SignalUtils;
import frc.lib.Signal.SignalWrangler;
import frc.lib.Signal.Annotations.Signal;
import frc.lib.Webserver2.Webserver2;
import frc.lib.Webserver2.DashboardConfig.SwerveStateTopicSet;
import frc.lib.miniNT4.NT4Server;
import frc.robot.Autonomous.Autonomous;

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


  Autonomous auto;
  SignalTestGenerator stg;

  @Override
  public void robotInit() {

    NT4Server.getInstance(); // Ensure it starts

    testServer = new Webserver2();

    auto = new Autonomous();

    testServer.dashboard.addCircularGauge(SignalUtils.nameToNT4ValueTopic("TestSlowSin"),  "Left DT Torque", "Nm", 0, 100, 75, 90, 5, 5, 1.0);
    testServer.dashboard.addCircularGauge(SignalUtils.nameToNT4ValueTopic("TestFastSin1"), "Right DT Torque", "Nm", 0, 100, 25, 99, 5, 45, 1.0);
    testServer.dashboard.addText(auto.mainModes.getCurModeTopicName(), "Blah", 5, 82.5, 1.0);

    testServer.dashboard.addIcon(SignalUtils.nameToNT4ValueTopic("TestSquare"), "Test Icon", "#FF0000", "icons/alert.svg", 30, 5, 1.0);
    testServer.dashboard.addIcon(SignalUtils.nameToNT4ValueTopic("TestSquare"), "Test Icon", "#00FF00", "icons/autoAlign.svg", 38, 5, 1.0);
    testServer.dashboard.addIcon(SignalUtils.nameToNT4ValueTopic("AnotherTestSquare"), "Test Icon", "#BBBB00", "icons/cameraFault.svg", 48.5, 5, 1.0);
    testServer.dashboard.addIcon(SignalUtils.nameToNT4ValueTopic("TestSquare"), "Test Icon", "#4444FF", "icons/fast.svg", 57, 5, 1.0);
    testServer.dashboard.addIcon(SignalUtils.nameToNT4ValueTopic("TestSquare"), "Test Icon", "#FF00FF", "icons/slow.svg", 65, 5, 1.0);
    testServer.dashboard.addAutoChooser(auto.delayModes, 30, 75, 1.0);
    testServer.dashboard.addAutoChooser(auto.mainModes, 30, 87, 1.0);

    testServer.dashboard.addLineGauge(SignalUtils.nameToNT4ValueTopic("TestFastSin2"), "Speed", "RPM", -30, 30, -20, 5, 75, 5, 1.0);
    testServer.dashboard.addLineGauge(auto.mainModes.getCurModeTopicName(), "Auto Main Idx", "RPM", -1, 5, -100, 100, 75, 20, 1.0);
    testServer.dashboard.addLineGauge(auto.delayModes.getCurModeTopicName(), "Auto Delay Idx", "RPM", -1, 5, -100, 100, 75, 35, 1.0);
    testServer.dashboard.addText("/testText", "Blah", 75, 50, 1.0);
    testServer.dashboard.addLineGauge(SignalUtils.nameToNT4ValueTopic("AnotherTestSquare"), "Turret Mode", "RPM", -30, 30, -20, 5, 75, 65, 1.0);

    //testServer.dashboard.addCamera(SignalUtils.nameToNT4ValueTopic("TestSlowSin"), "Main Driver Camera", "http://photonvision.local:1192/stream.mjpg", 30, 17, 1.0);

    SwerveStateTopicSet[] topicList = new SwerveStateTopicSet[4];
    topicList[0] = new SwerveStateTopicSet("modFL",0);
    topicList[1] = new SwerveStateTopicSet("modFR",1);
    topicList[2] = new SwerveStateTopicSet("modBL",2);
    topicList[3] = new SwerveStateTopicSet("modBR",3);
    testServer.dashboard.addSwerveState(topicList, "SwerveState Test", 35, 17, 1.0);

    //testServer.dashboard.addSound(SignalUtils.nameToNT4ValueTopic("TestSquare"), "Evil Sound", "sfx/alarm1.mp3", false);



    stg = new SignalTestGenerator();

    SignalWrangler.getInstance().registerSignals(this);

    testServer.startServer();
  }

  @Override
  public void robotPeriodic() {
    loopCounter++;
    auto.modeUpdate();
    stg.update();
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
