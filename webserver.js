var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var rpio= require('rpio');
var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
var publicDir = require('path').join(__dirname,'/public');

//app.use(express.static(publicDir));
const I2C = require('raspi-i2c').I2C;
const ADS1x15 = require('raspi-kit-ads1x15');
const {exec}= require("child_process");
const bat_scalefactor = 6.8238;
var batVolts = 0;
var ant =0;
var cap1 =500;
var cap2 =500;
var lswitch =0;
var serpar =1500;
var cinp =0;
var freq =0;

    // Init Raspi-I2c
    const i2c = new I2C();
    
    // Init the ADC
    const adc = new ADS1x15({
        i2c,                                    // i2c interface
        chip: ADS1x15.chips.IC_ADS1015,         // chip model
        address: ADS1x15.address.ADDRESS_0x48,  // i2c address on the bus
        
        // Defaults for future readings
        pga: ADS1x15.pga.PGA_4_096V,            // power-gain-amplifier range
        sps: ADS1x15.spsADS1015.SPS_250         // data rate (samples per second)
    });

function bat_update(){
    // Get a single-ended reading from channel-0 and display the results
    adc.readChannel(ADS1x15.channel.CHANNEL_0, (err, value, volts) => {
        if (err) {
            console.error('Failed to fetch value from ADC', err);
            process.exit(1);
        } else {
        volts = volts.toFixed(3);
//            console.log('Channel 0');    // will be a 11 or 15 bit integer depending on chip
//            console.log(' * Volts:', volts);    // voltage reading factoring in the PGA
            batVolts = volts*bat_scalefactor;	// scale for voltage divider.
            batVolts = batVolts.toFixed(3);
            console.log('ADC Battery Volts:', batVolts);    // voltage reading factoring in the PGA
        }
    });
  }


var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
};

pwm = new Pca9685Driver(options, function(err) {
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }
    console.log("Initialization done");

    // Set channel 0 to turn on on step 42 and off on step 255
    // (with optional callback)
//    pwm.setPulseRange(0, 42, 255, function() {
//        if (err) {
//            console.error("Error setting pulse range.");
//        } else {
//            console.log("Pulse range set.");
//        }
//    });
});

io.on('connection', (socket) => { // WebSocket Connection
  socket.on('ant select',(data) => {
  var antvalue = 0; //static variable for current status
    antvalue = data;
    resetgpio();
      console.log("Antenna sel %s",antvalue);
    if (antvalue == 1) {
      rpio.write(16,0); //turn LED on or off
    }
    if(antvalue==2) {
    rpio.write(18,0);
    }
    if(antvalue==3) {
    rpio.write(22,0);
    }
//    if(antvalue==4) {	// in use for cinp
//    rpio.write(7,0);
//    }
    ant = antvalue;
  });
  
  socket.on('servo pos',(num,pos) => {
  console.log("Setting servo num %s pos %s",num,pos);
  pos = Math.round(pos);		//need number for setservo 
    setservo(num,pos);
    if(num == 0) {cap1 = pos; }
    if(num == 1) {cap2 = pos; }
  });
  
  socket.on('servo switch',(num,position) => {
  var angle =[650,950,1150,1370,1620,1870,2050,2270,2450];
  setservo(num,angle[position]);
      lswitch = position;
  });
  
  socket.on('serpar',(num,pos) => {
  if(pos=='0'){usec=1300;}
  if(pos=='1'){usec=1700;}
//  else usec=1500;
  setservo(num,usec);
      serpar = pos;
  });

  socket.on('freq ch',(num) => {
  freq = num;
  console.log('Freq change= %d',num);
  });
 
  socket.on('input cap',(num,state) => {
    if (state == 0) {
      rpio.write(num,0); //turn LED on or off
    }
    if(state==1) {
    rpio.write(num,1);
    }
   console.log('Input Cap GPIO %s state %d',num,state);
   cinp = state;
  });

  socket.on('batupdate',(num) => {
//  batVolts=num;
//  update_batVolts();
  bat_update();
  console.log('Socket Bat Update %s',batVolts);
  socket.emit('adc Bat',batVolts);  
  });
  
  socket.emit('init all',freq,ant,cap1,cap2,lswitch,serpar,cinp);
});

resetgpio();		// Init all gpio points.
initservo();		// and servos 0-3
readstate();		// read last state
setstate();		// set gpio to saved state
//update_batVolts();	// get battery status
bat_update();	// get battery volts

http.listen(8080); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    console.log('Load index.html');
    return res.end();
    });
}

/*
 * Set the initial state to high.  The state is set prior to the pin
 * being actived, so is safe for devices which require a stable setup.
 */
process.on('SIGINT', function () { //on ctrl+c
  savestatus();	//save current settings
   resetgpio();
    pwm.dispose();   // stop pwm
process.exit(); //exit completely
  });

function resetgpio() {
   rpio.open(16, rpio.OUTPUT, rpio.HIGH);
   rpio.open(18, rpio.OUTPUT, rpio.HIGH);
   rpio.open(22, rpio.OUTPUT, rpio.HIGH);
   rpio.open(7, rpio.OUTPUT, rpio.HIGH);
 }

function initservo() {
var x = 0;
setTimeout(function(){ x.value="2 seconds" }, 2000);
  for(i=0; i<=3; i++) {
    pwm.setPulseRange(i, 500, 2500, function(err) {
        if (err) {
            console.error("Error setting pulse range.");
        } else {
           // console.log("Pulse range set.");
        }
    });
  }
    console.log('Pulse range set');
}

function savestatus() {
var currentstate = [freq,ant,cap1,cap2,lswitch,serpar,cinp];
fs.writeFileSync('AtuState.txt', currentstate, err => {
  if (err) {
    console.error(err)
    return
  }
  console.log('Current state saved\n');

  })
}

function readstate() {
try {
  var data = fs.readFileSync('AtuState.txt', 'utf8')
//  console.log(data);
  arr=data.split(",");
  freq = arr[0];
  ant = arr[1];
  cap1 = arr[2];
  cap2 = arr[3];
  lswitch=arr[4];
  serpar=arr[5];
  cinp=arr[6];
//  console.log("freq=%s ant=%s C1=%s C2=%s lsw=%s S/P=%s Cin=%s",freq,ant,cap1,cap2,lswitch,serpar,cinp);
  } catch (err) {
  console.error(err)
  }
}
function setstate() {

    if (ant == 1) {
      rpio.write(16,0); //turn LED on or off
    }
    if(ant == 2) {
    rpio.write(18,0);
    }
    if(ant == 3) {
    rpio.write(22,0);
    }
    if(cinp == 0){
    rpio.write(7,0);
    }
}

function setservo(num,pos) {
  pwm.setPulseLength(num,pos,0, function(err){
        if (err) {
            console.error("Error setting pulse range.");
        } else {
            console.log("Servo %s %d",num,pos);
        }
    }); 
}

/*
// Battery volts now comes from the last update tothe RRD database.
function update_batVolts() {
//var temp
let temp =  exec("./RRD/lastrrd.sh", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }

//        var temp = ('${stdout}');
//      temp = (16);
//      (console.log(`update_batVolts:${stdout}`));
//      BatVolts = $(console.log(`${stdout}`));
    });
    temp = temp.stdout.pipe(process.stdout);
//    temp = sed -n {'$'}p {temp};
return(temp);
//return  ( childProcess.stdout.pipe(process.stdout));
//console.log('Temp= %s',process.stdout);
}
*/
