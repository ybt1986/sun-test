/**
 * @class Cmp.chart.CartesianOptBuilder
 * @extends Cmp.chart.EchartOptBuilder
 * 直角坐标系图表
 *
 * @version 1.0.2
 * @since 2018-03-13
 * @author Weihanwei
 */
(function() {
  Cmp.define('Cp.chart.cartesian.CartesianOptBuilder', {
    extend: 'Cp.chart.EchartOptBuilder',
    factory: function(ext, reqs) {
      var superClazz = ext.prototype;
      return Cmp.extend(ext, {
        /**
         * @private
         * 初始化chart option
         */
        initOption: function() {
          var me = this,
            option, tmp, zoom, name;
          tmp = me.initSeries();
          me.initConfig();
          me.optionCfg = {
            title: me.title,
            subTitle: me.subTitle,
            xAxis: me.xAxis,
            yAxis: me.yAxis,
            legends: tmp.legends,
            series: tmp.seriesArr,
            hideLegend: me.hideLegend,
            other: me.other
          }
          if (me.formatter) {
            // tooltip formatter
            me.optionCfg.formatter = me.formatter;
          }
          if (isA(me.color)) {
            me.optionCfg.color = me.color;
          }
          option = me._getDefaultOption(me.optionCfg);
          if (isB(me.needZoom)) {
            zoom = {
              type: 'slider',
              show: true,
              // start: 0,
              // end: 40
            }
            tmp = me.getCategoryName();
            for (name in tmp) {
              name = tmp[name].split('-')[0];
              break;
            }
            // 有类目轴
            if (isS(name)) {
              if (name === 'xAxis') {
                // 横向
                zoom.xAxisIndex = [0];
                zoom.bottom = '3%';
              } else {
                // 纵向
                zoom.yAxisIndex = [0];
                zoom.right = '3%';
              }
            }
            Cmp.apply(option, {
              dataZoom: zoom
            });
          }
          // 遍历额外配置信息
          if (isO(me.otherCfg)) {
            option = me.applyOption(option, me.otherCfg);
          }
          return option;
        },
        /**
         * @private
         * @param  {Object}   option  待渲染option
         * @param  {Anything} cfg     额外配置信息
         */
        applyOption: function(option, cfg) {
          var me = this,
            name;
          for (name in cfg) {
            if (typeof option[name] === 'undefined') {
              // 如果option不存在该配置，直接赋值
              option[name] = cfg[name];
            } else if (isO(cfg[name]) && !isA(cfg[name])) {
              // 额外配置是对象且不是数组
              if (isA(option[name])) {
                // 如果option该属性是数组，对每一项进行配置
                Cmp.each(option[name], function(item, index) {
                  option[name][index] = me.applyOption(item, cfg[name]);
                })
              } else {
                // 如果option该属性不是数组，进行递归
                option[name] = me.applyOption(option[name], cfg[name]);
              }
            } else {
              // option该属性存在，cfg该属性值是数组或非对象，直接赋值
              option[name] = cfg[name];
            }
          }
          return option;
        },
        /**
         * @private
         * 初始化配置信息
         */
        initConfig: function() {
          var me = this;
          me._categoryName = {};
          if (!isS(me.title)) me.title = '';
          if (!isS(me.subTitle)) me.subTitle = '';
          if (!isB(me.hideLegend)) me.hideLegend = false;
          if (!isA(me.yAxis) && isO(me.yAxis)) {
            me.yAxis = [me.yAxis];
          }
          if (!isA(me.xAxis) && isO(me.xAxis)) {
            me.xAxis = [me.xAxis];
          }

          me.initCategorey('yAxis');
          me.initCategorey('xAxis');
        },
        /**
         * 获取category配置
         * @param  {String} name xAixs 或 yAixs
         */
        initCategorey: function(name) {
          var me = this;
          // 如果类目轴是数组
          Cmp.each(me[name], function(item, index) {
            if (isS(item.valueKey)) {
              me._categoryName[item.valueKey] = name + '-' + index;
            }
          });
        },
        /**
         * @private
         * 初始化series legends相关
         * @returns {Object}
         * @returns {Array}  seriesArr 系列配置
         * @returns {Array}  legends   图例
         */
        initSeries: function() {
          var me = this,
            seriesArr = [],
            legends = [],
            seriesCfg = me.seriesCfg;
          if (!isA(seriesCfg) && isO(seriesCfg)) {
            seriesCfg = [seriesCfg];
          }
          if (typeof seriesCfg !== 'undefined') {
            for (var i = 0; i < seriesCfg.length; i++) {
              // 系列配置
              seriesArr.push(Cmp.apply({}, seriesCfg[i]));
              // legends
              legends.push(seriesCfg[i].name);
            }
          }
          return {
            seriesArr: seriesArr,
            legends: legends
          };
        },
        /**
         * 获取类目名对象
         * @returns {Object} categoryName 的副本
         */
        getCategoryName: function() {
          return Cmp.apply({}, this._categoryName);
        },
        /**
         * 重新设置系列配置
         * @param   {Array/Object} seriesCfg 新的系列配置
         * @returns {Object}       最新options
         */
        setSeriesCfg: function(seriesCfg) {
          var me = this;
          me.seriesCfg = seriesCfg;
          me.rebuildDefaultOption();
          return me.setValue();
        },
        /**
         * 设置是否需要滚动条
         * @param   {Boolean} flag 是否需要
         * @returns {Object}       最新options
         */
        setNeedZoom: function(flag) {
          var me = this;
          if (isB(flag)) {
            me.needZoom = flag;
            me.rebuildDefaultOption();
            return me.setValue();
          }
        },
        /**
         * 根据设置的数据重新对option进行改造
         * @param    {Array}   data
         * @returns  {Object}  option
         */
        setValue: function(data) {
          var me = this,
            i, tempObj = {},
            temp, name, option = me.getOption(),
            categoryName = me.getCategoryName();
          if (Cmp.isDefined(data)) {
            me._tmpData = data;
          } else {
            data = me._tmpData;
          }
          if (isA(data)) {
            for (i = 0; i < option.series.length; i++) {
              option.series[i].data = [];
            }
            for (i = 0; i < data.length; i++) {
              for (temp in categoryName) {
                // 遍历类目配置
                if (Cmp.isDefined(data[i][temp])) {
                  // 如果该下标对象，有改类目key对应值
                  if (!Cmp.isDefined(tempObj[categoryName[temp]])) {
                    // 如果数据数组未定义，则先定义数组
                    tempObj[categoryName[temp]] = [];
                  }
                  tempObj[categoryName[temp]].push(data[i][temp]);
                }
              }
              option = me._fillSeriesData(option, data[i]);
            }
          }
          // tempObj是一个类二维数组的对象，key是下标，value是对应轴上的data
          for (temp in tempObj) {
            // 类目数据
            name = temp.split('-');
            i = name[1];
            name = name[0];
            option[name][i].data = tempObj[temp];
          }
          return option;
        },
        /**
         * @private
         * 装载serires数据
         * @param   {Object} option
         * @param   {Object} data
         * @returns {Object} 加工后的option
         */
        _fillSeriesData: function(option, data) {
          var me = this,
            i, val, valueKey;
          for (i = 0; i < me.seriesCfg.length; i++) {
            valueKey = me.seriesCfg[i].valueKey;
            val = data[valueKey] || '';
            if (!isA(option.series[i].data)) {
              option.series[i].data = [];
            }
            option.series[i].data.push(val);
          }
          return option;
        },
        /**
         * @private
         * @param   {Object} cfg 配置信息
         * @returns {Object} option
         */
        _getDefaultOption: function(cfg) {
          var me = this,
            uw = me._getSizeByRem(),
            option;
          option = {
            title: {
              show: (isS(cfg.title) && cfg.title.length > 0),
              text: cfg.title,
              subtext: cfg.subTitle,
              left: 'center'
            },
            grid: {
              left: '3%',
              right: '10%',
              bottom: '10%',
              top: '15%',
              containLabel: true
            },
            legend: {
              show: isB(cfg.hideLegend) ? !cfg.hideLegend : true,
              icon: 'circle',
              textStyle: {
                fontSize: uw * 0.6 > 12 ? 12 : uw * 0.6
              },
              data: cfg.legends
            },
            tooltip: {
              trigger: 'axis',
              backgroundColor: '#fff',
              borderColor: '#e5e5e5',
              textStyle: {
                color: '#000',
                fontSize: uw * 0.6 > 12 ? 12 : uw * 0.6
              }
            },
            xAxis: cfg.xAxis,
            yAxis: cfg.yAxis,
            series: cfg.series
          }
          if (typeof cfg.formatter !== 'undefined') {
            // 自定义tooltip显示
            option.tooltip.formatter = cfg.formatter;
          }
          if (isA(cfg.color)) {
            option.color = cfg.color;
          }
          return option;
        },
        /**
         * @public
         * 设置主标题
         * @param  {String} title 标题
         */
        setTitle: function(title) {
          if (isS(title)) {
            this.title = title;
            this.rebuildDefaultOption();
          }
          return this;
        },
        /**
         * @public
         * 设置副标题，主题仅当主标题存在时副标题才显示
         * @param  {String} subTitle 副标题
         */
        setSubTitle: function(subTitle) {
          if (isS(subTitle)) {
            this.subTitle = subTitle;
            this.rebuildDefaultOption();
          }
          return this;
        },
        /**
         * @public
         * 设置其他配置项
         * @param  {Object} otherCfg
         */
        setOtherCfg: function(otherCfg) {
          if (isO(otherCfg)) {
            this.otherCfg = otherCfg;
            this.rebuildDefaultOption();
          }
          return this;
        },
        /**
         * @public
         * 设置是否隐藏图例
         * @param  {Boolean} hideLegend
         */
        setHideLegend: function(hideLegend) {
          if (isB(hideLegend)) {
            this.hideLegend = hideLegend;
            this.rebuildDefaultOption();
          }
          return this;
        },
        /**
         * @public
         * 设置图所使用的调色盘颜色列表
         * @param  {Array} color
         */
        setColor: function(color) {
          if (isA(color)) {
            this.color = color;
            this.rebuildDefaultOption();
          }
          return this;
        }
      });
    }
  });
}());
