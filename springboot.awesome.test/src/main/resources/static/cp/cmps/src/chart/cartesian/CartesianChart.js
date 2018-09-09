/**
 * @class Cmp.chart.cartesian.CartesianChart
 * @extends Cmp.chart.Echart
 * 直角坐标系图表
 *
 * @version 1.0.2
 * @since 2018-03-13
 * @author Weihanwei
 */
(function() {
  Cmp.define('Cp.chart.cartesian.CartesianChart', {
    extend: 'Cp.chart.Echart',
    requires: [
      'Cp.chart.cartesian.CartesianOptBuilder'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var superClazz = ext.prototype,
        Builder = reqs[0];
      /**
       * @private
       * 为实例初始化默认配置信息
       * @param  {Object} obj 当前组件实例
       */
      var _initDefaultConfig = function(obj) {
        if (!isB(obj.hideLegend)) {
          obj.hideLegend = false;
        }
      }

      return Cmp.extend(ext, {
        /**
         * @private
         * 初始化组件
         */
        initComponent: function() {
          var me = this,
            cls = me.cls;
          if (isA(cls)) {
            cls.unshift('cmp-cartesianchart');
          } else if (isS(cls)) {
            cls = ['cmp-cartesianchart', cls];
          } else {
            cls = 'cmp-cartesianchart';
          }
          me.cls = cls;
          me.BuilderClazz = Builder;
          superClazz.initComponent.call(me);
          me.initConfig();
          _initDefaultConfig(me);
        },
        /**
         * @abstract
         * @public
         * 初始化默认配置
         */
        initConfig: Cmp.emptyFn,
        /**
         * @private
         * 渲染组件
         */
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
            me.seriesCfg = [{
              valueKey: 'value',
              type: 'line'
            }];
            cfg.seriesCfg = me.seriesCfg;
          }
          if (isS(me.title)) {
            // 标题 副标题配置，仅当有主标题，才显示副标题
            cfg.title = me.title;
            cfg.subTitle = isS(me.subTitle) ? me.subTitle : '';
          }
          if (Cmp.isDefined(me.xAxis)) {
            // X轴配置
            cfg.xAxis = me.xAxis;
          }
          if (Cmp.isDefined(me.yAxis)) {
            // Y轴配置
            cfg.yAxis = me.yAxis;
          }
          if (isB(me.hideLegend)) {
            // 是否显示图例
            cfg.hideLegend = me.hideLegend;
          }
          if (isO(me.otherCfg)) {
            // 其它个性化配置
            cfg.otherCfg = me.otherCfg;
          }
          if (Cmp.isDefined(me.formatter)) {
            // tooltip 显示方式
            cfg.formatter = me.formatter;
          }
          if (isB(me.needZoom)) {
            // 是否需要滚动条
            cfg.needZoom = me.needZoom;
          }
          if (isA(me.color)) {
            // 是否自定义颜色
            cfg.color = me.color;
          }
          return cfg;
        },
        /**
         * 重新设置系列配置
         * 最好由子类去实现，根据不同的类型完善seriesCfg
         * @param  {Array/Object} seriesCfg
         */
        setSeriesCfg: function(seriesCfg) {
          var me = this,
            option;
          seriesCfg = me.fillSeriesCfg(seriesCfg);
          option = me.builder.setSeriesCfg(seriesCfg);
          me.reRender(option);
        },
        /**
         * @abstract
         * 填充seriesCfg，由子类负责实现
         * @returns {Array(Object)} seriesCfg
         */
        fillSeriesCfg: Cmp.emptyFn,
        /**
         * 设置是否需要滚动条
         * @param  {Boolean} flag
         */
        setNeedZoom: function(flag) {
          var me = this,
            option;
          me.needZoom = flag;
          option = me.builder.setNeedZoom(flag);
          me.reRender(option);
        },
        /**
         * @public
         * 设置主标题
         * @param  {String} title 标题
         */
        setTitle: function(title) {
          if (isS(title)) {
            this.reRender(this.builder.setTitle(title).setValue());
          }
        },
        /**
         * @public
         * 设置副标题，主题仅当主标题存在时副标题才显示
         * @param  {String} subTitle 副标题
         */
        setSubTitle: function(subTitle) {
          if (isS(subTitle)) {
            this.reRender(this.builder.setSubTitle(subTitle).setValue());
          }
        },
        /**
         * @public
         * 设置其他配置项
         * @param  {Object} otherCfg
         */
        setOtherCfg: function(otherCfg) {
          if (isO(otherCfg)) {
            this.reRender(this.builder.setOtherCfg(otherCfg).setValue());
          }
        },
        /**
         * @public
         * 设置是否隐藏图例
         * @param  {Boolean} hideLegend
         */
        setHideLegend: function(hideLegend) {
          if (isB(hideLegend)) {
            this.reRender(this.builder.setHideLegend(hideLegend).setValue());
          }
        },
        /**
         * @public
         * 设置图所使用的调色盘颜色列表
         * @param  {Array} hideLegend
         */
        setColor: function(color) {
          if (isA(color)) {
            this.reRender(this.builder.setColor(color).setValue());
          }
        }
      });
    }
  });
}());
