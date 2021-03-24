# General

* Swap DAQ out with real NT4 interface
* Create calibration/NT4 interface class
* Pending Peter's dev schedule... write a JS NT4 client?

# Stripcharts

* color chooser support on plottedSignals
* save & restore chart/signal config to local storage
* save signal data to file
* better color coding & synchronization of "has data"/"selected"/"no-data" states between plottedSignal and selectableSignal.
  * Add state to the signal itself?
* Test/flesh-out signal unannounce behavior
  * signal should have an "is-announced" state which gets set to false on unannounce, but the object isn't removed (and all things that display the signal go to error state?)
* Y axis groupings like last time
  * Sync number of y axes across all plots
  * Same units signals auto-scale together
    * Update auto-scale logic to accept a "seed" min/max
  * Probably a new "valueAxis" class which is created new or 
* continue line drawing off end of chart (support very-high zoom levels).
* click-to-highlight plottedSignal (Selected vs. not state?)

# Data Logs

* Start it

# Calibration

* Start it

# Driver Dashboard

* Update js to source data from signal DAQ
* Java code to auto-generate the HTML/JS