/**
 * @abstract
 * @class Cmp.chart.Chart
 * @extend Cmp.Widget
 * 图表抽象类
 *
 * @version 4.0.0
 * @since 2018-02-28
 * @author Jinhai
 */
(function() {
  Cmp.define('Cp.chart.Chart', {
    extend: 'Cmp.Widget',
    cls: true,
    factory: function(ext, reqs) {
      var superClazz = ext.prototype;
      return Cmp.extend(ext, {
        /**
         * @abstract
         * @public
         * 设定数据，并同步到图表内容
         * @param {Object} value 设定数据
         * @return {Boolean} 返回true表示图表内容已经根据数据进行了更新；
         */
        setValue: Cmp.emptyFn
      });
    }
  });
}());
