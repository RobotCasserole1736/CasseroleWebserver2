package frc.lib.Webserver2.LogFiles;

/*
 *******************************************************************************************
 * Copyright (C) 2017 FRC Team 1736 Robot Casserole - www.robotcasserole.org
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

import java.io.IOException;
import java.util.ArrayList;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import frc.lib.Logging.LogFile;
import frc.lib.Logging.LogFileWrangler;

/**
 * DESCRIPTION: <br>
 * Private socket definition class that Jetty wants me to make public even
 * though it doesn't actually have to be. Don't use this for anything unless you
 * know preciisely what you are doing.
 */

public class LogFileStreamerSocket extends WebSocketAdapter {

    @Override
    public void onWebSocketText(String messageStr) {
        if (isConnected()) {

            JSONObject msg = new JSONObject(messageStr);
            String cmd = "";
            try{
                cmd = msg.get("cmd").toString();
            } catch (JSONException e){
                System.out.println("Malformed jSON - no cmd");
            }

            if(cmd == "deleteAll"){
                System.out.println("Deleting All Log Files");
                LogFileWrangler.getInstance().deleteAllLogs();
            } else {
                System.out.println("Malformed jSON - cmd \"" + cmd + "\" unrecognized.");
            }

            broadcastData();
        }
    }

    @Override
    public void onWebSocketConnect(Session sess) {
        super.onWebSocketConnect(sess);
        broadcastData();
    }

    @Override
    public void onWebSocketClose(int statusCode, String reason) {
        super.onWebSocketClose(statusCode, reason);
    }

    /**
     * Send current list of files and data to client
     */
    public void broadcastData() {
        if (isConnected()) {

            try {
                JSONObject full_obj = new JSONObject();
                JSONArray data_array = new JSONArray();
                ArrayList<JSONObject> logFileJsonObjs = new ArrayList<JSONObject>();

                for(LogFile lf : LogFileWrangler.getInstance().getLogFileListing()){
                    logFileJsonObjs.add(lf.getJSON());
                }
                data_array.putAll(logFileJsonObjs);
                full_obj.put("type", "log_files");
                full_obj.put("log_files", data_array);
                getRemote().sendString(full_obj.toString());

            } catch (IOException e) {
                e.printStackTrace(System.err);
            }
        }
    }

}
