/**
 * @class Cdk.chart.geo.GeoChart
 * @extends Ckk.chart.Echart
 * 地图系图表
 *
 * @version 1.0.0
 * @since 2018-03-21
 * @author Weihanwei
 */
(function() {
  Cmp.define('Cp.chart.geo.GeoChart', {
    extend: 'Cp.chart.Echart',
    requires: [
      'Cp.chart.geo.GeoOptBuilder'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var superClazz = ext.prototype,
        Builder = reqs[0];
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this,
            cls = me.cls;
          if (isA(cls)) {
            cls.unshift('cmp-geochart');
          } else if (isS(cls)) {
            cls = ['cmp-geochart', cls];
          } else {
            cls = 'cmp-geochart';
          }
          me.cls = cls;
          me.BuilderClazz = Builder;
          superClazz.initComponent.call(me);
          me.initConfig();
        },
        initConfig: Cmp.emptyFn,
        doRender: function() {
          var me = this;
          if (!isA(me.seriesCfg) && isO(me.seriesCfg)) {
            me.seriesCfg = [me.seriesCfg];
          }
          superClazz.doRender.call(me);
        },
        /**
         * @private
         * 获取Builder配置
         * @returns {Object} Builder所需配置
         */
        getBuilderConfig: function() {
          var me = this,
            cfg = {};
          if (isO(me.seriesCfg)) {
            // 系列配置信息
            cfg.seriesCfg = me.seriesCfg;
          } else {
            // 默认点选？
            me.seriesCfg = me.getDefaultSeriesCfg();
            cfg.seriesCfg = me.seriesCfg;
          }
          Cmp.each(cfg.seriesCfg, function(item) {
            if (!isN(item.geoIndex)) {
              item.geoIndex = 0;
            }
          })
          if (isS(me.title)) {
            // 标题 副标题配置，仅当有主标题，才显示副标题
            cfg.title = me.title;
            cfg.subTitle = isS(me.subTitle) ? me.subTitle : '';
          }
          if (isO(me.otherCfg)) {
            // 其它个性化配置
            cfg.otherCfg = me.otherCfg;
          }
          if (Cmp.isDefined(me.formatter)) {
            // tooltip 显示方式
            cfg.formatter = me.formatter;
          }
          if (isA(me.color)) {
            // 是否自定义颜色
            cfg.color = me.color;
          }
          if (isB(me.hideLegend)) {
            // 是否显示图例
            cfg.hideLegend = me.hideLegend;
          }
          if (isB(me.roam) || isS(me.roam)) {
            // 缩放配置
            cfg.roam = me.roam;
          }
          if (isB(me.selectedMode) || isS(me.selectedMode)) {
            // 选择配置
            cfg.selectedMode = me.selectedMode;
          }
          return cfg;
        },
        /**
         * 获取默认系列配置，当没有任何系列配置时使用
         * @returns {Array(Object)}
         */
        getDefaultSeriesCfg: function() {
          var me = this,
            cfg = [{
              valueKey: 'value',
              type: 'scatter'
            }];
          if (isS(me.symbol)) {
            cfg[0].symbol = me.symbol;
          }
          if (Cmp.isDefined(me.symbolSize)) {
            cfg[0].symbolSize = me.symbolSize;
          }
          if (Cmp.isDefined(me.symbolOffset)) {
            cfg[0].symbolOffset = me.symbolOffset;
          }
          return cfg;
        }
      });
    }
  })
}())
