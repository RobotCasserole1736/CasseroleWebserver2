package frc.lib.miniNT4;

import org.json.JSONString;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import edu.wpi.first.wpilibj.DriverStation;
import frc.lib.miniNT4.samples.TimestampedValue;
import frc.lib.miniNT4.topics.Topic;
import frc.lib.miniNT4.topics.TopicFactory;

import java.io.IOException;
import java.util.Set;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;

public class Socket extends WebSocketAdapter {

    RemoteClient clientInf;

    @Override
    public void onWebSocketText(String message) {
        JSONParser parser = new JSONParser();
        try {
            handleIncoming((JSONObject) parser.parse(message));
        } catch (Exception e) {
            DriverStation.reportWarning("Could not parse json message " + message, e.getStackTrace());
        }
    }

    @Override
    public void onWebSocketBinary(byte[] payload, int offset, int len)
    {
        //TODO - msgpack unpack
    }

    @Override
    public void onWebSocketConnect(Session sess) {
        super.onWebSocketConnect(sess);
        String clientName = sess.getUpgradeRequest().getRequestURI().toString();
        clientInf = new RemoteClient(this, clientName);
        System.out.println("WS Connect from " + clientName);
    }

    @Override
    public void onWebSocketClose(int statusCode, String reason) {
        super.onWebSocketClose(statusCode, reason);
        clientInf.onDisconnect();
        System.out.println("WS Disconnect");
        System.out.println(statusCode);
        System.out.println(reason);
    }

    void sendWebSocketString(String str){
        try {
            getRemote().sendString(str);
        } catch (IOException e) {
            DriverStation.reportWarning("Could not send message to " + clientInf.friendlyName, e.getStackTrace());
        }
    }

    @SuppressWarnings("unchecked") 
    public void sendAnnounce(Topic topic){

        JSONObject properties = new JSONObject();
        properties.put("persistent", topic.isPersistant);

        JSONObject params = new JSONObject();
        params.put("name", topic.name);
        params.put("id", topic.id);
        params.put("type", topic.getTypestring());
        params.put("properties", properties);

        JSONObject obj = new JSONObject();
        obj.put("method", "announce");
        obj.put("params", params);

        sendWebSocketString(obj.toJSONString());

    }

    public void sendUnannounce(Topic topic){
        //TODO
    }

    public void sendValueUpdate(Topic topic, TimestampedValue val){
        //TODO
    }

    void handleIncoming(JSONObject data) throws ParseException{
        String method = (String) data.get("method");
        JSONObject params = (JSONObject) data.get("params");

        String name;
        String type;
        String[] prefixes;
        int subuid;
        JSONObject options;


        switch(method){
            case "publish":
                name = (String) params.get("name");
                type = (String) params.get("type");
                clientInf.publish(TopicFactory.make(name,type));
            break;
            case "unpublish":
                name = (String) params.get("name");
                clientInf.unpublish(clientInf.publishedTopics.get(name));
            break;
            case "setproperties":
                //TODO
            break;
            case "getvalues":
                //TODO
            break;
            case "subscribe":
                prefixes = (String[]) params.get("prefixes");
                subuid = (int) params.get("subuid");
                Subscription newSub = clientInf.subscribe(Set.of(prefixes), subuid);
                options = (JSONObject) params.get("options");
                
                if(options.containsKey("immediate")){
                    newSub.isImmediate = (boolean) options.get("immediate");
                } else {
                    newSub.isImmediate = false;
                }

                if(options.containsKey("periodic")){
                    newSub.periodicTxRate_sec = (double) options.get("periodic");
                } else {
                    newSub.periodicTxRate_sec = 0.1;
                }

                if(options.containsKey("logging")){
                    newSub.isLogging = (boolean) options.get("logging");
                } else {
                    newSub.isLogging = false;
                }

                newSub.start();
            break;
            case "unsubscribe":
                subuid = (int) params.get("subuid");
                clientInf.unSubscribe(subuid);
            break;
            default:
                throw new IllegalArgumentException("Unrecognized method " + method);
        }
    }

}