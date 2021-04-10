# General

* Swap DAQ out with real NT4 interface
* Pending Peter's dev schedule... write a JS NT4 client?

# Stripcharts

* save signal data to file
* better color coding & synchronization of "has data"/"selected"/"no-data" states between plottedSignal and selectableSignal.
  * Add state to the signal itself?
* Test/flesh-out signal unannounce behavior
  * signal should have an "is-announced" state which gets set to false on unannounce, but the object isn't removed (and all things that display the signal go to error state?)
* continue line drawing off end of chart (support very-high zoom levels).
* Add modes to load data file from RIO or from local disk

# Data Logs

# Calibration

* Add cal save/load to file

# Driver Dashboard

* Add animatino to keep updates smooth, even if data comes in slow.
* Redraw Icon files

# Backend

* Annotation-based calibrations

