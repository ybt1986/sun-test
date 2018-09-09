(function() {
  Cmp.define('Cp.chart.geo.GeoOptBuilder', {
    extend: 'Cp.chart.EchartOptBuilder',
    factory: function(ext, reqs) {
      var superClazz = ext.prototype;
      /**
       * 转化数字，如果能够转化成功，返回转后的值，否则返回0
       * @param  {Anythin} data
       */
      function _convertNumber(data) {
        data = parseFloat(data);
        if (isNaN(data)) {
          return 0;
        }
        return data;
      }
      /**
       * 转化点数据
       * @param  {Array/Object} data
       */
      function _convertData(data) {
        var result = [],
          temp = {};

        if (isA(data)) {
          // 如果是数组，对每一项进行转化
          for (var i = 0, len = data.length; i < len; i++) {
            result.push(_convertData(data[i]));
          }
          return result;
        } else if (isO(data)) {
          temp.name = isS(data.name) ? data.name : '';
          if (isA(data.value) && data.value.length === 3) {
            // value包含坐标信息，第一项经度，第二项纬度，第三项值
            temp.value = data.value;
          } else {
            temp.value = [];
            // 经度
            temp.value.push(_convertNumber(data.long));
            // 纬度
            temp.value.push(_convertNumber(data.lat));
            // 值
            temp.value.push(_convertNumber(data.value));
          }
          return temp;
        }
      }
      return Cmp.extend(ext, {
        /**
         * 初始化chart option
         * @returns {Object} option
         */
        initOption: function() {
          var me = this,
            option, tmp;
          tmp = me.initSeries();
          me.optionCfg = {
            title: me.title,
            subTitle: me.subTitle,
            legends: tmp.legends,
            series: tmp.seriesArr,
            hideLegend: me.hideLegend,
            roam: me.roam,
            selectedMode: me.selectedMode,
            otherCfg: me.otherCfg
          }
          if (me.formatter) {
            // tooltip formatter
            me.optionCfg.formatter = me.formatter;
          }
          if (isA(me.color)) {
            me.optionCfg.color = me.color;
          }
          option = me._getDefaultOption(me.optionCfg);
          // 遍历其它选项
          if (isO(me.otherCfg)) {
            option = me.applyOption(option, me.otherCfg);
          }
          return option;
        },
        /**
         * @private
         * 递归拼装其他配置
         * @param    {Object} option chart option
         * @param    {Object} cfg    其他配置
         * @returns  {Object} 拼装后的option
         */
        applyOption: function(option, cfg) {
          var me = this,
            name;
          for (name in cfg) {
            if (typeof option[name] === 'undefined') {
              option[name] = cfg[name];
            } else if (!isA(option[name]) && isO(cfg[name]) && !isA(cfg[name])) {
              option[name] = me.applyOption(option[name], cfg[name]);
            } else {
              option[name] = cfg[name];
            }
          }
          return option;
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
            seriesCfg = me.seriesCfg,
            temp;
          if (!isA(seriesCfg) && isO(seriesCfg)) {
            seriesCfg = [seriesCfg];
          }
          if (typeof seriesCfg !== 'undefined') {
            for (var i = 0; i < seriesCfg.length; i++) {
              // 系列配置
              temp = Cmp.apply({}, seriesCfg[i]);
              temp.coordinateSystem = 'geo';
              seriesArr.push(temp);
              // legends
              legends.push(isS(seriesCfg[i].name) ? seriesCfg[i].name : '');
            }
          }
          return {
            seriesArr: seriesArr,
            legends: legends
          };
        },
        /**
         * 根据设置的数据重新对option进行改造
         * @param    {Array}   data
         * @returns  {Object}  option
         */
        setValue: function(data) {
          var me = this,
            i, option = me.getOption();
          if (Cmp.isDefined(data)) {
            me._tmpData = data;
          } else {
            data = me._tmpData;
          }

          for (i = 0; i < option.series.length; i++) {
            if (isA(data)) {
              // 如果是数组，则所有数据一致
              option.series[i].data = (isB(me.seriesCfg[i].needConvert) && me.seriesCfg[i].needConvert) ? _convertData(data) : data;
            } else if (isO(data)) {
              // 如果是对象则对应valueKey转化赋值
              option.series[i].data = (isB(me.seriesCfg[i].needConvert) && me.seriesCfg[i].needConvert) ? _convertData(data[me.seriesCfg[i].valueKey]) : data[me.seriesCfg[i].valueKey];
            } else {
              // 其他直接空
              option.series[i].data = [];
            }
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
              bottom: '5%',
              top: '15%',
              containLabel: true
            },
            tooltip: {
              trigger: 'item',
              backgroundColor: '#fff',
              borderColor: '#e5e5e5',
              textStyle: {
                color: '#000',
                fontSize: uw * 0.6 > 12 ? 12 : uw * 0.6
              }
            },
            legend: {
              orient: 'vertical',
              top: 'bottom',
              left: 'right',
              textStyle: {
                fontSize: uw * 0.6 > 12 ? 12 : uw * 0.6
              },
              selectedMode: 'single',
              data: cfg.legends
            },
            geo: {
              map: 'china',
              roam: isB(cfg.roam) || isS(cfg.roam) ? cfg.roam : false,
              selectedMode: isB(cfg.selectedMode) || isS(cfg.selectedMode) ? cfg.selectedMode : false,
              itemStyle: {
                normal: {
                  areaColor: '#87b4e7',
                  borderColor: '#d3cec9'
                }
              }
            },
            series: cfg.series
          }
          if (typeof cfg.formatter !== 'undefined') {
            // 自定义tooltip显示
            option.tooltip.formatter = cfg.formatter;
          }
          if (isA(cfg.color)) {
            option.color = cfg.color;
          }
          if (isB(cfg.hideLegend) && cfg.hideLegend) {
            option.legend.show = false;
          }
          return option;
        }
      })
    }
  })
}())
