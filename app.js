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
var ip = "192.168.0.101";
// var url = 'mongodb://'+ip+':27017/sensorApp';

var url = 'mongodb://tam:123456@ds013599.mlab.com:13599/niin';
// var jsdom = require('jsdom').jsdom;
//  var document = jsdom('<html></html>', {});
//  var window = document.defaultView;
//  var $ = require('jquery')(window);

var db;
var collection;
var sensortag = require('./routes/sensortag');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var server = require('http').Server(app);
var debug = require('debug')('sensorApp:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '8080');
var sensorType,sStatus;
var output,chosenType,chooseDate,chosenHourF,chosenHourT;
var io = require('socket.io')(server);
var gDate ={d:"",t:"",full:"",h:0,m:0,s:0};
var sigTemp,sigHumi,sigLux,sigGyro;

getDayTime(gDate);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
// app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
MongoClient.connect(url,function(err,database)
    {
      console.log("DB connected");
      db = database;
      db.collectionNames("s"+gDate.d,function(err,result)
      {
        // console.log(result.length);
        if(result.length==0)
        {
          db.createCollection(("s"+gDate.d),function(err,result)
          {
            if(err) console.log("there is an error: " + err);
          });
          console.log("db created");
        }
      });
      if(err) console.log(err);
    });
  
  setInterval(function()
  {
      if(typeof(sensortag.temp)!="undefined")
      {
          console.log("Adding value to database...");
          insertDocumentExplicit(db,function(err){
            if(err)
              console.log(err);
            else
              console.log("added to db!!!");
      });
          }
  },1000);
  
  io.on('connection',function(socket)
      {
          socket.removeAllListeners();
          socket.on('custom',function(data)
          {
              sensortag(Number(data.status),data.tempOn,data.humiOn,data.luxOn,data.gyroOn);
              sStatus = data.status;
              console.log("Sensor status: "+ data.status);
              console.log("Temp on: "+ data.tempOn);
              console.log("Humi on: "+ data.humiOn);
              console.log("Lux on: "+ data.luxOn);
              console.log("Gyro on: "+ data.gyroOn);

              sigTemp = data.tempOn;
              sigHumi = data.humiOn;
              sigGyro = data.gyroOn;
              sigLux = data.luxOn;
          });
          socket.on('turnOff',function(data)
          {
              sensortag(Number(data.turn));
              console.log("turn = " , data.turn);
              console.log("Turning off sensors.... ");
          });
          socket.emit('date',{
            points : output,
            type : chosenType
          });
          console.log("chosen type: "+ chosenType);
          console.log("Sending value from server... "+ sensortag.type);
          setInterval(function(){
                socket.emit('signal',{
                      sta: sStatus,
                      type: sensortag.type,
                      sigTemp: sigTemp,
                      sigHumi: sigHumi,
                      sigLux: sigLux,
                      sigGyro: sigGyro 
                  });
            
                socket.emit('valuesOut',{
                      temp: sensortag.temp,
                      humi: sensortag.humi,
                      lux: sensortag.lux,
                      gyro: sensortag.gyro,
                      state: sensortag.state
                    });
            
          },1000);
          if(sensortag.dis)
          {
            socket.on('disconnect',function(){
              })
          }
      });

sensortag.status = sStatus;
app.get('/',function(req, res, next) {
  res.render('index', { title: 'Express',});
});


// ------------- Dashboard controller


app.get('/dashboard', function(req, res) {
  res.statusCode = 200;
  console.log("Sending value from server... "+sensortag.type);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  db.collectionNames(function(err, items) {
      
        // console.log("substring of collection name: "+t[1]+t[2]+"/"+t[3]+t[4]+"/"+t[5]+t[6]+t[7]+t[8]);
  for (item of items) {
    item.name=reformatDate(item);
  }
  res.render('dashboard', {
            "datelist" : items
            });
         
        });
});

function reformatDate(item)
{
  var t= item.name.split("");
  result = t[1]+t[2]+"/"+t[3]+t[4]+"/"+t[5]+t[6]+t[7]+t[8];
  return result;
}
// ------------- Report controller
app.post('/report',function(req,res)
{
  var timestamp = function(objId)
    {
      var output = {full:"" , timeOnly:""};
      var t = objId.toString().substring(0,8);
      var d = new Date(parseInt (t,16) * 1000);
      output.full = d.getTime();
      return output;

    }
  console.log("choosen date called");
  function exportData(array,option)
    {
      var yValue;
        var data = [];
          for(var i=0;i<array.length;i++)
        {
            switch(option)
            {
                case 1:
                yValue=array[i].temp;
                break;

                case 2:
                yValue=array[i].humi;
                break;

                case 3:
                yValue=array[i].lux;
                break;

                case 4:
                yValue=array[i].state;
                break;
            }
            data.push({
                            x: timestamp(array[i]._id).full,
                            y: Number(yValue)
                          });
        }
       return data;

    }
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
  var t= chosenDate.split("/");
  chosenDate = t[0]+t[1]+t[2];
  console.log("from: " + chosenHourF + "to: " +  ' on:' + chosenDate);

  collection =db.collection("s"+chosenDate);
  // find entry in specific time period

   switch(chosenType)
   {
    case "temp":
        collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}} , {temp:1}).toArray(function(err,items){
         output=exportData(items,1);
        });
        break;

    case "humi":
        collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}} , {humi:1}).toArray(function(err,items){
        output=exportData(items,2);
        });
        break;

    case "lux":
        collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}} , {lux:1}).toArray(function(err,items){
        output=exportData(items,3);
        });
        break;

    case "state":
        collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}} , {state:1}).toArray(function(err,items){
        output=exportData(items,4);
        });
        break;
   }

    res.render('report',
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
app.use('/users', users);
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
       getDayTime(gDate);
       if(sensortag.temp!=null && sensortag.humi!=null && sensortag.lux!=null)
       {        }
        else
        {
          db.collection("s"+gDate.d).insert
          ({
                "hour": gDate.h,
                "minute": gDate.m,
                "second": gDate.s,
                "temp": sensortag.temp,
                "humi": sensortag.humi,
                "lux": sensortag.lux,
                "state": sensortag.state
          }, function(err,result)
            {
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
    var day = addZero(t.getDate()).toString();
    var month = addZero(t.getMonth()+1).toString();
    var year = t.getFullYear().toString();
    var fullTime = h + ":" + m + ":" + s ;
    var fullDate = day +  month  + year ;
    gDate.t=fullTime;
    gDate.d=fullDate;
    
    gDate.h = h;
    gDate.m = m;
    gDate.s = s;
    gDate.full = t.getTime();
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
