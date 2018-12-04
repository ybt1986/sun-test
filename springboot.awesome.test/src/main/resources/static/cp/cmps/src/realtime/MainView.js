/**
 * 库存实时
 * @author Weihanwei
 */
(function() {
  var URL = {
    // 初始化顶部筛选条件
    INIT: '/cate/getCategory.json',
    Search: '/stockInLine/getGoodsName.json',
    // 查询卡片数据、柱状图数据、地图数据
    QueryData: '/stockNorm/getData.json',
    // 下部表格数据初始化
    INIT_GRID: '/stockInLine/getWarehouseName.json',
    // 下部实时表格数据
    GET_GRID: '/stockInLine/getStockInLineByPage.json',
    //下部历史表格数据
    GET_DAILY_GRID:'/stockOffLine/getStockOffLineByPage.json',
    //下载数据表格
    DOWN_INLINE_EXCEL:'/stockInLine/getStockInLineExcel.json',
    //下载历史数据表格
    DOWN_OUTLINE_EXCEL:'/stockOffLine/getStockOffLineExcel.json'
  };

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
  var HTML = [];
  // 顶部查询
  HTML.push('<div class="cp-main-row"></div>');
  // 主数据显示
  HTML.push('<div class="cp-main-row"></div>');
  // 底部面板
  HTML.push('<div class="cp-main-row"></div>');
  HTML = HTML.join('');
  Cmp.define('Cp.realtime.MainView', {
    extend: 'Cmp.Widget',
    requires: [
      'Cmp.Dialogs',
      'Cmp.util.AjaxProxy',
      'Cp.realtime.TopFilter',
      'Cp.realtime.DataView',
      'Cp.realtime.SubGrid',
      'Cmp.util.Dates'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var SP = ext.prototype,
        Dialogs = reqs[0],
        Ajax = reqs[1],
        TopFilter = reqs[2],
        DataView = reqs[3],
        SubGrid = reqs[4];
        Dates = reqs[5] ;

      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this,
            cls = me.cls;
          if (isA(cls)) {
            cls.unshift('cp-main');
          } else if (isS(cls)) {
            cls = ['cp-main', cls];
          } else {
            cls = 'cp-main';
          }
          me.cls = cls;
          SP.initComponent.call(me);
          //每页默认的显示的条数
          me.pageIndex=0;
          me.pageLimit=10;
        },
        doRender: function() {
          var me = this,
            doms;
          SP.doRender.call(me);
          me.el.update(HTML);
          doms = me.el.dom.childNodes;
          me.topFilter = new TopFilter({
            searchUrl: URL.Search
          });
          me.topFilter.render(doms[0]);
          me.topFilter.setRefreshTime();
          // 查询按钮点击事件监听
          me.topFilter.on('query', me.onQueryBtn, me);
          me.topFilter.on("");
          me.dataView = new DataView();
          me.dataView.render(doms[1]);
          // 地图点击事件监听
          me.dataView.on('geoClick', me.onGeoClick, me);
          me.bottomView = new SubGrid();
          me.bottomView.render(doms[2]);
          me.bottomView.on('query', me.onBottomQuery, me);
          me.bottomView.on('export', me.onExport, me);
          me.initData();
        },
        /**
         * 初始化顶部导航筛选条件
         */
        initData: function() {
          var me = this;
          Dialogs.showWait('正在初始化数据请稍候...');
          Ajax.post(URL.INIT, {id:0}, me.onInitDataRes, me);
        },
        /**
         * 初始化选项数据处理
         * @param  {Object} data
         */
        onInitDataRes: function(data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            me.topFilter.setOption(data);
          } else {
            Dialogs.showWarn(data);
          }
        },
        /**
         * 顶部查询按钮点击事件
         * @param  {Object} data 顶部筛选条件
         */
        onQueryBtn: function(data) {
          var me = this;
            /**
             * 点击省份，仓库为值空,分页为空
             */
            me.bottomView.stockSel.setValue("");
            me.bottomView.setValue();
            me.bottomView.queryBtn.disable();
            me.bottomView.stockSel.disable();
            me.bottomView.pagingBar.setDataResult();
            me.goodsId = data.goods;
           /* me.topFilter.setRefreshTime(data.date);*/
          if(data.goods != undefined && data.goods != null && data.goods != ''){
              var goodsId=data.goods;
              var goodsName;
              if(data.goodsName != undefined){
                  goodsName=data.goodsName.split("-")[0];
              }
              var goodsJson=JSON.stringify(goodsId);
              var goodsNameJson=JSON.stringify(goodsName);
              Dialogs.showWait('正在获取数据，请稍候...');
              Ajax.post(URL.QueryData, {
                      goodsId:goodsJson,
                      goodsName:goodsNameJson
                  }
                  , me.onMainDataRes, me);
          }else {
              var cateOne = new Array();
              var cateTwo = new Array();
              var cateThree = new Array();
              for (var i in data.cate) {
                  cateOne.push(data.cate[i].oneId);
                  cateTwo.push(data.cate[i].twoId);
                  cateThree.push(data.cate[i].threeId);
              }
              /**
               * 去掉最后一个数
               */
              cateOne.pop();
              cateTwo.pop();
              cateThree.pop();
              var oneJson = JSON.stringify(cateOne);
              var twoJson = JSON.stringify(cateTwo);
              var threeJson = JSON.stringify(cateThree);
              Dialogs.showWait('正在获取数据，请稍候...');
              Ajax.post(URL.QueryData, {
                      goodsClassOne:oneJson,
                      goodsClassTwo:twoJson,
                      goodsClassThree:threeJson
                  }
              , me.onMainDataRes, me);
          }
        },
        /**
         * 顶部查询数据回调函数
         * @param  {Object} data
         */
        onMainDataRes: function(data) {
          var me = this;
          Dialogs.hide();
          var dataTmp;
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            me.topFilter.setRefreshTime(data.date);
            me.dataView.setValue(data);
          } else {
            Dialogs.showWarn(data);
          }
        },
        /**
         * 地图点击事件监听
         * @param  {String} name 选择的地区名
         */
        onGeoClick: function(name) {
          var me = this;
            /**
             * 点击省份，仓库为值空,分页为空
             */
          me.bottomView.stockSel.setValue("");
          me.bottomView.setValue();
          me.bottomView.pagingBar.setDataResult();
          me.nowSelProvince = name;
          var provinceId=me.dataView.nowSelProvinceId;
          Dialogs.showWait('正在获取数据，请稍候...');
          Ajax.post(URL.INIT_GRID, {
              name:name,
              provinceId:provinceId
          }, me.onGridOptRes, me)
        },
        /**
         * 下部仓库初始化
         * @param  {Object} data
         */
        onGridOptRes: function(data) {
          var me = this;
          data = _processData(data);
          Dialogs.hide();
          if (isO(data)) {
            data = data.result;
            var arr=new Array(data.length)
            for(var i in data){
              var warhouse = new Object;
              warhouse.text=data[i].text+"-"+data[i].value;
              warhouse.value=data[i].value;
              arr.push(warhouse);
            }
            me.bottomView.setOptions(arr);
          } else {
            Dialogs.showWarn(data);
          }
        },
        onBottomQuery: function(data) {
          var me = this;
          data.provinceId=me.dataView.nowSelProvinceId;
          data.provinceName = me.nowSelProvince;
          if (me.topFilter.getValue().goods!=null && me.topFilter.getValue().goods!=undefined){
            data.goodsId=me.goodsId;
          }
          /*data.stockName=data.stockName.split("-")[0];*/
          /*data.stockName=data.stockName.substr(0,data.stockName.lastIndexOf("-")-1);*/
          Dialogs.showWait('正在获取数据,请稍候...');
          if(data.date == Dates.toDateString(new Date())){
            Ajax.post(URL.GET_GRID, data, me.onGridRes, me);
          }else {
            Ajax.post(URL.GET_DAILY_GRID, data, me.onGridRes, me);
          }
        },
          /**
           * 下部查询回调函数
           * @param data
           */
        onGridRes: function(data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            me.bottomView.setValue(data);
          } else {
              /**
               * 在查询为空的时候，grid控件置空
               */
            me.bottomView.setValue();
            me.bottomView.pagingBar.setDataResult();
            Dialogs.showWarn(data);
          }
        },
        onExport: function() {
          var me=this;
          if(me.bottomView.getFilterValue().date == Dates.toDateString(new Date())){
              window.location=URL.DOWN_INLINE_EXCEL;
          }else {
              window.location=URL.DOWN_OUTLINE_EXCEL;
          }
        }
      })
    }
  })
}())
