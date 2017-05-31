/*
	sensorTag IR Temperature sensor example

	This example uses Sandeep Mistry's sensortag library for node.js to
	read data from a TI sensorTag.

	Although the sensortag library functions are all asynchronous,
	there is a sequence you need to follow in order to successfully
	read a tag:
		1) discover the tag
		2) connect to and set up the tag
		3) turn on the sensor you want to use (in this case, IR temp)
		4) turn on notifications for the sensor
		5) listen for changes from the sensortag

	This example does all of those steps in sequence by having each function
	call the next as a callback. Discover calls connectAndSetUp and so forth.

	This example is heavily indebted to Sandeep's test for the library, but
	achieves more or less the same thing without using the async library.

	created 15 Jan 2015
	modified 7 April 2015
	by Tom Igoe
*/

var async = require('async');
var SensorTag = require('sensortag');// sensortag library

// listen for tags:
var status=0;
var tOn,hOn,lOn,gOn;
SensorTag.discover(function(tag) {


	// when you disconnect from a tag, exit the program:
	tag.on('disconnect', function() {
		console.log('disconnected!');
		module.exports.dis = 1;
		process.exit(0);
	});

	function disconnectTag()
	{
		tag.on('disconnect', function() {
		console.log('disconnected!');
		module.exports.dis = 1;
		process.exit(0);
	});
	}
	function connectAndSetUpMe() {			// attempt to connect to the tag
     console.log('connectAndSetUp');
     tag.connectAndSetUp(enableIrTempMe);		// when you connect, call enableIrTempMe

   }

   function enableIrTempMe(tempON,humiON,luxON,gyroON) {		// attempt to enable the IR Temperature sensor
     // console.log('enableIRTemperatureSensor');
     // when you enable the IR Temperature sensor, start notifications:
     // tag.enableIrTemperature();
     if(tempON)
		{
			console.log("Temperature sensor is enabled!");
			tag.enableIrTemperature();
		}
		if(humiON)
		{
			console.log("Humidity sensor is enabled!");
			tag.enableHumidity();
		}
		if(luxON)
		{	
			console.log("Luxometer sensor is enabled!");
			tag.enableLuxometer();
		}
		if(gyroON)
		{
			console.log("Gyroscope sensor is enabled!");
			tag.enableGyroscope();
		}
     

   }
	 function disableSensors() {		// disable all sensors
     tag.disableHumidity(tag.disableLuxometer(tag.disableIrTemperature(tag.disableGyroscope())));
		 console.log("Disable all sensors!!!");
		 tag.disconnect();
		 // disconnectTag();
   }
	function notifyMe(tempON,humiON,luxON,gyroON) {
		console.log('Sensor '+tag.type+' is connected!');
		console.log('Device\'s ID detected: '+tag.id);
		console.log('--------------------------------');
		console.log('Services have started !...');
		console.log('Humidity sensor Enabled !...');
		console.log('Temperature sensor Enabled !...');
		console.log('Luxometer sensor Enabled!...');
		console.log('--------------------------------');
		console.log('--------------------------------');
		console.log('');
		tag.unnotifySimpleKey();
		if(tempON)
		{
			tag.notifyIrTemperature(tag.setIrTemperaturePeriod(1000,listenForTempReading));
		}
		if(humiON)
		{
			tag.notifyHumidity(tag.setHumidityPeriod(1000,listenForHumidity));
		}
		if(luxON)
		{	
			tag.notifyLuxometer(tag.setLuxometerPeriod(1000,listenForLuxometer));
		}
		if(gyroON)
		{
			tag.notifyGyroscope(tag.setGyroscopePeriod(1000,listenForGyroscope));
		}
		// console.log('Accelerometer sensor Enabled!...');
		// tag.notifyAccelerometer(tag.setAccelerometerPeriod(1000, listenForAccelerometer));

   }
   function listenForAccelerometer(){
   		// Listen for Luxometer
   		tag.on('accelerometerChange', function(x, y, z){
   			console.log('Accelerometer:');
   			console.log('x: ',x.toFixed(1));
   			console.log('y: ',y.toFixed(1));
   			console.log('z: ',z.toFixed(1));
   			module.exports.acc = x.toFixed(1) +" | "+ y.toFixed(1)+ " | " + z.toFixed(1);
   			// module.exports.acc = (Number(x.toFixed(1))+ Number(y.toFixed(1))+ Number(z.toFixed(1))).toFixed(1);
   		});


   	}
   function listenForLuxometer(){
   		// Listen for Luxometer
   		tag.on('luxometerChange', function(lux){
   			console.log('lux value = ',lux);
   			module.exports.lux = lux.toFixed(1);
   		});
   }

   function listenForGyroscope(){
   		// Listen for Luxometer
			var tempX,tempY,tempZ,state;

   		tag.on('gyroscopeChange', function(x,y,z){
   			console.log('Gyroscope:');
   			console.log('x: ',x.toFixed(1));
   			console.log('y: ',y.toFixed(1));
   			console.log('z: ',z.toFixed(1));

   		module.exports.gyro = x.toFixed(1) +" | "+ y.toFixed(1)+ " | " + z.toFixed(1);
				if(x.toFixed(1)-tempX>0.8)
				{
					state = 1;
				}
				// else if (x.toFixed(1)-tempX<-0.6) 
				// {
				// 	state = 2;
				// }
				else 
				{
					state = 0;
				}
				module.exports.state = state;
				tempX = x.toFixed(1);
				tempY = y.toFixed(1);
				tempZ = z.toFixed(1);
   		});
   }

   // When you get an accelermeter change, print it out:
	function listenForTempReading() {
		tag.on('irTemperatureChange', function(objectTemp, ambientTemp) {
	    console.log('\tObject Temp = %d deg. C', objectTemp.toFixed(1));
	    console.log('\tAmbient Temp = %d deg. C', ambientTemp.toFixed(1));
	    var intemp = ambientTemp.toFixed(1);
	    module.exports.temp= ambientTemp.toFixed(1);
	   });
	}


   	// Get data from Humidity Sensor ( + Temperature )
	function listenForHumidity() {
		tag.on('humidityChange', function(temperature, humidity) {
	     console.log('\tTemperature = %d deg. C', temperature.toFixed(1));
	     console.log('\tHumidity = %d %H', humidity.toFixed(1));
	     module.exports.humi= humidity.toFixed(1);
	     var intemp = temperature.toFixed(1);
	     var inhumid = humidity.toFixed(1);
	   });
	}
	// when you get a button change, print it out:
	function listenForButton() {
		tag.on('simpleKeyChange', function(left, right) {
			console.log("Device: "+tag.type);
			console.log("Device ID: "+tag.id);
			if (left) {
				console.log('left button PRESSED!');
			}
			if (right) {
				console.log('right button PRESSED!');
			}
			// if both buttons are pressed, disconnect:
			if (left && right) {
				console.log("Device: "+tag.type+" with id of: "+tag.id+" connected !");
				enableIrTempMe();
				// tag.disconnect();

			}
	   });
	}

	// Now that you've defined all the functions, start the process:
	tag.connectAndSetUp(
		function(){
			var intervalID=setInterval(function()
			{
					// console.log("Check status: ",status);
							if(status==1)
							{
								notifyMe(tOn,hOn,lOn,gOn);
							 	enableIrTempMe(tOn,hOn,lOn,gOn);// connected signal
								clearInterval(intervalID);
								var secondIntervalID = setInterval(function(){
									if(status == 2)
									{
										disableSensors();
										clearInterval(secondIntervalID);
									}
								},1000);
							}				
			},1000);
        	console.log("Sensor Type: ",tag.type);
        	console.log("Sensor ID: ",tag.id);
			module.exports.sta = status;
        	module.exports.type= tag.type;
			tag.notifySimpleKey(listenForButton); // start the button listener);
        });

});
	module.exports= function(s,tempOn,humiOn,luxOn,gyroOn)
{
	status=s;
	tOn = tempOn;
	hOn = humiOn;
	lOn = luxOn;
	gOn = gyroOn;
	
	
}
	