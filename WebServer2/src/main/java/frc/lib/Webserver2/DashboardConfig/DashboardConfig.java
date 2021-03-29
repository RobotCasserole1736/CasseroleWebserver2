package frc.lib.Webserver2.DashboardConfig;

import java.util.LinkedList;
import java.util.List;

public class DashboardConfig {

    public LinkedList<WidgetConfig> widgetList = new LinkedList<WidgetConfig>();

    //Factory Functions for user to make new widgets
    //TODO on all - add Signal/NT references
    public void addAutoChooser(String name, List<String> modeNames, double xPos, double yPos, double sizeScaleFactor){ 
        var w = new AutoChooserConfig();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        w.modeNameList = modeNames;
        widgetList.add(w);

    }

    public void addCamera(String name, String streamURL, double xPos, double yPos, double sizeScaleFactor){ //TODO add version for NT referenced URL
        var w = new CameraConfig();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        w.streamURL = streamURL;
        widgetList.add(w);
    }

    public void addCircularGauge(String name, String units, double minRange, double maxRange, double minAcceptable, double maxAcceptable, double xPos, double yPos, double sizeScaleFactor){
        var w = new CircularGaugeConfig();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        w.minRange = minRange;
        w.maxRange = maxRange;
        w.minAcceptable = minAcceptable;
        w.maxAcceptable = maxAcceptable;
        widgetList.add(w);
    }

    public void addIcon(String name, String colorOn, String colorOff, String symbolPath, double xPos, double yPos, double sizeScaleFactor){
        var w = new IconConfig();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        w.colorOn = colorOn;
        w.colorOff = colorOff;
        w.symbolPath = symbolPath;
        widgetList.add(w);
    }

    public void addLineGauge(String name, String units, double minRange, double maxRange, double minAcceptable, double maxAcceptable, double xPos, double yPos, double sizeScaleFactor){
        var w = new LineGaugeConfig();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        w.minRange = minRange;
        w.maxRange = maxRange;
        w.minAcceptable = minAcceptable;
        w.maxAcceptable = maxAcceptable;
        widgetList.add(w);
    }

    public void addSound(String name, String filePath, boolean looping){
        var w = new SoundConfig();
        w.name = name;
        w.filePath = filePath;
        w.looping = looping;
        widgetList.add(w);
    }

    public void addText(String name, double xPos, double yPos, double sizeScaleFactor){
        var w = new TextConfig();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        widgetList.add(w);
    }

}
