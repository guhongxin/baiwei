// 获取首页数据
var basUrl = "http://192.168.1.14:9009"
function lotIndex(callback, errCallBack) {
  $.ajax({
    url: basUrl + '/lot/index',
    type:'GET',
    dataType:'json',
    success: function(data){
      callback(data)
    },
    error: function (err) {
      errCallBack(err)
    }
  })
}
// 数据页查询。获取符合条件的批次Id集合
function lotList(param, callback, errCallBack) {
  $.ajax({
    url: basUrl + '/lot/list',
    type:'GET',
    data: param,
    dataType:'json',
    success: function(data){
      callback(data)
    },
    error: function (err) {
      errCallBack(err)
    }
  })
}
// 批次工序详情
function lotProcess(lotId, callback, errCallBack) {
  $.ajax({
    url: basUrl + '/lot/process/'+ lotId,
    type:'GET',
    dataType:'json',
    success: function(data){
      callback(data)
    },
    error: function (err) {
      errCallBack(err)
    }
  })
}
// 工序单元详情
function lotUnit(param, callback, errCallBack) {
  $.ajax({
    url: basUrl + '/lot/unit/'+ param.lotId + '/' + param.processName,
    type:'GET',
    dataType:'json',
    success: function(data){
      callback(data)
    },
    error: function (err) {
      errCallBack(err)
    }
  })
}

// 品牌列表
function commonBrand(param, callback, errCallBack) {
  $.ajax({
    url: basUrl + '/common/brand',
    type:'GET',
    data: param,
    dataType:'json',
    success: function(data){ 
      callback(data)
    },
    error: function (err) {
      errCallBack(err)
    }
  })
}

// 工序列表
function commonProcess(param, callback, errCallBack) {
  $.ajax({
    url: basUrl + '/common/process',
    type:'GET',
    data: param,
    dataType:'json',
    success: function(data){
      callback(data)
    },
    error: function (err) {
      errCallBack(err)
    }
  })
}

// 批次列表
function commonLot(param, callback, errCallBack) {
  $.ajax({
    url: basUrl + '/common/lot',
    type:'GET',
    data: param,
    dataType:'json',
    success: function(data){
      callback(data)
    },
    error: function (err) {
      errCallBack(err)
    }
  })
}
