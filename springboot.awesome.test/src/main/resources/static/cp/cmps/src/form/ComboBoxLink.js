/**
 * 多级联动ComboBox
 */
(function() {
  function _getOptions(name, data) {
    var options = [];
    Cmp.each(data, function(val) {
      options.push({
        text: val[name + 'Name'],
        value: val[name + 'No']
      });
    })
    return options;
  }
  Cmp.define('Cp.form.ComboBoxLink', {
    extend: 'Cmp.Widget',
    requires: [
      'Cmp.form.ComboBox'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var SP = ext.prototype,
        ComboBox = reqs[0];
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this,
            cls = me.cls;
          if (isA(cls)) {
            cls.unshift('cp-cbl');
          } else if (isS(cls)) {
            cls = ['cp-cbl', cls];
          } else {
            cls = 'cp-cbl';
          }
          me.cls = cls;
          SP.initComponent.call(me);
        },
        doRender: function() {
          var me = this;
          SP.doRender.call(me);
          me.renderItems();
        },
        /**
         * 渲染所有items
         */
        renderItems: function() {
          var me = this,
            cls = 'cp-cbl-horizontal';
          me._items = [];
          if (!isA(me.cfg) || me.cfg.length <= 0) return;
          if (me.layout === 1) {
            cls = 'cp-cbl-vertical'
          } else {
            cls = 'cp-cbl-horizontal ' + 'cp-col-' + (Math.ceil(12 / me.cfg.length));
          };
          Cmp.each(me.cfg, function(item, index) {
            var box = me.el.createChild({
              tag: 'div',
              cls: cls
            });
            var tempItem = new ComboBox(item);
            // 监听所有ComBox的选项
            tempItem.on('changed', (function(i) {
              return function(data) {
                me.onItemsChanged(data, i);
              }
            })(index))
            tempItem.render(box);
            // 默认禁用
            tempItem.disable();
            me._items.push({
              item: tempItem,
              name: item.name
            });
          })
        },
        /**
         * 监听所有ComboBox changed事件
         * @param  {String/Number} data   改变后的值
         * @param  {Number}        index  改变的元素下标
         */
        onItemsChanged: function(data, index) {
          var me = this;
          me.changeItems(index);
          me.fireEvent('changed');
        },
        changeItems: function(index) {
          var me = this,
            tmp, next, name, val, dd;
          // 当是最后一项的时候 无需执行后续代码
          if (index === me._items.length - 1) {
            return
          };
          dd = me._cacheData;
          // 遍历之前所有值
          for (var i = 0; i <= index;) {
            tmp = me._items[i];
            next = me._items[++i];
            name = tmp.name;
            val = tmp.item.getValue();
            if (!val) {
              // 如果当前项没有值，减一
              i--;
              break;
            }
            Cmp.each(dd, function(sub) {
              if (sub[name + 'No'] === val) {
                dd = sub[next.name + 's'];
                return false;
              }
            });
          }
          // 下一项启用
          me._items[i === 0 ? ++i : i].item.enable();
          me._items[i].item.setValue();
          // 设置下一项options
          me.setItemOption(dd, i);
          // 当是需要全部，无需执行后续代码
          if (isB(me.needWhole) && me.needWhole) {
            me.fireEvent('changed');
            return;
          }
          // 后续项目禁用, 并清空值
          for (++i; i < me._items.length; i++) {
            me._items[i].item.setValue();
            me._items[i].item.disable();
          }
        },
        /**
         * 设置选项
         * @param  {Array} options
         */
        setOptions: function(options) {
          var me = this;
          me._cacheData = options;
          me.setItemOption(options, 0);
        },
        /**
         * 设置单项option
         * @param  {Number} index 第几个
         */
        setItemOption: function(options, index) {
          var me = this,
            item, op;
          if (!isA(options)) return;
          item = me._items[index];
          op = _getOptions(item.name, options);
          // 如果有全部可选
          if (isB(me.needWhole) && me.needWhole && isB(me.autoFillWhole) && me.autoFillWhole) {
            op.unshift({
              text: '全部',
              value: ''
            });
            for (; index < me._items.length; index++) {
              me._items[index].item.setOptions([{
                text: '全部',
                value: ''
              }]);
              me._items[index].item.setValue('', false);
              me._items[index].item.enable();
            }
          }
          item.item.setOptions(op);
          item.item.enable();
        },
        /**
         * 获取所有item值
         */
        getValue: function() {
          var me = this,
            result = {};
          Cmp.each(me._items, function(item) {
            var name = item.name;
            result[name + 'No'] = item.item.getValue();
            result[name + 'Name'] = item.item.getTextByValue(result[name + 'No']);
          });
          return result;
        },
        setValue: function(data) {
          var me = this;
          if (!data) {
            me.clear();
            return;
          }
          Cmp.each(me._items, function(item, index) {
            for (var name in data) {
              if (name === (item.name + 'No')) {
                item.item.setValue(data[name]);
                me.changeItems(index);
                break;
              }
            }
          })
        },
        /**
         * 清空
         */
        clear: function() {
          var me = this;
          Cmp.each(me._items, function(item, index) {
            me._items[index].item.setValue();
          });
          me.changeItems(0);
        },
        disable: function() {
          this.toggleEnDis(false);
        },
        enable: function() {
          this.toggleEnDis(true);
          this.changeItems(0);
        },
        toggleEnDis: function(flag) {
          var me = this,
            oper = 'disable';
          if (flag) {
            oper = 'enable';
          }
          Cmp.each(me._items, function(item) {
            item.item[oper]();
          })
        }
      })
    }
  })
}());
