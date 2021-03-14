# Webserver 2.0 specificiation

🚧 this is a work in process! It relies on technologies not yet released. 

This specification document is designed to help organize thoughts as much as possible prior to starting software.

Question: Is "Webserver" a valid name for this thing? It's more of a full development suite. TODO: make some good class names for how this gets exposed to the user.

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

A variable may be annotated into a calibration. The annotation shoudl support user-defined custom name, units, min, and max. It should default to a name derived from the class structure, no units, and no range limits. The variable's value at annotation evaluation time may be used as the default value.

All calibrations should be first published under the topic `Calibrations`, so client programs can find them all easily. Client programs should only update the vlaue of existing calibrations, not attempt to create new ones themselves.

The server must watch all calibrations for changes to values and update the annotated variable.

MAYBE: The calibratino object should also be avaialble as a public class for the user to create, and register a callback function for consuming the new value?

NOTE: The save-to-file functionality has been removed from scope.

## Client Content

Clients will be presented a similar set of pages to what is displayed today.

### Index Page

Should have links to all other pages, and basic info about the build and deploy to help uniquely (as much as possible at least) identify what software is running.

### Stripchart

1 or more highcharts plots with X axis linked. +/- buttons to increase or decreases the number of plots.

Sidebar flyout menu with all possible signals? Or dedicated "add" menu per stripchart?

Dedicated left-hand chunk (ATI Style) with signal color, name, and value under cursor.

Cursors synced between all charts.

Start/stop buttons to change whether the stripchart is gathering data or not. While running, stripchart should use the logging style in NT4 to get all samples from just the relevant topics in NT.

![ATI Style](https://user-images.githubusercontent.com/4583662/110501823-31a67200-80c0-11eb-8f13-abdb580ccb51.png)

### Logs

Serve a table of all saved .csv files on the roboRIO.

Sortable by date/time or match/event/etc.

TODO: maybe use QuestDB? [Java docs here](https://questdb.io/docs/reference/api/java-embedded/)

show file size

Download or Delete options per individual log

Download-all-as-zip or delete-all (with modal confirmation) options

Log data structure under topic `logfiles` in NT - mostly string data probably?

Show current status (logging, inactive, current filename, length...)

Maybe: a way to view these online? Write the stripchart viewer to be able to show both?

### Dashboard

This page is an alternate way to view specific values, presented in a formant easily viewable in a during-match environment. Only a small number of signals will be present, and should prioritize getting info as fast as possible. 

In user code, widgets get defined at init time, and users have the ability to change their displayed values.

This should create a special `dashboard` topic in NT with enough info to describe the values of each widget.

Allow for free-form placement of widgets. Percentage-based size (1.0 = suggested, multiplier to scale up and down)

Allow for custom background image.

Dashboard HTML will be dynamically generated based on java code configuration... maybe JS too.

Most widgets will be instantiated in java code with a reference (either by name or by object) to the Signal they're associated with.

The following "widgets" are allowed for displaying information:

#### Circular Gauge

Configurable min acceptable, max acceptable.

Display shoudl show title, typed out value, and color-coding to indicate if the value is in the 'acceptable" range.

#### Line Gauge

Configureable min acceptable, max acceptable

Display should show title, typed out value, color coding.

#### Icon

light, turns on and off.

Color coded, allow for red/green/yellow 

Possible - support on/off images to do line-art? Support alpha-channel.

#### Text 

has a title, and displays arbitrary text. 

#### Autonomous Chooser

Special case - Takes in the following:

Calibration Reference - "Desired" auto routine - integer
Signal Reference - "Actual" auto routine - integer

Some mapping of strings to integers to have nice human names for the autonomous routines

Uses that mapping to display everything nicely to thhe user

#### Cameras

Special case: takes in either a raw string for the URL to the camera stream, or some CameraServer reference info to derive the reference string from NT.

Should be able to full-screen. Config for client-side rotation? Client-side cursor overlay (needs additional signal input config)?

#### Stylistic Inspiration

![this guy](https://preview.redd.it/mu52tfn61xl61.jpg?width=4032&format=pjpg&auto=webp&s=d86192692948678f1246d434967b2cafd4b13cdf)

![another dude](https://user-images.githubusercontent.com/4583662/110501245-97dec500-80bf-11eb-8d27-d537a1436cc9.png)

Use google Michhroma font? Need local download for .tff file - https://fonts.google.com/specimen/Michroma?preview.text_type=custom 

### Signals

This is mostly a quick-debug view. It should display a flat, alphabetized list of all signals, filterable, with name, units, and value displayed. It should get updated at a modest rate so as to not bog down network traffic - 100ms maybe to start.

Its main purpose is to provide developers an at-a-glance way to see signal values. 

Its value is debatable - outline viewer might also suit this well?

### Calibration

This page is a filterable table of all possible calibrations with name, units, min, max, and default listed out. Users should be allowed to enter a new value by typing it in, and hitting an "apply" button. A "Reset" button should revert to the default value. Changed values should be highlighted with a different color row.

## Java Class Structure

* `WebServer2` - top level wrapper around jetty to serve all HTML/css/js
* `Signal` - recieves timesamped samples, forwards to NT4 and to a queue for local logging.
  * `AnnotationSignal` - wrappers signal with additional data needed for supporting annotations
* `Calibration` - Goes between users code and NT4 for calibration type objects
  * `AnnotationCalibration` - wrappers calibration with additional data needed for supporting annotations
* `SignalBank` - singleton to hold all signals in code, and perform actions on all signals (sample all, .... maybe that's it)
* `CalibrationBank` - singleton to hold all calibrations in code
* `Dashboard` - top-level config for driver dashboard. Singleton. Must have a way to accept widgets
  * `LineGaugeWidget`, `CircularGaugeWidget`, `IconWidget`, `TextWidget`, etc. per individual widget
  * Each should auto-register with the Dashboard singleton on instantiation

