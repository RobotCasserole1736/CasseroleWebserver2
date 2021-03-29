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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import frc.lib.Webserver2.DashboardConfig.DashboardConfig;
import frc.lib.Webserver2.DashboardConfig.WidgetConfig;
import frc.robot.Robot;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

class DashboardServlet extends HttpServlet {

    private static final long serialVersionUID = -654451291074753656L;

    final String templatesBaseLocal = "./src/main/deploy/templates";
    final String templatesBaseRIO = "/home/lvuser/deploy/templates";

    String htmlTemplateFile;
    String jsTemplateFile;

    DashboardConfig dCfg;

    DashboardServlet(DashboardConfig cfg_in) {
        super();
        dCfg = cfg_in;

        String templatesRootDir = Robot.isReal() ? templatesBaseRIO : templatesBaseLocal;
        htmlTemplateFile = Path.of(templatesRootDir, "dashboard.html").toString();
        jsTemplateFile = Path.of(templatesRootDir, "dashboard.js").toString();
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String outputText = "";
        if (request.getRequestURL().toString().endsWith(".html")) {
            outputText = generateHTML();
            response.setContentType("text/html");
            response.setStatus(HttpServletResponse.SC_OK);
        } else if (request.getRequestURL().toString().endsWith(".js")) {
            outputText = generateJS();
            response.setContentType("application/javascript");
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.setContentType("text/plain");
            response.setStatus(HttpServletResponse.SC_NOT_IMPLEMENTED);
        }

        response.getWriter().println(outputText);
    }

    String generateHTML(){
        String fileContent = readFileToString(htmlTemplateFile);
        
        String htmlReplacement = "";
        for(WidgetConfig w : dCfg.widgetList){
            htmlReplacement += w.getHTML();
            htmlReplacement += "\n";
        }
        String filledOut = fileContent.replace("${WIDGETS_HTML}", htmlReplacement);

        return filledOut;
    }

    String generateJS() {
        String fileContent = readFileToString(jsTemplateFile);
        
        String jsReplacement = "";
        for(WidgetConfig w : dCfg.widgetList){
            jsReplacement += w.getJS();
            jsReplacement += "\n";
        }
        String filledOut = fileContent.replace("${WIDGETS_JS}", jsReplacement);

        return filledOut;    
    }

    private String readFileToString(String filePath) {
        String content = "";

        try {
            content = new String(Files.readAllBytes(Paths.get(filePath)));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return content;
    }
}