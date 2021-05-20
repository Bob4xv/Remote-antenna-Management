#!/bin/bash
#
# tool to get last stroed battery volts form RRD file
#
BatVolts=$(rrdtool lastupdate /home/pi/project/RRD/bat_volts.rrd | sed ':a;N;$!ba;s/.*: \([0-9]*\)/\1/g')
echo $BatVolts
#export BatVolts
#rrdtool lastupdate /home/pi/project/RRD/bat_volts.rrd

