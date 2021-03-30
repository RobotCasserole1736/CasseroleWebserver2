package frc.lib.Webserver2.DashboardConfig;

public class SoundConfig extends WidgetConfig {

    String filePath = "";
    boolean looping = false;

    @Override
    public String getJSDeclaration(){
        return String.format("var widget%d = new Sound('%s', '%s', %s);", idx, name, filePath, looping?"true":"false");
    }

    @Override
    public String getJSUpdate() {
        return String.format("widget%d.render();", idx);
    }
    
}
