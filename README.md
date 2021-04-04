# Remote-antenna-Management
This project was the result of my station being in a separate building to my antenna base.  They are connected by one single 50 ohm coax cable.

The project hardware consisted of a raspberry pi zerow, a gpio header breakout pcb, a pca9685 servo driver card, and a ADS1115 adc module.  Both of these are driven from the i2c buss.

The software uses the node-js software to allow the pi zero to serve a web page to enable the control of the antenna switching and the control of various antenna tuners.  The first of these is based on a ww2 AT21 atu which makes possible a wide range of matches.  this is made possible using servo motors to control the HV capacitors and switches.  Because of the design range of matches both high voltages and high currents are possible.  These settings may not be very efficient but better a match than not for most modern PAs.

The pi zero joins my local wifi network and serves the control web page to the client device.

This is still a work in progress.
