/**
 * @module Sn.Utilitis
 * 数据计算工具模块
 *
 * @version 1.0.0
 * @since 2017-03-30
 * @author Jinhai
 */
(function() {
  var NUMBER_UNITS = [false, '万', '亿', '万亿'],
    ValueHelper;
  var Utilitis = {
    /**
     * @public
     * 计算同比百分值
     * 正常时返回值的公式为：(value-cpValue)*100/cpValue
     * @return {Number/Boolean} 当传入值均为数字时，返回一个数值；否则返回false
     */
    comparePercent: function(value, cpValue) {
      value = ValueHelper.toInteger(value, false);
      cpValue = ValueHelper.toInteger(cpValue, false);
      if (!isN(value) || !isN(cpValue)) {
        return false;
      } else {
        return (value - cpValue) * 100 / cpValue;
      }
    },
    /**
     * 计算占比值，并格式化为一个带有百分号的字符串，如：'6.03%'；
     * 当无法计算时，返回defaultValue值；
     * @param {Number} value 分子值；
     * @param {Number} total 分母值；
     * @param {Number} precision (可选)小数精度值，默认为2；
     * @param {String} defaultValue 无法计算时的返回值；
     * @return {String} 格式化后的字符串；当不能把value，total转换为数字，或者total的值等于0时返回defaultValue的值。
     */
    toPercentString: function(value, total, precision, defaultValue) {
      value = ValueHelper.toFloat(value, false);
      total = ValueHelper.toFloat(total, false);
      if (!isN(value) || !isN(total) || total == 0) {
        return defaultValue;
      }
      precision = isN(precision) ? precision : 2;
      var v = value * 100 / total;
      return v.toFixed(precision) + '%';
    },
    /**
     * @public
     * 格式化输出一个百分比数值
     *
     * @param {Number/String} value (必须)百分比数值或者是可以转换为小数的字符串
     * @param {Number/Object} precentZoom (可选)百分比数值倍数设定；只有当precentMode等于true时有效；具体值设定说明如下：
     * 							当precentZoom等于false时，表示无须进行缩放；
     *							等于true表示需要放大100倍；等于数字时，则需要放大此数值的倍数；默认为false
     * @param {Number} precision (可选)小数精度值，默认为2；
     * @return {String} 字符串
     *			当不能将value转换为一个小数值时，直接返回字符串: '--';
     *			否则返回格式如： <span class="value-num">{value}</span><span class="pre-value"></span>
     */
    formatPercentNumber: function(value, zoom, precision) {
      var v = ValueHelper.toFloat(value, false);
      if (!isN(v)) {
        return '--'
      }
      if (true == zoom) {
        v = v * 100;
      } else if (isN(zoom)) {
        v = v * zoom;
      }

      var rel = ['<span class="value-num">'];
      if (isN(precision) && precision >= 0) {
        rel.push(v.toFixed(precision));
      } else {
        rel.push(v.toFixed(2));
      }
      rel.push('</span><span class="pre-value"></span>');
      return rel.join('');
    },
    /**
     * @public
     * 按照国人习惯对一个数值进行缩放，且不具有HTML格式
     * 规则为以个，万，亿为单位进行缩放，并确保只保留1位小数
     * @param {Number} v 数值
     * @param {Boolean} noUnit 等于true时，不会具备单位
     */
    formatNumberForScaleSimple: function(v, noUnit) {
      if (!isN(v)) {
        return '';
      }

      var c = v < 0 ? -v : v,
        ix = 0;
      while (c >= 10000) {
        c = c / 10000;
        ix++;
      }
      if (ix > 0) {
        var tx = [];
        if (v < 0) {
          tx.push('-');
        }
        tx.push(c.toFixed(1));
        if (true !== noUnit) {
          tx.push(NUMBER_UNITS[ix]);
        }
        return tx.join('');
      } else {
        return Utilitis.formatInteger(v);
      }
    },
    /**
     * @public
     * 按照国人习惯对一个数值进行缩放
     * 规则为以个，万，亿为单位进行缩放，并确保只保留1位小数
     * @param {Number} v 数值
     * @return {String} 格式为: <span class="value-num">{value}</span>[<span class="value-unit">{unit}</span>]
     *		其中{value}为缩放完后并保留1位小数的数值，{unit}为单位名，当为'个'时，不会具有'<span class="value-unit">{unit}</span>'这个字符串；
     */
    formatNumberForScale: function(v) {
      if (!isN(v)) {
        return '';
      }

      var c = v < 0 ? -v : v,
        ix = 0;
      while (c >= 10000) {
        c = c / 10000;
        ix++;
      }

      var html = ['<span class="value-num">'];
      if (ix > 0) {
        if (v < 0) {
          html.push('-');
        }
        html.push(ix > 0 ? c.toFixed(1) : c);
        html.push('</span>');
        html.push('<span class="value-unit">');
        html.push(NUMBER_UNITS[ix]);
        html.push('</span>');
      } else {
        html.push(Utilitis.formatInteger(v));
        html.push('</span>');
      }
      return html.join('');
    },

    /**
     * @public
     * 格式化一个整数值
     */
    formatInteger: function(n) {
      if (!isN(n)) {
        return '';
      }
      var v = Math.floor(n),
        vs = [],
        m, len = 0;

      if (v === 0) {
        return '0';
      }
      v = n < 0 ? -v : v;
      while (v != 0) {
        m = v % 10;
        if (len > 0 && len % 3 === 0) {
          vs.unshift(',');
        }
        vs.unshift(m);
        v = Math.floor(v / 10);
        len++;
      }

      if (n < 0) {
        vs.unshift('-');
      }

      return vs.join('');
    }
  }

  Cmp.define('Cp.util.Utilitis', {
    requires: [
      'Cmp.util.ValueHelper'
    ],
    factory: function(ext, reqs) {
      ValueHelper = reqs[0];
      return Utilitis;
    }
  });
}());
