var ip = "192.168.0.101";
// var socket = io.connect('http://localhost:8080');
var value={'name':'','type':'','unit':''};
var chart;
function createChart()
{
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

}
$(function () {

    $('select').material_select();
    $('.button-collapse').sideNav();

    createChart();
    Highcharts.setOptions(Highcharts.theme);
    chart = new Highcharts.stockChart({
        chart: {
                zoomType: 'x',
                renderTo : 'container',
                type : 'line',

            },
            title: {
                text: ''
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime',
                // tickInterval: 4,
            },
            yAxis: {
                title: {
                    text: value.unit
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
            exporting:{
              allowHTML: true,
              buttons: {
                contextButton: {
                  enabled: true,
                  align: "right",

                }
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
                turboThreshold: 0,
                data: [],
                
                dataGrouping: {
                    enabled: true
                }
            }]
        });
      chart.showLoading("choose day to report...");
     $('.submitBtn').on('click',function(e)
     {
      e.preventDefault();
      var date = $('#dateChoice').val().split('/');
      var type = $('#typeChoice').val();
      var convertedDate = date[0] + date[1] + date[2];
      $.ajax({
        type: 'GET',
        url:  '/sample',
        data: {dates : convertedDate,types : type},
        dataType: 'json',
        })
          .done(function(database){
          console.time();
          // console.log(database);
          chart.series[0].setData(database,false,false,false);
          chart.redraw();
          chart.hideLoading();
          console.timeEnd();    
        
      });           
        switch(type)
        {
          case "temp":
          chart.setTitle({
          text:"Temperature Record Chart"
          });
          chart.yAxis[0].update({
          title:{
          text: "\xB0C"
          }
          });
          chart.series[0].update({
          
          lineWidth: 2,
          marker:{
            enabled: false,
            radius:2
          },
          states:{
            hover: {
              lineWidthPlus:1
            }
          }
          });
          break;

          case "humi":
          chart.setTitle({
          text:"Humidity Record Chart"
          });
          chart.yAxis[0].update({
          title:{
          text: "%H"
          }
          });
          chart.series[0].update({
          
          lineWidth: 2,
          marker:{
            enabled: false,
            radius:2
          },
          states:{
            hover: {
              lineWidthPlus:1
            }
          }
          });
          break;

          case "lux":
          chart.setTitle({
          text:"Light Level Record Chart"
          });
          chart.yAxis[0].update({
          title:{
          text: "lux"
          }
          });  
          chart.series[0].update({
          
          lineWidth: 2,
          marker:{
            enabled: false,
            radius:2
          },
          states:{
            hover: {
              lineWidthPlus:1
            }
          }
          });
          break;

          case "state":
          chart.setTitle({
          text:"Door state Record Chart"
          });
          chart.yAxis[0].update({
          title:{
          text: "state"
          }
          });
          chart.series[0].update({
          rangeSelector:{
            selected: 1
          },
          lineWidth: 0,
          marker:{
            enabled: true,
            radius:2
          },
          states:{
            hover: {
              lineWidthPlus:0
            }
          }
          });

          break;
        }   
      
      });

  
    
 });


