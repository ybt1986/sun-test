/**
 * @class Cp.chart.cartesian.SimpleCartesianChart
 * @extends Cp.chart.cartesian.CartesianChart
 * 简单单线图
 * 配置参数(皆可选)
 * @cfg {String}              chartType   图类型 bar | line
 * @cfg {Boolean}             isSmooth    是否是曲线
 * @cfg {Boolean}             isArea      是否是面积
 * @cfg {String}              title       图标题
 * @cfg {String}              subTitle    图子标题，仅当主标题存在时有用
 * @cfg {Boolean}             hideLegends 是否隐藏图例，默认false
 * @cfg {Function/String}     formatter   tooltip显示方式
 * @cfg {Boolean}             needZoom    是否需要缩放条
 * @cfg {Array/Object}        seriesCfg   系列配置信息
 *    @cfg {String}           valueKey    对应值字段
 *    @cfg {String}           name        系列名
 * @cfg {Array/Object}        xAxis       横坐标配置信息
 *    @cfg {String}           valueKey    对应值字段
 *    @cfg {String}           type        类型：category:类目轴 value:数值轴
 *    @cfg {Boolean}          boundaryGap boundaryGap 可以配置为 true 和 false。默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间
 * @cfg {Array/Object}        yAxis       总坐标配置信息
 *    @cfg {String}           valueKey    对应值字段
 *    @cfg {String}           type        类型：category:类目轴 value:数值轴
 *    @cfg {Boolean}          boundaryGap boundaryGap 可以配置为 true 和 false。默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间
 * @cfg {Object}              other       其他配置，所有echarts配置皆支持，详情请参考echarts完整API
 * @version 1.0.0
 * @since 2018-03-14
 * @author Weihanwei
 */
(function() {
  var LABEL_KEY, VALUE_KEY;
  Cmp.define('Cp.chart.cartesian.SimpleCartesianChart', {
    extend: 'Cp.chart.cartesian.CartesianChart',
    factory: function(ext, reqs) {
      var chartType;
      /**
       * 获取默认坐标配置
       * @param  {Boolean} flag true:类目轴 false:值轴
       */
      function _getDefaultAxis(flag) {
        var cfg = {
          type: flag ? 'category' : 'value',
          boundaryGap: chartType === 'bar'
        }
        if (flag) {
          cfg.valueKey = LABEL_KEY;
        }
        return cfg;
      }
      /**
       * 判断是否是Array 如果不是Array，则包裹成Array
       * @param  {Object/Array} obj
       */
      function _judgeIsA(obj) {
        if (!isA(obj) && isO(obj)) {
          obj = [obj];
        }
        return obj;
      }
      /**
       * 根据a对象 判断b对象是类目轴还是数值轴
       * @param  {Array}   obja
       */
      function _fixCfg(obja) {
        var flag = true;
        Cmp.each(obja, function(item) {
          if (Cmp.isDefined(item.type) && item.type === 'category') {
            if (!isS(item.valueKey)) {
              item.valueKey = LABEL_KEY;
            }
            flag = false;
            return false;
          }
        });
        return _getDefaultAxis(flag);
      }
      return Cmp.extend(ext, {
        initConfig: function() {
          var me = this;
          LABEL_KEY = isS(me.labelKey) ? me.labelKey : 'name';
          VALUE_KEY = isS(me.valueKey) ? me.valueKey : 'value';
          if (!isS(me.chartType) || me.chartType !== 'bar') {
            me.chartType = 'line';
          }
          chartType = me.chartType;
          // 坐标轴初始化
          if (!Cmp.isDefined(me.xAxis) && !Cmp.isDefined(me.yAxis)) {
            me.xAxis = _getDefaultAxis(true);
            me.yAxis = _getDefaultAxis(false);
          } else {
            me.xAxis = _judgeIsA(me.xAxis);
            me.yAxis = _judgeIsA(me.yAxis);

            // 只有一个轴配置时，配置另一个轴
            if (Cmp.isDefined(me.xAxis) && !Cmp.isDefined(me.yAxis)) {
              me.yAxis = _fixCfg(me.xAxis);
            } else if (Cmp.isDefined(me.yAxis) && !Cmp.isDefined(me.xAxis)) {
              me.xAxis = _fixCfg(me.yAxis);
            }
          }
          me.seriesCfg = me.fillSeriesCfg(me.seriesCfg);
        },
        /**
         * 对seriesCfg进行补充
         * @param  {OBject/Array} seriesCfg
         */
        fillSeriesCfg: function(seriesCfg) {
          var me = this;
          // 系列配置初始化
          seriesCfg = _judgeIsA(seriesCfg);
          if (!Cmp.isDefined(seriesCfg)) {
            seriesCfg = [{
              valueKey: VALUE_KEY,
              type: me.chartType
            }]
          }
          Cmp.each(seriesCfg, function(item) {
            if (!isS(item.type)) {
              // 缺省类型
              item.type = me.chartType;
            }
            if (!isS(item.name)) {
              // 缺省系列名
              item.name = isS(me.name) ? me.name : '';
            }
            if (!isS(item.valueKey)) {
              // 缺省数组key值
              item.valueKey = VALUE_KEY;
            }
            if (isB(me.isSmooth)) {
              // 是否曲线
              item.smooth = me.isSmooth;
            }
            if (isB(me.isArea)) {
              // 是否面积
              item.areaStyle = {};
            }
          })
          return seriesCfg;
        }
      });
    }
  });
}());
