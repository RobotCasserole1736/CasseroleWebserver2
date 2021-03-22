# General

* Swap DAQ out with real NT4 interface
* Create calibration/NT4 interface class
* Pending Peter's dev schedule... write a JS NT4 client?

# Stripcharts

* vertical cursor (synced) support
* Synced zoom/pan
* color chooser support on plottedSignals
* plotted Signal default colors from reasonable palate
* save & restore chart/signal config to local storage
* save signal data to file
* scroll-wheel zoom support
* better color coding & synchronization of "has data"/"selected"/"no-data" states between plottedSignal and selectableSignal.
  * Add state to the signal itself?
* Investigate custom svg-based chart drawing (seeing if we can improve framerate)
* Test/flesh-out signal unannounce behavior
  * signal should have an "is-announced" state which gets set to false on unannounce, but the object isn't removed (and all things that display the signal go to error state?)

# Data Logs

* Start it

# Calibration

* Start it

# Driver Dashboard

* Update js to source data from signal DAQ
* Java code to auto-generate the HTML/JS