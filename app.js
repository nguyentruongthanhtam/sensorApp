var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// database inported library
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
// var monk = require('monk');
// var db = monk('192.168.11.7:27017/sensorApp');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var ip = "192.168.11.7";
var url = 'mongodb://'+ip+':27017/sensorApp';
var jsdom = require('jsdom').jsdom;
 var document = jsdom('<html></html>', {});
 var window = document.defaultView;
 var $ = require('jquery')(window);
var db;
var collection;

// var SensorTag = require('sensortag');

var sensortag = require('./routes/sensortag');
var routes = require('./routes/index');
var users = require('./routes/users');


var j= require('./routes/jq');
var app = express();
var server = require('http').Server(app);
var debug = require('debug')('sensorApp:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '8080');


var io = require('socket.io')(server);
var gDate ={d:"",t:"",full:"",h:0,m:0,s:0};
getDayTime(gDate);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
// app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
MongoClient.connect(url,function(err,database)
    {
      db = database;
      db.collectionNames(gDate.d,function(err,result){
        
        if(result.length>0)
        {
          db.createCollection(gDate.d,function(err,result)
          {if(err) console.log("there is an error: " + err);});
          
        }
      });
      if(err) console.log(err);

      
    });

var sensorType,sStatus;

              setInterval(function(){ 
            if(typeof(sensortag.temp)!="undefined")
            {
                console.log("Adding value to database...");
                insertDocumentExplicit(db,function(){    
                });  
            }
              },1000);
io.on('connection',function(socket)
      {
          
          socket.removeAllListeners();
          socket.on('custom',function(data){
              sensortag(Number(data.status));
              sStatus = data.status;
               console.log("Sensor status: "+ data.status);
          })
          socket.emit('date',{
            entry:output,
            type:chosenType
          });
          console.log("chosen type: "+ chosenType);
          console.log("Sending value from server... "+sensortag.type);
          setInterval(function(){ 
            // if(typeof(sensortag.temp)!="undefined")
            // {
            // console.log("Adding value to database...");
            //   insertDocumentExplicit(db,function(){    
            //     });  
            // }
            
                socket.emit('signal',{
                      sta: sStatus,
                      type:sensortag.type
                  });
             
             
                // db.close()
              
                              socket.emit('tempOut',{
                                                        temp: sensortag.temp,
                                                        humi: sensortag.humi,
                                                        lux: sensortag.lux
                                                      });
             
            // console.log(typeof(sensortag.temp)); 
          },1000);
          socket.on('disconnect',function(){
            
          })
      });
sensortag.status = sStatus;
app.get('/',function(req, res, next) {
  res.render('index', { title: 'Express',});
});

app.get('/userlist', function(req, res) {
  res.statusCode = 200;
  console.log("Sending value from server... "+sensortag.type);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  db.collectionNames(function(err, items) {
        // console.log(items);
          res.render('userlist', {
            "datelist" : items
            });
        });
    
});


var output,chosenType,chooseDate,chosenHourF,chosenHourT;
app.post('/chooseDate',function(req,res)
{
  console.log("choosen date called");
  res.statusCode=200;   
  chosenDate = req.body.dateForm;
  chosenType = req.body.typeForm;
  chosenHourF = Number(req.body.hourF); 
  chosenHourT = Number(req.body.hourT);
  
  if(chosenHourF==0 && chosenHourT==0)
  {
    chosenHourF=0;
    chosenHourT=23;
  } 
      
  console.log("from: " + chosenHourF + "to: " + chosenHourT);
  
  collection =db.collection(chosenDate);
  // find entry in specific time period 
  collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}}).toArray(function(err,items){
    res.render('date',
    {
      "day":chosenDate
    });
    output = items;
    
  });

  // send data from Database to Date List Page to display in graph


  // Fired multiple times !!!!

    

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req,res,next){
//     req.db = db;
//     next();
// }); 
// app.use('/', routes);
app.use('/users', users);
// app.use('/', sensortag);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// database
var insertDocumentExplicit = function(db,callback) {  
       // getDayTime(gDate);
       getDayTime(gDate);
       // console.log(gDate.t);
       if(sensortag.temp!=null && sensortag.humi!=null && sensortag.lux!=null)
       {
          db.collection(gDate.d).insert
          ({
                "hour": gDate.h,
                "minute": gDate.m,
                "second": gDate.s,
                "temp": sensortag.temp,
                "humi": sensortag.humi,
                "lux": sensortag.lux
          }, function(err,result) 
            {
              // assert.equal(err, null);
              // // console.log(result);

              if(err)
                console.log("Error: "+err);
              callback(result);
            });
        }
        
    };    

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
    var h= t.getHours();
    var m= t.getMinutes();
    var s= t.getSeconds();
    var day = t.getDate();
    var month = t.getMonth()+1;
    var year = t.getFullYear();
    var fullTime = h + ":" + m + ":" + s ;
    var fullDate = day + "/" + month + "/" + year ;
    gDate.t=fullTime;
    gDate.d=fullDate;

    gDate.h = h;
    gDate.m = m;
    gDate.s = s;

    gDate.full = t.getTime();
    // console.log(fullTime);
    // console.log(fullDate);
}
//---------------

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
// SensorTag.discover(function(tag) {


//   // when you disconnect from a tag, exit the program:
//   tag.on('disconnect', function() {
//     console.log('disconnected!');
//     process.exit(0);
//   });

//   function connectAndSetUpMe() {      // attempt to connect to the tag
//      console.log('connectAndSetUp');
//      tag.connectAndSetUp(enableIrTempMe);   // when you connect, call enableIrTempMe
   
//    }

//    function enableIrTempMe() {    // attempt to enable the IR Temperature sensor
//      console.log('enableIRTemperatureSensor');
//      // when you enable the IR Temperature sensor, start notifications:
//      // tag.enableIrTemperature();
//      tag.enableHumidity(tag.enableLuxometer(tag.enableIrTemperature(notifyMe)));
     

//    }

//   function notifyMe() {
//     console.log('Services have started !...');
//     console.log('Humidity sensor Enabled !...');
//     console.log('Temperature sensor Enabled !...');
//     console.log('Luxometer sensor Enabled!...');
//     tag.unnotifySimpleKey();
//     tag.notifyIrTemperature(tag.setIrTemperaturePeriod(1000,listenForTempReading));
//     tag.notifyHumidity(tag.setHumidityPeriod(1000,listenForHumidity));
//     tag.notifyLuxometer(tag.setLuxometerPeriod(1000,listenForLuxometer));

//     // console.log('Accelerometer sensor Enabled!...');
//     // tag.notifyAccelerometer(tag.setAccelerometerPeriod(1000, listenForAccelerometer));

//    }
//    function listenForAccelerometer(){
//       // Listen for Luxometer 
//       tag.on('accelerometerChange', function(x, y, z){
//         console.log('x: ',x.toFixed(1));
//         console.log('y: ',y.toFixed(1));
//         console.log('z: ',z.toFixed(1));
//         module.exports.acc = x.toFixed(1) +" | "+ y.toFixed(1)+ " | " + z.toFixed(1);
//         // module.exports.acc = (Number(x.toFixed(1))+ Number(y.toFixed(1))+ Number(z.toFixed(1))).toFixed(1);
//       });
      

//     }
//    function listenForLuxometer(){
//       // Listen for Luxometer 
//       tag.on('luxometerChange', function(lux){
//         console.log('lux value = ',lux);
//         module.exports.lux = lux.toFixed(1);
//       });
//    }



//    // When you get an accelermeter change, print it out:
//   function listenForTempReading() {
//     tag.on('irTemperatureChange', function(objectTemp, ambientTemp) {
//       console.log('\tObject Temp = %d deg. C', objectTemp.toFixed(1));
//       console.log('\tAmbient Temp = %d deg. C', ambientTemp.toFixed(1));
//       var intemp = ambientTemp.toFixed(1);
//       module.exports.temp= ambientTemp.toFixed(1);


//      });
//   }
  
   
//     // Get data from Humidity Sensor ( + Temperature )
//   function listenForHumidity() {
//     tag.on('humidityChange', function(temperature, humidity) {
//        console.log('\tTemperature = %d deg. C', temperature.toFixed(1));
//        console.log('\tHumidity = %d %H', humidity.toFixed(1));
//        module.exports.humi= humidity.toFixed(1);
//        var intemp = temperature.toFixed(1);
//        var inhumid = humidity.toFixed(1);
      
    
//      });
//   }
//   // when you get a button change, print it out:
//   function listenForButton() {
//     tag.on('simpleKeyChange', function(left, right) {
//       console.log("Device: "+tag.type);
//       console.log("Device ID: "+tag.id);
//       if (left) {
//         console.log('left button PRESSED!');
//       }
//       if (right) {
//         console.log('right button PRESSED!');
//       }
//       // if both buttons are pressed, disconnect:
//       if (left && right) {
//         console.log("Device: "+tag.type+" with id of: "+tag.id+" connected !");
//         enableIrTempMe();
//         // tag.disconnect();

//       }
//      });
//   }


//  //  });
//   // Now that you've defined all the functions, start the process:
//   tag.connectAndSetUp(
//     function(){
//     console.log("Sensor Type: ",tag.type);
//           console.log("Sensor ID: ",tag.id);
//       www.io.on('connection',function(socket){
//       socket.removeAllListeners();
//       socket.on('custom',function(data){
//       // console.log('Connect state : ',data.status);
//         if(Number(data.status)==1)
//         {
//           enableIrTempMe();// connected signal
//           module.exports.sta= data.status; // connected state
//         }
//         else
//         {
//           module.exports.sta= data.status; // initial state
//         }
//         console.log("Connection status: ",data.status);
//       });

//       });
//           console.log("Sensor Type: ",tag.type);
//           console.log("Sensor ID: ",tag.id);
//           // module.exports.type= tag.type;
//           sensorType=tag.type;
//         tag.notifySimpleKey(listenForButton); // start the button listener);    
//         });
   
  
// });


module.exports = app;
