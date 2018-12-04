/**
 * @class Cp.chart.geo.scatter.ScatterChart
 * @extends Cp.chart.goe.GeoChart
 * 散点形式地图
 * 配置参数(皆可选)
 * @cfg {String}                             symbol      系列点显示图
 * @cfg {String}                             name        系列图例名
 * @cfg {Object/Array[Object]/Array[String]} seriesCfg   系列配置信息
 * @cfg {Boolean}                            needEffect  是否需要涟漪特效动画 默认false
 * @cfg {Boolean}                            hideLegend  是否隐藏图例
 * @cfg {String}                             title       主标题
 * @cfg {String}                             subTitle    副标题(仅当主标题存在时，显示副标题)
 * @cfg {Function/String}                    formatter   tooltip显示方式
 * @cfg {Array}                              color       自定义颜色
 */
(function() {
  Cmp.define('Cp.chart.geo.scatter.ScatterChart', {
    extend: 'Cp.chart.geo.GeoChart',
    factory: function(ext, reqs) {
      var SP = ext.prototype;
      return Cmp.extend(ext, {
        /**
         * @private
         * 初始化默认配置
         */
        initConfig: function() {
          var me = this;
          // 确定series类型， 动效点和普通点
          me.chartType = (isB(me.needEffect) && me.needEffect) ? 'effectScatter' : 'scatter';
          me._seriesCfg = [];
          if (!isA(me.seriesCfg) && isO(me.seriesCfg)) me.seriesCfg = [me.seriesCfg];
          if (isA(me.seriesCfg)) {
            Cmp.each(me.seriesCfg, function(cfg) {
              var _cfg = {};
              if (isS(cfg)) {
                _cfg.valueKey = cfg;
              } else if (isO(cfg)) {
                _cfg = cfg;
                if (!isS(_cfg.valueKey)) {
                  _cfg.valueKey = 'value';
                }
              }
              if (!isS(cfg.name)) {
                // 缺省系列名
                _cfg.name = isS(me.name) ? me.name : '';
              }
              if (!isS(cfg.symbol) && isS(me.symbol)) {
                // 如果有公用symbol且没有系列私设symbol
                _cfg.symbol = me.symbol;
              }
              if (Cmp.isDefined(me.symbolSize) && !Cmp.isDefined(cfg.symbolSize)) {
                _cfg.symbolSize = me.symbolSize;
              }
              if (Cmp.isDefined(me.symbolOffset) && !Cmp.isDefined(cfg.symbolOffset)) {
                _cfg.symbolOffset = me.symbolOffset;
              }
              me._seriesCfg.push(_cfg);
            })
            me.seriesCfg = me._seriesCfg;
            delete me._seriesCfg;
          }
        }
      })
    }
  })
}())
