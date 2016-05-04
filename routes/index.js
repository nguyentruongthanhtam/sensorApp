var express = require('express');
var Highcharts = require('highcharts');
var www = require('../bin/www');



// var sensorLib = require('sensortag');
// MongoDB Wired up
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var ip = "192.168.11.3";
var url = 'mongodb://'+ip+':27017/sensorApp';
// Jquery Wired up
var jsdom = require('jsdom').jsdom;
 var document = jsdom('<html></html>', {});
 var window = document.defaultView;
 var $ = require('jquery')(window);

var router = express.Router();
var intemp="TEMP OUTPUT";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',temp : intemp});
});
router.get('/userlist', function(req, res) {
	res.statusCode = 200;
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    MongoClient.connect(url,function(err,db){
		db.collectionNames(function(err, items) {
	  		console.log(items);
	        res.render('userlist', {
	        	"datelist" : items
	        	});
	   		});
    	
    });
    // var db = req.db;
    // db.collectionNames(function(err, items) {
	  	// 			console.log(items);
	   //      		res.render('userlist', {
	   //          		"datelist" : items
	   //      		});
	   // 			});
    // // var collection = db.collection("temp");
    // db.get('18/1/2016').find({},{},function(e,docs){
    //     res.render('userlist', {
    //         "userlist" : docs
    //     });
    // });
    
});

var output;
router.post('/chooseDate',function(req,res)
{

	if(typeof(req.body.dateForm)!="undefined")
	{	
		MongoClient.connect(url,function(err,db){
				res.statusCode=200;
				
				var collection=db.collection(req.body.dateForm);
				collection.find().toArray(function(err,items)
				{
					res.render('date',
					{
						"datelist":items,
						"day":req.body.dateForm
					});
					output = items;
					
  					//console.log(output);
				});	
   		 });

		// send data from Database to Date List Page to display in tables
		www.io.on('connection',function(socket)
		{
			socket.removeAllListeners();
    		socket.emit('date',{entry:output});
  		});
	}
	else
	{
		res.statusCode = 400;
	}
});

router.get('/newuser', function(req, res){
	res.render('newuser', { title: 'Add new User'});
	// set our internal BD variable
	res.statusCode = 200;
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var db = req.db;

	// Get our form values. These rely on the "name" attributes
	// var userName = req.body.usernam;
	// var userEmail = req.body.useremail;

	// set our collection
	

	// get data from DB
	db.get('temp').find({},{},function(e,docs){
        res.render('newuser', {
            "newuser" : docs
        });

        console.log(e);
    });



});
// --------Jquery


// ----------------

 module.exports = router;
// var SensorTag = require('sensortag');// sensortag library

// // listen for tags:
// SensorTag.discover(function(tag) {
// 	// when you disconnect from a tag, exit the program:
// 	tag.on('disconnect', function() {
// 		console.log('disconnected!');
// 		process.exit(0);
// 	});

// 	function connectAndSetUpMe() {			// attempt to connect to the tag
//      console.log('connectAndSetUp');
//      tag.connectAndSetUp(enableIrTempMe);		// when you connect, call enableIrTempMe
//    }

//    function enableIrTempMe() {		// attempt to enable the IR Temperature sensor
//      console.log('enableIRTemperatureSensor');
//      // when you enable the IR Temperature sensor, start notifications:
//      tag.enableIrTemperature(notifyMe);
//      tag.setIrTemperaturePeriod(1000);
//    }

// 	function notifyMe() {
//    	tag.notifyIrTemperature(listenForTempReading);   	// start the accelerometer listener
// 		tag.notifySimpleKey(listenForButton);		// start the button listener
//    }


//    var gDate ={d:"",t:""};
//    getDayTime(gDate);
//    console.log(gDate.t + "......." + gDate.d);
//    MongoClient.connect(url, function(err, db)
// 			 {
// 				assert.equal(null, err);
//    				db.createCollection(gDate.d,function(err,result)
// 					{
// 						if(err)
// 							console.log("");
// 					});
//    			});
//    // When you get an accelermeter change, print it out:
// 	function listenForTempReading() {
// 		tag.on('irTemperatureChange', function(objectTemp, ambientTemp) {
// 	     console.log('\tObject Temp = %d deg. C', objectTemp.toFixed(1));
// 	     console.log('\tAmbient Temp = %d deg. C', ambientTemp.toFixed(1));
// 	     intemp = ambientTemp.toFixed(1);
// 		// ---------------------------
		
// 		// ---------------------------
// 		var insertDocumentExplicit = function(db,callback) {	
// 		db.collection(gDate.d).insert
// 		({
// 			  	"time": gDate.t,
// 		  		"temp": intemp
// 		}, function(err,result) 
// 			{
// 				assert.equal(err, null);
// 				if(err)
// 					console.log("There is an error");
// 				callback(result);
// 			});
// 		};		
// 			MongoClient.connect(url, function(err, db)
// 			 {
// 				assert.equal(null, err);
				
// 				insertDocumentExplicit(db,function(){
// 					db.close();
// 				});	
// 			});

// 			});
// 	}

// 	// when you get a button change, print it out:
// 	function listenForButton() {
// 		tag.on('simpleKeyChange', function(left, right) {
// 			if (left) {
// 				console.log('left: ' + left);
// 			}
// 			if (right) {
// 				console.log('right: ' + right);
// 			}
// 			// if both buttons are pressed, disconnect:
// 			if (left && right) {
// 				tag.disconnect();
// 			}
// 	   });
// 	}
// 	// Now that you've defined all the functions, start the process:
// 	connectAndSetUpMe();
// 	exports.temp= intemp;
// });



