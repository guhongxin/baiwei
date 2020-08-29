// 初始化页面

var echartList; // echart 对象

function setPlanHeight(dom1, dom2) {
  let clientRect = dom1.getBoundingClientRect();
  let ht = $(window).height();
  dom2.css("height", ht - clientRect.bottom + "px");
}

$(document).ready(function () {
  init();
  $(window).resize(function () {
    this.setPlanHeight($(".right-head")[0], $(".plan"));
  });
  window.addEventListener("resize", resizeThrottler, false);
  var resizeTimeout;
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
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
  function EchartList() {
    this.halfPie1 = echarts.init(document.getElementById("halfPie1"));
    this.halfPie2 = echarts.init(document.getElementById("halfPie2"));
    this.halfPie3 = echarts.init(document.getElementById("halfPie3"));
    this.lineChart1 = echarts.init(document.getElementById("lineChart1"));
    this.lineChart2 = echarts.init(document.getElementById("lineChart2"));
    this.lineChart3 = echarts.init(document.getElementById("lineChart3"));
    
    this.tool1 = $("#tool1");
    this.tool2 = $("#tool2");
    this.tool3 = $("#tool3");
    // this.initEcharts();
    this.lineChart1.on('click', function (params) {
      console.log(params);
      // 批次工序详情默认第一个
      // lotProcess(data.serieItem.lotIdList[0], getlotProcess, lotProcessErr);
      lotProcess(params.name, getlotProcess, lotProcessErr);
    });
  }
  $.extend(EchartList.prototype, {
    initEcharts: function () {
      this.inithalfPie1();
      this.initLineChart();
      this.bindToolClick();
    },
    bindToolClick: function () {
      var self = this;
      this.tool1.bind("click", function () {
        self.initLineChart();
      });
      this.tool2.bind("click", function () {});
      this.tool3.bind("click", function () {});
    },
    initLineChart: function () {
      this.lineChart1.setOption(this.lineChartBaseOption("bar"));
      this.lineChart2.setOption(this.lineChartBaseOption("line"));
      this.lineChart3.setOption(this.lineChartBaseOption("line"));
    },
    inithalfPie1: function (val1, val2, val3) {
      this.halfPie1.setOption(this.halfPieBaseOption(val1, "rgba(107,168,62,1)"));
      this.halfPie2.setOption(this.halfPieBaseOption(val2, "rgba(233,107,46,1)"));
      this.halfPie3.setOption(this.halfPieBaseOption(val3, "rgba(193,66,66,1)"));
    },
    lineChartBaseOption: function (type, xAxisData, data) {
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            return params[0].name + ':' + params[0].data / 1000 + '%';
          }
        },
        xAxis: {
          type: "category",
          data: xAxisData,
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
        yAxis: {
          type: "value",
          show: false
        },
        grid: {
          top: "4%",
          left: "0%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },

        series: [
          {
            data: data,
            type: type,
            symbolSize: 6,
            symbol: "circle",
            showBackground: false,
            backgroundStyle: {
              color: "rgba(114, 227, 250, 0.3)"
            },
            barWidth: 10,
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
      };
    },
    halfPieBaseOption: function (val, color) {
      function getAlpha(rgba, index) {
        var rgb = rgba.match(/(\d(\.\d+)?)+/g);
        return rgb[index];
      }
      var r = getAlpha(color, 0);
      var g = getAlpha(color, 1);
      var b = getAlpha(color, 2);
      var a = getAlpha(color, 3);

      var placeHolderStyle = {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          color: "rgba(0,0,0,0)",
          borderWidth: 0
        },
        emphasis: {
          color: "rgba(0,0,0,0)",
          borderWidth: 0
        }
      };

      var dataStyle = {
        normal: {
          formatter: "{c}%",
          position: "center",
          show: true,
          textStyle: {
            fontSize: "16",
            fontWeight: "normal",
            color: color
          }
        }
      };
      return {
        //第一个图表
        series: [
          {
            type: "pie",
            top: "10%",
            hoverAnimation: false, //鼠标经过的特效
            radius: ["90%", "100%"],
            startAngle: 200,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    color: "rgba(255,255,255,0.2)"
                  }
                }
              },
              {
                value: 63,
                itemStyle: placeHolderStyle
              }
            ]
          },
          //上层环形配置
          {
            type: "pie",
            hoverAnimation: false, //鼠标经过的特效
            radius: ["90%", "100%"],
            top: "10%",
            startAngle: 200,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: val,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.RadialGradient(0, 1, 1.5, [
                      {
                        offset: 0,
                        color: "transparent"
                      },
                      {
                        offset: 0.5,
                        color: "rgba(" + r + "," + g + "," + b + ",0.2)"
                      },
                      {
                        offset: 1,
                        color: color
                      }
                    ])
                  }
                },
                label: dataStyle
              },
              {
                value: 63,
                itemStyle: placeHolderStyle
              }
            ]
          }
        ]
      };
    }
  });
  echartList = new EchartList();
  echartList.bindToolClick();
});

function init() {
  this.setPlanHeight($(".right-head")[0], $(".plan"));
  // 请求首页接口
  lotIndex(getIndex, getErrorIndex)
}

function getIndex(res) {
  // 首页获取成功
  let data = res.data;

  let pie1 = (Number(data.lastLot.realityTime) * 100 / Number(data.lastLot.normTime)).toFixed(2);
  let pie2 = (Number(data.lastLot.realityTime) * 100 / Number(data.lastLot.normTime)).toFixed(2);
  let pie3 = (Number(data.lastLot.realityTime) * 100 / Number(data.lastLot.normTime)).toFixed(2);

  $(".latestbatch .batchNo").text(data.lastLot.lotId);
  $(".latestbatch .brandName").text(data.lastLot.brandName);
  
  $(".monthlyOEE .quantity").text(data.monthLot.lotCount);
  $(".annualOEE .quantity").text(data.yearLot.lotCount);

  echartList.inithalfPie1(pie1, pie2, pie3);
  
  // 绘制柱状图
  let _ratioList = []
  for (let i = 0; i< data.serieItem.ratioList.length; i++) {
    let ratioData = data.serieItem.ratioList[i].replace(/\%/, "");
    _ratioList.push(Number(ratioData)*1000)
  }
  // echartList.lineChart1.setOption(echartList.lineChartBaseOption("bar", data.serieItem.lotIdList, data.serieItem.ratioList));
  echartList.lineChart1.setOption(echartList.lineChartBaseOption("bar", data.serieItem.lotIdList, _ratioList));
  // 批次工序详情默认第一个
  // lotProcess(data.serieItem.lotIdList[0], getlotProcess, lotProcessErr);
  lotProcess(data.serieItem.lotIdList[9], getlotProcess, lotProcessErr);
}
function getErrorIndex(err) {
  // 首页获取失败
  console.log("err", err);
}
// 批次工序详情
function getlotProcess(res) {
  let data = res.data;
  let processNameOptions = [
    "Rice Outtake",
    "Malt Outtake",
    "Rice Grinding",
    "Rice Cooker2",
    "Malt Grinding",
    "Mash Tun3",
    "Lauter Tun3",
    "Brew Kettle 4",
    "Brew Kettle 5",
    "Whirpool3",
    "Wort Cooling 2",
  ]
  // 
  let tool1 = data.find(function (item) {
    return item.processName === "MALT SILOS"
  })
  let tool2 = data.find(function (item) {
    return item.processName === "MASH TUN"
  })
  let tool3 = data.find(function (item) {
    return item.processName === "LAUTER TUN"
  })
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
