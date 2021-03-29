package frc.lib.Webserver2;

import java.util.LinkedList;

import frc.lib.Webserver2.WidgetType;

public class DashboardConfig {

    LinkedList<WidgetConfig> widgetList = new LinkedList<WidgetConfig>();

    //Factory Functions for user to make new widgets
    //TODO on all - add Signal/NT references
    public void addAutoChooser(String name, String[] modeNames, double xPos, double yPos, double sizeScaleFactor){ 
        var w = new WidgetConfig(WidgetType.AUTO_CHOOSER);
        w.propertyMap.put("name", name);
        w.propertyMap.put("xPos", xPos);
        w.propertyMap.put("yPos", yPos);
        w.propertyMap.put("sizeScaleFactor", sizeScaleFactor);
        widgetList.add(w);
    }

    public void addCamera(String name, String url, double xPos, double yPos, double sizeScaleFactor){ //TODO add version for NT referenced URL
        var w = new WidgetConfig(WidgetType.AUTO_CHOOSER);
        w.propertyMap.put("name", name);
        w.propertyMap.put("xPos", xPos);
        w.propertyMap.put("yPos", yPos);
        w.propertyMap.put("sizeScaleFactor", sizeScaleFactor);
        widgetList.add(w);
    }

    public void addCircularGauge(String name, String units, double minRange, double maxRange, double minAcceptable, double maxAcceptable, double xPos, double yPos, double sizeScaleFactor){
        var w = new WidgetConfig(WidgetType.AUTO_CHOOSER);
        w.propertyMap.put("name", name);
        w.propertyMap.put("units", units);
        w.propertyMap.put("minRange", minRange);
        w.propertyMap.put("maxRange", maxRange);
        w.propertyMap.put("minAcceptable", minAcceptable);
        w.propertyMap.put("maxAcceptable", maxAcceptable);
        w.propertyMap.put("xPos", xPos);
        w.propertyMap.put("yPos", yPos);
        w.propertyMap.put("sizeScaleFactor", sizeScaleFactor);
        widgetList.add(w);
    }

    public void addIcon(String name, String colorOn, String colorOff, String svgPath, double xPos, double yPos, double sizeScaleFactor){
        var w = new WidgetConfig(WidgetType.AUTO_CHOOSER);
        w.propertyMap.put("name", name);
        w.propertyMap.put("colorOn", colorOn);
        w.propertyMap.put("colorOff", colorOff);
        w.propertyMap.put("svgPath", svgPath);
        w.propertyMap.put("xPos", xPos);
        w.propertyMap.put("yPos", yPos);
        w.propertyMap.put("sizeScaleFactor", sizeScaleFactor);
        widgetList.add(w);
    }

    public void addLineGauge(String name, String units, double minRange, double maxRange, double minAcceptable, double maxAcceptable, double xPos, double yPos, double sizeScaleFactor){
        var w = new WidgetConfig(WidgetType.AUTO_CHOOSER);
        w.propertyMap.put("name", name);
        w.propertyMap.put("units", units);
        w.propertyMap.put("minRange", minRange);
        w.propertyMap.put("maxRange", maxRange);
        w.propertyMap.put("minAcceptable", minAcceptable);
        w.propertyMap.put("maxAcceptable", maxAcceptable);
        w.propertyMap.put("xPos", xPos);
        w.propertyMap.put("yPos", yPos);
        w.propertyMap.put("sizeScaleFactor", sizeScaleFactor);
        widgetList.add(w);
    }

    public void addSound(String name, String audioFilePath){
        var w = new WidgetConfig(WidgetType.AUTO_CHOOSER);
        w.propertyMap.put("name", name);
        w.propertyMap.put("audioFilePath", audioFilePath);
        widgetList.add(w);
    }

    public void addText(String name, double xPos, double yPos, double sizeScaleFactor){
        var w = new WidgetConfig(WidgetType.AUTO_CHOOSER);
        w.propertyMap.put("name", name);
        w.propertyMap.put("xPos", xPos);
        w.propertyMap.put("yPos", yPos);
        w.propertyMap.put("sizeScaleFactor", sizeScaleFactor);
        widgetList.add(w);
    }

}
