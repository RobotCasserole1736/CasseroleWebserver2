# Casserole Webserver 2.0

Webserver 2.0 builds on previous implementations of website and websocket data transport software components [designed to facilitate easy robot development workflows](https://trickingrockstothink.com/blog_posts/2020/05/05/data_acq.html).

See [the spec](spec.md) for more info.

This is a work in process.

# Back-End

NT4 - coming soon!

No web development required. Visual appearance & configuration done from Java user code.

# Front-End

HTML5/JS, served from the roboRIO. No tools to install. Cross-platform (including tablets & mobile devices). Interfaces automatically scale to available view area.

## Dashboard

![Super cool dashboard demo](doc/dashboard.gif)

* Driver-Focused - At-A-Glance robot state notification
* ISO-like iconography
* Animation to keep visualization smooth even at slow data rates.
* Webcam Display, including fullscreen
* Autonomous chooser

## Stripcharts

![Super cool stripcharts demo](doc/stripcharts.gif)

 * Multi-Chart time-axis synchronized zoom & pan.
 * Flexible Capture/display lists
 * Saves current configuration to local storage for easy recall on page reload
 * Same-units plotted on same-y-axis
 * Load data from file or view live from RIO.

## Calibration

![Super cool calibrations demo](doc/calibrations.gif)

 * Configurable min/max/default constraints
 * Coming soon: Save/Load reporting

## Data Logs

![Super cool log files demo](doc/logfiles.png)

 * View log files present on RIO
 * Download & Delete operations
 * View current logging status (actively creating new log, idle, etc.)

## Build Info

![Super cool build info demo](doc/buildinfo.png)

* View gradle & git generated info at build time
* Helps uniquely identify the software version running on the RIO
