var socket = io.connect('http://192.168.11.8:8080');
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
Highcharts.setOptions({
    	global: {
        	useUTC: false
    	}
		});
Highcharts.createElement('link', {
   href: 'https://fonts.googleapis.com/css?family=Unica+One',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
   colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
         stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
         ]
      },
      style: {
         fontFamily: "'Unica One', sans-serif"
      },
      plotBorderColor: '#606063'
   },
   title: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase',
         fontSize: '20px'
      }
   },
   subtitle: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase'
      }
   },
   xAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
         style: {
            color: '#A0A0A3'

         }
      }
   },
   yAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
         style: {
            color: '#A0A0A3'
         }
      }
   },
   tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
         color: '#F0F0F0'
      }
   },
   plotOptions: {
      series: {
         dataLabels: {
            color: '#B0B0B3'
         },
         marker: {
            lineColor: '#333'
         }
      },
      boxplot: {
         fillColor: '#505053'
      },
      candlestick: {
         lineColor: 'white'
      },
      errorbar: {
         color: 'white'
      }
   },
   legend: {
      itemStyle: {
         color: '#E0E0E3'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#606063'
      }
   },
   credits: {
      style: {
         color: '#666'
      }
   },
   labels: {
      style: {
         color: '#707073'
      }
   },

   drilldown: {
      activeAxisLabelStyle: {
         color: '#F0F0F3'
      },
      activeDataLabelStyle: {
         color: '#F0F0F3'
      }
   },

   navigation: {
      buttonOptions: {
         symbolStroke: '#DDDDDD',
         theme: {
            fill: '#505053'
         }
      }
   },

   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: '#505053',
         stroke: '#000000',
         style: {
            color: '#CCC'
         },
         states: {
            hover: {
               fill: '#707073',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: '#000003',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            }
         }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      },
      xAxis: {
         gridLineColor: '#505053'
      }
   },

   scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
   },

   // special colors for some of the
   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
   background2: '#505053',
   dataLabelsColor: '#B0B0B3',
   textColor: '#C0C0C0',
   contrastTextColor: '#F0F0F3',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
var chart = new Highcharts.StockChart({
        chart: {
                zoomType: 'x',
                renderTo : 'container',
                type : 'line',
                
            },
            title: {
                text: 'Temperature Record Chart'
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
                    text: 'Temperature'
                }
            },      
            legend: {
                enabled: false
            },
            loading:
            {
            	style: {
						position: 'absolute',
						backgroundColor: 'white',
						opacity: 0.7,
						textAlign: 'center'
				}

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
                data: [], 
                // (function () {
        //             var data = [];
    					
    				// 		console.log("data received ...." + dataFromSocket);
    				// 		for (var i = 0; i < dataFromSocket.entry.length; i++) {
    				// // 			console.log("data received ...." + timestamp(dataFromSocket.entry[i]._id).full);
								// // console.log("data received ...." + dataFromSocket.entry[i]);
								// data.push({
		      //             			x: timestamp(dataFromSocket.entry[i]._id).full,
		      //             			y: Number(dataFromSocket.entry[i].temp)
		      //             		});
    				// 		}
    					
        //             return data;
                // }()),

                 dataGrouping: {
                    enabled: false
                }
            }]
        });
chart.showLoading();
socket.once('date',function(dataFromSocket)
	{
		socket.removeAllListeners();
		// fetchData = (JSON.parse(JSON.stringify(data.entry)));
		// myFunction(data);
		console.log("data length...." + dataFromSocket.entry.length);
		function addData() {
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
    		data.sort();
            return data;
		};

	chart.series[0].setData(addData());
	chart.hideLoading();
	});
});
