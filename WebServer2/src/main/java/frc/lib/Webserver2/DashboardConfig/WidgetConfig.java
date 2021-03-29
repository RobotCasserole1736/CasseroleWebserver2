package frc.lib.Webserver2.DashboardConfig;

public abstract class WidgetConfig {

    String name = "";
    public double xPos = 0.0;
    public double yPos = 0.0;
    public double sizeScaleFactor = 1.0;


    public WidgetConfig(){

    }

    public abstract String getHTML();

    public abstract String getJS();

}
