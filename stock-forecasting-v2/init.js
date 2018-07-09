var color_list = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
var colors = ['#5793f3', '#d14a61', '#675bba','#b62f46'];
var close = GOOGLE['data'].map(function(el, idx) {
  return el[1];
})
function calculate_distribution(real,predict){
  data_plot = []
  data_arr = [real,predict]
  for(var outer = 0; outer < data_arr.length;outer++){
    data = data_arr[outer]
    max_arr = Math.max(...data)
    min_arr = Math.min(...data)
    num_bins = Math.ceil(Math.sqrt(data.length));
    kde = kernelDensityEstimator(epanechnikovKernel(max_arr/50), arange(min_arr,max_arr,(max_arr-min_arr)/num_bins))
    kde = kde(data)
    bar_x = [], bar_y = []
    for(var i = 0; i < kde.length;i++){
      bar_x.push(kde[i][0])
      bar_y.push(kde[i][1])
    }
    min_line_y = Math.min(...bar_y)
    for(var i = 0; i < bar_y.length;i++) bar_y[i] -= min_line_y
    data_plot.push({'bar_x':bar_x,'bar_y':bar_y})
  }
  option = {
    color: colors,

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data:['real histogram','predict histogram']
    },
    xAxis: [
      {
        type: 'category',
        data: data_plot[0]['bar_x']
      },
      {
        type: 'category',
        data: data_plot[1]['bar_x']
      }
    ],
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name:'real histogram',
        type:'bar',
        data:data_plot[0]['bar_y']
      },
      {
        name:'predict histogram',
        type:'bar',
        data:data_plot[1]['bar_y'].slice(0,data_plot[1]['bar_y'].length-2)
      }
    ]
  };
  var bar_plot = echarts.init(document.getElementById('div_dist'));
  bar_plot.setOption(option,true);
}

function calculateMA(dayCount, data) {
  var result = [];
  for (var i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data[i - j][1];
    }
    result.push((sum / dayCount).toFixed(2));
  }
  return result;
}
var dataMA5 = calculateMA(5, GOOGLE['data']);
var dataMA10 = calculateMA(10, GOOGLE['data']);
var dataMA20 = calculateMA(20, GOOGLE['data']);
var dataMA30 = calculateMA(30, GOOGLE['data']);

option = {
  animation: false,
  color: color_list,
  title: {
    left: 'center'
  },
  legend: {
    top: 30,
    data: ['GOOGLE', 'MA5', 'MA10', 'MA20', 'MA30']
  },
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    }
  },
  axisPointer: {
    link: [{
      xAxisIndex: [0, 1]
    }]
  },
  dataZoom: [{
    type: 'slider',
    xAxisIndex: [0, 1],
    realtime: false,
    start: 0,
    end: 100,
    top: 65,
    height: 20,
    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    handleSize: '120%'
  }, {
    type: 'inside',
    xAxisIndex: [0, 1],
    start: 40,
    end: 70,
    top: 30,
    height: 20
  }],
  xAxis: [{
    type: 'category',
    data: GOOGLE['date'],
    boundaryGap : false,
    axisLine: { lineStyle: { color: '#777' } },
    axisLabel: {
      formatter: function (value) {
        return echarts.format.formatTime('MM-dd', value);
      }
    },
    min: 'dataMin',
    max: 'dataMax',
    axisPointer: {
      show: true
    }
  }, {
    type: 'category',
    gridIndex: 1,
    data: GOOGLE['date'],
    scale: true,
    boundaryGap : false,
    splitLine: {show: false},
    axisLabel: {show: false},
    axisTick: {show: false},
    axisLine: { lineStyle: { color: '#777' } },
    splitNumber: 20,
    min: 'dataMin',
    max: 'dataMax',
    axisPointer: {
      type: 'shadow',
      label: {show: false},
      triggerTooltip: true,
      handle: {
        show: true,
        margin: 30,
        color: '#B80C00'
      }
    }
  }],
  yAxis: [{
    scale: true,
    splitNumber: 2,
    axisLine: { lineStyle: { color: '#777' } },
    splitLine: { show: true },
    axisTick: { show: false },
    axisLabel: {
      inside: true,
      formatter: '{value}\n'
    }
  }, {
    scale: true,
    gridIndex: 1,
    splitNumber: 2,
    axisLabel: {show: false},
    axisLine: {show: false},
    axisTick: {show: false},
    splitLine: {show: false}
  }],
  grid: [{
    left: 20,
    right: 30,
    top: 110,
  }, {
    left: 20,
    right: 30,
    top: 400
  }],
  graphic: [{
    type: 'group',
    left: 'center',
    top: 70,
    width: 300,
    bounding: 'raw',
    children: [{
      id: 'MA5',
      type: 'text',
      style: {fill: color_list[1]},
      left: 0
    }, {
      id: 'MA10',
      type: 'text',
      style: {fill: color_list[2]},
      left: 'center'
    }, {
      id: 'MA20',
      type: 'text',
      style: {fill: color_list[3]},
      right: 0
    }]
  }],
  series: [{
    name: 'Volume',
    type: 'bar',
    xAxisIndex: 1,
    yAxisIndex: 1,
    itemStyle: {
      normal: {
        color: '#7fbe9e'
      },
      emphasis: {
        color: '#140'
      }
    },
    data: GOOGLE['volume']
  }, {
    type: 'candlestick',
    name: 'GOOGLE',
    data: GOOGLE['data'],
    itemStyle: {
      normal: {
        color: '#ef232a',
        color0: '#14b143',
        borderColor: '#ef232a',
        borderColor0: '#14b143'
      },
      emphasis: {
        color: 'black',
        color0: '#444',
        borderColor: 'black',
        borderColor0: '#444'
      }
    }
  }, {
    name: 'MA5',
    type: 'line',
    data: dataMA5,
    smooth: true,
    showSymbol: false,
    lineStyle: {
      normal: {
        width: 1
      }
    }
  }, {
    name: 'MA10',
    type: 'line',
    data: dataMA10,
    smooth: true,
    showSymbol: false,
    lineStyle: {
      normal: {
        width: 1
      }
    }
  }, {
    name: 'MA20',
    type: 'line',
    data: dataMA20,
    smooth: true,
    showSymbol: false,
    lineStyle: {
      normal: {
        width: 1
      }
    }
  },
  {
    name: 'MA30',
    type: 'line',
    data: dataMA30,
    smooth: true,
    showSymbol: false,
    lineStyle: {
      normal: {
        width: 1
      }
    }
  }]
};

var chart_stock = echarts.init(document.getElementById('div_output'));
chart_stock.setOption(option,true);

$('#suggestbutton').click(function(){
  $('#learningrate').val(0.01)
  $('#inputdropoutrate').val(1.0)
  $('#outputdropoutrate').val(0.8)
  $('#timestamp').val(5)
  $('#sizelayer').val(32)
  $('#initialmoney').val(10000)
  $('#maxbuy').val(5)
  $('#maxsell').val(10)
  $('#epoch').val(10)
  $('#history').val(4)
  $('#future').val(30)
})
$('#suggestbutton').click()
$('#trainbutton').click(function(){
  $('.close-first').css('display','block');
  if(parseFloat($('#inputdropoutrate').val())<0 || parseFloat($('#inputdropoutrate').val())>1){
    Materialize.toast('input dropout must bigger than 0 and less than 1', 4000)
    return
  }
  if(parseFloat($('#outputdropoutrate').val())<0 || parseFloat($('#outputdropoutrate').val())>1){
    Materialize.toast('output dropout must bigger than 0 and less than 1', 4000)
    return
  }
  setTimeout(function(){
    minmax_scaled = minmax_1d(close)
    timestamp = parseInt($('#timestamp').val())
    epoch = parseInt($('#epoch').val())
    future = parseInt($('#future').val())
    X_scaled = minmax_scaled.scaled.slice([0],[Math.floor(minmax_scaled.scaled.shape[0]/timestamp)*timestamp+1])
    cells = [tf.layers.lstmCell({units: parseInt($('#sizelayer').val())})];
    rnn = tf.layers.rnn({cell: cells, returnSequences: true,returnState:true});
    dense_layer = tf.layers.dense({units: 1, activation: 'linear'});
    function f(x,states){
      x = dropout_nn(x,parseFloat($('#inputdropoutrate').val()))
      forward = rnn.apply(x,{initialState:states});
      last_sequences = dropout_nn(forward[0].reshape([x.shape[1],parseInt($('#sizelayer').val())]),parseFloat($('#outputdropoutrate').val()))
      return {'forward':dense_layer.apply(last_sequences),'states_1':forward[1],'states_2':forward[2]}
    }
    cost = (label, pred) => tf.square(tf.sub(label,pred)).mean();
    optimizer = tf.train.adam(parseFloat($('#learningrate').val()));
    batch_states = [tf.zeros([1,parseInt($('#sizelayer').val())]),tf.zeros([1,parseInt($('#sizelayer').val())])];
    arr_loss = [], arr_layer = []
    function async_training_loop(callback) {
      (function loop(i) {
        var total_loss = 0
        for(var k = 0; k < Math.floor(X_scaled.shape[0]/timestamp)*timestamp; k+=timestamp){
          batch_x = X_scaled.slice([k],[timestamp]).reshape([1,-1,1])
          batch_y = X_scaled.slice([k+1],[timestamp]).reshape([-1,1])
          feed = f(batch_x,batch_states)
          optimizer.minimize(() => cost(batch_y,f(batch_x,batch_states)['forward']));
          total_loss += parseFloat(cost(batch_y,f(batch_x,batch_states)['forward']).toString().slice(7));
          batch_states = [feed.states_1,feed.states_2]
        }
        total_loss /= Math.floor(X_scaled.shape[0]/timestamp);
        arr_loss.push(total_loss)
        output_predict = nj.zeros([X_scaled.shape[0]+future, 1])
        output_predict.slice([0,1],null).assign(tf_str_tolist(X_scaled.slice(0,1))[0],false)
        upper_b = Math.floor(X_scaled.shape[0]/timestamp)*timestamp
        distance_upper_b = X_scaled.shape[0] - upper_b
        batch_states = [tf.zeros([1,parseInt($('#sizelayer').val())]),tf.zeros([1,parseInt($('#sizelayer').val())])];
        for(var k = 0; k < (Math.floor(X_scaled.shape[0]/timestamp)*timestamp); k+=timestamp){
          batch_x = X_scaled.slice([k],[timestamp]).reshape([1,-1,1])
          feed = f(batch_x,batch_states)
          state_forward = tf_nj_list(feed.forward)
          output_predict.slice([k+1,k+1+timestamp],null).assign(state_forward,false)
          batch_states = [feed.states_1,feed.states_2]
        }
        batch_x = X_scaled.slice([upper_b],[distance_upper_b]).reshape([1,-1,1])
        feed = f(batch_x,batch_states)
        state_forward = tf_nj_list(feed.forward)
        output_predict.slice([upper_b+1,X_scaled.shape[0]+1],null).assign(state_forward,false)
        pointer = X_scaled.shape[0]+1
        tensor_output_predict = output_predict.reshape([-1]).tolist()
        batch_states = [feed.states_1,feed.states_2]
        for(var k = 0; k < future-1; k+=1){
          batch_x = tf.tensor(tensor_output_predict.slice(pointer-timestamp,pointer)).reshape([1,-1,1])
          feed = f(batch_x,batch_states)
          state_forward = tf_nj_list(feed.forward.transpose())
          tensor_output_predict[pointer] = state_forward[0][4]
          pointer += 1
          batch_states = [feed.states_1,feed.states_2]
        }
        $('#log').append('Epoch: '+(i+1)+', avg loss: '+total_loss+'<br>');
        predicted_val = tf_nj_list_flatten(reverse_minmax_1d(tf.tensor(tensor_output_predict),minmax_scaled['min'],minmax_scaled['max']))
        $('#div_output').attr('style','height:450px;');
        new_date = GOOGLE.date.slice()
        for(var k = 0; k < future; k+=1){
          somedate = new Date(new_date[new_date.length-1])
          somedate.setDate(somedate.getDate() + 1)
          dd = somedate.getDate()
          mm = somedate.getMonth() + 1
          y = somedate.getFullYear()
          new_date.push(y.toString()+'-'+mm.toString()+'-'+dd.toString())
        }

        option = {
          animation: false,
          color: color_list,
          title: {
            left: 'center'
          },
          legend: {
            top: 30,
            data: ['GOOGLE', 'MA5', 'MA10', 'MA20', 'MA30','predicted close']
          },
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
          axisPointer: {
            link: [{
              xAxisIndex: [0, 1]
            }]
          },
          dataZoom: [{
            type: 'slider',
            xAxisIndex: [0, 1],
            realtime: false,
            start: 0,
            end: 100,
            top: 65,
            height: 20,
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '120%'
          }, {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 40,
            end: 70,
            top: 30,
            height: 20
          }],
          xAxis: [{
            type: 'category',
            data: new_date,
            boundaryGap : false,
            axisLine: { lineStyle: { color: '#777' } },
            axisLabel: {
              formatter: function (value) {
                return echarts.format.formatTime('MM-dd', value);
              }
            },
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              show: true
            }
          }, {
            type: 'category',
            gridIndex: 1,
            data: GOOGLE['date'],
            scale: true,
            boundaryGap : false,
            splitLine: {show: false},
            axisLabel: {show: false},
            axisTick: {show: false},
            axisLine: { lineStyle: { color: '#777' } },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              type: 'shadow',
              label: {show: false},
              triggerTooltip: true,
              handle: {
                show: true,
                margin: 30,
                color: '#B80C00'
              }
            }
          }],
          yAxis: [{
            scale: true,
            splitNumber: 2,
            axisLine: { lineStyle: { color: '#777' } },
            splitLine: { show: true },
            axisTick: { show: false },
            axisLabel: {
              inside: true,
              formatter: '{value}\n'
            }
          }, {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          }],
          grid: [{
            left: 20,
            right: 20,
            top: 110,
          }, {
            left: 20,
            right: 20,
            top: 400
          }],
          graphic: [{
            type: 'group',
            left: 'center',
            top: 70,
            width: 300,
            bounding: 'raw',
            children: [{
              id: 'MA5',
              type: 'text',
              style: {fill: color_list[1]},
              left: 0
            }, {
              id: 'MA10',
              type: 'text',
              style: {fill: color_list[2]},
              left: 'center'
            }, {
              id: 'MA20',
              type: 'text',
              style: {fill: color_list[3]},
              right: 0
            }]
          }],
          series: [{
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#7fbe9e'
              },
              emphasis: {
                color: '#140'
              }
            },
            data: GOOGLE['volume']
          }, {
            type: 'candlestick',
            name: 'GOOGLE',
            data: GOOGLE['data'],
            itemStyle: {
              normal: {
                color: '#ef232a',
                color0: '#14b143',
                borderColor: '#ef232a',
                borderColor0: '#14b143'
              },
              emphasis: {
                color: 'black',
                color0: '#444',
                borderColor: 'black',
                borderColor0: '#444'
              }
            }
          }, {
            name: 'MA5',
            type: 'line',
            data: dataMA5,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            }
          }, {
            name: 'MA10',
            type: 'line',
            data: dataMA10,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            }
          }, {
            name: 'MA20',
            type: 'line',
            data: dataMA20,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            }
          },
          {
            name: 'MA30',
            type: 'line',
            data: dataMA30,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            }
          },
          {
            name: 'predicted close',
            type: 'line',
            data: predicted_val,
            smooth: false,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            }
          }]
        };

        var chart_stock = echarts.init(document.getElementById('div_output'));
        chart_stock.setOption(option,true);
        calculate_distribution(close,predicted_val)
        option = {
          title:{
            text:'loss graph'
          },
          xAxis: {
            type: 'category',
            data: arange(0,arr_loss.length,1)
          },
          yAxis: {
            type: 'value'
          },
          grid:{
            bottom:'10%'
          },
          series: [{
            data: arr_loss,
            type: 'line'
          }]
        };
        var chart_line = echarts.init(document.getElementById('div_loss'));
        chart_line.setOption(option,true);
        if (i < (epoch-1)) {
          setTimeout(function() {loop(++i)}, 2000);
        } else {
          callback();
        }
      }(0));
    }
    async_training_loop(function() {
      $('#log').append('Done training!');
      my_investment = simple_investor(close,predicted_val,parseInt($('#history').val()),
      parseFloat($('#initialmoney').val()),parseInt($('#maxbuy').val()),parseInt($('#maxsell').val()),GOOGLE.date)
      $('#table-body').html('');
      for(var i = 0; i < my_investment['output'].length; i++) $('#table-body').append(my_investment['output'][i]);
      $('#log-invest').append("<h6 class='header'>Overall gain: "+my_investment['overall gain']+", Overall investment: "+my_investment['overall investment']+"%</h5>")

      var markpoints = []
      for (var i = 0; i < my_investment['buy_X'].length;i++){
        ind = new_date.indexOf(my_investment['buy_X'][i])
        markpoints.push({name: 'buy', value: 'buy', xAxis: ind, yAxis: my_investment['buy_Y'][i],itemStyle:{color:'#61a0a8'}})
      }
      for (var i = 0; i < my_investment['sell_X'].length;i++){
        ind = new_date.indexOf(my_investment['sell_X'][i])
        markpoints.push({name: 'sell', value: 'sell', xAxis: ind, yAxis: my_investment['sell_Y'][i],itemStyle:{color:'#c23531'}})
      }
      option = {
        animation: false,
        color: color_list,
        title: {
          left: 'center'
        },
        legend: {
          top: 30,
          data: ['GOOGLE', 'MA5', 'MA10', 'MA20', 'MA30','predicted close','sell','buy']
        },
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        axisPointer: {
          link: [{
            xAxisIndex: [0, 1]
          }]
        },
        dataZoom: [{
          type: 'slider',
          xAxisIndex: [0, 1],
          realtime: false,
          start: 0,
          end: 100,
          top: 65,
          height: 20,
          handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '120%'
        }, {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 40,
          end: 70,
          top: 30,
          height: 20
        }],
        xAxis: [{
          type: 'category',
          data: new_date,
          boundaryGap : false,
          axisLine: { lineStyle: { color: '#777' } },
          axisLabel: {
            formatter: function (value) {
              return echarts.format.formatTime('MM-dd', value);
            }
          },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            show: true
          }
        }, {
          type: 'category',
          gridIndex: 1,
          data: GOOGLE['date'],
          scale: true,
          boundaryGap : false,
          splitLine: {show: false},
          axisLabel: {show: false},
          axisTick: {show: false},
          axisLine: { lineStyle: { color: '#777' } },
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            type: 'shadow',
            label: {show: false},
            triggerTooltip: true,
            handle: {
              show: true,
              margin: 30,
              color: '#B80C00'
            }
          }
        }],
        yAxis: [{
          scale: true,
          splitNumber: 2,
          axisLine: { lineStyle: { color: '#777' } },
          splitLine: { show: true },
          axisTick: { show: false },
          axisLabel: {
            inside: true,
            formatter: '{value}\n'
          }
        }, {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: {show: false},
          axisLine: {show: false},
          axisTick: {show: false},
          splitLine: {show: false}
        }],
        grid: [{
          left: 20,
          right: 20,
          top: 110,
        }, {
          left: 20,
          right: 20,
          top: 400
        }],
        graphic: [{
          type: 'group',
          left: 'center',
          top: 70,
          width: 300,
          bounding: 'raw',
          children: [{
            id: 'MA5',
            type: 'text',
            style: {fill: color_list[1]},
            left: 0
          }, {
            id: 'MA10',
            type: 'text',
            style: {fill: color_list[2]},
            left: 'center'
          }, {
            id: 'MA20',
            type: 'text',
            style: {fill: color_list[3]},
            right: 0
          }]
        }],
        series: [{
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#7fbe9e'
            },
            emphasis: {
              color: '#140'
            }
          },
          data: GOOGLE['volume']
        }, {
          type: 'candlestick',
          name: 'GOOGLE',
          data: GOOGLE['data'],
          markPoint: {
            data: markpoints
          },
          itemStyle: {
            normal: {
              color: '#ef232a',
              color0: '#14b143',
              borderColor: '#ef232a',
              borderColor0: '#14b143'
            },
            emphasis: {
              color: 'black',
              color0: '#444',
              borderColor: 'black',
              borderColor0: '#444'
            }
          }
        }, {
          name: 'MA5',
          type: 'line',
          data: dataMA5,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          }
        }, {
          name: 'MA10',
          type: 'line',
          data: dataMA10,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          }
        }, {
          name: 'MA20',
          type: 'line',
          data: dataMA20,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          }
        },
        {
          name: 'MA30',
          type: 'line',
          data: dataMA30,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          }
        },
        {
          name: 'predicted close',
          type: 'line',
          data: predicted_val,
          smooth: false,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2
            }
          }
        }]
      };

      var chart_stock = echarts.init(document.getElementById('div_output'));
      chart_stock.setOption(option,true);

    });
  }, 500);
})
