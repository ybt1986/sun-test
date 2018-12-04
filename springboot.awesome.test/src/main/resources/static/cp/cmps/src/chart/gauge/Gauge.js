/**
 * 仪表盘
 */
(function() {
  var getDefaultOption = function(name) {
    return {
      tooltip : {
        formatter: "{a} <br/>{b} : {c}%"
      },
      series : [
        {
          name: isS(name) ? name : '',
          type: 'gauge',
          //半径
          radius: 150,
          min:0,
          max:100,
          startAngle: 195,
          endAngle: -15,
          axisLine: {
            show: true,
            lineStyle: {
              width: 30,
              shadowBlur: 0,
              color: [[0.6, '#e74f46'],[0.8, '#edb240'],[1, '#87d0b6']]
            }
          },
          axisTick: {
            show: true,
            splitNumber: 1
          },
          splitLine:{
            show: false,
          },
          axisLabel: {
            textStyle: {
              fontSize: 15,
              fontWeight: ""
            }
          },
          pointer: {
            show: false,
          },
          detail: {
            formatter: '{value}%',
            offsetCenter: [0, -10],
            textStyle: {
              fontSize: 50,
              color:'#000'
            }
          },
          data: []
        }
      ]
    };
  };
  var HTML = [];
  HTML.push('<div class="lp-dashboard-timeprogress">库存健康指数总分：<span class="text"></span><i class="icon fa fa-question-circle"><span class="lp-prompt-text">库存健康指数是根据关键指标现货率、缺货率、库存周转率、滞销率等指标根据权重综合评分结果。</span></i></div>');
  HTML.push('<div class="lp-dashboard-main"></div>');
  HTML.push('<div class="lp-dashboard-monthbudget">状态健康 </div>');
  HTML = HTML.join('');
  Cmp.define('Cp.chart.gauge.Gauge', {
    extend: 'Cmp.Widget',
    cls: true,
    requires: [],
    factory: function(ext, reqs) {
      var superClazz = ext.prototype;
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this;
          superClazz.initComponent.call(me);
        },
        doRender: function() {
          var me = this,
            dom;
          superClazz.doRender.call(me);
          me.el.addClass('lp-gauge');
          me.el.update(HTML);
          dom = me.el.dom.childNodes;
          me.timeprogress = dom[0].childNodes[1];
          me.icon = dom[0].childNodes[2];
          me.prompt = Cmp.get(me.icon.childNodes[0]) ;
          me.singlefinish = dom[2].childNodes[1];
          me.chart = echarts.init(dom[1],'macarons');
          me.prompt.setHideModal('display');
          me.prompt.hide()
          me.icon.onmouseover = function () {
            me.prompt.show()
          }
          me.icon.onmouseout = function () {
            me.prompt.hide()
          }
          // me.setDashboardData();
        },
        setDashboardData: function(data) {
          var me = this,
            dom;
          dom = me.el.dom.childNodes;
          if(data) {
            me.timeprogress.innerText = data.timeprogress;
          }
          me.chart = echarts.init(dom[1], 'macarons');
        },
        setValue: function(data) {
          var me =  this;
          me.reload(data.chartData);
          me.timeprogress.innerHTML = (isS(data.timeprogress) || isN(data.timeprogress) ? data.timeprogress : '--');
        },
        /**
         * 设置仪表盘数据
         * @param  {Array} data
         */
        reload: function(data) {
          var me = this,
            option;
          option = getDefaultOption(me.name);
          option.series[0].data = data;
          me.chart.setOption(option, true);
          me.resize();
        },
        resize: function() {
          this.chart.resize();
        }
      });
    }
  })
})();