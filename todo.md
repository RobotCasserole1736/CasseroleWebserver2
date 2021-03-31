# General

* Swap DAQ out with real NT4 interface
* DAQ equivalent for files?
* Create calibration/NT4 interface class
* Pending Peter's dev schedule... write a JS NT4 client?

# Stripcharts

* color chooser support on plottedSignals
* save signal data to file
* better color coding & synchronization of "has data"/"selected"/"no-data" states between plottedSignal and selectableSignal.
  * Add state to the signal itself?
* Test/flesh-out signal unannounce behavior
  * signal should have an "is-announced" state which gets set to false on unannounce, but the object isn't removed (and all things that display the signal go to error state?)
* continue line drawing off end of chart (support very-high zoom levels).

# Data Logs

* Start it

# Calibration

* Start it

# Driver Dashboard

* Update js to source data from signal DAQ
* Java code to auto-generate the HTML/JS

# Backend

* Add Signals

* Add calibration

* Add signal logging
