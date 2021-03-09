# Webserver 2.0 specificiation

🚧 this is a work in process! It relies on technologies not yet released. 

This specification document is designed to help organize thoughts as much as possible prior to starting software.

# Motivation

Casserole has had a large amount of success using a rio-based webserver environment to allow the software team to specify points where data needs to be read or written, and propagate that data to any client device which supports web browsing.

The current infrastructure has some threading-based issues, is entirely custom, and relies on a (fairly) convoluted data server mechanism to provide data in a queue format. Though field-proven, it has a number of flaws (including client-induced crashes, using strings as GUID's, duplicated logic on server and client side, incomplete deployment to driver view.... the list goes on).

[Network Tables V4](https://github.com/PeterJohnson/allwpilib/blob/nt4/ntcore/doc/networktables4.adoc) covers the main functionality our custom data server was implemented to accomplish, and is therefor provides a convenient point for us to rework our web interface around more standardized toolsets.

# Basic Specifications

## Server

Jetty shall be retained as the http server. Unneeded libraries (eg websockets and json processing) should be removed if not needed. Update all libraries to latest version.

## Transport Layer

NT4 is the chosen transport mechanism.

## Java Code Interface

### Signal

Signals are objects which track time-varying values inside robot code.

A variable may be annotated into a signal. The annotation should support user-defined custom namees and units, though it will default to deriving a name from the class structure (and default to an empty string for units).

Signals should cause two things to happen:

1) A specific entry in NT with the name, units, and value
2) A column in local .csv log files

Log file capture should happen the same way as it does today: methods are exposed to the user to indicate the start of teleop or autnonomous, or close the log out in disabled.

All signals should show up under a NT topic called `Signals`, so clients can find all possible signals with ease.

The server does not need to watch for value changes on either the name or units topics. Additionally, it does not need to scan for new signals being created by other clients.

### Calibration

Calibratinos are objects which represent values which are technically "constants" in software, but may be occassionally tuned by client programs. Timeouts and PID constants are common examples.

A variable may be annotated into a calibration. The annotation shoudl support user-defined custom name, units, min, and max. It should default to a name derived from the class structure, no units, and no range limits.

All calibrations should be first published under the topic `Calibrations`, so client programs can find them all easily. Client programs should only update the vlaue of existing calibrations, not attempt to create new ones themselves.

The server must watch all calibrations for changes to values and update the annotated variable.

MAYBE: The calibratino object should also be avaialble as a public class for the user to create, and register a callback function for consuming the new value?

## Client Content
