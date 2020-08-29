// 数据模型
var vuedata = {
  currentModel: 0, // 当前模块 0 1
  lotId: undefined
}
var echartList;
var temp // 中间变量
$(document).ready(function(){
  // 初始化 默显示模块1
  // 获取
  echartList = new EchartList()
  if (vuedata.currentModel === 0) {
    showModule1();
  } else {
    showModule2();
  }
  $.fn.datetimepicker.dates['zh-CN'] = {
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    today: "今天",
    suffix: [],
    meridiem: ["上午", "下午"]
  }
  $('#startDate').datetimepicker({
    format: 'yyyy-mm-dd',
    initialDate: new Date(),
    language:'zh-CN',
    minView: 2
  }).on('changeDate',function(ev){
  　　var startTime = $('#startDate').val();
  　　$('#endDate').datetimepicker('setStartDate',startTime);
  });
  $('#endDate').datetimepicker({
    format: 'yyyy-mm-dd',
    initialDate: new Date(),
    language:'zh-CN',
    minView: 2
  }).on('changeDate',function(ev){
  　　var endTime = $('#endDate').val();
  　　$('#startDate').datetimepicker('setEndDate',endTime);
  });
  setPlanHeight($(".search")[0], $(".data-box"));
  setPlanHeight($(".search")[0], $(".module2"));
  window.addEventListener("resize", resizeThrottler, false);
  var resizeTimeout;
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        console.log("屏幕尺寸改变")
        resizeTimeout = null;
        setPlanHeight($(".search")[0], $(".data-box"));
        actualResizeHandler();
        // The actualResizeHandler will execute at a rate of 15fps
      }, 66);
    }
  }
  function actualResizeHandler() {
    var ww = window.innerWidth;
    var wh = window.innerHeight;
    var scaleX = ww / 1540;
    $("#boxer").css({
      transform: "scale(" + scaleX + ")"
    });
  }
  
  $(".fragment").click(function() {
    // 点击容器，弹出弹窗
    let processName = $(this).attr("data-processname");
    let obj = {
      lotId: vuedata.lotId,
      processName: processName
    }
    lotUnit(obj, function(res){
      getlotUnit(res, processName)
    }, getlotUnitErr)
   
  });

  $(".Flowchart").click(function() {
    // 折线图
    if ($(this).is(".activePage")) {
      return false
    }
    vuedata.currentModel = 1;
  });

  $(".Duration").click(function() {
    // 模型页
    if ($(this).is(".activePage")) {
      return false
    }
    vuedata.currentModel = 0;
  });
  $("#searchBtn").click(function() {
    // 查询
    let _lotId = $("#batch").val() !== "none" ? $("#batch").val() : undefined;
    let _brandId = $("#brand").val() !== "none" ? $("#brand").val() : undefined;
    let obj = {
      beginDate: $("#startDate").val() || undefined,
      endDate: $("#endDate").val() || undefined,
      lotId: _lotId,
      brandId: _brandId,
    }
    lotList(obj, getlotList, getlotListErr);
  });
  // 对象拦截， 监听当前模式
  Object.defineProperty(vuedata, 'currentModel',{
    get:function(){
      console.log("得到数据");
      return temp
    },
    set:function(newValue){
      console.log("newValue", newValue)
      switch(newValue) {
        case 1:
          showModule2() // 显示模块2
          break;
        default:
          showModule1()
      }
      temp = newValue
    },
    enumerable:true,  //为 true  表示 该属性 可被枚举 
    configurable:true //为true 标识该属性可被修改和删除
  })
  // 获取品牌列表
  commonBrand(undefined, getcommonBrandList, getcommonBrandListErr);
  // 获取批次列表
  commonLot(undefined, getcommonLotList, getcommonLotListErr);

  // 符合条件的批次Id
  lotList(undefined, getlotList, getlotListErr);
});
function showModule1() {
  // 显示模块1
  $(".data-box").css({display: "flex"})
  $(".module2").css({display: "none"})
  $(".Duration").addClass("activePage");
  $(".Flowchart").removeClass("activePage");
}
function showModule2() {
  // 显示模块2
  $(".data-box").css({display: "none"})
  $(".module2").css({display: "block"})
  $(".Flowchart").addClass("activePage");
  $(".Duration").removeClass("activePage");
  // 获取
  setTimeout(() => {
    echartList.averageDay.clear();
    echartList.averageDay.resize();
    echartList.averageDay.setOption(option1);
    echartList.averageWeek.clear();
    echartList.averageWeek.resize();
    echartList.averageWeek.setOption(option1);
  }, 50);
}

function setPlanHeight(dom1, dom2) {
  let clientRect = dom1.getBoundingClientRect();
  let ht = $(window).height();
  dom2.css("height", ht - clientRect.bottom + "px");
}
function createPopUp(barArr, title) {
 
  let strBar = ""
  let colors = ["#6BA83E", "#E96B2E", "#C14242"]
 
  if (barArr.length === 0) {
    strBar = "<div class='no-data'>"
    +"<img src='./img/no-data.png' />"
    + "<div class='no-data-txt'>暂无数据</div>"
    +"</div>"
  } else {
    for (let i = 0; i < barArr.length; i++) {
      let _color = colors[ i % 3];
      let _progress = (Number(barArr[i].normTime) ? Number(barArr[i].realityTime) * 100 / Number(barArr[i].normTime) : 0).toFixed(2) + "%";
      strBar += '<div class="progress-box">'
      + '<div class="progress-title">Batch Number:<span style="margin-left:5px;">'+ barArr[i].unitName +'</span></div>'
      + '<div class="progress-outside-bar">'
      + '<div class="progress-inner-bar" style="width:'+ _progress +';color:'+_color+';background-color:'+ _color +'">'
      +  '<div class="progress__text">'+ _progress +'</div>'
      + '</div>'
      + '</div>'
      + '</div>'
    }
  }
  var html =  '<div class="popUp">'
  + '<div class="popUp-content">'
  +'<div class="popUp-title">'+title+'</div>'
  +'<div class="popUp-body">'
  +'<div class="popUp-body-content">'
  + strBar
  +'</div>'
  +'</div>'
  + '</div>'
  + '</div>'
  if (!document.querySelector(".popUp")) {
    $("body").append(html);
  } else {
    $(".popUp").remove();
    $("body").append(html);
  }
  $(".popUp-content").removeClass("popUp-content-move")
  var timeer =setTimeout(() => {
    $(".popUp-content").addClass("popUp-content-move")
    clearTimeout(timeer)
  }, 6);
  // 点击弹窗内容以外的部分关闭
  $(".popUp").on("click", function() {
    $(this).remove();
  });
  $(".popUp-content").on("click", function() {
    return false
  })
}
var option1 = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    axisLabel: {
      show: true,
      textStyle: {
        color: "rgba(114, 227, 250, 0.3)" //更改坐标轴文字颜色
      }
    },
    axisLine: {
      lineStyle: {
        color: "rgba(114, 227, 250, 0.3)" //更改坐标轴颜色
      }
    },
    axisTick: {
      //y轴刻度线
      show: false
    }
  },
  grid: {
    top: "4%",
    left: "0%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  yAxis: {
    type: "value",
    show: false
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "line",
      symbolSize: 6,
      symbol: "circle",
      showBackground: false,
      backgroundStyle: {
        color: "rgba(114, 227, 250, 0.3)"
      },
      itemStyle: {
        normal: {
          //这里是重点
          color: function (params) {
            //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
            var colorList = ["#6A5500", "#206774", "#620F2A"];
            var index = params.dataIndex % 3;
            return colorList[index];
          },
          barBorderRadius: 50
        }
      },
      lineStyle: {
        color: "rgba(115, 228,251,0.4)"
      }
    }
  ]
}
var option2 = {
  xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
      type: 'value'
  },
  series: [{
      data: ['120', '200', '150', '80', '70', '110', '130'],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
          color: 'rgba(220, 220, 220, 0.8)'
      }
  }]
};
// echart 绘制echartList 列表
function EchartList() {
  this.averageDay = echarts.init(document.getElementById("averageDay"));
  this.averageWeek = echarts.init(document.getElementById("averageWeek"));
  this.averageDay.setOption(option1);
  this.averageWeek.setOption(option2);
}

// 获取品牌列表
function getcommonBrandList(data) {
  var res = data.data;
  var brandOption = createOptions(res, 'name')
  $("#brand").append(brandOption);
}
function getcommonBrandListErr(err) {
  console.log("品牌列表错误", err)
}

// 获取批次列表
function getcommonLotList(res) {
  var data = res.data;
  var brandOption = createBatchOptions(data)
  $("#batch").append(brandOption);
}
function getcommonLotListErr(err) {
  console.log("获取批次列表", err)
}

// 创建option
function createOptions(options, txt) {
  let str = '<option value="none">全部</option>'
  for (let i = 0; i < options.length; i++) {
    str += '<option value='+ options[i].id+ '>'+ options[i][txt]+'</option>'
  }
  return str
}
// 创建批次option
function createBatchOptions(options) {
  let str = '<option value="none">全部</option>'
  for (let i = 0; i < options.length; i++) {
    str += '<option value='+ options[i]+ '>'+ options[i]+'</option>'
  }
  return str
}

// 批次Id集合
function getlotList(res) {
  let data = res.data;
  let str = ''
  for (let i = 0; i < data.length; i++) {
    str += '<li class="batchNumber">'+ data[i]+'</li>'
  }
  $("#tree").empty()
  $("#tree").append(str)
  // 默认查看第一个工序
  $("#tree li").eq(0).addClass('liactive').siblings().removeClass("liactive");
  // 工序详情 默认选择第一个
  vuedata.lotId = data[0]
  lotProcess(vuedata.lotId, getlotProcess, lotProcessErr);
  $("#tree li").on("click", function() {
    $(this).addClass('liactive').siblings().removeClass("liactive");
    let lotId = $(this).text();
    vuedata.lotId = lotId;
    lotProcess(vuedata.lotId, getlotProcess, lotProcessErr);
  })
}

function getlotListErr(err) {
  console.log("批次Id集合err", err);
}

// 批次工序详情
function getlotProcess(res) {
  let data = res.data;
  let processNameOptions = [
    "Rice Outtake",
    "Malt Outtake",
    "Rice Grinding",
    "MASHING VESSEL",
    "Mash Tun 3",
    "Lauter Tun 3",
    "Brew Kettle 4",
    "Whirlpool 3",
    "Wort Cooling 2"
  ]
  // Dummy_LT
  let tool1 = data.find(function (item) {
    // return item.processName === "MALT SILOS"
    return item.processName === "Dummy_LT"
  })
  let tool2 = data.find(function (item) {
    return item.processName === "MASH TUN"
  })
  let tool3 = data.find(function (item) {
    return item.processName === "LAUTER TUN"
  })
  // // 给工序添加工序ID
  // for (let i=0; i< processNameOptions.length; i++) {
  //   let gx = data.find(function (item) {
  //     return item.processName === processNameOptions[i]
  //   })
  //   $(".fragment[data-processname = '"+ processNameOptions[i] + "']").attr( "data-processId", gx ? gx.processId : '-1' )
  // }
  let tooltext1 = tool1 ? (Number(tool1.realityTime) * 100 / Number(tool1.normTime)).toFixed(2) : 0;
  let tooltext2 = tool2 ? (Number(tool2.realityTime) * 100 / Number(tool2.normTime)).toFixed(2) : 0;
  let tooltext3 = tool3 ? (Number(tool3.realityTime) * 100 / Number(tool3.normTime)).toFixed(2) : 0;
  $("#tool1 .tool-text").text(tooltext1 + "%");
  $("#tool2 .tool-text").text(tooltext2 + "%");
  $("#tool3 .tool-text").text(tooltext3 + "%");
}
function lotProcessErr(err) {
  console.log("err", err);
}

// 批次工序详情
function getlotUnit(res, title) {
  let data = res.data;
  console.log("批次工序详情", data)
  createPopUp(data, title);
}
function getlotUnitErr(err) {
  console.log("err", err);
}