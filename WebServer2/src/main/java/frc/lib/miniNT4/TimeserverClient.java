package frc.lib.miniNT4;

import edu.wpi.first.wpilibj.Timer;
import frc.lib.miniNT4.samples.TimestampedValue;
import frc.lib.miniNT4.topics.TimeTopic;
import frc.lib.miniNT4.topics.Topic;

/**
 * Timeserver Client is a unique client which serves the time topic, and nothing else

 */
public class TimeserverClient extends BaseClient{

    Topic timeTopic;

    public TimeserverClient(){
        super();
        timeTopic = new TimeTopic();
        this.publish(timeTopic);
    }

    @Override
    public void onAnnounce(Topic newTopic) {
        // Nothing to do.
    }

    @Override
    public void onUnannounce(Topic deadTopic) {
        // Nothing to do
    }

    @Override
    public void onValueUpdate(Topic topic, TimestampedValue newVal) {
        // Nothing to do - no other client should be updating the time
    }

    /**
     * 
     * @return current server microseconds time
     */
    public static long getCurServerTime(){
        return Math.round(Timer.getFPGATimestamp() * 1000000l);
    }

}
