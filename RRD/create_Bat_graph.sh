#!/bin/bash
#
## change directory to the rrdtool script dir
cd /home/pi/project/RRD
 
## Graph for last 24 hours 
/usr/bin/rrdtool graph bat_volt.png \
-w 785 -h 151 -a PNG \
--slope-mode \
--start -86400 --end now \
--font DEFAULT:7: \
--title "Bat Volts" \
--watermark "`date`" \
--vertical-label "DC Volts" \
--lower-limit 10 \
--upper-limit 20 \
--x-grid MINUTE:10:HOUR:1:MINUTE:120:0:%R \
--alt-y-grid --rigid \
DEF:pvdcv=bat_volts.rrd:DCV1:MAX \
LINE1:pvdcv#FF0000:"DC Volts" \
#GPRINT:pvdci1:MAX:" I Max\: %3.1lf" \
#GPRINT:pvdci2:MAX:" I Max\: %3.1lf" \
#COMMENT:"PV Array DC Volts\:" 
 
## copy to the web directory
 cp bat_volt.png /home/pi/project/public
#ls ./
