(function() {
  var ColumnChartCfg = {
    color: ['#0e6ede', '#b66ecc', '#7cccc9', '#e68e30', '#e64747'],
    otherCfg: {
      legend: {
        right: '3%'
      }
    },
    seriesCfg: [
      {
        name: '实时库存',
        valueKey: 'sskc'
      },
      {
        name: '月日均销量',
        valueKey: 'zdkc',
        stack: 'bar2'
      },
      {
        name: '安全库存',
        valueKey: 'aqkc',
        stack: 'bar2'
      },
      {
        name: '滞慢件数',
        valueKey: 'zmjs',
        stack: 'bar2'
      },
      {
        name: '不动销件数',
        valueKey: 'bdxjs',
        stack: 'bar2'
      }
    ],
    xAxis: {
      valueKey: 'name',
      type: 'category',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: {
      type: 'value',
      name: '单量/单',
      nameTextStyle: {
        align: 'left'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: ['#f1f2f4']
        }
      }
    }
  }

  var GeoChartCfg = {
    title: '全国各省库存分布图',
    formatter: '{a}<br/>{b}：{c}%',
    hideLegend: true,
    selectedMode: 'single',
    otherCfg: {
      title: {
        left: 'left',
        textStyle: {
          color: '#333'
        }
      },
      visualMap: {
        inRange: {
          color: ['#abcff8', '#87b4e7', '#4d94e7']
        },
        type: 'piecewise',
        pieces: [
          {
              min: 10,
              label: '占总体库存10%及以上'
          },
          {
              max: 10,
              min: 5,
              label: '占总体库存5%~10%'
          },
          {
              max: 5,
              label: '占总体库存5%及以下'
          }
        ],
        left: 'left',
        top: 'bottom',
        showLabel: true
      }
    },
    seriesCfg: [
      {
        name: '占全国库存比例',
        type: 'map',
        mapType: 'china',
        showLegendSymbol: false,
        valueKey: 'value'
      },
      {
        valueKey: 'special',
        silent: true,
        tooltip: {
          show: false
        },
        type: 'scatter',
        symbol: 'image:///valueSupplyChain/images/mapIcon.png',
        symbolSize: [25, 36],
        legendHoverLink: false,
        symbolOffset: [0, '-50%']
      }
    ]
  };
  var HTML = [];
  HTML.push('<div class="cp-row cp-dv-h12">');
  HTML.push('<div class="cp-col-4"></div>');
  HTML.push('<div class="cp-col-8"></div>');
  HTML.push('</div>');
  HTML.push('<div class="cp-row cp-dv-h28">');
  HTML.push('<div class="cp-col-12"></div>');
  HTML.push('<div class="map-icon"><span class="fa fa-map-marker mapIcon"></span> 低于安全库存 </div>');
  HTML.push('</div>');
  HTML = HTML.join('');
  Cmp.define('Cp.realtime.DataView', {
    extend: 'Cmp.Widget',
    requires: [
      'Cp.chart.cartesian.column.MulitipleColumn',
      'Cp.chart.geo.GeoChart',
      'Cp.realtime.Card'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var SP = ext.prototype,
        MulitipleColumn = reqs[0],
        GeoChart = reqs[1],
        Card = reqs[2] ;

      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this;
          me.cls = 'cp-dv';
          SP.initComponent.call(me);
        },
        doRender: function() {
          var me = this;
          SP.doRender.call(me);
          me.el.update(HTML);
          me.renderMainData();
          me.renderGeo();
        },
        /**
         * 渲染卡片和柱图
         */
        renderMainData: function() {
          var me = this,
            doms;
          doms = me.el.dom.childNodes[0].childNodes;
          // data card
          me.dataCard = new Card({
            label: '全国库存总数量',
            unit: '件',
            compareLabelUp: '高于安全库存',
            compareLabelDown: '低于安全库存'
          });
          me.dataCard.render(doms[0]);
          // column
          me.columnChart = new MulitipleColumn(ColumnChartCfg);
          me.columnChart.render(doms[1]);
        },
        /**
         * 渲染GEO
         */
        renderGeo: function() {
          var me = this,
            doms;
          doms = me.el.dom.childNodes[1].childNodes;
          // geo
            GeoChartCfg.formatter=function (param) {
              var html='';
              for(var i in me.geoVo){

                if(param.name==(me.geoVo[i].name)){
                 html='占全国库存比例 :'+param.value+'%<br/>';
                  /*html+='占全国库存比例 :'+me.geoVo[i].nationScale+'%<br/>';*/
                  html+='实时库存 :'+me.geoVo[i].realNum+'<br/>';
                  html+='日均库存 :'+me.geoVo[i].avgDayNum+'<br/>';
                  html+='安全库存 :'+me.geoVo[i].saftyNum;
                }
              }
             return html;
          }
          me.geoChart = new GeoChart(GeoChartCfg);
          me.geoChart.render(doms[0]);
          me.geoChart.on('click', me.onGeoClick, me);
        },
        /**
         * 设置显示数据
         * @param  {Object} data
         * @param  {Object} data.card     卡片数据 {value:主值,compare:副值}
         * @param  {Array}  data.columns  柱图数据 [{name:区域,sskc:实时库存.....}...]
         * @param  {}
         */
        setValue: function(data) {
          var me = this;
          if (isO(data.card)) {
            // 卡片数据
            me.dataCard.setValue(data.card);
          }
          if (isA(data.columns)) {
            me.columnChart.setValue(data.columns);
          }
          if (isO(data.geo)) {
            me.geoChart.setValue(data.geo);
          }
          if(isO(data.test)){
            me.geoVo=data.test.value;
          }
        },
        /**
         * 地图点击事件处理
         * @param  {} params
         */
        onGeoClick: function(params) {
          var me=this;
          //获得地图省份ID,me表示该dataview的this
          for(var i in me.geoVo){
              if(params.name==(me.geoVo[i].name)){
                me.nowSelProvinceId = me.geoVo[i].provinceId;
              }
          }
          //param.data中有点击省份的数据，可以从其中取得
          // 当前点击的地区
          if (isS(me.nowSelProvince) && me.nowSelProvince === params.name) {
              me.geoChart.chart.dispatchAction({
                  type: 'highlight',
                  name: params.name
              })
              return;
          }
          me.nowSelProvince = params.name
          me.fireEvent('geoClick', params.name);
        }
      })
    }
  })
}());
