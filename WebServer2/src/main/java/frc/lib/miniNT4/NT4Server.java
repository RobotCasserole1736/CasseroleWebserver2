package frc.lib.miniNT4;


import java.util.HashSet;
import java.util.Set;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import edu.wpi.first.wpilibj.Timer;
import frc.lib.miniNT4.topics.Topic;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    private Set<BaseClient> clients = new HashSet<BaseClient>();

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

        serverThread.setName("NT4 Main Server");
        serverThread.setPriority(10);
        serverThread.start();
    }

    /**
     * Called internally when a new client has connected
     * @param newClient
     */
    void registerClient(BaseClient newClient){
        clients.add(newClient);
    }
    /**
     * Called internally when a client is no longer connected
     * @param newClient
     */
    void unRegisterClient(BaseClient deadClient){
        clients.remove(deadClient);
    }

    void broadcastAnnounce(Topic newTopic){
        for(BaseClient c : clients){
            c.onAnnounce(newTopic);
        }
    }

    void broadcastUnannounce(Topic deadTopic){
        for(BaseClient c : clients){
            c.onUnannounce(deadTopic);
        }
    }

    /**
     * 
     * @return current server microseconds time
     */
    public long getCurServerTime(){
        return Math.round(Timer.getFPGATimestamp() * 1000000l);
    }

    /**
     * 
     * @return list of all available topics on the server
     */
    public Set<Topic> getAllTopics(){
        HashSet<Topic> retTopics = new HashSet<Topic>();
        for(BaseClient client : clients){
            retTopics.addAll(client.publishedTopics.values());
        }
        return retTopics;
    }

        /**
     * 
     * @param pattern String Regex pattern to match topic names
     * @return list of names matching the given regex pattern.
     */
    public Set<Topic> getTopics(String pattern){
        Set<String> p = new HashSet<String>(1);
        p.add(pattern);
        return this.getTopics(p);
    }

    /**
     * 
     * @param patterns Set of Strings of Regex pattern to match topic names
     * @return list of names matching the given regex pattern.
     */
    public Set<Topic> getTopics(Set<String> patterns){
        //Generate regex patterns for each pattern
        Set<Pattern> regex_patterns = new HashSet<Pattern>(patterns.size());
        for(String pattern : patterns){
            regex_patterns.add(Pattern.compile(pattern));
        }

        HashSet<Topic> retTopics = new HashSet<Topic>();
        for(BaseClient client : clients){
            for(Topic topic : client.publishedTopics.values()){
                //For all topics...
                for(Pattern pattern : regex_patterns){
                    //Check against all incoming patterns
                    Matcher m = pattern.matcher(topic.name);
                    if(m.find()){
                        //On the first match, add it to the ret list, and move on to the next topic (skipping remaining topics).
                        retTopics.addAll(client.publishedTopics.values());
                        break;
                    }
                }
            }
        }
        return retTopics;
    }
}
