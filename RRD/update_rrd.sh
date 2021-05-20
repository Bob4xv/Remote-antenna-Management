#!/bin/bash
 
gawk="/bin/gawk"
sysctl="/home/fc007/workspace/Delta/DeltaSerialTest/Debug/DeltaSerialTest"
rrdtool="/usr/local/bin/rrdtool"
#cat tempx.txt  
#health_info() {
#    local output=$($sysctl 2>&1)  
#    local output=$(cat temp1 2>&1)
#    local temp=$(echo "$output" | $gawk '
/home/fc007/workspace/Delta/DeltaSerialTest/Debug/DeltaSerialTest | $qawk '
        BEGIN {FS = "\t"} 
        /Delta 5 data/ {printf("%d:",systime())}
        / DC V1/ {printf("%1.3f:",$3)}
        END {print " "}
        '
#print(temp)
#    RETURN_VALUE=$temp
#}
  
### change to the script directory
# cd ~/tools/rrdtool/Delta5

### collect the data
#health_info
#printf("%s ",$temp)
### update the database
# $rrdtool update health_db.rrd --template MbTemp:CpuTemp:CpuFan:PSFan:VCore:Plus12V:Plus3V:Plus5V:Neg12V:CpuSpeed:LoadAvg N:$RETUR



