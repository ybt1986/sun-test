(function() {
  var HTML = [];
  HTML.push('<div class="cp-card-iconbox">');
  HTML.push('<img src="/valueSupplyChain/images/cardIcon.png" />');
  HTML.push('</div>');
  HTML.push('<div class="cp-card-label"></div>');
  HTML.push('<div class="cp-card-main"><span class="cp-card-main-val"></span><span class="cp-card-main-unit"></span></div>');
  HTML.push('<div class="cp-card-compare"><span class="cp-card-label"></span><span class="cp-card-cpvalue"></span></div>');
  HTML = HTML.join('');
  Cmp.define('Cp.realtime.Card', {
    extend: 'Cmp.Widget',
    requires: ['Cp.util.Utilitis'],
    cls: true,
    factory: function(ext, reqs) {
      var SP = ext.prototype,
        Utilitis = reqs[0];
      return Cmp.extend(ext, {
        initComponent: function() {
          if (!isB(this.needFormat)) {
            this.needFormat = true;
          }
          this.cls = 'cp-card';
          SP.initComponent.call(this);
        },
        doRender: function() {
          var me = this,
            doms;
          SP.doRender.call(me);
          me.el.update(HTML);
          doms = me.el.dom.childNodes;
          // 文字信息
          me.labelBox = Cmp.get(doms[1]);
          if (isS(me.label)) {
            me.labelBox.update(me.label);
          }
          // 主数据
          me.mainBox = Cmp.get(doms[2].firstChild);
          if (isS(me.unit)) {
            Cmp.get(doms[2].lastChild).update(me.unit);
          }
          // 比较数据
          me.compareLabelBox = Cmp.get(doms[3].firstChild);
          // if (isS(me.compareLabel)) {
          //   me.compareLabelBox.update(me.compareLabel);
          // }
          me.compareBox = Cmp.get(doms[3].lastChild);
          if (me.value) {
            me.setValue(me.value);
          }
        },
        /**
         * 设置数据
         * @param  {Object} data
         * @param  {String/Number} data.value   主数据
         * @param  {String/Number} data.compare 比较数据
         */
        setValue: function(data) {
          var me = this;
          if (typeof data.value !== 'undefined') {
            // 主数据存在
            if (me.needFormat) {
              // 需要千分号格式化
              data.value = Utilitis.formatInteger(parseInt(data.value));
            }
            me.mainBox.update(data.value);
          }
          if (typeof data.compare !== 'undefined') {
            // 对比数据存在
            data.compare = parseInt(data.compare);
            if (!isNaN(data.compare)) {
              // 对比数据可被转为整数
              me.compareBox.removeClass(['pre-value', 'up-value', 'down-value']);
              var cls = ['pre-value'];
              if (data.compare > 0) {
                cls.push('up-value');
                me.compareLabelBox.update(isS(me.compareLabelUp) ? me.compareLabelUp : '');
              } else if (data.compare < 0) {
                cls.push('down-value');
                me.compareLabelBox.update(isS(me.compareLabelDown) ? me.compareLabelDown : '');
              }
              me.compareBox.update(Math.abs(data.compare));
              me.compareBox.addClass(cls);
            }
          }
        }
      })
    }
  })
}());
