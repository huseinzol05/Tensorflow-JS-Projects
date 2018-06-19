function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function async_sleep(ms) {
  await sleep(ms);
}
function wasting_time(count){
  for(var n = 0; n < count; n++){
    // do nothing
  }
}
function arange(start, end, skip){
  var arr = [start]
  while((parseFloat(arr.slice(-1))+parseFloat(skip)) < (end)) arr.push(parseFloat(arr.slice(-1))+parseFloat(skip))
  return arr
}
async function tf_tolist(a){
  var arr = []
  for(var i = 0; i < a.shape[0];i++)arr.push(Array.prototype.slice.call(await a.slice([0,0],[1,-1]).data()));
  return arr
}
function tf_str_tolist(a){
  return JSON.parse(a.toString().slice(7).trim())
}
function tf_slice_tolist(a){
  var arr = []
  for(var i = 0; i < a.shape[0];i++) {
    var val = JSON.parse(a.slice([i,0],[1,1]).toString().slice(7).trim().replace(',',''))[0][0]
    arr.push(val);
  }
  return arr
}
function tf_nj_list(a){
  var arr = nj.zeros([a.shape[0],a.shape[1]]).tolist();
  for(var i = 0; i < a.shape[0];i++){
    for(var k = 0; k < a.shape[1];k++) arr[i][k] = JSON.parse(a.slice([i,k],[1,1]).toString().slice(7).trim().replace(',',''))[0][0]
  }
  return arr
}
function tf_nj_list_flatten(a){
  var arr = nj.zeros([a.shape[0]]).tolist();
  for(var i = 0; i < a.shape[0];i++) arr[i] = JSON.parse(a.slice([i],[1]).toString().slice(7).trim())[0]
  return arr
}
function label_encoder(arr){
  var unique = [...new Set(arr)];
  var encoder = []
  for(var i = 0; i < arr.length;i++) encoder.push(unique.indexOf(arr[i]))
  return {'unique':unique,'encode':encoder}
}
function shuffle(arr1, arr2) {
  var index = arr1.length;
  var rnd, tmp1, tmp2;
  while (index) {
    rnd = Math.floor(Math.random() * index);
    index -= 1;
    tmp1 = arr1[index];
    tmp2 = arr2[index];
    arr1[index] = arr1[rnd];
    arr2[index] = arr2[rnd];
    arr1[rnd] = tmp1;
    arr2[rnd] = tmp2;
  }
}
function get_index(arr, val){
  var indices = []
  for(var i = 0; i < arr.length;i++) if(arr[i] == val) indices.push(i)
  return indices
}
function get_elements(arr, indices){
  var elements = []
  for (i in indices) {
    elements.push(arr[indices[i]])
  }
  return elements
}
function pca(a, n_components){
  a = tf.tensor(a)
  tiled=tf.matMul(tf.ones([150,1]), a.mean(0).reshape([1,-1]))
  sub = tf.sub(a,tiled)
  sub_list = tf_str_tolist(tf.matMul(sub.transpose(),sub))
  eig=numeric.eig(sub_list)
  eigenvectors = tf.tensor(eig.E.x).slice([0,0],[-1,n_components])
  return tf.matMul(sub, eigenvectors)
}
function svd(a, n_components){
  output_svd = numeric.svd(a)
  tensor_U = tf.tensor(output_svd['U'])
  tensor_V = tf.tensor(output_svd['V']).slice([0,0],[-1,n_components])
  return tf.matMul(tensor_U, tensor_V)
}
function metrics(a){
  a = tf.tensor(a)
  squared = tf.square(tf.sub(a,a.mean(0))).sum(0)
  variance = tf.div(squared,tf.scalar(a.shape[0]-1))
  std = tf.sqrt(tf.div(squared,tf.scalar(a.shape[0]-1)))
  return {'std':std,'variance':variance}
}
function standard_scaling(a){
  squared = tf.square(tf.sub(a,a.mean(0))).sum(0)
  variance = tf.div(squared,tf.scalar(a.shape[0]-1))
  std = tf.sqrt(tf.div(squared,tf.scalar(a.shape[0]-1)))
  return tf.div(tf.sub(x,x.mean(0)),std)
}
function minmax_scaling(a){
  a = tf.tensor(a)
  return tf.div(tf.sub(a,a.min(0)), tf.sub(a.max(0),a.min(0)))
}
function one_hot(label_encoder){
  var onehot = nj.zeros([label_encoder['encode'].length,label_encoder['unique'].length]).tolist();
  for(var i = 0; i < label_encoder['encode'].length;i++) onehot[i][label_encoder['encode'][i]] = 1
  return onehot
}
function plot_map(data, X_mean, Y_mean, arr_X, arr_Y){
  var data_map = [
    {
      z: data['z'],
      x: data['xx'],
      y: data['y_'],
      type: 'heatmap',
      opacity: 0.4,
      colorscale: 'Jet',
      colorbar: {
        title: 'Label',
        titleside: 'top',
        tickvals: [...Array(data['label'].length).keys()],
        ticktext: data['label']
      }
    },
    {
      x: data['x'],
      y: data['y'],
      mode: 'markers',
      type: 'scatter',
      marker: {
        colorscale: 'Jet',
        color: data['color']
      }
    }
  ];
  var layout = {
    title: 'Decision Boundaries',
    showlegend: false,
    annotations: []
  }
  for(var i =0; i <data['label'].length;i++){
    data_map.push({
      x: [X_mean, arr_X[i]],
      y: [Y_mean, arr_Y[i]],
      mode: 'lines',
      line: {
        color: 'rgb(0,0,0)',
        width: 1
      }
    })
    layout['annotations'].push({
      x: arr_X[i],
      y: arr_Y[i],
      xref: 'x',
      yref: 'y',
      text: data['label'][i],
      showarrow: true,
      arrowhead: 3,
      ax: 0,
      ay: -20,
      arrowside:'start',
      font: {
        size: 16
      },
    })
  }
  Plotly.newPlot('div_output', data_map, layout);
}

function plot_graph(data){
  var trace_loss = {
    x: data['epoch'],
    y: data['loss'],
    mode: 'lines',
    type: 'scatter'
  }
  var layout_loss = {
    'title': 'Loss Graph',
    xaxis: {
      autotick: true
    },
    margin: {
      b: 25,
      pad: 4,
      l:25
    }
  }
  var trace_acc = {
    x: data['epoch'],
    y: data['accuracy'],
    mode: 'lines',
    type: 'scatter',
    name: 'Training accuracy'
  }
  var layout_acc = {
    'title': 'Accuracy Graph',
    xaxis: {
      autotick: true
    },
    margin: {
      b: 25,
      pad: 4,
      l:25
    }
  }
  Plotly.newPlot('div_loss', [trace_loss], layout_loss);
  Plotly.newPlot('div_acc', [trace_acc], layout_acc);
}
function plot_joyplot(x_outside,div,title,btm_gap=0.1, top_gap=0.25, gap=0.1,ratio=1.0){
  concat_x = [], concat_y = []
  for (var out = 0; out < x_outside.length; out++) {
    out_hist = histogram(x_outside[out],100)
    new_x = out_hist['x']
    new_y = out_hist['y']

    if(out == 0){
      for (var i = 0;i < new_y.length;i++) {
        new_y[i] += 0.1;
      }
    }
    else{
      for (var i = 0;i < new_y.length;i++) {
        new_y[i] += (0.1+0.1*out);
      }
    }
    concat_y.push(new_y)
    concat_x.push(new_x)
  }
  var data_joyplot = [], out_min_x = 0, out_max_x = 0
  for (var out = 0; out < x_outside.length; out++) {

    min_y = Math.min(...concat_y[out]), max_y = Math.max(...concat_y[out])
    min_x = Math.min(...concat_x[out]), max_x = Math.max(...concat_x[out])
    if(min_x > out_min_x) out_min_x = min_x
    if(max_x > out_max_x) out_max_x = max_x
    data_joyplot.push({
      y:[min_y,min_y],
      x:[min_x,max_x],
      line:{
        color: '#FFFFFF',
        width: 0.1
      },
      type:'scatter',
      mode:'lines'
    })
    mul_concat_y = []
    for (var k = 0; k < concat_y[out].length; k++) mul_concat_y[k] = concat_y[out][k] * ratio
    data_joyplot.push({
      name:out,
      fillcolor:'rgba(222, 34, 36, 0.8)',
      mode: 'lines',
      y:mul_concat_y,
      x:concat_x[out],
      line:{
        color: '#FFFFFF',
        width: 0.5,
        shape: 'spline'
      },
      type:'scatter',
      fill:'tonexty'
    })
  }
  tickvals = []
  for(var i = 0; i < concat_y.length;i++) tickvals.push(Math.min(...concat_y[i]))
  var layout={
    "title":title,
    "yaxis":{
      "title":"epoch",
      "ticklen":4,
      "gridwidth":1,
      "showgrid":true,
      "range":[
        0,
        Math.min(...concat_y[concat_y.length-1]) +0.25
      ],
      "gridcolor":"rgb(255,255,255)",
      "zeroline":false,
      "showline":false,
      "ticktext":arange(0,concat_y.length,1),
      "tickvals":tickvals
    },
    "showlegend":false,
    "xaxis":{
      "title":"tensor values",
      "ticklen":4,
      "dtick":0.1,
      "showgrid":false,
      "range":[out_min_x, out_max_x + 0.05],
      "zeroline":false,
      "showline":false
    },
    "hovermode":"closest",
    "font":{
      "family":"Balto"
    }
  }
  Plotly.newPlot(div, data_joyplot, layout);
}
function histogram(arr,bins=30,norm=true,jitter=0.001){
  var max_arr = Math.max(...arr)
  var min_arr = Math.min(...arr)
  var arr_bins = []
  var start = min_arr
  var skip = (max_arr-min_arr)/bins
  var x_arange = []
  while(arr_bins.length<bins){
    arr_bins.push([start+jitter,start+skip])
    x_arange.push((start+jitter+start+skip)/2)
    start += skip
  }
  var hist = nj.zeros([bins]).tolist()
  for(var i = 0; i < arr.length;i++){
    for(var b = 0; b < arr_bins.length;b++){
      if(arr[i] >= arr_bins[b][0] && arr[i] <= arr_bins[b][1]){
        hist[b] += 1
        break
      }
    }
  }
  function getSum(total, num) {
    return total + num;
  }
  sum_hist = hist.reduce(getSum)
  if(norm) for(var b = 0; b < arr_bins.length;b++) hist[b] /= sum_hist
  return {'y':hist,'x':x_arange}
}
