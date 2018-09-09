/**
 * 多选选择录入组控件类
 * @class Cmp.form.CheckboxGroup
 * @extend Cmp.form.Field
 * <p>
 * 构建时可以的属性配置说明如下：
 * @cfg {Array} value (可选)初始时处于选中的选项；每一项为一个值
 * @cfg {String} text (可选)右侧提示文字；默认为空的。
 * @cfg {Array} options (可选)候选项对象组成的数组。每一个对象具有以下两个属性
 *		{String} value (必须)选项值
 *		{String} text (可选)选项显示文字,默认等于value
 * @cfg {Boolean} disabled (可选)等于true时认为初始时为失效的，即不可录入值。默认为false。
 * @cfg {Boolean} hideLabel (可选)等于true时，不会绘制标签文字。默认为false
 * @cfg {String/Number} labelWidth (可选)标签文字占用的宽度，如果是一个数值则认为配置的是像素级别的宽度值。默认为: '5rem'；
 * @cfg {Boolean} showAll (可选)等于true时，显示表示全选Checkbox控件；默认为true；
 * @cfg {String/Number} optionWidth (可选)每一候选项所占用的宽度；
 * </p>
 */
(function() {
  Cmp.define('Cp.form.CheckBox', {
    extend: 'Cmp.Widget',
    requires: [],
    cls: true,
    factory: function(ext, reqs) {
      var superClazz = ext.prototype;
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this,
            cls = me.cls;
          if (isA(cls)) {
            cls.unshift('cp-checkbox');
          } else if (isS(cls)) {
            cls = ['cp-checkbox', cls];
          } else {
            cls = 'cp-checkbox';
          }
          me.cls = cls;
          superClazz.initComponent.call(me);
          cls = me.checked;
          if ('half' === cls) {
            cls = 'half';
          } else if (true === cls || 'true' === cls) {
            cls = 'checked';
          } else {
            cls = false;
          }
          me.checkMode = cls;
          delete me.checked;
          me.addEvents(
            'click'
          );
        },
        /**
         * @private
         */
        doRender: function() {
          var me = this,
            el, lw;
          superClazz.doRender.call(me);
          el = me.el;
          lw = me.labelWidth;
          if (isN(lw)) {
            lw += 'px';
          }
          if (!isS(lw)) {
            lw = '5rem';
          }
          me.labelWidth = lw;
          // label
          me.labelBox = el.createChild({
            cls: 'c-lb',
            style: {
              width: lw
            },
            html: '<strong>' + (me.labelText || '') + '</strong><i></i><b></b>'
          });
          me.labelBox.setHideModal('display');

          // checkbox
          me.checkboxBox = el.createChild({
            cls: 'c-checkbox-warp',
            style: {
              paddingLeft: lw
            },
            html: '<span class="c-checkbox-icon fa fa-square-o"></span><span class="c-checkbox-text">' + (me.text || '') + '</span>'
          });
          me.checkboxBox.on('click', me.onClickInput, me);
          me.checkboxIcon = Cmp.get(me.checkboxBox.dom.firstChild);
          me.checkboxText = Cmp.get(me.checkboxBox.dom.lastChild);
          if (isS(me.text)) {
            me.checkboxText.update(me.text);
          }
          if (false !== me.checkMode) { // 当未选中 选中或者半选状态
            me.checkboxIcon.addClass('c-checkbox-' + me.checkMode);
            if ('half' === me.checkMode) { // 半选状态
              me.checkboxIcon.update('<span class="c-checkbox-icon fa-check-square-o"></span>');
            }
          }
          // 初始化是否禁用
          if (typeof me.disabled !== 'undefined' && isB(me.disabled) && me.disabled) {
            // 将其置为未禁用，否则无法禁用
            me.disabled = false;
            me.disable();
          }
          // 初始化是否隐藏标签
          if (typeof me.hideLabel !== 'undefined' && isB(me.hideLabel) && me.hideLabel) {
            me.hideLabelBox();
          }
        },
        /**
         * 获得当前录入的值
         * @return {String} value 选中状态值；'checked'为选中，'half'为半选；false为非选中。
         */
        getValue: function() {
          return this.value;
        },
        getText: function() {
          return this.text;
        },
        getName: function(){
          return this.name
        },
        /**
         * 设定值
         * @param {String} value 选中状态值；'checked'为选中，'half'为半选；false为非选中。
         */
        setValue: function(value) {
          var me = this;
          if ('true' === value || true === value) {
            value = 'checked'
          } else if ('false' === value) {
            value = false;
          }
          if (me.checkMode === value) {
            return;
          }
          if ('checked' === value) {
            me.toCheckedMode();
          } else if ('half' === value) {
            me.toHalfCheckedMode();
          } else {
            me.toUncheckedMode();
          }
        },
        /**
         * 返回true表示当前为选中状态;
         * 注意：半选状态不属于选中状态
         * @return {Boolean}
         */
        isCheckeded: function() {
          return 'checked' === this.checkMode;
        },
        /**
         * 返回true表示当前为半选中状态
         * @return {Boolean}
         */
        isHalfChecked: function() {
          return 'half' === this.checkMode;
        },
        /**
         * 返回true表示当前为非选中状态
         * 注意：半选状态不属于非选中状态
         * @return {Boolean}
         */
        isUnchecked: function() {
          return '' === this.checkMode;
        },
        /**
         * @private
         */
        onClickInput: function() {
          var me = this;

          if (me.isDisabled()) {
            return;
          }
          if (false !== me.fireEvent('click', me.checkMode, (me.isCheckeded() ? 'checked' : false), me)) {
            //允许切换
            if (me.isCheckeded()) {
              me.toUncheckedMode();
            } else {
              me.toCheckedMode();
            }
          }
        },
        /**
         * @public
         * 切换至选中状态，并分发'changed'事件
         */
        toCheckedMode: function(flag) {
          var me = this;
          if (me.isCheckeded()) {
            return me;
          }
          if (false !== me.checkMode) { // 半选
            me.checkboxBox.removeClass('c-checkbox-' + me.checkMode);
            me.checkboxIcon.removeClass('fa-check-square');
            me.checkboxIcon.removeClass('fa-square-o');
            me.checkboxIcon.addClass('fa-check-square-o');
          }
          me.checkMode = 'checked';
          me.checkboxBox.addClass('c-checkbox-' + me.checkMode);
          me.checkboxIcon.removeClass('fa-square-o');
          me.checkboxIcon.removeClass('fa-check-square-o');
          me.checkboxIcon.addClass('fa-check-square');
          me.checkboxIcon.update('');
          if (isB(flag) && flag) {
            return me;
          }
          me.fireEvent('changed', me.checkMode, me);
          return me;
        },
        /**
         * @public
         * 切换至半选中状态，并分发'changed'事件
         */
        toHalfCheckedMode: function(flag) {
          var me = this;
          if (me.isHalfChecked()) {
            return me;
          }
          if (false !== me.checkMode) { // 选中
            me.checkboxBox.removeClass('c-checkbox-' + me.checkMode);
            me.checkboxIcon.removeClass('fa-square-o');
            me.checkboxIcon.removeClass('fa-check-square-o');
            me.checkboxIcon.addClass('fa-check-square');
          }
          me.checkMode = 'half';
          me.checkboxBox.addClass('c-checkbox-' + me.checkMode);
          me.checkboxIcon.removeClass('fa-check-square');
          me.checkboxIcon.removeClass('fa-check-square-o');
          me.checkboxIcon.addClass('fa-square-o');
          me.checkboxIcon.update('<span class="fa fa-square check-half-inner"></span>');
          if (isB(flag) && flag) {
            return me;
          }
          me.fireEvent('changed', me.checkMode, me);
          return me;
        },
        /**
         * @public
         * 切换至非选中状态，并分发'changed'事件
         */
        toUncheckedMode: function(flag) {
          var me = this;
          if (me.isUnchecked()) {
            return me;
          }
          me.checkboxBox.removeClass('c-checkbox-' + me.checkMode);
          me.checkboxIcon.removeClass('fa-check-square');
          me.checkboxIcon.removeClass('fa-check-square-o');
          me.checkboxIcon.addClass('fa-square-o');
          me.checkboxIcon.update('');
          me.checkMode = false;
          if (isB(flag) && flag) {
            return me;
          }
          me.fireEvent('changed', me.checkMode, me);
          return me;
        },
        /**
         * @public
         * 判断组件是否被禁用
         * @return {boolean} 禁用：true  启用：false
         */
        isDisabled: function() {
          return this.disabled;
        },
        /**
         * @public
         * 禁用组件
         */
        disable: function() {
          var me = this;
          if (me.isDisabled()) {
            return;
          }
          me.disabled = !me.disabled;
          me.el.addClass('c-disabled');
        },
        /**
         * @public
         * 启动组件
         */
        enable: function() {
          var me = this;
          if (!me.isDisabled()) {
            return
          }
          me.disabled = !me.disabled;
          me.el.removeClass('c-disabled');
        },
        /**
         *  隐藏标签
         * */
        hideLabelBox: function() {
          var me = this;
          me.labelBox.hide();
          me.checkboxBox.setStyle({
            paddingLeft: '0rem'
          });
        }
      })
    }
  })
}());
