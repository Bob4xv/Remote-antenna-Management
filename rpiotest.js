var rpio = require('rpio');

/*
 * Set the initial state to high.  The state is set prior to the pin
 * being actived, so is safe for devices which require a stable setup.
 */
rpio.open(16, rpio.OUTPUT, rpio.HIGH);
rpio.open(18, rpio.OUTPUT, rpio.HIGH);
rpio.open(22, rpio.OUTPUT, rpio.HIGH);
rpio.open(7, rpio.OUTPUT, rpio.HIGH);

rpio.sleep(1);
rpio.write(16,rpio.LOW);
rpio.sleep(1);
rpio.write(18,rpio.LOW);
rpio.sleep(1);
rpio.write(22,rpio.LOW);
rpio.sleep(1);
rpio.write(7,rpio.LOW);
