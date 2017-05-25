var sensortag = require('../routes/sensortag');
var MongoClient = require('mongodb').MongoClient;
var ip = "192.168.11.7";
var url = 'mongodb://'+ip+':27017/sensorApp';
var gDate ={d:"",t:"",full:"",h:0,m:0,s:0};
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var www = require('../bin/www');

// ---------------------------
    // insert each value with timestamp into database
    var insertDocumentExplicit = function(db,callback) {  
       // getDayTime(gDate);
       getDayTime(gDate);
       // console.log(gDate.t);
       if(sensortag.temp!=null || sensortag.humi!=null || sensortag.lux!=null)
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
              assert.equal(err, null);
              if(err)
                console.log("There is an error");
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

MongoClient.connect(url, function(err, db)
   {
    assert.equal(null, err);

    // Create a collection with the current date as the name
      db.createCollection(gDate.d,function(err,result)
      {
        if(err)
          console.log("");
      });

    });


www.io.on('connection',function(socket){

      socket.removeAllListeners();
      console.log("Sending value from server... "+sensortag.type);
      setInterval(function(){ 
      socket.emit('signal',{
                                sta: sensortag.sta,
                                type:sensortag.type
                            });
      if(typeof(sensortag.temp)!='undefined')
      {
          socket.emit('tempOut',{
                                    temp: sensortag.temp,
                                    humi: sensortag.humi,
                                    lux: sensortag.lux,
                                    // acc: sensortag.acc
                                    // sta: sensortag.sta
                                  });
          MongoClient.connect(url, function(err, db)
          {
            assert.equal(null, err);
            insertDocumentExplicit(db,function(){
              db.close();
            }); 
          });
      }
      },1000);

  });