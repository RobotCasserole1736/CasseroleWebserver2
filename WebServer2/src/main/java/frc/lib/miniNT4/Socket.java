package frc.lib.miniNT4;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;

public class Socket extends WebSocketAdapter {

    RemoteClient clientInf;


    @Override
    public void onWebSocketText(String message) {
        JSONParser parser = new JSONParser();
        try {
            handleIncoming((JSONObject) parser.parse(message));
        } catch (ParseException e) {
            e.printStackTrace();
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
        clientInf = new RemoteClient(sess);
        System.out.println("WS Connect");
        System.out.println(sess.getUpgradeRequest().getRequestURI());
    }

    @Override
    public void onWebSocketClose(int statusCode, String reason) {
        super.onWebSocketClose(statusCode, reason);
        clientInf.onDisconnect();
        System.out.println("WS Disconnect");
        System.out.println(statusCode);
        System.out.println(reason);
    }

    void handleIncoming(JSONObject data){

    }

}