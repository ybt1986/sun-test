/**
 * @class Cp.form.SearchComboBox
 * @extend Cmp.form.ComboBox
 * @author weihanwei
 * 可输入进行模糊查询的下拉框单选控件实现类
 */
(function() {
  Cmp.define('Cp.form.SearchComboBox', {
    extend: 'Cmp.form.ComboBox',
    requires: [
      'Cmp.util.AjaxProxy',
      'Cmp.util.DelayedTask'
    ],
    factory: function(ext, reqs) {
      var superClazz = ext.prototype,
        Ajax = reqs[0],
        DelayedTask = reqs[1];
      /**
       * 解析Ajax返回的数据
       * @param data
       * @returns {Object/String} 返回String则说明获取数据失败,返回错误信息;返回Object说明数据获取成功，并将解析后的数据返回
       * @private
       */
      function _processData(data) {
        var msg;
        try {
          data = eval('(' + data.result + ')');
        } catch (ex) {
          data = {};
        }
        if (!isO(data) || !isN(data.successFlag) || data.successFlag != 1) {
          if (isS(data.msg)) {
            msg = data.msg;
          } else {
            msg = '获取数据失败,请重试。'
          }
          return msg;
        }
        return data;
      }
      return Cmp.extend(ext, {
        /**
         * @private
         * @overwrite
         */
        renderInput: function(box) {
          var me = this;
          me.taskDriver = new DelayedTask({
            delay: isN(me.delayTime) ? me.delayTime : 500,
            handler: me.queryData,
            scope: me
          })
          superClazz.renderInput.call(me, box);
          me.input.on('click', function(event) {
            if (me.getValue() === '') {
              me.setValue();
              me.input.dom.value = '';
            }
            // me.doClickTrigger(event);
            me.extend();
          }, me);
          me.input.on('keyup', function() {
            me.taskDriver.run();
          });
        },
        /**
         * 查询数据
         */
        queryData: function() {
          var me = this,
            val;
          val = me.input.dom.value;
          Ajax.post(me.queryUrl, {
            value: val
          }, me.onSearchRes, me);
        },
        /**
         * 数据查询回调函数
         * @param  {Object} data
         */
        onSearchRes: function(data) {
          var me = this;
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            var arr = new Array(data.length)
            /**
             * 转换为 *-*格式显示
             */
            for (var i in data) {
              var goods = new Object;
              goods.text = data[i].text + "-" + data[i].value;
              goods.value = data[i].value;
              arr.push(goods);
            }
            var inputVal = me.input.dom.value;
            me.setOptions(arr);
            me.setValue('');
            me.input.dom.value = inputVal;
          }
        }
      });
    }
  });
}());
