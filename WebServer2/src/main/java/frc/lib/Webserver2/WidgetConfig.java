package frc.lib.Webserver2;

import java.util.HashMap;

class WidgetConfig {


    public WidgetType type;

    HashMap<String, Object> propertyMap;

    public WidgetConfig(WidgetType type){
        this.type = type;
        this.propertyMap = new HashMap<String, Object>();
    }

}
