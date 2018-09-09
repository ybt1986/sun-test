/**
 * @abstract
 * @class Cmp.chart.Echart
 * @extend Cmp.chart.Chart
 * Echart图表抽象类
 *
 * @version 1.0.0
 * @since 2018-03-14
 * @author weihanwei
 */
(function() {
  Cmp.define('Cp.chart.Echart', {
    extend: 'Cp.chart.Chart',
    factory: function(ext, reqs) {
      var superClazz = ext.prototype;
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this;
          // 加载OptionBuilder类文件
          if (isS(me.BuilderClazz)) {
            Cmp.require(me.BuilderClazz, function(Clazz) {
              me.BuilderClazz = Clazz;
            })
          }
          superClazz.initComponent.call(me);
        },
        doRender: function() {
          var me = this;
          superClazz.doRender.call(me);
          me.builder = new me.BuilderClazz(me.getBuilderConfig());
          me.option = me.builder.getOption();
          me.chart = echarts.init(me.el.dom);
          me.chart.setOption(me.option);
          me.resize();
          me.chart.on('click', function(params) {
            me.onChartClick(params);
          });
          me.chart.on('mouseover', function(params) {
            me.onChartMouseover(params);
          });
          me.chart.on('mouseoout', function(params) {
            me.onChartMouseout(params);
          });
        },
        /**
         * chart鼠标点击事件
         * 允许子类重写该方法
         * @param  {Object} params
         */
        onChartClick: function(params) {
          this.fireEvent('click', params);
        },
        /**
         * chart鼠标移入事件
         * 允许子类重写该方法
         * @param  {Object} params
         */
        onChartMouseover: function(params) {
          this.fireEvent('mouseover', params);
        },
        /**
         * chart鼠标移出事件
         * 允许子类重写该方法
         * @param  {Object} params
         */
        onChartMouseout: function(params) {
          this.fireEvent('mouseout', params);
        },
        /**
         * @abstract
         * 获取Builder配置
         * @returns {Object} Builder所需配置
         */
        getBuilderConfig: Cmp.emptyFn,
        /**
         * @public
         * chart组件重新渲染并适应容器
         */
        resize: function() {
          this.chart.resize();
        },
        /**
         * 某些配置变化后，自动调用该方法，用最新setValue的数据进行重新渲染
         */
        reRender: function(option) {
          this.chart.setOption(option, true);
        },
        /**
         * @public
         * 设定数据，并同步到图表内容
         * @param  {Object}  data 设定数据
         * @return {Boolean} 返回true表示图表内容已经根据数据进行了更新；
         */
        setValue: function(data) {
          var me = this;
          me.chart.setOption(me.builder.setValue(data), true);
          me.chart.resize();
          return true;
        }
      });
    }
  });
}());
