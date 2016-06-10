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
var ip = "192.168.11.5";
var url = 'mongodb://'+ip+':27017/sensorApp';
// var jsdom = require('jsdom').jsdom;
//  var document = jsdom('<html></html>', {});
//  var window = document.defaultView;
//  var $ = require('jquery')(window);

var db;
var collection;

// var SensorTag = require('sensortag');

var sensortag = require('./routes/sensortag');
var routes = require('./routes/index');
var users = require('./routes/users');
// var mongoexport = require('./public/javascripts/outout');

var j= require('./routes/jq');
var app = express();
var server = require('http').Server(app);
var debug = require('debug')('sensorApp:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '8080');
var sensorType,sStatus;
var output,chosenType,chooseDate,chosenHourF,chosenHourT;
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
            points:output,
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



app.post('/chooseDate',function(req,res)
{
  var timestamp = function(objId)
{
  var t = objId.toString().substring(0,8);
  var d = new Date(parseInt (t,16) * 1000);
  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds()); 
  var output = {full:"" , timeOnly:""};
  output.timeOnly= h+':'+m+':'+s;
  output.full = d.getTime();
  
  return output;
  // return d;
}
  console.log("choosen date called");
  function createJSON(array)
    {

          for(var i=0;i<array.length;i++)
        {
            // we using synchronous version of appendFile because the required consistency in 
            // JSON format
            console.log(array[i].temp);
             // fs.appendFileSync('./public/test.json',JSON.stringify(array[i]));
             if(i != array.length-1)
             {
              fs.appendFileSync('./public/test.json',","); 
             }
        }
       
        fs.appendFileSync('./public/test.json',"]");
    }
  function exportData(array)
    {
        var data = [];
          for(var i=0;i<array.length;i++)
        {
            // we using synchronous version of appendFile because the required consistency in 
            // JSON format
            data.push({
                            x: timestamp(array[i]._id).full,
                            y: Number(array[i].temp)
                          });
            // console.log(data[0]);
        }
       return data;
        
    }
  res.statusCode=200;   
  chosenDate = req.body.dateForm;
  chosenType = req.body.typeForm;
  chosenHourF = Number(req.body.hourF); 
  chosenHourT = Number(req.body.hourT);
  // export collection to JSON file ready to pass to HighCharts to display
  // var mongoexport=require('./public/javascripts/outout')(chosenDate);
  var fs = require('fs');
  if(chosenHourF==0 && chosenHourT==0)
  {
    chosenHourF=0;
    chosenHourT=23;
  } 
      
  console.log("from: " + chosenHourF + "to: " +  ' on:' + chosenDate);
  
  collection =db.collection(chosenDate);
  // find entry in specific time period 
   fs.appendFileSync('./public/test.json',"[");
   switch(chosenType)
   {
    case "temp":
        collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}} , {temp:1}).toArray(function(err,items){
         // output = items;
         output=exportData(items);
        });
        break;

    case "humi":
        collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}} , {humi:1}).toArray(function(err,items){
        createJSON(items);
        });
        break;

    case "lux":
        collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}} , {lux:1}).toArray(function(err,items){
         createJSON(items); 
        });
        break;
   }
    
    res.render('date',
    {
      "day":chosenDate
    });
  
  // send data from Database to Date List Page to display in graph
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


module.exports = app;
