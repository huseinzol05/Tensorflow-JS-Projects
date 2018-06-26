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
  myRegression = ecStat.regression('polynomial', EXPORT['polynomial'], 3);
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
      text: 'Malaysia export 2008-2017 Sales, K = 3',
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
      nested += "<td>"+to_list[i][k].toFixed(3)+"</td>"
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
