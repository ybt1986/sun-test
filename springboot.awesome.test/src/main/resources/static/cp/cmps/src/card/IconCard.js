(function() {
  var Utilitis , ValueHelper;
  // 判断同比数据
  var createSubValue = function(title, cls, box) {
    var html = [],
      el, cns, rel = {};
    html.push('<div class="value">--</div>');
    el = box.createChild({
      cls: [cls, 'lp-card-cpvalue'],
      html: html.join('')
    });
    cns = el.dom.childNodes;
    rel.el = el;
    rel.valueEl = Cmp.get(cns[0]);
    rel.hide = function() {
      rel.el.hide();
    }
    rel.show = function() {
      rel.el.show();
    }
    rel.setValue = function(value, precentMode, precentZoom) {
      rel.valueEl.removeClass(['pre-value', 'up-value', 'down-value']);
      if (false === precentMode || isS(value)) {
        // 直接设定形式
        if (isN(value)) {
          rel.valueEl.update(Utilitis.formatInteger(value));
        } else {
          rel.valueEl.update(value || '');
        }
      } else {
        if (!isN(value)) {
          rel.valueEl.update(isS(value) ? value : '--');
        } else {
          var tx;
          if (isN(precentZoom)) {
            tx = value * precentZoom;
          } else if (true === precentZoom) {
            tx = value * 100;
          } else {
            tx = value;
          }
          var cls = ['pre-value'];
          if (tx > 0) {
            if (tx > 9999) {
              cls = ['max-value'];
            } else {
              cls.push('up-value');
            }
          } else if (tx < 0) {
            cls.push('down-value');
            tx = -tx;
          }
          rel.valueEl.addClass(cls);
          rel.valueEl.update(tx > 9999 ? '9999' : (tx == 100 ? '100%' : tx.toFixed(2) + '%'));
        }
      }
    }
    return rel;
  }
  var formatVal = function(cv, valueScalable) {
    var val;
    // 当前值
    if (isN(cv)) {
      if (isB(valueScalable) && valueScalable) {
        // 智能缩放
        val = Utilitis.formatNumberForScale(cv);
      } else {
        val = Utilitis.formatInteger(cv);
      }
    } else {
      if (isS(cv)) {
        val = cv;
      } else {
        val = '--';
      }
    }
    return val;
  }
  var HTML = [];
  HTML.push('<div class="lp-card-content">');
  HTML.push('<div class="icon"></div>');
  HTML.push('<div class="number"></div>');
  HTML.push('<div class="title"></div>');
  HTML.push('<div class="lp-card-subbox"></div>');
  HTML.push('</div>');
  HTML = HTML.join('');
  Cmp.define('Cp.card.IconCard', {
    extend: 'Cmp.Widget',
    cls: true,
    requires: [
      'Cp.util.Utilitis',
      'Cmp.util.ValueHelper'
    ],
    factory: function(ext, reqs) {
      var superClazz = ext.prototype;
        Utilitis = reqs[0];
        ValueHelper = reqs[1];
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this;
          superClazz.initComponent.call(me);
        },
        doRender: function() {
          var me = this ,dom;
          superClazz.doRender.call(me);
          me.el.addClass('lp-card');
          me.el.update(HTML);
          dom = me.el.dom;
          me.el.on('click', me.check, me);
          me.iconBox = Cmp.get(dom.childNodes[0].childNodes[0]);
          me.valueEl = Cmp.get(dom.childNodes[0].childNodes[1]);
          me.titleBox = Cmp.get(dom.childNodes[0].childNodes[2]);
          me.subBox = Cmp.get(dom.childNodes[0].childNodes[3]);
          me.RenderMain();
        },
        /**
         * 参数配置
         * @constructor
         */
        RenderMain:function(){
          var me = this,
              cv,dv;
          // title
          if (isS(me.title)) {
            me.titleBox.update(me.title);
          } else {
            me.titleBox.setHideModal('display');
            me.titleBox.hide();
          }
          // value
          if (isO(me.value) && Cmp.isDefined(me.value.count)) {
            cv = Utilitis.formatInteger(me.value.count) ? Utilitis.formatInteger(me.value.count) : me.value.main;
            me.valueEl.update(cv);
          }
          // 同比
          me.dayCountEl = createSubValue(isS(me.dayLabel) ? me.dayLabel : '', 'day-count', me.subBox);
          me.dayCountEl.el.setHideModal('display');
          if (isO(me.value) && Cmp.isDefined(me.value.dayCount)) {
            dv = Utilitis.comparePercent(cv, me.value.dayCount);
            me.dayCountEl.setValue(dv, true, false);
          }
        },
        /**
         * 设置数值
         * @param value [Array]
         */
        setValue:function (value) {
            var me = this;
            me.setMainVal(value);
            if (isA(me.subList)) {
              me.setSubVal(value.sub);
            }
        },
        /**
         * 设置主面板数据
         * @param  {Object} value
         */
        setMainVal: function(value) {
          var me = this,
            ov, cv, dv, wv, val, temp;
          ov = isO(value) ? value : {};
          if (isB(me.percentMode) && me.percentMode) {
            me.valueEl.update(ov.count);
            if (!(isB(me.hideDay) && me.hideDay)) {
              me.dayCountEl.setValue(ov.dayCount, true, false);
            }
          } else {
            if (parseInt(ov.count) != ov.count) {
              val = ov.count;
              val = Math.round(ValueHelper.toFloat(val, false) * 100) / 100;
              temp = Math.floor(val);
              html = Utilitis.formatInteger(temp) + '.' + (val.toFixed(2).split('.')[1]);
              me.valueEl.update(html+'%');
              cv = parseFloat(html+'%');
            } else {
              cv = ValueHelper.toInteger(ov.count, false);
              me.valueEl.update(formatVal(cv)+'%')
            }
            if (!(isB(me.hideDay) && me.hideDay)) {
              dv = Utilitis.comparePercent(cv, ov.dayCount);
              me.dayCountEl.setValue(dv, true, false);
            }
          }
        },
        /**
         * 设置下部列表值
         * @param  {Object} value
         */
        setSubVal: function(value) {
          var me = this;
          Cmp.each(me.list, function(item) {
            var name = item.dataName;
            item.setValue(value[name]);
          })
        },
        /**
         * 选中
         */
        check: function() {
          if (this.disabled || this.checked) {
            return;
          }
          this.checked = true;
          this.el.addClass('on');
          this.fire();
        },
        /**
         * 取消选中
         */
        uncheck: function() {
          if (this.disabled || !this.checked) {
            return;
          }
          this.checked = false;
          this.el.removeClass('on');
        },
        /**
         * 触发点击事件
         */
        fire: function() {
          this.fireEvent('onClick');
        },
        /**
         * 禁用
         */
        disable: function() {
          this.disabled = true;
          this.el.addClass('lp-card-disabled');
        },
        /**
         * 取消禁用
         */
        enable: function() {
          this.disabled = false;
          this.el.removeClass('lp-card-disabled');
        }
      })
    }
  })
}());
