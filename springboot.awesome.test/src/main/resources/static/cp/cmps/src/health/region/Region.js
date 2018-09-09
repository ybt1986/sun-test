/**
 * 库存健康
 */
(function() {
  var HTML = [];
  HTML.push('<div class="cp-main-row">');/*
  HTML.push('<div class="cp-col-4"><!--<div class="chart-title"></div><div></div>--></div>');
  HTML.push('<div class="cp-col-8"><!--<div class="chart-title"></div><div></div>--></div>');*/
  HTML.push('</div>');
  HTML = HTML.join('');
  Cmp.define('Cp.health.region.Region', {
    extend: 'Cmp.Widget',
    requires: [
        'Cp.chart.cartesian.column.SingleHorizontalColumn',
        'Cp.chart.cartesian.curve.SingleCurve'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var SP = ext.prototype,
        SingleHorizontalColumn = reqs[0],
        SingleCurve = reqs[1];
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this,
            cls = me.cls;
          if (isA(cls)) {
            cls.unshift('cp-region');
          } else if (isS(cls)) {
            cls = ['cp-region', cls];
          } else {
            cls = 'cp-region';
          }
          me.cls = cls;
          SP.initComponent.call(me);
          me.regionTxt = ''
          me.cardName = '现货率'
        },
        doRender: function() {
          var me = this;
          SP.doRender.call(me);
          me.el.update(HTML);
          me.renderContent();
        },
        renderContent:function () {
          var me = this ,doms;
          doms = me.el.dom.childNodes;
          me.leftBox = Cmp.get(doms[0]).createChild({
            cls:'cp-col-4'
          });
          me.rightBox = Cmp.get(doms[0]).createChild({
            cls:'cp-col-8'
          });
          me.barChartTitle = me.leftBox.createChild({
            cls:'chart-title'
          })
          me.lineChartTitle = me.rightBox.createChild({
            cls:'chart-title'
          });
          me.barChartBox = me.leftBox.createChild({});
          me.lineChartBox = me.rightBox.createChild({});
         /* var barData = [
            {
              name: '华东',
              value: 587976
            },
            {
              name: '华南',
              value: 583234
            },
            {
              name: '华北',
              value: 442906
            },
            {
              name: '华中',
              value: 583234
            },
            {
              name: '华西',
              value: 442906
            },
            {
              name: '西北',
              value: 583234
            },
            {
              name: '西南',
              value: 442906
            }
          ]*/
          me.barChart = new SingleHorizontalColumn({
            chartType :'bar',
            width:'100%',
            height:'13rem',
            color : ['#0e6ede']
          })
          me.barChart.on('click',me.barChartClickFn,me)
          me.barChart.render(me.barChartBox);
          me.barChart.setValue(/*barData*/);
          // debugger
            // me.lineChartTitle.innerText(me.name+'（区/省/仓）'+me.type+'周趋势分析')
         /*var lineData = [
            {
              name: '华东',
              value: 587976
            },
            {
              name: '华东',
              value: 583234
            },
            {
              name: '华东',
              value: 442906
            },
            {
              name: '华东',
              value: 583234
            },
            {
              name: '华东',
              value: 442906
            },
            {
              name: '华东',
              value: 583234
            },
            {
              name: '华东',
              value: 442906
            },
              {
                  name: '华东',
                  value: 442906
              },
              {
                  name: '华东',
                  value: 442906
              },
              {
                  name: '华东',
                  value: 442906
              },
              {
                  name: '华东',
                  value: 442906
              },
              {
                  name: '华东',
                  value: 442906
              }
          ]*/
          me.lineChart = new SingleCurve({
            width:'100%',
            height:'13rem',
            color : ['#0e6ede']
          })
          me.lineChart.on('click',me.lineChartClickFn,me)
          me.lineChart.render(me.lineChartBox);
          me.lineChart.setValue(/*lineData*/);
          me.setChartTitle();
        },
        setChartTitle:function(){
          var me = this;
          me.barChartTitle.update(me.barChartTxt+'详情（%）');
          me.lineChartTitle.update( me.regionTxt +''+ me.cardName +'周趋势分析（%）');
        },
        /**
         * 左侧水平柱图点击事件
         * @param params
         */
        barChartClickFn:function (params) {
          var me = this;
          for (var i in me.idAndName){
              if(params.name == (me.idAndName[i].name)){
                  params.id = me.idAndName[i].id;
              }
          }
          me.fireEvent('barClick',params);
        },
        /**
         * 右侧曲线图点击事件
         * @param params
         */
        lineChartClickFn:function (params) {
          var me = this;
          me.fireEvent('lineClick',params);
        },
        /**
         * 设置柱图的数据
         * @param data [Array]
         */
        setBarChartValue:function (data) {
          var me = this;
          me.idAndName = data;
          me.barChart.setValue(data);
        },
        /**
         * 设置线图的数据
         * @param data [Array]
         */
        setLineChartValue:function (data) {
          var me = this;
          me.lineChart.setValue(data);
        },
        /**
         * 设置柱图的标题
         * @param text  [String]
         */
        setBarChartTitle:function (text) {
          var me = this;
          me.barChartTxt = text;
          me.setChartTitle();
        },
        /**
         * 设置线图的标题
         * @param text  [String]
         */
        setLineChartTitle:function (text,name) {
          var me = this;
          me.regionTxt = text;
          me.cardName = name;
          me.setChartTitle();
        }
      })
    }
  })
}())
