/**
 * 库存实时 下面搜索 grid PageBar
 * @author Weihanwei
 * @version 1.0.0
 */
(function() {
  var Columns = [
    {
      text: '',
      key: 'count',
      width: '2rem'
    },
    {
      text: '仓编码',
      key: 'stockName'
    },
    {
      text: '仓名称',
      key: 'libName'
    },
    {
      text: '商品编码',
      key: 'cateCode'
    },
    {
      text: '商品名称',
      key: 'cateName'
    },
    {
      text: '安全状态',
      key: 'safety',
      render: function(val) {
        var cls = ['fa', 'fa-exclamation-triangle'];
        val = parseInt(val);
        if (val === 1) {
          cls.push('cp-sbg-yellow');
        } else if (val === 0) {
          cls.push('cp-sbg-red');
        } else {
          return '--';
        }
        return '<span class="' + cls.join(' ') + '"></span>';
      }
    },
    {
      text: '库存量',
      key: 'curStock'
    },
    {
      text: '可用库存',
      key: 'firstStock'
    },
    {
      text: '预占库存',
      key: 'preStcok'
    },
    {
      text: '作业预占量',
      key: 'workStock'
    },
    {
      text: '异常库存数量',
      key: 'excStcok'
    }
  ]
    var HTML = [];
    HTML.push('<div class="cp-sbg-top">');
    HTML.push('<div class="cp-col-4"></div>');
    HTML.push('<div class="cp-col-4"></div>');
    HTML.push('<div class="cp-col-1.5 cp-btn-bar"></div>');
    HTML.push('<div class="cp-col-2.5 cp-warn"><i class="fa fa-exclamation-triangle cp-sbg-yellow">低于50%以下</i> <i class="fa fa-exclamation-triangle cp-sbg-red">低于50%及以上</i> </div>');
    HTML.push('</div>');
    HTML.push('<div class="cp-sbg-gird"></div>');
    HTML.push('<div class="cp-sbg-paginbar"></div>');
    HTML = HTML.join('');
  Cmp.define('Cp.realtime.SubGrid', {
    extend: 'Cmp.Widget',
    requires: [
      'Cmp.util.Dates',
      'Cmp.form.ComboBox',
      'Cmp.form.DateField',
      'Cmp.Button',
      'Cp.form.Grid',
      'Cp.form.PagingBar'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var SP = ext.prototype,
        Dates = reqs[0],
        ComboBox = reqs[1],
        DateField = reqs[2],
        Button = reqs[3],
        Grid = reqs[4],
        PagingBar = reqs[5];
      return Cmp.extend(ext, {
        initComponet: function() {
          this.cls = 'cp-sbg';
          SP.initComponet.call(this);
        },
        doRender: function() {
          var me = this;
          SP.doRender.call(me);
          me.el.update(HTML);
          me.renderTop();
          me.renderGrid();
          me.renderPaingbar();
        },
        /**
         * 渲染顶部
         */
        renderTop: function() {
          var me = this,
            doms;
          doms = me.el.dom.childNodes[0].childNodes;
          // 日期选择
          me.dateSel = new DateField({
            label: '日期',
            value: new Date(),
            maxValue: new Date(),
            emptyText: '请选择日期...'
          });
          me.dateSel.render(doms[0]);

          // 仓库选择
          me.stockSel = new ComboBox({
            label: '仓',
            disabled: true
          });
          me.stockSel.render(doms[1]);

          // 查询
          me.queryBtn = new Button({
            cls: 'cp-main-normal',
            text: '查询',
            handler: me.onClickQuery,
            disabled: true,
            scope: me
          });
          me.queryBtn.render(doms[2]);
          // 导出
          me.exportBtn = new Button({
            cls: 'cp-main-normal',
            text: '导出',
            handler: me.onClickExport,
            scope: me
          });
          me.exportBtn.render(doms[2]);
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
        onClickExport: function() {
          var me = this;
          me.fireEvent('export', me.getFilterValue());
        },
        /**
         * 渲染表格
         */
        renderGrid: function() {
          var me = this;
          me.grid = new Grid({
            columns: Columns
          });
          me.grid.render(me.el.dom.childNodes[1]);
        },
        /**
         * 渲染分页
         */
        renderPaingbar: function() {
          var me = this;
          me.pagingBar = new PagingBar();
          me.pagingBar.render(me.el.dom.childNodes[2]);
          me.pagingBar.on('indexchange', me.onIndexChange, me);
          me.pagingBar.on('limitchange', me.onClickQuery, me);
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
            stockId: me.stockSel.getValue(),
            stockName: me.stockSel.getTextByValue(me.stockSel.getValue()),
            provinceName:me.nowSelProvince,
              //添加省份Id
            provinceId:me.nowSelProvinceId,
              //添加商品ID
            goodsId:me.goodsId
          }
        },
        /**
         * 设置数据
         * @param  {Object} data
         */
        setValue: function(data) {
          var me = this;
          if (data!=null && data!=''&& data!=undefined){
              /**
               * 获得省名字和商品ID
               */
            me.nowSelProvince=data.provinceName;
            if(data.goodsId!=null&&data.goodsId!=undefined) {
                me.goodsId = data.goodsId;
            }else {
              me.goodsId = null;
            }
            me.pagingBar.setDataResult({
              pageIndex: --data.pageIndex,
              pageSize: data.pageSize
            });
            me.grid.setValue(data.grid);
          }else{
            me.grid.setValue();
          }
        }
      })
    }
  })
}());
