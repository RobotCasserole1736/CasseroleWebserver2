# General

* NT4 signals - move to having the interface .js file maintain the master list of cals/signals and manipulate them as things are announced. Separately, update plotter pages to interact directly with the list in the interface.
* Increase topic flexibility to parse out any number into the correct type

# Stripcharts

* save signal data to file
* better color coding & synchronization of "has data"/"selected"/"no-data" states between plottedSignal and selectableSignal.
  * Add state to the signal itself?
* Test/flesh-out signal unannounce behavior
  * signal should have an "is-announced" state which gets set to false on unannounce, but the object isn't removed (and all things that display the signal go to error state?)
* continue line drawing off end of chart (support very-high zoom levels).
* middle click does scroll and remove, should ignore default

# Data Logs

* Add support to plot text values too (enum? in datatype?)

# Calibration

* Add cal save/load to file

# Driver Dashboard

* Config autonomous mode names by string array topic
* Configurable aspect ratio

# Outline Viewer

* Sort by column headings - https://www.w3schools.com/howto/howto_js_sort_table.asp
* more spacing, better row highlight
* color-highlight changing values


# Backend

* Annotation-based calibrations
* Make the topic type more specific to @Signal variable getting annotated (string/bool/etc.)

