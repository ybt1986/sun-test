/**
 * 库存健康
 */
(function() {
  var Columns = [
    {
      text: '',
      key: 'count',
      width: '2rem'
    },
    {
      text: '商品一级分类',
      key: 'first'
    },
    {
      text: '商品二级分类',
      key: 'second'
    },
    {
      text: '商品三级分类',
      key: 'third'
    },
    {
      text: '商品名称',
      key: 'cateName'
    },
    {
      text: '当前库存数量',
      key: 'dqkcsl'
    },
    {
      text: '滞销数量',
      key: 'zxsl'
    },
    {
      text: '滞销占比（%）',
      key: 'zxzb'
    },
    {
      text: '商品周转天数',
      key: 'spzzts'
    }
  ]
  var HTML = [];
  HTML.push('<div class="cp-main-row"><div class="cp-col-4"></div><div class="cp-col-4"></div><div class="cp-col-4 brn-box"></div></div>');
  HTML.push('<div class="cp-main-row oos-grid"></div>');
  HTML.push('<div class="cp-main-row"></div>');
  HTML = HTML.join('');
  Cmp.define('Cp.health.table.Unsalable', {
    extend: 'Cmp.Widget',
    requires: [
      'Cmp.form.ComboBox',
      'Cmp.form.DateField',
      'Cp.form.Grid',
      'Cmp.Button',
      'Cp.form.PagingBar',
      'Cmp.util.Dates'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var SP = ext.prototype,
        ComboBox = reqs[0],
        DateField = reqs[1],
        Grid = reqs[2],
        Button = reqs[3],
        PagingBar = reqs[4],
        Dates = reqs[5];
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this,
            cls = me.cls;
          if (isA(cls)) {
            cls.unshift('cp-region');
          } else if (isS(cls)) {
            cls = ['cp-region', cls];
          } else {
            cls = 'cp-region';
          }
          me.cls = cls;
          SP.initComponent.call(me);
        },
        doRender: function() {
          var me = this;
          SP.doRender.call(me);
          me.el.update(HTML);
          me.queryRender();
          me.renderGrid();
        },
        queryRender:function () {
          var me = this,doms;
          doms = me.el.dom.childNodes[0].childNodes;
          // 仓库选择
          me.stockSel = new ComboBox({
            label: '仓',
            disabled:true
          });
          me.stockSel.render(doms[0]);
          me.dateSel = new DateField({
            label: '日期',
            value: new Date(),
            maxValue: new Date(),
            emptyText: '请选择日期...'
          });
          me.dateSel.render(doms[1]);
          me.queryBtn = new Button({
            cls: 'cp-main-normal',
            text: '查询',
            handler: me.onClickQuery,
            scope: me
          })
          me.queryBtn.render(doms[2]);
          me.exportBtn = new Button({
            cls: 'cp-main-normal',
            text: '导出',
            handler: me.onClickExport,
            scope: me
          });
          me.exportBtn.render(doms[2]);
        },
        /**
         * 表格渲染
         */
        renderGrid:function () {
          var me = this,doms;
          doms = me.el.dom.childNodes[1];
          me.grid = new Grid({
            columns: Columns
          });
          me.grid.render(doms);
          me.pagingBar = new PagingBar();
          me.pagingBar.render(me.el.dom.childNodes[2]);
          me.pagingBar.on('indexchange', me.onIndexChange, me);
          me.pagingBar.on('limitchange', me.onClickQuery, me);
        },
        /**
         * 查询按钮点击事件
         */
        onClickQuery: function() {
          var me = this,
            params, pageInfo;
            params = me.getFilterValue();
            pageInfo = me.getPagingInfo();
            params.index = pageInfo.index + 1;
            params.limit = pageInfo.limit;
            me.fireEvent('query', params);
        },
        /**
         * 导出按钮点击事件
         */
        onClickExport: function() {
          var me = this;
          me.fireEvent('export', me.getFilterValue());
        },

        /**
         * 翻页
         * @param  {Number} index
         */
        onIndexChange: function(index) {
          var me = this;
          me.pagingBar.setDataResult({
            pageIndex: index
          });
          me.onClickQuery();
        },
        /**
         * 获取pagingbar 数据
         * @returns 返回当前页标，和每页行数
         */
        getPagingInfo: function() {
          var me = this;
          return {
            index: me.pagingBar.getPageIndex(),
            limit: me.pagingBar.getPageLimit()
          }
        },
        /**
         * 获取下部查询条件
         * @returns Object
         */
        getFilterValue: function() {
          var me = this;
          return {
            date: Dates.toDateString(me.dateSel.getValue()),
              warehouseId: me.stockSel.getValue(),
            stockName: me.stockSel.getTextByValue(me.stockSel.getValue())
          }
        },
        /**
         * 设置仓选项
         * @param  {Array} options
         */
        setOptions: function(options) {
          if (isA(options)) {
            this.stockSel.setOptions(options);
            this.stockSel.enable();
            this.queryBtn.enable();
          }
        },
        /**
         * 设置数据
         * @param  {Object} data
         */
        setValue: function(data) {
            var me = this;
            if (data != null && data != '' && data != undefined) {
                me.pagingBar.setDataResult({
                    pageIndex: --data.pageIndex,
                    pageSize: data.pageSize
                });
                me.grid.setValue(data.grid);
            } else {
                me.grid.setValue();
            }
        }
      })
    }
  })
}())
