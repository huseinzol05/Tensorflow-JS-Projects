var chart = echarts.init(document.getElementById('div_heatmap_sale'));
max = 0;
EXPORT['heatmap'] = EXPORT['heatmap'].map(function (item) {
  if(item[2]>max) max=item[2];
  return [item[1], item[0], item[2]];
});
chart.setOption({
  title: {
    text: 'Malaysia export 2008-2017 Sales',
    left: 'center',
    top: 16
  },
  tooltip: {
    position: 'top'
  },
  animation: false,
  grid: {
    height: '50%',
    y: '10%'
  },
  xAxis: {
    type: 'category',
    data: EXPORT['x_axis'],
    splitArea: {
      show: true
    },
    axisLabel: {
      interval: 0,
      rotate: 90
    }
  },
  yAxis: {
    type: 'category',
    data: EXPORT['y_axis'],
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: max,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '0%'
  },
  series: [{
    name: 'Sales',
    type: 'heatmap',
    data: EXPORT['heatmap'],
    label: {
      normal: {
        show: false
      }
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
})
var chart = echarts.init(document.getElementById('div_heatmap_share'));
max = 0;
EXPORT['heatmap_shares'] = EXPORT['heatmap_shares'].map(function (item) {
  if(item[2]>max) max=item[2];
  return [item[1], item[0], item[2]];
});
chart.setOption({
  title: {
    text: 'Malaysia export 2008-2017 Shares',
    left: 'center',
    top: 16
  },
  tooltip: {
    position: 'top'
  },
  animation: false,
  grid: {
    height: '50%',
    y: '10%'
  },
  xAxis: {
    type: 'category',
    data: EXPORT['x_axis'],
    splitArea: {
      show: true
    },
    axisLabel: {
      interval: 0,
      rotate: 90
    }
  },
  yAxis: {
    type: 'category',
    data: EXPORT['y_axis'],
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: max,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '0%'
  },
  series: [{
    name: 'Shares',
    type: 'heatmap',
    data: EXPORT['heatmap_shares'],
    label: {
      normal: {
        show: false
      }
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
})

var chart = echarts.init(document.getElementById('div_correlation'));

chart.setOption({
  title: {
    text: 'Product correlation',
    left: 'center',
    top: 16
  },
  tooltip: {
    position: 'top'
  },
  tooltip: {
        formatter: function (params) {
            return params.value[2] + ': ' + EXPORT['x_axis'][params.value[1]] + ' & ' + EXPORT['x_axis'][params.value[0]];
        },
        position: 'top'
    },
  animation: false,
  grid: {
    height: '50%',
    y: '10%'
  },
  xAxis: {
    type: 'category',
    data: EXPORT['x_axis'],
    splitArea: {
      show: true
    },
    axisLabel: {
      interval: 0,
      rotate: 90
    }
  },
  yAxis: {
    type: 'category',
    data: EXPORT['x_axis'],
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: 1,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '0%'
  },
  series: [{
    name: 'correlation',
    type: 'heatmap',
    data: EXPORT['correlation'],
    label: {
      normal: {
        show: false
      }
    },
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
})

var schema = EXPORT['schema_scatter']
var rawData = EXPORT['scatter_plot']
var CATEGORY_DIM_COUNT = schema.length - 1;
var GAP = 1;
var BASE_LEFT = 5;
var BASE_TOP = 10;
var GRID_WIDTH = (100 - BASE_LEFT - GAP) / CATEGORY_DIM_COUNT - GAP;
var GRID_HEIGHT = (100 - BASE_TOP - GAP) / CATEGORY_DIM_COUNT - GAP;
var CATEGORY_DIM = schema.length-1;
var SYMBOL_SIZE = 4;

function retrieveScatterData(data, dimX, dimY) {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    var item = [data[i][dimX], data[i][dimY]];
    item[CATEGORY_DIM] = data[i][CATEGORY_DIM];
    result.push(item);
  }
  return result;
}

function generateGrids(option) {
  var index = 0;

  for (var i = 0; i < CATEGORY_DIM_COUNT; i++) {
    for (var j = 0; j < CATEGORY_DIM_COUNT; j++) {
      if (CATEGORY_DIM_COUNT - i + j >= CATEGORY_DIM_COUNT) {
        continue;
      }

      option.grid.push({
        left: BASE_LEFT + i * (GRID_WIDTH + GAP) + '%',
        top: BASE_TOP + j * (GRID_HEIGHT + GAP) + '%',
        width: GRID_WIDTH + '%',
        height: GRID_HEIGHT + '%'
      });

      option.brush.xAxisIndex && option.brush.xAxisIndex.push(index);
      option.brush.yAxisIndex && option.brush.yAxisIndex.push(index);

      option.xAxis.push({
        splitNumber: 3,
        position: 'top',
        axisLine: {
          show:false,
          onZero: false
        },
        axisTick: {
          show:false,
          inside: true
        },
        axisLabel: {
          show:false
        },
        type: 'value',
        gridIndex: index,
        scale: true
      });

      option.yAxis.push({
        splitNumber: 3,
        position: 'right',
        axisLine: {
          show:false,
          onZero: false
        },
        axisTick: {
          show:false,
          inside: true
        },
        axisLabel: {
          show:false
        },
        type: 'value',
        gridIndex: index,
        scale: true
      });

      option.series.push({
        type: 'scatter',
        symbolSize: SYMBOL_SIZE,
        xAxisIndex: index,
        yAxisIndex: index,
        data: retrieveScatterData(rawData, i, j)
      });

      option.visualMap.seriesIndex.push(option.series.length - 1);

      index++;
    }
  }
}


var option = {
  animation: false,
  brush: {
    brushLink: 'all',
    xAxisIndex: [],
    yAxisIndex: [],
    inBrush: {
      opacity: 1
    }
  },
  visualMap: {
    type: 'piecewise',
    categories: ['AGRICULTURE','MANUFACTURED','MINING','OTHERS'],
    dimension: CATEGORY_DIM,
    orient: 'horizontal',
    top: 0,
    left: 'center',
    inRange: {
      color: ['#c23531','#2f4554', '#61a0a8','yellow']
    },
    outOfRange: {
      color: '#ddd'
    },
    seriesIndex: [0]
  },
  tooltip: {
    trigger: 'item'
  },
  parallelAxis: [
    {dim: 0, name: schema[0].text},
    {dim: 1, name: schema[1].text},
    {dim: 2, name: schema[2].text},
    {dim: 3, name: schema[3].text},
    {dim: 4, name: schema[4].text},
    {dim: 5, name: schema[5].text},
    {dim: 6, name: schema[6].text},
    {dim: 7, name: schema[7].text},
    {dim: 8, name: schema[8].text},
    {dim: 9, name: schema[9].text}
  ],
  parallel: {
    bottom: '5%',
    left: '5%',
    height: '31%',
    width: '55%',
    parallelAxisDefault: {
      type: 'value',
      nameLocation: 'end',
      nameGap: 20,
      splitNumber: 3,
      nameTextStyle: {
        fontSize: 14
      },
      axisLine: {
        lineStyle: {
          color: '#555'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#555'
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#555'
        }
      }
    }
  },
  grid: [],
  xAxis: [],
  yAxis: [],
  series: [
    {
      name: 'parallel',
      type: 'parallel',
      smooth: true,
      lineStyle: {
        normal: {
          width: 2,
          opacity: 0.5
        }
      },
      data: rawData
    }
  ]
};
generateGrids(option);
var chart = echarts.init(document.getElementById('div_scatter'));
chart.setOption(option, true)


var indices = {
  group: 0
};
var schema = EXPORT['schema_line']

var groupCategories = [];
var groupColors = [];

function normalizeData(originData) {
  var groupMap = {};
  originData.forEach(function (row) {
    var groupName = row[indices.group];
    if (!groupMap.hasOwnProperty(groupName)) {
      groupMap[groupName] = 1;
    }
  });

  originData.forEach(function (row) {
    row.forEach(function (item, index) {
      if (index !== indices.group) {
        row[index] = parseFloat(item) || 0;
      }
    });
  });

  for (var groupName in groupMap) {
    if (groupMap.hasOwnProperty(groupName)) {
      groupCategories.push(groupName);
    }
  }
  var hStep = Math.round(300 / (groupCategories.length - 1));
  for (var i = 0; i < groupCategories.length; i++) {
    groupColors.push(echarts.color.modifyHSL('#5A94DF', hStep * i));
  }
}

function getOption(data) {

  var lineStyle = {
    normal: {
      width: 2,
      opacity: 0.5
    }
  };

  return {
    title: [
      {
        text: 'Groups',
        top: 0,
        left: 0,
        textStyle: {
          color: '#fff'
        }
      }
    ],
    visualMap: {
      show: true,
      type: 'piecewise',
      categories: groupCategories,
      dimension: indices.group,
      inRange: {
        color: groupColors
      },
      outOfRange: {
        color: ['#ccc']
      },
      top: 20,
      textStyle: {
        color: 'black'
      },
      realtime: false
    },
    parallelAxis: [,
      {dim: 1, name: schema[1].name, nameLocation: 'end'},
      {dim: 2, name: schema[2].name, nameLocation: 'end'},
      {dim: 3, name: schema[3].name, nameLocation: 'end'},
      {dim: 4, name: schema[4].name, nameLocation: 'end'},
      {dim: 5, name: schema[5].name, nameLocation: 'end'},
      {dim: 6, name: schema[6].name, nameLocation: 'end'},
      {dim: 7, name: schema[7].name, nameLocation: 'end'},
      {dim: 8, name: schema[8].name, nameLocation: 'end'},
      {dim: 9, name: schema[9].name, nameLocation: 'end'},
      {dim: 10, name: schema[10].name, nameLocation: 'end'}
    ],
    parallel: {
      left: 280,
      top: 20,
      // top: 150,
      // height: 300
      layout: 'vertical',
      parallelAxisDefault: {
        type: 'value',
        name: 'nutrients',
        nameLocation: 'end',
        nameGap: 20,
        nameTextStyle: {
          color: 'black',
          fontSize: 14
        },
        axisLine: {
          lineStyle: {
            color: '#aaa'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#777'
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: 'white'
          },
          show:false
        },
        realtime: false
      }
    },
    animation: false,
    series: [
      {
        name: 'exports',
        type: 'parallel',
        lineStyle: lineStyle,
        inactiveOpacity: 0,
        activeOpacity: 1,
        progressive: 500,
        smooth: true,
        data: data
      }
    ]
  };
}

var chart = echarts.init(document.getElementById('div_line'));
normalizeData(EXPORT['line_plot']);
chart.setOption(option = getOption(EXPORT['line_plot']));


var schema = EXPORT['schema_4_axis']
var app = {};
option = null;

var axisColors = {
  'xAxisLeft': '#2A8339',
  'xAxisRight': '#367DA6',
  'yAxisTop': '#A68B36',
  'yAxisBottom': '#BD5692'
};
var colorBySchema = {};

var fieldIndices = schema.reduce(function (obj, item) {
  obj[item.name] = item.index;
  return obj;
}, {});

var groupCategories = [];
var groupColors = [];
var data;

function normalizeData_4_axis(originData) {
  var groupMap = {};
  originData.forEach(function (row) {

  });

  originData.forEach(function (row) {
    row.forEach(function (item, index) {
    });
  });

  for (var groupName in groupMap) {
    if (groupMap.hasOwnProperty(groupName)) {
      groupCategories.push(groupName);
    }
  }
  var hStep = Math.round(300 / (groupCategories.length - 1));
  for (var i = 0; i < groupCategories.length; i++) {
    groupColors.push(echarts.color.modifyHSL('#5A94DF', hStep * i));
  }

  return originData;
}

function makeAxis(dimIndex, id, name, nameLocation) {
  var axisColor = axisColors[id.split('-')[dimIndex]];
  colorBySchema[name] = axisColor;
  return {
    id: id,
    name: name,
    nameLocation: nameLocation,
    nameGap: nameLocation === 'middle' ? 30 : 10,
    gridId: id,
    splitLine: {show: false},
    axisLine: {
      lineStyle: {
        color: axisColor
      }
    },
    axisLabel: {
      textStyle: {
        color: axisColor
      }
    },
    axisTick: {
      lineStyle: {
        color: axisColor
      }
    }
  };
}

function makeSeriesData(xLeftOrRight, yTopOrBottom) {
  return data.map(function (item, idx) {
    var schemaX = app.config[xLeftOrRight];
    var schemaY = app.config[yTopOrBottom];
    return [
      item[fieldIndices[schemaX]], // 0: xValue
      item[fieldIndices[schemaY]], // 1: yValue
      item[1],                     // 2: group
      item[0],                     // 3: name
      schemaX,                     // 4: schemaX
      schemaY,                     // 5: schemaY
      idx                          // 6
    ];
  });
}

function makeSeries(xLeftOrRight, yTopOrBottom) {
  var id = xLeftOrRight + '-' + yTopOrBottom;
  return {
    zlevel: 1,
    type: 'scatter',
    name: 'exports',
    xAxisId: id,
    yAxisId: id,
    symbolSize: 8,
    itemStyle: {
      emphasis: {
        color: '#fff'
      }
    },
    animationThreshold: 5000,
    progressiveThreshold: 5000,
    data: makeSeriesData(xLeftOrRight, yTopOrBottom)
  };
}

function makeDataZoom(opt) {
  return echarts.util.extend({
    type: 'slider',
    fillerColor: 'rgba(255,255,255,0.1)',
    borderColor: '#777',
    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    handleSize: '60%',
    handleStyle: {
      color: '#aaa'
    },
    textStyle: {
      color: '#aaa'
    },
    filterMode: 'empty',
    realtime: false
  }, opt);
}

function getOption_4_axis(data) {
  var gridWidth = '35%';
  var gridHeight = '35%';
  var gridLeft = 80;
  var gridRight = 50;
  var gridTop = 50;
  var gridBottom = 80;

  return {
    axisPointer: {
      show: true,
      snap: true,
      lineStyle: {
        type: 'dashed'
      },
      label: {
        show: true,
        margin: 6,
        backgroundColor: '#556',
        textStyle: {
          color: '#fff'
        }
      },
      link: [{
        xAxisId: ['xAxisLeft-yAxisTop', 'xAxisLeft-yAxisBottom']
      }, {
        xAxisId: ['xAxisRight-yAxisTop', 'xAxisRight-yAxisBottom']
      }, {
        yAxisId: ['xAxisLeft-yAxisTop', 'xAxisRight-yAxisTop']
      }, {
        yAxisId: ['xAxisLeft-yAxisBottom', 'xAxisRight-yAxisBottom']
      }]
    },
    xAxis: [
      makeAxis(0, 'xAxisLeft-yAxisTop', 'Palm oil & palm oil based agriculture products', 'middle'),
      makeAxis(0, 'xAxisLeft-yAxisBottom', 'Palm oil & palm oil based agriculture products', 'middle'),
      makeAxis(0, 'xAxisRight-yAxisTop', 'Processed food', 'middle'),
      makeAxis(0, 'xAxisRight-yAxisBottom', 'Processed food', 'middle')
    ],
    yAxis: [
      makeAxis(1, 'xAxisLeft-yAxisTop', 'Natural rubber', 'end'),
      makeAxis(1, 'xAxisLeft-yAxisBottom', 'Petroleum Products', 'end'),
      makeAxis(1, 'xAxisRight-yAxisTop', 'Natural rubber', 'end'),
      makeAxis(1, 'xAxisRight-yAxisBottom', 'Petroleum Products', 'end')
    ],
    grid: [{
      id: 'xAxisLeft-yAxisTop',
      left: gridLeft,
      top: gridTop,
      width: gridWidth,
      height: gridHeight
    }, {
      id: 'xAxisLeft-yAxisBottom',
      left: gridLeft,
      bottom: gridBottom,
      width: gridWidth,
      height: gridHeight
    }, {
      id: 'xAxisRight-yAxisTop',
      right: gridRight,
      top: gridTop,
      width: gridWidth,
      height: gridHeight
    }, {
      id: 'xAxisRight-yAxisBottom',
      right: gridRight,
      bottom: gridBottom,
      width: gridWidth,
      height: gridHeight
    }],
    dataZoom: [
      makeDataZoom({
        width: gridWidth,
        height: 20,
        left: gridLeft,
        bottom: 10,
        xAxisIndex: [0, 1]
      }),
      makeDataZoom({
        width: gridWidth,
        height: 20,
        right: gridRight,
        bottom: 10,
        xAxisIndex: [2, 3]
      }),
      makeDataZoom({
        orient: 'vertical',
        width: 20,
        height: gridHeight,
        left: 10,
        top: gridTop,
        yAxisIndex: [0, 2]
      }),
      makeDataZoom({
        orient: 'vertical',
        width: 20,
        height: gridHeight,
        left: 10,
        bottom: gridBottom,
        yAxisIndex: [1, 3]
      })
    ],
    visualMap: [{
      show: false,
      type: 'piecewise',
      categories: groupCategories,
      dimension: 2,
      inRange: {
        color: groupColors //['#d94e5d','#eac736','#50a3ba']
      },
      outOfRange: {
        color: ['#ccc'] //['#d94e5d','#eac736','#50a3ba']
      },
      top: 20,
      textStyle: {
        color: '#fff'
      },
      realtime: false
    }],
    series: [
      makeSeries('xAxisLeft', 'yAxisTop'),
      makeSeries('xAxisLeft', 'yAxisBottom'),
      makeSeries('xAxisRight', 'yAxisTop'),
      makeSeries('xAxisRight', 'yAxisBottom')
    ],
    animationEasingUpdate: 'cubicInOut',
    animationDurationUpdate: 1000
  };
}

var fieldNames = schema.map(function (item) {
  return item.name;
})

app.config = {
  xAxisLeft: 'Palm oil & palm oil based agriculture products',
  yAxisTop: 'Natural rubber',
  xAxisRight: 'Processed food',
  yAxisBottom: 'Petroleum Products',
  onChange: function () {
    if (data) {
      colorBySchema[app.config.xAxisLeft] = axisColors.xAxisLeft;
      colorBySchema[app.config.xAxisRight] = axisColors.xAxisRight;
      colorBySchema[app.config.yAxisTop] = axisColors.yAxisTop;
      colorBySchema[app.config.yAxisBottom] = axisColors.yAxisBottom;

      myChart.setOption({
        xAxis: [{
          name: app.config.xAxisLeft
        }, {
          name: app.config.xAxisLeft
        }, {
          name: app.config.xAxisRight
        }, {
          name: app.config.xAxisRight
        }],
        yAxis: [{
          name: app.config.yAxisTop
        }, {
          name: app.config.yAxisBottom
        }, {
          name: app.config.yAxisTop
        }, {
          name: app.config.yAxisBottom
        }],
        series: [{
          data: makeSeriesData('xAxisLeft', 'yAxisTop')
        }, {
          data: makeSeriesData('xAxisLeft', 'yAxisBottom')
        }, {
          data: makeSeriesData('xAxisRight', 'yAxisTop')
        }, {
          data: makeSeriesData('xAxisRight', 'yAxisBottom')
        }]
      });
    }
  }
};

app.configParameters = {
  xAxisLeft: {
    options: fieldNames
  },
  xAxisRight: {
    options: fieldNames
  },
  yAxisTop: {
    options: fieldNames
  },
  yAxisBottom: {
    options: fieldNames
  }
};

var myChart = echarts.init(document.getElementById('div_4_axis'));
data = normalizeData_4_axis(EXPORT['data_4_axis']);
myChart.setOption(option = getOption_4_axis(data));

option = {
  legend: {},
  tooltip: {
    trigger: 'axis',
    showContent: false
  },
  dataset: {
    source: EXPORT['data_stack']
  },
  xAxis: {type: 'category'},
  yAxis: {gridIndex: 0},
  grid: {top: '55%'},
  series: [
    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
    {
      type: 'pie',
      id: 'pie',
      radius: '30%',
      center: ['50%', '25%'],
      label: {
        formatter: '{b}: {@2008} ({d}%)'
      },
      encode: {
        itemName: 'product',
        value: '2008',
        tooltip: '2008'
      }
    }
  ]
};
var chart_pie = echarts.init(document.getElementById('div_pie'));
chart_pie.on('updateAxisPointer', function (event) {
  var xAxisInfo = event.axesInfo[0];
  if (xAxisInfo) {
    var dimension = xAxisInfo.value + 1;
    chart_pie.setOption({
      series: {
        id: 'pie',
        label: {
          formatter: '{b}: {@[' + dimension + ']} ({d}%)'
        },
        encode: {
          value: dimension,
          tooltip: dimension
        }
      }
    });
  }
});

chart_pie.setOption(option);


function calculate_function(x, arr){
  var total = 0
  for(var i = 0; i < arr.length-1;i++) {
    total += (Math.pow(x,arr.length-(i+1)) * arr[i])
  }
  total += arr[arr.length-1]
  return total
}

var myRegression;
$('#trainbutton').click(function(){
  myRegression = ecStat.regression('polynomial', EXPORT['polynomial'], parseInt($('#polynomial-k').val()));
  copy_polynomial = EXPORT['polynomial'].slice()
  for(var i = 0; i < parseInt($('#future').val());i++){
    future_year = myRegression['points'][myRegression['points'].length-1][0] + 1
    myRegression['points'].push([future_year,calculate_function(future_year,myRegression.parameter.reverse())])
    copy_polynomial.push([future_year,calculate_function(future_year,myRegression.parameter.reverse())])
  }
  myRegression.points.sort(function(a, b) {
    return a[0] - b[0];
  });

  option = {

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    title: {
      text: 'Malaysia export 2008-2017 Sales, K = '+parseInt($('#polynomial-k').val()),
      left: 'center',
      top: 16
    },
    xAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      min:2007,
      max:myRegression['points'][myRegression['points'].length-1][0]+1
    },
    yAxis: {
      type: 'value',
      min: -40,
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    grid: {
      top: 90
    },
    series: [{
      name: 'scatter',
      type: 'scatter',
      label: {
        emphasis: {
          show: true,
          position: 'right',
          textStyle: {
            color: 'blue',
            fontSize: 16
          }
        }
      },
      data: copy_polynomial
    },{
      name: 'line',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: myRegression.points,
      markPoint: {
        itemStyle: {
          normal: {
            color: 'transparent'
          }
        },
        label: {
          normal: {
            show: true,
            position: 'left',
            formatter: myRegression.expression,
            textStyle: {
              color: '#333',
              fontSize: 14
            }
          }
        },
        data: [{
          coord: myRegression.points[myRegression.points.length - 1]
        }]
      }
    }]
  };
  var chart = echarts.init(document.getElementById('div_polynomial'));
  chart.setOption(option, true);
  create_table();
})

function create_table(){
  batch_x = []
  for(var i = myRegression.points.length-parseInt($('#future').val()); i < myRegression.points.length;i++)batch_x.push(myRegression.points[i][1]/1000000)
  batch_x = tf.tensor(batch_x).reshape([-1,1]);
  to_list = tf_nj_list(f(batch_x).transpose())
  header = "<th>Products</th>"
  for(var i = 0; i < myRegression.points.length;i++) header += "<th>"+myRegression.points[i][0]+"</th>"
  $('#table-header').html(header);
  body = "";
  for(var i = 0; i < EXPORT['Y'][0].length;i++){
    nested = "<tr><td>"+EXPORT['x_axis'][i]+"</td>"
    for(var k = 0; k < EXPORT['Y'].length;k++){
      nested += "<td>"+EXPORT['Y'][k][i].toFixed(3)+"</td>"
    }
    for(var k = 0; k < to_list[i].length;k++){
      nested += "<td class='red-text'>"+to_list[i][k].toFixed(3)+"</td>"
    }
    nested += "</br>";
    body += nested
  }
  $('#table-body').html(body);
}

var dense_layer1 = tf.layers.dense({units: 100, activation: 'sigmoid'});
var dense_layer2 = tf.layers.dense({units: EXPORT.Y[0].length, activation: 'softmax'});
function f(x){
    return dense_layer2.apply(dense_layer1.apply(x));
}
var cost = (label, pred) => tf.abs(tf.sub(label,pred)).mean();
var optimizer = tf.train.adam(0.01);
batch_x = tf.tensor(EXPORT.X.slice(0,1));
batch_y = tf.tensor(EXPORT.Y.slice(0,1));
cost(batch_y, f(batch_x));
for(var n = 0; n < 100; n++){
  for(var k = 0; k < EXPORT.Y.length; k++){
    batch_x = tf.tensor(EXPORT.X.slice(k,k+1));
    batch_y = tf.tensor(EXPORT.Y.slice(k,k+1));
    optimizer.minimize(() => cost(batch_y, f(batch_x)));
  }
  cost(batch_y, f(batch_x)).print()
}

$('#trainbutton').click();

var latlong = {};
latlong.AD = {'latitude':42.5, 'longitude':1.5};
latlong.AE = {'latitude':24, 'longitude':54};
latlong.AF = {'latitude':33, 'longitude':65};
latlong.AG = {'latitude':17.05, 'longitude':-61.8};
latlong.AI = {'latitude':18.25, 'longitude':-63.1667};
latlong.AL = {'latitude':41, 'longitude':20};
latlong.AM = {'latitude':40, 'longitude':45};
latlong.AN = {'latitude':12.25, 'longitude':-68.75};
latlong.AO = {'latitude':-12.5, 'longitude':18.5};
latlong.AP = {'latitude':35, 'longitude':105};
latlong.AQ = {'latitude':-90, 'longitude':0};
latlong.AR = {'latitude':-34, 'longitude':-64};
latlong.AS = {'latitude':-14.3333, 'longitude':-170};
latlong.AT = {'latitude':47.3333, 'longitude':13.3333};
latlong.AU = {'latitude':-27, 'longitude':133};
latlong.AW = {'latitude':12.5, 'longitude':-69.9667};
latlong.AZ = {'latitude':40.5, 'longitude':47.5};
latlong.BA = {'latitude':44, 'longitude':18};
latlong.BB = {'latitude':13.1667, 'longitude':-59.5333};
latlong.BD = {'latitude':24, 'longitude':90};
latlong.BE = {'latitude':50.8333, 'longitude':4};
latlong.BF = {'latitude':13, 'longitude':-2};
latlong.BG = {'latitude':43, 'longitude':25};
latlong.BH = {'latitude':26, 'longitude':50.55};
latlong.BI = {'latitude':-3.5, 'longitude':30};
latlong.BJ = {'latitude':9.5, 'longitude':2.25};
latlong.BM = {'latitude':32.3333, 'longitude':-64.75};
latlong.BN = {'latitude':4.5, 'longitude':114.6667};
latlong.BO = {'latitude':-17, 'longitude':-65};
latlong.BR = {'latitude':-10, 'longitude':-55};
latlong.BS = {'latitude':24.25, 'longitude':-76};
latlong.BT = {'latitude':27.5, 'longitude':90.5};
latlong.BV = {'latitude':-54.4333, 'longitude':3.4};
latlong.BW = {'latitude':-22, 'longitude':24};
latlong.BY = {'latitude':53, 'longitude':28};
latlong.BZ = {'latitude':17.25, 'longitude':-88.75};
latlong.CA = {'latitude':54, 'longitude':-100};
latlong.CC = {'latitude':-12.5, 'longitude':96.8333};
latlong.CD = {'latitude':0, 'longitude':25};
latlong.CF = {'latitude':7, 'longitude':21};
latlong.CG = {'latitude':-1, 'longitude':15};
latlong.CH = {'latitude':47, 'longitude':8};
latlong.CI = {'latitude':8, 'longitude':-5};
latlong.CK = {'latitude':-21.2333, 'longitude':-159.7667};
latlong.CL = {'latitude':-30, 'longitude':-71};
latlong.CM = {'latitude':6, 'longitude':12};
latlong.CN = {'latitude':35, 'longitude':105};
latlong.CO = {'latitude':4, 'longitude':-72};
latlong.CR = {'latitude':10, 'longitude':-84};
latlong.CU = {'latitude':21.5, 'longitude':-80};
latlong.CV = {'latitude':16, 'longitude':-24};
latlong.CX = {'latitude':-10.5, 'longitude':105.6667};
latlong.CY = {'latitude':35, 'longitude':33};
latlong.CZ = {'latitude':49.75, 'longitude':15.5};
latlong.DE = {'latitude':51, 'longitude':9};
latlong.DJ = {'latitude':11.5, 'longitude':43};
latlong.DK = {'latitude':56, 'longitude':10};
latlong.DM = {'latitude':15.4167, 'longitude':-61.3333};
latlong.DO = {'latitude':19, 'longitude':-70.6667};
latlong.DZ = {'latitude':28, 'longitude':3};
latlong.EC = {'latitude':-2, 'longitude':-77.5};
latlong.EE = {'latitude':59, 'longitude':26};
latlong.EG = {'latitude':27, 'longitude':30};
latlong.EH = {'latitude':24.5, 'longitude':-13};
latlong.ER = {'latitude':15, 'longitude':39};
latlong.ES = {'latitude':40, 'longitude':-4};
latlong.ET = {'latitude':8, 'longitude':38};
latlong.EU = {'latitude':47, 'longitude':8};
latlong.FI = {'latitude':62, 'longitude':26};
latlong.FJ = {'latitude':-18, 'longitude':175};
latlong.FK = {'latitude':-51.75, 'longitude':-59};
latlong.FM = {'latitude':6.9167, 'longitude':158.25};
latlong.FO = {'latitude':62, 'longitude':-7};
latlong.FR = {'latitude':46, 'longitude':2};
latlong.GA = {'latitude':-1, 'longitude':11.75};
latlong.GB = {'latitude':54, 'longitude':-2};
latlong.GD = {'latitude':12.1167, 'longitude':-61.6667};
latlong.GE = {'latitude':42, 'longitude':43.5};
latlong.GF = {'latitude':4, 'longitude':-53};
latlong.GH = {'latitude':8, 'longitude':-2};
latlong.GI = {'latitude':36.1833, 'longitude':-5.3667};
latlong.GL = {'latitude':72, 'longitude':-40};
latlong.GM = {'latitude':13.4667, 'longitude':-16.5667};
latlong.GN = {'latitude':11, 'longitude':-10};
latlong.GP = {'latitude':16.25, 'longitude':-61.5833};
latlong.GQ = {'latitude':2, 'longitude':10};
latlong.GR = {'latitude':39, 'longitude':22};
latlong.GS = {'latitude':-54.5, 'longitude':-37};
latlong.GT = {'latitude':15.5, 'longitude':-90.25};
latlong.GU = {'latitude':13.4667, 'longitude':144.7833};
latlong.GW = {'latitude':12, 'longitude':-15};
latlong.GY = {'latitude':5, 'longitude':-59};
latlong.HK = {'latitude':22.25, 'longitude':114.1667};
latlong.HM = {'latitude':-53.1, 'longitude':72.5167};
latlong.HN = {'latitude':15, 'longitude':-86.5};
latlong.HR = {'latitude':45.1667, 'longitude':15.5};
latlong.HT = {'latitude':19, 'longitude':-72.4167};
latlong.HU = {'latitude':47, 'longitude':20};
latlong.ID = {'latitude':-5, 'longitude':120};
latlong.IE = {'latitude':53, 'longitude':-8};
latlong.IL = {'latitude':31.5, 'longitude':34.75};
latlong.IN = {'latitude':20, 'longitude':77};
latlong.IO = {'latitude':-6, 'longitude':71.5};
latlong.IQ = {'latitude':33, 'longitude':44};
latlong.IR = {'latitude':32, 'longitude':53};
latlong.IS = {'latitude':65, 'longitude':-18};
latlong.IT = {'latitude':42.8333, 'longitude':12.8333};
latlong.JM = {'latitude':18.25, 'longitude':-77.5};
latlong.JO = {'latitude':31, 'longitude':36};
latlong.JP = {'latitude':36, 'longitude':138};
latlong.KE = {'latitude':1, 'longitude':38};
latlong.KG = {'latitude':41, 'longitude':75};
latlong.KH = {'latitude':13, 'longitude':105};
latlong.KI = {'latitude':1.4167, 'longitude':173};
latlong.KM = {'latitude':-12.1667, 'longitude':44.25};
latlong.KN = {'latitude':17.3333, 'longitude':-62.75};
latlong.KP = {'latitude':40, 'longitude':127};
latlong.KR = {'latitude':37, 'longitude':127.5};
latlong.KW = {'latitude':29.3375, 'longitude':47.6581};
latlong.KY = {'latitude':19.5, 'longitude':-80.5};
latlong.KZ = {'latitude':48, 'longitude':68};
latlong.LA = {'latitude':18, 'longitude':105};
latlong.LB = {'latitude':33.8333, 'longitude':35.8333};
latlong.LC = {'latitude':13.8833, 'longitude':-61.1333};
latlong.LI = {'latitude':47.1667, 'longitude':9.5333};
latlong.LK = {'latitude':7, 'longitude':81};
latlong.LR = {'latitude':6.5, 'longitude':-9.5};
latlong.LS = {'latitude':-29.5, 'longitude':28.5};
latlong.LT = {'latitude':55, 'longitude':24};
latlong.LU = {'latitude':49.75, 'longitude':6};
latlong.LV = {'latitude':57, 'longitude':25};
latlong.LY = {'latitude':25, 'longitude':17};
latlong.MA = {'latitude':32, 'longitude':-5};
latlong.MC = {'latitude':43.7333, 'longitude':7.4};
latlong.MD = {'latitude':47, 'longitude':29};
latlong.ME = {'latitude':42.5, 'longitude':19.4};
latlong.MG = {'latitude':-20, 'longitude':47};
latlong.MH = {'latitude':9, 'longitude':168};
latlong.MK = {'latitude':41.8333, 'longitude':22};
latlong.ML = {'latitude':17, 'longitude':-4};
latlong.MM = {'latitude':22, 'longitude':98};
latlong.MN = {'latitude':46, 'longitude':105};
latlong.MO = {'latitude':22.1667, 'longitude':113.55};
latlong.MP = {'latitude':15.2, 'longitude':145.75};
latlong.MQ = {'latitude':14.6667, 'longitude':-61};
latlong.MR = {'latitude':20, 'longitude':-12};
latlong.MS = {'latitude':16.75, 'longitude':-62.2};
latlong.MT = {'latitude':35.8333, 'longitude':14.5833};
latlong.MU = {'latitude':-20.2833, 'longitude':57.55};
latlong.MV = {'latitude':3.25, 'longitude':73};
latlong.MW = {'latitude':-13.5, 'longitude':34};
latlong.MX = {'latitude':23, 'longitude':-102};
latlong.MY = {'latitude':2.5, 'longitude':112.5};
latlong.MZ = {'latitude':-18.25, 'longitude':35};
latlong.NA = {'latitude':-22, 'longitude':17};
latlong.NC = {'latitude':-21.5, 'longitude':165.5};
latlong.NE = {'latitude':16, 'longitude':8};
latlong.NF = {'latitude':-29.0333, 'longitude':167.95};
latlong.NG = {'latitude':10, 'longitude':8};
latlong.NI = {'latitude':13, 'longitude':-85};
latlong.NL = {'latitude':52.5, 'longitude':5.75};
latlong.NO = {'latitude':62, 'longitude':10};
latlong.NP = {'latitude':28, 'longitude':84};
latlong.NR = {'latitude':-0.5333, 'longitude':166.9167};
latlong.NU = {'latitude':-19.0333, 'longitude':-169.8667};
latlong.NZ = {'latitude':-41, 'longitude':174};
latlong.OM = {'latitude':21, 'longitude':57};
latlong.PA = {'latitude':9, 'longitude':-80};
latlong.PE = {'latitude':-10, 'longitude':-76};
latlong.PF = {'latitude':-15, 'longitude':-140};
latlong.PG = {'latitude':-6, 'longitude':147};
latlong.PH = {'latitude':13, 'longitude':122};
latlong.PK = {'latitude':30, 'longitude':70};
latlong.PL = {'latitude':52, 'longitude':20};
latlong.PM = {'latitude':46.8333, 'longitude':-56.3333};
latlong.PR = {'latitude':18.25, 'longitude':-66.5};
latlong.PS = {'latitude':32, 'longitude':35.25};
latlong.PT = {'latitude':39.5, 'longitude':-8};
latlong.PW = {'latitude':7.5, 'longitude':134.5};
latlong.PY = {'latitude':-23, 'longitude':-58};
latlong.QA = {'latitude':25.5, 'longitude':51.25};
latlong.RE = {'latitude':-21.1, 'longitude':55.6};
latlong.RO = {'latitude':46, 'longitude':25};
latlong.RS = {'latitude':44, 'longitude':21};
latlong.RU = {'latitude':60, 'longitude':100};
latlong.RW = {'latitude':-2, 'longitude':30};
latlong.SA = {'latitude':25, 'longitude':45};
latlong.SB = {'latitude':-8, 'longitude':159};
latlong.SC = {'latitude':-4.5833, 'longitude':55.6667};
latlong.SD = {'latitude':15, 'longitude':30};
latlong.SE = {'latitude':62, 'longitude':15};
latlong.SG = {'latitude':1.3667, 'longitude':103.8};
latlong.SH = {'latitude':-15.9333, 'longitude':-5.7};
latlong.SI = {'latitude':46, 'longitude':15};
latlong.SJ = {'latitude':78, 'longitude':20};
latlong.SK = {'latitude':48.6667, 'longitude':19.5};
latlong.SL = {'latitude':8.5, 'longitude':-11.5};
latlong.SM = {'latitude':43.7667, 'longitude':12.4167};
latlong.SN = {'latitude':14, 'longitude':-14};
latlong.SO = {'latitude':10, 'longitude':49};
latlong.SR = {'latitude':4, 'longitude':-56};
latlong.ST = {'latitude':1, 'longitude':7};
latlong.SV = {'latitude':13.8333, 'longitude':-88.9167};
latlong.SY = {'latitude':35, 'longitude':38};
latlong.SZ = {'latitude':-26.5, 'longitude':31.5};
latlong.TC = {'latitude':21.75, 'longitude':-71.5833};
latlong.TD = {'latitude':15, 'longitude':19};
latlong.TF = {'latitude':-43, 'longitude':67};
latlong.TG = {'latitude':8, 'longitude':1.1667};
latlong.TH = {'latitude':15, 'longitude':100};
latlong.TJ = {'latitude':39, 'longitude':71};
latlong.TK = {'latitude':-9, 'longitude':-172};
latlong.TM = {'latitude':40, 'longitude':60};
latlong.TN = {'latitude':34, 'longitude':9};
latlong.TO = {'latitude':-20, 'longitude':-175};
latlong.TR = {'latitude':39, 'longitude':35};
latlong.TT = {'latitude':11, 'longitude':-61};
latlong.TV = {'latitude':-8, 'longitude':178};
latlong.TW = {'latitude':23.5, 'longitude':121};
latlong.TZ = {'latitude':-6, 'longitude':35};
latlong.UA = {'latitude':49, 'longitude':32};
latlong.UG = {'latitude':1, 'longitude':32};
latlong.UM = {'latitude':19.2833, 'longitude':166.6};
latlong.US = {'latitude':38, 'longitude':-97};
latlong.UY = {'latitude':-33, 'longitude':-56};
latlong.UZ = {'latitude':41, 'longitude':64};
latlong.VA = {'latitude':41.9, 'longitude':12.45};
latlong.VC = {'latitude':13.25, 'longitude':-61.2};
latlong.VE = {'latitude':8, 'longitude':-66};
latlong.VG = {'latitude':18.5, 'longitude':-64.5};
latlong.VI = {'latitude':18.3333, 'longitude':-64.8333};
latlong.VN = {'latitude':16, 'longitude':106};
latlong.VU = {'latitude':-16, 'longitude':167};
latlong.WF = {'latitude':-13.3, 'longitude':-176.2};
latlong.WS = {'latitude':-13.5833, 'longitude':-172.3333};
latlong.YE = {'latitude':15, 'longitude':48};
latlong.YT = {'latitude':-12.8333, 'longitude':45.1667};
latlong.ZA = {'latitude':-29, 'longitude':24};
latlong.ZM = {'latitude':-15, 'longitude':30};
latlong.ZW = {'latitude':-20, 'longitude':30};

var max = -Infinity;
var min = Infinity;
EXPORT_MAP['map'].forEach(function (itemOpt) {
    if (itemOpt.value > max) {
        max = itemOpt.value;
    }
    if (itemOpt.value < min) {
        min = itemOpt.value;
    }
});

option_map = {
    title : {
        text: 'World Export (2017)',
        left: 'center',
        top: 'top'
    },
    tooltip : {
        trigger: 'item',
        formatter : function (params) {
            return params['data']['name'] + ': RM' + params['data']['value'][2]
        }
    },
    visualMap: {
        show: true,
        min: 0,
        max: max,
         calculable: true,
        inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d']
        },
        calculable: true
    },
    geo: {
        name: 'World Export (2017)',
        type: 'map',
        map: 'world',
        roam: true,
        zoom: 1.5,
        label: {
            emphasis: {
                show: false
            }
        },
        itemStyle: {
            normal: {
                borderColor: '#111'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    },
    series : [
        {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: EXPORT_MAP['map'].map(function (itemOpt) {
                return {
                    name: itemOpt.name,
                    value: [
                        latlong[itemOpt.code].longitude,
                        latlong[itemOpt.code].latitude,
                        itemOpt.value
                    ],
                    label: {
                        emphasis: {
                            position: 'right',
                            show: true
                        }
                    }
                };
            })
        }
    ]
};

var chartmap = echarts.init(document.getElementById('div_map'));
chartmap.setOption(option_map, true);

legendData = [], selected = {}, seriesData = [], count = 0
for(var i = 0; i <EXPORT_MAP['map'].length;i++){
  legendData.push(EXPORT_MAP['map'][i]['name'])
  if(count < 5) selected[EXPORT_MAP['map'][i]['name']]=true
  else selected[EXPORT_MAP['map'][i]['name']]=false
  seriesData.push({'name':EXPORT_MAP['map'][i]['name'],'value':EXPORT_MAP['map'][i]['value']})
  count++;
}

data_pie = {'legendData':legendData,'selected':selected,'seriesData':seriesData}
option_pie = {
    title : {
        text: 'Country Export(2017)',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: data_pie.legendData,
        selected: data_pie.selected
    },
    series : [
        {
            name: 'countries',
            type: 'pie',
            radius : '55%',
            center: ['40%', '50%'],
            data: data_pie.seriesData,
            label: {
                    formatter: '{b}: ({d}%)'
                },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

var chartmap_pie = echarts.init(document.getElementById('div_map_pie'));
chartmap_pie.setOption(option_pie, true);

setTimeout(function(){ $('.loadingscreen').slideUp(500); }, 3000);
