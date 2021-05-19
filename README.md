# Remote-antenna-Management
This project was the result of my station being in a separate building to my antenna base.  They are connected by one single 50 ohm coax cable.

The project hardware consisted of a raspberry pi zerow, a gpio header breakout pcb, a pca9685 servo driver card, and a ADS1115 adc module.  Both of these are driven from the i2c bus.

The software uses the node-js software to allow the pi zero to serve a web page to enable the control of the antenna switching and the control of various antenna tuners.  The first of these is based on a ww2 AT21 atu which makes possible a wide range of matches.  this is made possible using servo motors to control the HV capacitors and switches.  Because of the design range of matches both high voltages and high currents are possible.  These settings may not be very efficient but better a match than not, for most modern PAs.

The pi zero joins my local wifi network and serves the control web page to the client device.  The initial stage is one that can select 1 of 3 antennas or a dummy load.  The first stage we have only one ATU of the pi coupler design style, as above which uses servo motors to control the capacitors and inductor switches. One relay gpio output is used to control the size of the input capacitor.  The installation is powered by a solar panel and a lipo battery. This required a battery monitoring package which was implemented using the RRDtools package (Round Robin Database) and cron jobs to read the battery package voltage every 1 minute and produce a graph of the results for the last 24 hours every 15 mins.


This is still a work in progress.
