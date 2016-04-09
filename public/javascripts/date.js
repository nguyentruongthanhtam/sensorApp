var socket = io.connect('http://localhost:3000');
// var fetchData;


// if(typeof(fetchData)!="undefined")
// {console.log(fetchData);}
// console.log(fetchData);
$(function () { 
	function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
// convert Object ID to timestamp
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
socket.once('date',function(dataFromSocket)
	{
		socket.removeAllListeners();
		// fetchData = (JSON.parse(JSON.stringify(data.entry)));
		// myFunction(data);
	console.log("data length...." + dataFromSocket.entry.length);
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});
// alert(fetchData.entry);

var chart = new Highcharts.StockChart({
        chart: {
                zoomType: 'x',
                renderTo : 'container',
                type : 'line'
            },
            title: {
                text: 'USD to EUR exchange rate over time'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Exchange rate'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null,
                    
                }
            },

            series: [{
    			turboThreshold:0,
                data: (function () {
                    var data = [];
    					
    						console.log("data received ...." + dataFromSocket);
    						for (var i = 0; i < dataFromSocket.entry.length; i++) {
    				// 			console.log("data received ...." + timestamp(dataFromSocket.entry[i]._id).full);
								// console.log("data received ...." + dataFromSocket.entry[i]);
								data.push({
		                  			x: timestamp(dataFromSocket.entry[i]._id).full,
		                  			y: Number(dataFromSocket.entry[i].temp)
		                  		});
    						}
    					
                    return data;
                }()),
                 dataGrouping: {
                    enabled: false
                }
            }]
        });
	});
});
