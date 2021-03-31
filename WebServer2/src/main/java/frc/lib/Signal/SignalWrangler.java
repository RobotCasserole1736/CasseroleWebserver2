package frc.lib.Signal;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Set;

import edu.wpi.first.wpilibj.DriverStation;
import frc.lib.Logging.SignalFileLogger;

public class SignalWrangler {

    /* Singleton infrastructure */
    private static SignalWrangler instance;

    public static SignalWrangler getInstance() {
        if (instance == null) {
            instance = new SignalWrangler();
        }
        return instance;
    }

    /** Full set of all registered signals on this robot */
    public ArrayList<Signal> registeredSignals = new ArrayList<Signal>(0);

    // File logger for signals
    SignalFileLogger logger;

    private SignalWrangler() {
        logger = new SignalFileLogger();
    }

    public int register(Signal sig_in) {
        int ret_val = 0;
        if (registeredSignals.contains(sig_in)) {
            DriverStation.reportWarning("[SignalWrangler] WARNING: " + sig_in.name
                    + " has already been added to the signal wrangler. Nothing done.", false);
            ret_val = -1;
        } else {
            registeredSignals.add(sig_in);
            ret_val = 0;
        }
        return ret_val;
    }

    public Signal getSignalFromName(String name_in) {
        for (Signal sig : registeredSignals) {
            if (sig.name.equals(name_in)) {
                return sig;
            }
        }
        return null;
    }

    public Signal[] getAllSignals() {
        return (Signal[]) registeredSignals.toArray();
    }

    /** Set of all auto-discovered signals from @Signal annotations */
    Set<AutoDiscoveredSignal> autoSig;
    /**
     * Set of all java Reflection objects that we've analyzed for whether they
     * have @Signal annotation or not In the event that two objects reference each
     * other, this should help break an infinite-recursion case, since each unique
     * object only needs to be checked once.
     */
    Set<Object> checkedObjects;

    /**
     * Recursively-called signals-finding function. Starting at some object `root`
     * it traverses each field (ie, variable or object or whatever) declared withing
     * the class of that object, finds the objects of each of those fields, and does
     * none of two things: 1) Check if it's annotated to be a signal 2) Otherwise,
     * call the function recursively on the new "child" object. Recursion stops if
     * we hit #1, or if the object's class is not "frc.robot" - this should help
     * keep search time reasonable, since this happens at runtime at robot init.
     * Note this should NOT be called at periodic runtime.... because a) it's not
     * tested that way and b) recursion.
     * 
     * @param root
     * @param prefix
     */
    public void findAllAnnotatedSignals(Object root, String prefix) {
        Class rootClass = root.getClass();
        Package rootPkg = rootClass.getPackage();

        if (rootPkg != null && rootPkg.toString().contains("frc.robot")) {
            // If we've got a valid package name inside of frc.robot, go through all the
            // fields in the associated class.
            for (Field field : rootClass.getDeclaredFields()) {

                // As we recurse, keep track of the full-name for the object as a "."-separated
                // path of sorts.
                String newName = prefix + (prefix.length() > 0 ? "." : "") + field.getName();

                if (field.isAnnotationPresent(frc.lib.Signal.Annotations.Signal.class)) {
                    // Case #1 - we found a @signal annotation - create a new AUtoDiscoveredSignal
                    frc.lib.Signal.Annotations.Signal ann = field
                            .getAnnotation(frc.lib.Signal.Annotations.Signal.class);
                    autoSig.add(new AutoDiscoveredSignal(field, root, newName, ann.units()));

                } else {
                    // No signal annotation - we should see if we can recurs on the object
                    // associated with this field
                    // First attempt to get the object and make it accessable.
                    Object childObj = null;
                    try {
                        field.setAccessible(true);
                        childObj = field.get(root);
                    } catch (IllegalAccessException e) {
                        // Not 100% sure how this could get thrown. If so, print a warning, but move on
                        // without error.
                        System.out.println("WARNING: skipping " + field.getName());
                        System.out.println(e);
                    }

                    if (childObj != null && !checkedObjects.contains(childObj)) {
                        checkedObjects.add(childObj);
                        findAllAnnotatedSignals(childObj, newName);
                    } // else, we either couldn't get a reference to the object, or we already checked
                      // it - stop recursion
                }
            } // End FOR

        } // else, rootPkg wasn't in frc.robot - stop recursion
    }

}
