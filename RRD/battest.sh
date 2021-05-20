#!/bin/bash

gawk="/usr/bin/gawk"
sysctl="/home/pi/project/ADC/adcBat"
rrdtool="/usr/bin/rrdtool"

output=$($sysctl 2>>BobError.txt)
#output=$(cat DeltaData.txt)
echo $output
 temp=$(echo "$output" | $gawk '
        BEGIN {FS = "\t"} 
         {printf("%d:",systime())}
         {printf("%1.3f",$1)} 
        END {print " "}
        ')
#echo "temp= "
#echo $temp
#echo "Bob"
### change to the script directory
#cd /home/pi/RRD/Data


### update the database
$rrdtool update /home/pi/project/RRD/bat_volts.rrd --template DCV1 $temp


