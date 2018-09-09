/**
 * @class Cp.chart.cartesian.curve.SingleCurve
 * @extend Cp.chart.cartesian.SimpleCartesianChart
 * 简单单线图
 * 配置参数(皆可选)
 * @cfg {String}              chartType   图类型 bar | line
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
  Cmp.define('Cp.chart.cartesian.curve.SingleCurve', {
    extend: 'Cp.chart.cartesian.SimpleCartesianChart',
    factory: function(ext, reqs) {
      var SP = ext.prototype;
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this;
          me.chartType = 'line';
          me.isSmooth = true;
          SP.initComponent.call(me);
        }
      });
    }
  });
}());
