var express = require('express');
// var Highcharts = require('highcharts');
// // var www = require('../bin/www');


// // var sensorLib = require('sensortag');
// // MongoDB Wired up
// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');
// var ObjectId = require('mongodb').ObjectID;
// var ip = "193.166.93.42";
// var url = 'mongodb://'+ip+':27017/sensorApp';
// // Jquery Wired up
// var jsdom = require('jsdom').jsdom;
//  var document = jsdom('<html></html>', {});
//  var window = document.defaultView;
//  var $ = require('jquery')(window);

var router = express.Router();
// var intemp="TEMP OUTPUT";
// var db;
// var collection;
// MongoClient.connect(url,function(err,database)
// 		{
// 			if(err) throw err;
// 			db = database;
			
// 		});
// // /* GET home page. */
// // router.get('/', function(req, res, next) {
// //   res.render('index', { title: 'Express',temp : intemp});
// // });
// router.get('/userlist', function(req, res) {
// 	res.statusCode = 200;
// 	res.setHeader("Access-Control-Allow-Origin", "*");
// 	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	db.collectionNames(function(err, items) {
// 	  		// console.log(items);
// 	        res.render('userlist', {
// 	        	"datelist" : items
// 	        	});
// 	   		});
//     // var db = req.db;
//     // db.collectionNames(function(err, items) {
// 	  	// 			console.log(items);
// 	   //      		res.render('userlist', {
// 	   //          		"datelist" : items
// 	   //      		});
// 	   // 			});
//     // // var collection = db.collection("temp");
//     // db.get('18/1/2016').find({},{},function(e,docs){
//     //     res.render('userlist', {
//     //         "userlist" : docs
//     //     });
//     // });
    
// });

// var output,chosenType,chooseDate,chosenHourF,chosenHourT;
// router.post('/chooseDate',function(req,res)
// {
// 	console.log("choosen date called");
// 	res.statusCode=200;		
// 	chosenDate = req.body.dateForm;
// 	chosenType = req.body.typeForm;
// 	chosenHourF = Number(req.body.hourF); 
// 	chosenHourT = Number(req.body.hourT);
	
// 	if(chosenHourF==0 && chosenHourT==0)
// 	{
// 		chosenHourF=0;
// 		chosenHourT=23;
// 	} 
			
// 	console.log("from: " + chosenHourF + "to: " + chosenHourT);
	
// 	collection =db.collection(chosenDate);
// 	// find entry in specific time period 
// 	collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}}).toArray(function(err,items){
// 		res.render('date',
// 		{
// 			"day":chosenDate
// 		});
// 		output = items;
		
// 	});

// 	// send data from Database to Date List Page to display in graph


// 	// Fired multiple times !!!!

		

// });

// router.get('/newuser', function(req, res){
// 	res.render('newuser', { title: 'Add new User'});
// 	// set our internal BD variable
// 	res.statusCode = 200;
// 	res.setHeader("Access-Control-Allow-Origin", "*");
// 	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	var db = req.db;

// 	// Get our form values. These rely on the "name" attributes
// 	// var userName = req.body.usernam;
// 	// var userEmail = req.body.useremail;

// 	// set our collection
	

// 	// get data from DB
// 	db.get('temp').find({},{},function(e,docs){
//         res.render('newuser', {
//             "newuser" : docs
//         });

//         console.log(e);
//     });



// });
// // --------Jquery


// // ----------------

 module.exports = router;