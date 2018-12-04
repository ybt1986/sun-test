/**
 * @class Cp.form.CateTreeSelect
 * @extend Cmp.form.ComboBox
 *
 * 下拉框单选控件实现类
 * <p>
 * 构建时可以的属性配置说明如下：
 * @cfg {String} emptyText (可选)录入控件中的值为空时，出现的提示文字；默认为空的。
 * @cfg {String} label (可选)显示标签文字，默认为空的。
 * @cfg {String} name (可选)录入值的属性名设定，默认为空的。
 * @cfg {Boolean} disabled (可选)等于true时认为初始时为失效的，即不可录入值。默认为false。
 * @cfg {Boolean} hideLabel (可选)等于true时，不会绘制标签文字。默认为false
 * @cfg {String/Number} labelWidth (可选)标签文字，占用的宽度，如果是一个数值则认为配置的是像素级别的宽度值。默认为: '5rem'；
 * @cfg {Boolean} readOnly 等于true时，为只读状态。
 * @cfg {Array} options (可选)构建候选项的数据对象组成的数组。数组中每一个对象为一个候选项，候选项排列顺序等于数组顺序。
 * @cfg {Boolean} hidderRoot 等于true时，隐藏最高层级。
 * @cfg {Boolean} radio 等于true时，为单选状态。 默认为false。
 * @cfg {Object} root ，基础值{id : 'root',text : '全部'}。此时子项的加载是异步的，请求的地址/geSkuCateList.json。同步时数据格式为：
 * [{"itemFirstCateCd":670,"itemFirstCateName":"电脑、办公","async":false,"children":[{"itemSecondCateCd":686,"itemSecondCateName":"外设产品","async":false,"children":[{"id":null,"itemFirstCateCd":670,"itemFirstCateName":"电脑、办公","itemSecondCateCd":686,"itemSecondCateName":"外设产品","itemThirdCateCd":1047,"itemThirdCateName":"插座"}]}]}]
 * </p>
 */
(function() {
  Cmp.define('Cp.form.CateTreeSelect', {
    extend: 'Cmp.form.ComboBox',
    requires: [
      'Cp.form.CateTreeSelectView',
      'Cmp.util.AjaxProxy'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var superClazz = ext.prototype,
        treeComboBoxViewClazz = reqs[0],
        AjaxProxy = reqs[1];

      return Cmp.extend(ext, {
        /**
         * @overwrite
         *
         */
        getValue: function() {
          return this.getTrueSelect();
        },
        /**
         * @overwrite
         * 功能：只支持重置
         */
        setValue: function(data) {
          var view = this.view,
            name = '';
          if (typeof data === 'undefined') {
            view.reset();
          } else {
            view.trueSelect['temp'] = {
              oneId: !!data.itemFirstCateCd ? data.itemFirstCateCd : '',
              itemFirstCateName: !!data.itemFirstCateName ? data.itemFirstCateName : '',
              twoId: !!data.itemSecondCateCd ? data.itemSecondCateCd : '',
              itemSecondCateName: !!data.itemSecondCateName ? data.itemSecondCateName : '',
              threeId: !!data.itemThirdCateCd ? data.itemThirdCateCd : '',
              itemThirdCateName: !!data.itemThirdCateName ? data.itemThirdCateName : ''
            };
            if (isS(data.itemFirstCateName)) {
              name += data.itemFirstCateName;
            }
            if (isS(data.itemSecondCateName)) {
              name += '-' + data.itemSecondCateName;
            }
            if (isS(data.itemThirdCateName)) {
              name += '-' + data.itemThirdCateName;
            }
            view.inputField.dom.value = name;
          }
        },
        /**
         * @param {object} data 树结构
         * 功能：用传入的数据重新绘制树
         */
        setOptions: function(data) {
          //强制清空树。
          var me = this;
          delete me.view.tree;
          me.view.nodeViews = {};
          me.warp.update("");
          me.root = {
            id: 'root',
            text: '全部',
            children: data
          };
          me.view.render(me, me.warp);
        },
        getTrueSelect: function() {
          var me = this,
            id, result = [],
            selected = me.view.trueSelect;
          for (id in selected) {
            result.push(selected[id]);
          }
          return result
        },
        getSelectValue: function() {
          return this.view.selectShowValue;
        },
        getLoader: function() {
          return AjaxProxy;
        },
        /**
         * @private
         * 收缩候选项列表
         */
        collect: function() {
          var me = this;
          if (me.extended) {
            me.extended = false;
            var mask = me.getBodyMask();
            mask.hide();
            me.el.removeClass('c-cbx-extended');
            mask.un('click', me.collect, me);
            me.box.hide();
            me.fireEvent('changed');
          }
        },
        /**
         * @private
         * 展开候选项列表
         */
        extend: function() {
          var me = this;
          if (!me.extended) {
            me.extended = true;
            var w = me.input.getWidth(),
              h = me.input.getHeight(),
              xy = me.input.getXY();
            me.box.setLeftTop(xy[0], xy[1] + h);
            me.box.setWidth(w);
            me.box.show();
            me.el.addClass('c-cbx-extended');
            window.setTimeout(function() {
              var mask = me.getBodyMask();
              mask.show();
              mask.on('click', me.collect, me);
            }, 10);
          }
        },
        /**
         * @private
         * @overwrite
         */
        doClickTrigger: function() {
          var me = this;
          if (me.disabled) {
            return
          }
          if (me.extended) {
            me.collect();
          } else {
            me.extend();
          }
        },
        /**
         * @private
         * 获得实际控制该部件进行渲染得树渲染其
         */
        getView: function() {
          var me = this;
          if (!me.view) {
            me.view = new treeComboBoxViewClazz(me.input);
          }
          return me.view;
        },
        /**
         * @private
         * @overwrite
         */
        initComponent: function() {
          var me = this;
          var cls = ['c-cbx'];
          if (isS(me.cls)) {
            cls.push(me.cls);
          } else if (isA(me.cls)) {
            cls = cls.concat(me.cls);
          }
          me.cls = cls;
          me.readOnly = false !== me.readOnly;
          //是否为单选
          me.radio = true === me.radio;
          // 是否自动加载
          me.autoInit = false !== me.autoInit;
          me.btnType = 'down';
          superClazz.initComponent.call(me);
          me.addEvents(
            /**
             * @event
             * 节点展开后，分发此事件
             * @param {TreeNode} node 收缩的节点
             * @param {TreePanel} this
             */
            'extendednode',
            /**
             * @event
             * 节点收缩后，分发此事件
             * @param {TreeNode} node 收缩的节点
             * @param {TreePanel} this
             */
            'collectednode'
          );
        },
        /**
         * @private
         * @overwrite
         */
        renderInput: function(box) {
          var me = this;
          superClazz.renderInput.call(me, box);
          me.getBodyMask();
          superClazz.renderOptionView.call(me);
          me.root = {
            id: 'root',
            text: '全部',
            children: me.root
          };
          var view = me.getView();
          view.render(me, me.warp);
        },
        /**
         * @private
         * 渲染用于遮挡BODY的遮罩层。该方法将会创建bodyMask属性
         */
        getBodyMask: function() {
          var me = this;
          if (!me.bodyMask) {
            me.bodyMask = Cmp.getBody().createMask('ComboxMask', 900000);
          }
          return me.bodyMask;
        },
        selAll: function() {
          this.getView().selAll();
        }
      });
    }
  });
}());
