package frc.lib.Webserver2.DashboardConfig;

import java.util.LinkedList;
import java.util.List;

public class DashboardConfig {

    public LinkedList<WidgetConfig> widgetList = new LinkedList<WidgetConfig>();

    // Factory Functions for user to make new widgets
    public void addAutoChooser(String nt4TopicCur_in, String nt4TopicDes_in, String name, List<String> modeNames, double xPos, double yPos, double sizeScaleFactor) {
        var w = new AutoChooserConfig();
        w.nt4TopicCurVal = nt4TopicCur_in;
        w.nt4TopicDesVal = nt4TopicDes_in;
        w.idx = widgetList.size();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        w.modeNameList = modeNames;
        widgetList.add(w);

    }

    // TODO - add alternate form for NT-referenced address (CameraServer)
    public void addCamera(String nt4Topic_in, String name, String streamURL, double xPos, double yPos, double sizeScaleFactor) {

        var w = new CameraConfig();
        w.nt4TopicCurVal = nt4Topic_in;
        w.idx = widgetList.size();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        w.streamURL = streamURL;
        widgetList.add(w);
    }

    public void addCircularGauge(String nt4Topic_in, String name, String units, double minRange, double maxRange, double minAcceptable,
            double maxAcceptable, double xPos, double yPos, double sizeScaleFactor) {
        var w = new CircularGaugeConfig();
        w.nt4TopicCurVal = nt4Topic_in;
        w.idx = widgetList.size();
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

    public void addIcon(String nt4Topic_in, String name, String colorOn, String symbolPath, double xPos, double yPos,
            double sizeScaleFactor) {
        var w = new IconConfig();
        w.nt4TopicCurVal = nt4Topic_in;
        w.idx = widgetList.size();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        w.colorOn = colorOn;
        w.symbolPath = symbolPath;
        widgetList.add(w);
    }

    public void addLineGauge(String nt4Topic_in, String name, String units, double minRange, double maxRange, double minAcceptable,
            double maxAcceptable, double xPos, double yPos, double sizeScaleFactor) {
        var w = new LineGaugeConfig();
        w.nt4TopicCurVal = nt4Topic_in;
        w.idx = widgetList.size();
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

    public void addSound(String nt4Topic_in, String name, String filePath, boolean looping) {
        var w = new SoundConfig();
        w.nt4TopicCurVal = nt4Topic_in;
        w.idx = widgetList.size();
        w.name = name;
        w.filePath = filePath;
        w.looping = looping;
        widgetList.add(w);
    }

    public void addText(String nt4Topic_in, String name, double xPos, double yPos, double sizeScaleFactor) {
        var w = new TextConfig();
        w.nt4TopicCurVal = nt4Topic_in;
        w.idx = widgetList.size();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        widgetList.add(w);
    }

    public void addSwerveState(SwerveStateTopicSet[] topics_in, String name, double xPos, double yPos, double sizeScaleFactor) {
        var w = new SwerveStateConfig();
        w.idx = widgetList.size();
        w.xPos = xPos;
        w.yPos = yPos;
        w.name = name;
        w.sizeScaleFactor = sizeScaleFactor;
        w.FLTopics = topics_in[0];
        w.FRTopics = topics_in[1];
        w.BLTopics = topics_in[2];
        w.BRTopics = topics_in[3];
        widgetList.add(w);
    }

}
