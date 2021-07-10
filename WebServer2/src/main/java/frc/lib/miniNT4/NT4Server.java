package frc.lib.miniNT4;

import java.util.Collections;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Set;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import frc.lib.miniNT4.topics.Topic;

public class NT4Server {

    /* Singleton infrastructure */
    private static NT4Server instance;
    public static synchronized NT4Server getInstance() {
        if (instance == null) {
            instance = new NT4Server();
            instance.startServer();
        }
        return instance;
    }

    private Server server;

    //Synchronization required since we add/remove clients and iterate over the list simulaneously
    private Set<BaseClient> clients = Collections.synchronizedSet(new HashSet<BaseClient>());

    private NT4Server() {

    }

    //Lists of all available topics for rapid access
    Hashtable<String, Topic> topicsByName = new Hashtable<String, Topic>();
    Hashtable<Integer, Topic> topicsByID = new Hashtable<Integer, Topic>();


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

        //Automatically register the special client to serve the current time
        registerClient(new TimeserverClient());
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

        topicsByName.put(newTopic.name, newTopic);
        topicsByID.put(newTopic.id, newTopic);

        synchronized(clients){
            for(BaseClient c : clients){
                c.onAnnounce(newTopic);
                for(Subscription s : c.subscriptions.values()){
                    s.updateTopicSet();
                }
            }
        }
    }

    void broadcastUnannounce(Topic deadTopic){
        synchronized(clients){
            for(BaseClient c : clients){
                c.onUnannounce(deadTopic);
                for(Subscription s : c.subscriptions.values()){
                    s.updateTopicSet();
                }
            }
        }

        topicsByName.remove(deadTopic.name);
        topicsByID.remove(deadTopic.id);
    }

    /**
     * 
     * @return list of all available topics on the server
     */
    public Set<Topic> getAllTopics(){
        return new HashSet<Topic>(topicsByName.values());
    }

    /**
     * 
     * @return topic with the given ID, or none if nothing found.
     */
    public Topic getTopic(int id){
        return topicsByID.get(id);
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
     * @param prefixes Set of Strings of key prefixes
     * @return list of names matching the given regex pattern.
     */
    public Set<Topic> getTopics(Set<String> prefixes){
        HashSet<Topic> retTopics = new HashSet<Topic>();

        for(Topic topic : topicsByName.values()){
            //For all topics...
            for(String prefix : prefixes){
                if(topic.name.startsWith(prefix)){
                    //On the first match, add it to the ret list, and move on to the next topic (skipping remaining topics).
                    retTopics.add(topic);
                    break;
                }
            }
        }

        return retTopics;
    }

    int topicUIDCounter = 0;
    public int getUniqueTopicID(){
        return topicUIDCounter++;
    }
}
