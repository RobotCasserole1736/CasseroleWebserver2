package frc.lib.miniNT4;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.msgpack.core.MessageBufferPacker;
import org.msgpack.core.MessagePack;

import edu.wpi.first.wpilibj.DriverStation;
import frc.lib.miniNT4.samples.TimestampedValue;
import frc.lib.miniNT4.topics.Topic;
import frc.lib.miniNT4.topics.TopicFactory;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.HashSet;

import org.eclipse.jetty.websocket.api.RemoteEndpoint;
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
            DriverStation.reportWarning("Could not parse json message " + message + "\n" + e.getMessage(),
                    e.getStackTrace());
        }
    }

    @Override
    public void onWebSocketBinary(byte[] payload, int offset, int len) {
        // TODO - msgpack unpack
    }

    @Override
    public void onWebSocketConnect(Session sess) {
        super.onWebSocketConnect(sess);

        String clientName = sess.getUpgradeRequest().getRequestURI().toString();
        clientInf = new RemoteClient(this, clientName);
        System.out.println("WS Connect from " + clientName);

        // Announce all existing topics to the client
        for(Topic t : NT4Server.getInstance().getAllTopics()){
            this.sendAnnounce(t);
        }
    }

    @Override
    public void onWebSocketClose(int statusCode, String reason) {
        super.onWebSocketClose(statusCode, reason);
        clientInf.onDisconnect();
        System.out.println("WS Disconnect");
    }

    void sendWebSocketString(String str){
        try {
            RemoteEndpoint tmp = getRemote();
            //System.out.println("MSG: Server to " + clientInf.friendlyName + " : \n" + str);
            tmp.sendString(str);
        } catch (Exception e) {
            DriverStation.reportWarning("Could not send message to " + clientInf.friendlyName + "\n" + e.getMessage(), e.getStackTrace());
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

    @SuppressWarnings("unchecked") 
    public void sendUnannounce(Topic topic){

        JSONObject params = new JSONObject();
        params.put("name", topic.name);
        params.put("id", topic.id);

        JSONObject obj = new JSONObject();
        obj.put("method", "unannounce");
        obj.put("params", params);

        sendWebSocketString(obj.toJSONString());

    }

    public synchronized void sendValueUpdate(Topic topic, TimestampedValue val){
        //System.out.println("MSG: Server to " + clientInf.friendlyName + " :");
        //System.out.println("Value Update: " + topic.name + " = " + val.toNiceString());

        ByteBuffer buff;

        MessageBufferPacker packer = MessagePack.newDefaultBufferPacker();
        try {
            packer.packInt(topic.id);
            packer.packLong(val.timestamp_us);
            packer.packInt(topic.getTypeInt());
            val.packValue(packer);
            packer.close();
            buff = ByteBuffer.wrap(packer.toByteArray());
        } catch (IOException e) {
            DriverStation.reportWarning("Could not construct MessagePack for value update to " + clientInf.friendlyName + "\n" + e.getMessage(), e.getStackTrace());
            return;
        }

        try {
            RemoteEndpoint curRemote = getRemote();
            if(curRemote != null){
                curRemote.sendBytes(buff);
            }
        } catch (IOException e) {
            DriverStation.reportWarning("Could not transmit value update to " + clientInf.friendlyName + "\n" + e.getMessage(), e.getStackTrace());
        }


    }

    private HashSet<String> parseStringSet(JSONArray arr){
        HashSet<String> retSet = new HashSet<String>(arr.size());
        for(int i = 0; i < arr.size(); i++){
            retSet.add((String)arr.get(i));
        }
        return retSet;
    }

    void handleIncoming(JSONObject data) throws ParseException{
        //System.out.println("MSG: " + clientInf.friendlyName + " to Server : \n" + data.toJSONString());

        String method = (String) data.get("method");
        JSONObject params = (JSONObject) data.get("params");

        String name;
        String type;
        HashSet<String> prefixes = new HashSet<String>();
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
                prefixes = parseStringSet((JSONArray) params.get("prefixes"));
                clientInf.getValues(prefixes);
            break;
            case "subscribe":
                prefixes = parseStringSet((JSONArray) params.get("prefixes"));
                subuid = ((Number)params.get("subuid")).intValue();
                Subscription newSub = clientInf.subscribe(prefixes, subuid);
                options = (JSONObject) params.get("options");
                
                if(options.containsKey("immediate")){
                    newSub.isImmediate = (boolean) options.get("immediate");
                } else {
                    newSub.isImmediate = false;
                }

                if(options.containsKey("periodic")){
                    newSub.periodicTxRate_sec = ((Number)options.get("periodic")).doubleValue();
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
                subuid = ((Number)params.get("subuid")).intValue();
                clientInf.unSubscribe(subuid);
            break;
            default:
                throw new IllegalArgumentException("Unrecognized method " + method);
        }
    }

}