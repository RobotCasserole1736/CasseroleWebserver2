package frc.lib.miniNT4;


import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import edu.wpi.first.wpilibj.Timer;

public class NT4Server {

    /* Singleton infrastructure */
    private static NT4Server instance;

    public static NT4Server getInstance() {
        if (instance == null) {
            instance = new NT4Server();
        }
        return instance;
    }

    private Server server;

    private NT4Server() {
        startServer();
    }


    /**
     * Starts the web server in a new thread. Should be called at the end of robot
     * initialization.
     */
    public void startServer() {

        server = new Server(5810);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);

        ServletHolder dataServerHolder = new ServletHolder("nt", new Servlet());
        context.addServlet(dataServerHolder, "/nt/*");

        // Kick off server in brand new thread.
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

        serverThread.setName("miniNT4Server");
        serverThread.setPriority(10);
        serverThread.start();
    }

    private long getCurServerTime(){
        return Math.round(Timer.getFPGATimestamp() * 1000000l);
    }

}
