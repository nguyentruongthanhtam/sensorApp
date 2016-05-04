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
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var ip = "192.168.11.3";
var url = 'mongodb://'+ip+':27017/sensorApp';
var www = require('../bin/www');

console.log(www.io);
// www.io.on('connection',function(socket){
// 	socket.removeAllListeners();
// 	socket.on('connect',function(data){

// 		console.log('Connect state : ',data.state);
// 	});
// 	console.log("Device: "+tag.type+" with id of: "+tag.id+" connected !");
// 	enableIrTempMe();
// })
//---------------
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function getDayTime(gDate)
{
	var t = new Date();
		var h= addZero(t.getHours());
		var m= addZero(t.getMinutes());
		var s= addZero(t.getSeconds());
		var day = t.getDate();
		var month = t.getMonth()+1;
		var year = t.getFullYear();
		var fullTime = h + ":" + m + ":" + s ;
		var fullDate = day + "/" + month + "/" + year ;
		gDate.t=fullTime;
		gDate.d=fullDate;
		gDate.full = t.getTime();
		// console.log(fullTime);
		// console.log(fullDate);
}
//---------------
// listen for tags:
SensorTag.discover(function(tag) {


	// when you disconnect from a tag, exit the program:
	tag.on('disconnect', function() {
		console.log('disconnected!');
		process.exit(0);
	});

	function connectAndSetUpMe() {			// attempt to connect to the tag
     console.log('connectAndSetUp');
     tag.connectAndSetUp(enableIrTempMe);		// when you connect, call enableIrTempMe
   
   }

   function enableIrTempMe() {		// attempt to enable the IR Temperature sensor
     console.log('enableIRTemperatureSensor');
     // when you enable the IR Temperature sensor, start notifications:
     // tag.enableIrTemperature();
     tag.enableHumidity(tag.enableLuxometer(tag.enableAccelerometer(notifyMe)));
     

   }

	function notifyMe() {
		console.log('Services have started !...');
		console.log('Humidity sensor Enabled !...');
		console.log('Temperature sensor Enabled !...');
		tag.unnotifySimpleKey();
		tag.notifyHumidity(listenForHumidity);
		console.log('Luxometer has started!...');
		tag.notifyLuxometer(listenForLuxometer);

		console.log('Accelerometer has started!...');
		tag.notifyAccelerometer(listenForAccelerometer);
   }
   function listenForAccelerometer(){
   		// Listen for Luxometer 
   		tag.on('accelerometerChange', function(x, y, z){
   			console.log('x: ',x.toFixed(1));
   			console.log('y: ',y.toFixed(1));
   			console.log('z: ',z.toFixed(1));
   			module.exports.acc = x.toFixed(1) +" "+ y.toFixed(1)+ " " + z.toFixed(1);
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



   // When you get an accelermeter change, print it out:
	function listenForTempReading() {
		tag.on('irTemperatureChange', function(objectTemp, ambientTemp) {
	     console.log('\tObject Temp = %d deg. C', objectTemp.toFixed(1));
	     console.log('\tAmbient Temp = %d deg. C', ambientTemp.toFixed(1));
	     

	   });
	}
	var gDate ={d:"",t:"",full:""};
   	getDayTime(gDate);
   	console.log(gDate.t + "......." + gDate.d);
   	MongoClient.connect(url, function(err, db)
			 {
				assert.equal(null, err);
   				db.createCollection(gDate.d,function(err,result)
					{
						if(err)
							console.log("");
					});
   			});
	function listenForHumidity() {
		tag.on('humidityChange', function(temperature, humidity) {
	     console.log('\tTemperature = %d deg. C', temperature.toFixed(1));
	     console.log('\tHumidity = %d %H', humidity.toFixed(1));
	     module.exports.temp= temperature.toFixed(1);
	     module.exports.humi= humidity.toFixed(1);
	     var intemp = temperature.toFixed(1);
	     var inhumid = humidity.toFixed(1);
	     getDayTime(gDate);
	     console.log(gDate.t);
		// ---------------------------
		var insertDocumentExplicit = function(db,callback) {	
		db.collection(gDate.d).insert
		({
			  	"time": gDate.t,
		  		"temp": intemp,
		  		"humi": inhumid
		}, function(err,result) 
			{
				assert.equal(err, null);
				if(err)
					console.log("There is an error");
				callback(result);
			});
		};		
			MongoClient.connect(url, function(err, db)
			 {
				assert.equal(null, err);
				insertDocumentExplicit(db,function(){
					db.close();
				});	
			});

	   });
	}
	// when you get a button change, print it out:
	function listenForButton() {
		tag.on('simpleKeyChange', function(left, right) {
			
			if (left) {
				console.log("Device: "+tag.type+" with id of: "+tag.id+"\n");
				console.log('left button PRESSED!');
			}
			if (right) {
				console.log("Device: "+tag.type+" with id of: "+tag.id+"\n");
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
			www.io.on('connection',function(socket){
			socket.removeAllListeners();
			socket.on('custom',function(data){
			// console.log('Connect state : ',data.status);
				if(Number(data.status)==1)
				{
				 	enableIrTempMe();// connected signal
				 	module.exports.sta= data.status; // connected state
				}
				else
				{
					module.exports.sta= data.status; // initial state
				}
				console.log("Connection status: ",data.status);
			});

		});
        	console.log("Sensor Type: ",tag.type);
        	console.log("Sensor ID: ",tag.id);
        	module.exports.type= tag.type;
     		tag.notifySimpleKey(listenForButton); // start the button listener);   	
        });
	 
	
});
