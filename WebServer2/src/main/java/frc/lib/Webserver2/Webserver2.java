package frc.lib.Webserver2;

/*
 *******************************************************************************************
 * Copyright (C) FRC Team 1736 Robot Casserole - www.robotcasserole.org
 *******************************************************************************************
 *
 * This software is released under the MIT Licence - see the license.txt
 *  file in the root of this repo.
 *
 * Non-legally-binding statement from Team 1736:
 *  Thank you for taking the time to read through our software! We hope you
 *   find it educational and informative! 
 *  Please feel free to snag our software for your own use in whatever project
 *   you have going on right now! We'd love to be able to help out! Shoot us 
 *   any questions you may have, all our contact info should be on our website
 *   (listed above).
 *  If you happen to end up using our software to make money, that is wonderful!
 *   Robot Casserole is always looking for more sponsors, so we'd be very appreciative
 *   if you would consider donating to our club to help further STEM education.
 */

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import frc.robot.Robot;



public class Webserver2 {

    static Server server;

    /**
     * Main dashboard configuration object. User should call methods 
     * from this object to configure 
     */
    public final DashboardConfig dashboard = new DashboardConfig();

    final String resourceBaseLocal = "./src/main/deploy/www";
    final String resourceBaseRIO = "/home/lvuser/deploy/www";

    String resourceBase = resourceBaseRIO; //default to roboRIO

    /**
     * Starts the web server in a new thread. Should be called at the end of robot
     * initialization.
     */
    public void startServer() {

        //Pick web resources path approprate to execution environment
        if(Robot.isReal()){
            resourceBase = resourceBaseRIO;
        } else {
            resourceBase = resourceBaseLocal;
        }

        // New server will be on the robot's address plus port 5805
        server = new Server(5805);

        //By default - serve all files under the calculated resourceBase folder
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);

        ResourceHandler resource_handler = new ResourceHandler();
        resource_handler.setDirectoriesListed(true);
        resource_handler.setWelcomeFiles(new String[] { "index.html" });
        resource_handler.setResourceBase(resourceBase);
        server.insertHandler(resource_handler);

        // Separately - Dashboard html/js is auto-generated from templates
        ServletHolder dashboardSH = new ServletHolder("dashboard", new DashboardServlet(dashboard));
        context.addServlet(dashboardSH, "/dashboard/dashboard.html");
        context.addServlet(dashboardSH, "/dashboard/dashboard.js");
        

        // Kick off server in brand new, low-priority thread.
        Thread serverThread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    server.start();
                    server.join();
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
        });
        serverThread.setName("WebServer2");
        serverThread.setPriority(2);
        serverThread.start();

    }

}
