### change to the script directory
cd /home/pi/project/RRD

rrdtool create bat_volts.rrd \
--start 1619485260 \
--step 60 \
DS:DCV1:GAUGE:120:0:100 \
RRA:MAX:0.5:1:1500 