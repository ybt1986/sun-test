/**
 * @abstract
 * @class Cmp.chart.EchartOptBuilder
 * Echart图表Option制造者抽象类
 *
 * @version 1.0.2
 * @since 2018-03-14
 * @author weihanwei
 */
(function() {
  function Builder(config) {
    Cmp.apply(this, config);
    this._defaultOption = this.initOption();
  }
  Builder.prototype = {
    /**
     * @abstract
     * 初始化chart option
     * @returns   {Object}  option
     */
    initOption: Cmp.emptyFn,
    /**
     * @abstract
     * 根据设置的数据重新对option进行改造
     * @param    {Array}   data
     * @returns  {Object}  option
     */
    setValue: Cmp.emptyFn,
    /**
     * 获取option
     * @returns {Object} 经转换后的option的复制对象
     */
    getOption: function() {
      return Cmp.apply({}, this._defaultOption)
    },
    /**
     * 获取1rem对应px值
     */
    _getSizeByRem: function() {
      var w = Cmp.getBody().getWidth();
      w = Math.floor(w / 62);
      return w < 15 ? 15 : w;
    },
    /**
     * 重新创建默认配置信息
     */
    rebuildDefaultOption: function() {
      this._defaultOption = this.initOption();
    }
  }
  Cmp.define('Cp.chart.EchartOptBuilder', {
    factory: function(ext, reqs) {
      return Builder;
    }
  });
}());
