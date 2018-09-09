/**
 * table组件
 * @author weihanwei
 */
(function() {
  /**
   * 清除某个dom元素的所有子元素
   * @author Weihw
   * @date   2018-03-01
   * @param  {CmpElement}   el 待清空的CmpEl元素
   */
  function _clear(el) {
    el.update('');
  }
  /**
   * 数据转化，转为row渲染顺序
   * @author Weihw
   * @date   2018-03-02
   * @param  {Object}   item    待渲染数据
   * @param  {Array}    columns 列配置信息
   * @param  {Object}   colCfg  序合并单元格的列
   * @param  {Number}   index   该行数据是总数据第几行
   * @return {Array}            经过排序后可直接用于渲染行的数据
   */
  function _convertRowData(data) {
    var result = [],
      rowspan, item, columns, colCfg, index, config;
    item = data.row;
    columns = data.columns;
    index = data.index;
    if (typeof data.colCfg === 'undefined') {
      colCfg = {};
    } else {
      colCfg = data.colCfg;
    }
    for (var i = 0, len = columns.length; i < len; i++) {
      var key = columns[i].key,
        value;
      if (isF(columns[i].render)) {
        // 如果有render方法，调用该方法
        value = columns[i].render(item[key], item, index);
      } else if (typeof item[key] === 'undefined') {
        value = '--';
      } else {
        value = item[key];
      }
      // 如果有col配置信息，则加入配置信息内容
      if (typeof colCfg[key] !== 'undefined') {
        rowspan = colCfg[key];
      } else {
        rowspan = 1;
      }
      result.push({
        value: value,
        rowspan: rowspan,
        width: isS(columns[i].width) ? columns[i].width : '',
        align: isS(columns[i].align) ? columns[i].align : 'center'
      });
    }
    return result;
  }
  Cmp.define('Cp.form.Grid', {
    extend: 'Cmp.Widget',
    requires: [
      'Cp.form.GridNode'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var SP = ext.prototype,
        Node = reqs[0];

      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this,
            cls = me.cls;
          if (isA(cls)) {
            cls.unshift('cp-grid');
          } else if (isS(cls)) {
            cls = ['cp-grid', cls];
          } else {
            cls = 'cp-grid';
          }
          me.cls = cls;
          SP.initComponent.call(me);
        },
        doRender: function() {
          var me = this;
          // 主table
          me.table = me.el.createChild({
            tag: 'table',
            cls: 'cp-grid-main'
          });
          // thead
          me.thead = me.table.createChild({
            tag: 'thead'
          });
          // tbody
          me.tbody = me.table.createChild({
            tag: 'tbody'
          });
          me.renderHeader();
        },
        /**
         * 渲染thead,此方法只支持单行thead
         */
        renderHeader: function() {
          var me = this,
            fragment = document.createDocumentFragment(),
            tr, td, div;
          // 清空thead
          if (isO(me.thead)) {
            _clear(me.thead);
          }
          tr = document.createElement('tr');
          fragment.appendChild(tr);
          // 遍历列配置，生成thead
          for (var i = 0, len = me.columns.length; i < len; i++) {
            td = document.createElement('th');
            div = document.createElement('div');
            div.appendChild(document.createTextNode(me.columns[i].text));
            if (isS(me.columns[i].width)) {
              td.setAttribute('width', me.columns[i].width);
            }
            td.appendChild(div);
            tr.appendChild(td);
          }
          me.thead.dom.appendChild(fragment);
        },
        /**
         * 渲染tbody
         */
        renderBody: function() {
          var me = this,
            fragment = document.createDocumentFragment();
          // 清空tbody
          if (isO(me.tbody)) {
            _clear(me.tbody);
          }
          for (var i = 0, len = me.nodes.length; i < len; i++) {
            var nodeInfo = me.nodes[i].getValue(),
              tr;
            if (isA(nodeInfo.sub)) {
              // 有子行
              var colCfg = {},
                mainTd = {},
                rowLen = nodeInfo.sub.length;
              // 生成rowspan配置信息
              for (var x in nodeInfo) {
                if (x !== 'sub') {
                  colCfg[x] = rowLen;
                  mainTd[x] = nodeInfo[x];
                }
              }
              // 遍历子行数据
              for (var j = 0, subLen = nodeInfo.sub.length; j < subLen; j++) {
                var tempRow;
                if (j === 0) {
                  // 第一行数据合并
                  for (x in nodeInfo.sub[j]) {
                    mainTd[x] = nodeInfo.sub[j][x];
                  }
                  tempRow = mainTd;
                } else {
                  // 非第一行
                  tempRow = nodeInfo.sub[j];
                }
                tr = me.renderRow(_convertRowData({
                  row: tempRow,
                  columns: me.columns,
                  colCfg: colCfg,
                  index: i
                }));
                fragment.appendChild(tr);
              }
            } else {
              // 单行
              tr = me.renderRow(_convertRowData({
                row: nodeInfo,
                columns: me.columns,
                index: i
              }));
              fragment.appendChild(tr);
            }
          }
          me.tbody.dom.appendChild(fragment);
        },
        /**
         * 渲染行
         * @param  {Array}          item            行数据
         * @param  {String/Number}  item[i].value   HTML片段
         * @param  {Number}         item[i].rowspan 需要rowspan的值
         * @param  {String}         item[i].align   对齐方式
         * @return {Element}        tr element
         */
        renderRow: function(item) {
          var tr, td, div;
          tr = document.createElement('tr');
          for (var i = 0, len = item.length; i < len; i++) {
            td = document.createElement('td');
            td.setAttribute('rowspan', item[i].rowspan);
            td.className = 'cp-grid-td-' + item[i].align
            td.setAttribute('width', item[i].width);
            div = document.createElement('div');
            div.innerHTML = item[i].value;
            td.appendChild(div);
            tr.appendChild(td);
          }
          return tr;
        },
        /**
         * 设置数据
         * @param  {Array} data  待渲染的数据
         */
        setValue: function(data) {
          var me = this;
          me.nodes = [];
          if (data!=null && data!=''&& data!=undefined){
            for (var i = 0, len = data.length; i < len; i++) {
              me.nodes.push(new Node(data[i], i));
            }
          }
          me.renderBody();
        },
        /**
         * 根据下表获取行数据
         * @param  {Number} index
         */
        getNodeByIndex: function(index) {
          index = parseInt(index);
          if (!isN(index)) return void(0);
          return this.nodes[index];
        },
        /**
         * 获取所有行数据
         */
        getNodes: function() {
          return this.nodes;
        },
        getValueByKV: function(obj) {
          var me = this,
            result = [];
          if (!isO(obj)) return;
          Cmp.each(me.nodes, function(node) {
            for (var name in obj) {
              if (!node.isVal(name, obj[name])) return;
            }
            result.push(node);
          });
          return result;
        },
        /**
         * 重新绘制table
         */
        reRender: function() {
          if (isA(this.nodes) && this.nodes.length > 0) {
            this.renderBody();
          }
        },
        /**
         * 设置列配置信息
         * @param  {Array} columns
         */
        setColumns: function(columns) {
          this.columns = columns;
          this.renderHeader();
          if (isA(this.nodes) && this.nodes.length > 0) {
            this.renderBody();
          }
        }
      })
    }
  })
}());
