/**
 * 库存健康
 *
 */
(function() {
  var URL = {
    // 初始化顶部筛选条件
    INIT: '/heathStatus/getHeathStatusData.json',
    Search: '/heathStatus/getHeathStatusData.json',
    // 查询卡片数据、柱状图数据、地图数据
    QueryArea: '/heathStatus/getRateOfArea.json',
    QueryProvince: '/heathStatus/getRateOfProvince.json',
    QueryWarehouse: '/heathStatus/getRateOfWarehouse.json',
    //查询趋势
    QueryPastArea: '/heathStatus/getPastOfArea.json',
    QueryPastProvince: '/heathStatus/getPastOfProvince.json',
    QueryPastWarehouse: '/heathStatus/getPastOfWarehouse.json',
    //查询仓库
    getWarehouses:'/heathStatus/getWarehouses.json',
    //查询仓库和下部表格
    getWarehousesAndArea:'/heathStatus/getPageAndWarehouseOfArea.json',
    getWarehousesAndProvince:'/heathStatus/getPageAndWarehouseOfProvince.json',
    getWarehousesAndWarehouse:'/heathStatus/getPageAndWarehouseOfWarehouse.json',
    // 下载
    DOWN_GRID: '/heathStatus/getHealthStatusExc.json',
    // 下部表格数据
    GET_NOTSALEGRID: '/heathStatus/getPageOfNotSale.json',
    GET_SLOWGRID: '/heathStatus/getPageOfSlow.json',
    GET_LACKGRID: '/heathStatus/getPageOfLack.json'
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
  HTML.push('<div class="cp-main-row">');
  HTML.push('<div class="cp-col-4"></div>');
  HTML.push('<div class="cp-col-4 cp-btn-bar"></div>');
  HTML.push('</div>');
  HTML.push('<div class="cp-main-row">');
  HTML.push('<div class="cp-col-4"></div>');
  HTML.push('<div class="cp-col-8"><div></div></div>');
  HTML.push('</div>');
  HTML.push('<div class="cp-main-row region"></div>');
  HTML.push('<div class="cp-main-row"></div>');
  HTML = HTML.join('');
  Cmp.define('Cp.health.MainView', {
    extend: 'Cmp.Widget',
    requires: [
      'Cp.card.IconCardGroup',
      'Cp.chart.gauge.Gauge',
      'Cmp.util.Dates',
      'Cmp.form.ComboBox',
      'Cmp.form.DateField',
      'Cmp.Button',
      'Cp.form.Grid',
      'Cp.form.PagingBar',
      'Cp.panel.TabPanel',
      'Cp.health.region.Region',
      'Cp.health.region.Warehouse',
      'Cp.health.region.Province',
      'Cp.health.table.OOS',
      'Cp.health.table.Unsalable',
      'Cp.health.table.NoPin',
      'Cmp.Dialogs',
      'Cmp.util.AjaxProxy'
      ],
    cls: true,
    factory: function(ext, reqs) {
      var SP = ext.prototype,
        IconCardGroup = reqs[0],
        Gauge = reqs[1],
        Dates = reqs[2],
        ComboBox = reqs[3],
        DateField = reqs[4],
        Button = reqs[5],
        Grid = reqs[6],
        PagingBar = reqs[7],
        TabPanel = reqs[8],
        Region = reqs[9],
        Warehouse = reqs[10],
        Province = reqs[11],
        OOS = reqs[12],
        Unsalable = reqs[13],
        NoPin = reqs[14],
        Dialogs = reqs[15],
        Ajax = reqs[16];
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
          me.cardName = '现货率';
          me.BarChartName = '全国';
        },
        doRender: function() {
          var me = this,doms;
          SP.doRender.call(me);
          me.el.update(HTML);
          doms = me.el.dom.childNodes;
          me.initData();
          me.renderQuery(doms);
          me.renderIndex(doms);
          me.renderRegion(doms);
        },
        /**
         * 头部查询条件渲染
         * @param doms
         */
        renderQuery:function (doms) {
          var me = this;
          me.dateChoose = doms[0].childNodes[0];
          me.queryBox = doms[0].childNodes[1];
          me.dateRange = new DateField({
            label: '日期',
            value: new Date(),
            maxValue: new Date(),
            emptyText: '请选择日期...'
          })
          me.dateRange.render(me.dateChoose);
          me.queryBtn = new Button({
            cls: 'cp-main-normal',
            text: '查询',
            handler: me.onClickQuery,
            scope: me
          })
          me.queryBtn.render(me.queryBox);
            me.queryBtn.unactive()
          // 头部时间选择框的value值
          me.dateValue = Dates.toDateString(me.dateRange.getValue());
        },
        /**
         * 库存健康指数总分 与 关键指标 渲染
         * @param doms
         */
        renderIndex:function (doms) {
          var me = this;
          me.gaugeBox = doms[1].childNodes[0];
          me.cardBox = doms[1].childNodes[1].childNodes[0];
          me.gaugeChart = new Gauge({
            name: '本月预算进度',
            width: '100%',
            height: '14.1rem'
          })
          me.gaugeChart.render(me.gaugeBox);
          var data = {};
          //状态健康
          data.chartData = [{
            value: 23,
            name: ''
          }];
          //健康总分
          /*data.timeprogress = 12;*/
          me.gaugeChart.setValue(data);
          //由于现货率错过**%,请关注指标相关库存
          var num = '';
          me.iconCard = new IconCardGroup({
            rowLimit: 4,
            list: [
              {
                dataName: 'xhl',
                cfg: {
                  title: '现货率'
                }
              },
              {
                dataName: 'qhl',
                cfg: {
                  title: '缺货率'
                }
              },
              {
                dataName: 'kczzl',
                cfg: {
                  title: '库存周转率'
                }
              },
              {
                dataName: 'zmxl',
                cfg: {
                  title: '滞慢销率'
                }
              }
            ]
          })
            //关键指标
          var icondata = {
            xhl: {
              count:'',
              dayCount :''
            },
            qhl: {
              count:'',
              dayCount :''
            },
            kczzl: {
              count:'',
              dayCount :''
            },
            zmxl: {
              count:'',
              dayCount :''
            }
          };
          me.iconCard.on('onClick',me.clickCard,me);
          me.iconCard.render(me.cardBox);
          me.iconCard.setValue(icondata);
          me.iconCard.setFootText(me.cardName,num);
        },
        /**
         * 区域、省份、仓库渲染
         */
        renderRegion:function (doms) {
          var me = this;
          me.regionBox = doms[2];
          me.region = new Region();
          me.province = new Province();
          me.warehouse = new Warehouse();
          me.regionTabPanel = new TabPanel({
            list: [
              {
                name: '区域',
                item: me.region,
                dataName: 'region'
              },
              {
                name: '省份',
                item: me.province,
                dataName: 'province'
              },
              {
                name: '仓库',
                item: me.warehouse,
                dataName: 'warehouse'
              }
            ]
          });
          me.regionTabPanel.on('tabChanged',function (name) {
            //获取当前talpanel的值
              me.tabPanelName = name;
            //需要添加区域、省、仓库点击事件
              if(name == 'region') {
                  Ajax.post(URL.QueryArea, {
                      date:Dates.toDateString(me.dateRange.getValue())
                  },me.tabPanleClickRes, me)
              }
              if(name == 'province') {
                  Ajax.post(URL.QueryProvince, {
                      date:Dates.toDateString(me.dateRange.getValue())
                  },me.tabPanleClickRes, me)
              }
              if(name == 'warehouse') {
                  Ajax.post(URL.QueryWarehouse, {
                      date:Dates.toDateString(me.dateRange.getValue())
                  },me.tabPanleClickRes, me)
              }
          },me)
          me.region.on('barClick',me.regionBarClickFn,me)
          me.region.on('lineClick',me.regionLineClickFn,me)
          me.province.on('barClick',me.provinceBarClickFn,me)
          me.province.on('lineClick',me.provinceLineClickFn,me)
          me.warehouse.on('barClick',me.warehouseBarClickFn,me)
          me.warehouse.on('lineClick',me.warehouseLineClickFn,me)
          me.regionTabPanel.render(me.regionBox);
          me.setBarTitle(me.cardName);
          me.setLineTitle(me.BarChartName,me.cardName);
        },
        /**
         * 底部表格渲染
         * @param doms
         */
        renderTable:function () {
          var me = this,doms;
            doms = me.el.dom.childNodes;
          me.regionBox = Cmp.get(doms[3]);
          me.regionBox.update('');
          me.regionBox.update('');
          me.oos = new OOS();
          me.oos.on('query',me.oosClickFn,me);
          me.oos.on('export',me.oosExportFn,me);
          me.unsalable = new Unsalable();
          me.unsalable.on('query',me.unsalableClickFn,me);
          me.unsalable.on('export',me.unsalableExportFn,me);
          me.noPin = new NoPin;
          me.noPin.on('query',me.noPinClickFn,me);
          me.noPin.on('export',me.noPinExportFn,me);
          //初始值
          me.tableTabPanel = new TabPanel({
            list: [
              {
                name: '缺货 ('+me.oosData+')',
                item: me.oos,
                dataName: 'oos'
              },
              {
                name: '滞销 ('+me.unsalableData+')',
                item: me.unsalable,
                dataName: 'unsalable'
              },
              {
                name: '不动销 ('+me.noPinData+')',
                item: me.noPin,
                dataName: 'noPin'
              }
            ]
          });
          me.tableTabPanel.render(me.regionBox);
        },
        setListNum :function (oosData,unsalableData,noPinData) {
            var me = this;
            me.oosData = oosData;
            me.unsalableData = unsalableData;
            me.noPinData = noPinData;
            me.renderTable();
        },
        /**
         * 顶部查询按钮触发事件
         */
        onClickQuery:function () {
          var me = this;
          //恢复到现货率、区域
          me.iconCard.setDefaultCard(0);
          me.regionTabPanel.setDefaultPanel(0);
          me.setLineTitle('全国', '现货率');
          Dialogs.showWait('正在获取数据，请稍候...');
          Ajax.post(URL.Search, {
            date:Dates.toDateString(me.dateRange.getValue())
          }, me.onMainDataRes, me);
        },
        /**
         * 顶部查询数据回调函数
         * @param  {Object} data
         */
        onMainDataRes:function (data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            // 渲染顶部按钮点击后需要改变数据部分
              //健康状态指标
              var chart = {};
              chart.chartData = [{
                  value: data.chartData,
                  name: ''
              }];
              chart.timeprogress = data.chartData,
                  me.gaugeChart.setValue(chart);
              //关键指标
              me.iconCard.setValue(data.icondata);
              //区域现货
              me.region.setBarChartValue(data.barData);
              //线图
              me.region.setLineChartValue(data.lineData);
              //缺货数量
              me.oosData = data.lackNum ? data.lackNum : 0;
              //不动销数量
              me.noPinData = data.notSaleNum ? data.notSaleNum : 0;
              //滞慢销数量
              me.unsalableData = data.slowNum ? data.slowNum : 0;
          } else {
            Dialogs.showWarn(data);
          }
          me.setListNum(me.oosData,me.noPinData,me.unsalableData);
        },
        /**
         * card 组件点击事件触发
         * @param name
         */
        clickCard:function (name) {
            var me = this;
            switch (name){
              case 'xhl':
                me.cardName = '现货率'
                break;
              case 'qhl':
                me.cardName = '缺货率'
                break;
              case 'kczzl':
                me.cardName = '库存周转率'
                break;
              case 'zmxl':
                me.cardName = '滞慢销率'
                break;
            }
            me.iconCard.setFootText(me.cardName,'')
            Dialogs.showWait('正在获取数据，请稍候...');
            //获取关键指标的name
            me.rName = me.regionTabPanel.now.dataName;
             if (me.rName == 'region'){
                Ajax.post(URL.QueryArea, {
                  date:Dates.toDateString(me.dateRange.getValue())
                }, me.onCardRes, me);
             }
             if(me.rName == 'province'){
                 Ajax.post(URL.QueryProvince, {
                     date:Dates.toDateString(me.dateRange.getValue())
                 }, me.onCardRes, me);
             }
             if(me.rName == 'warehouse'){
                 Ajax.post(URL.QueryWarehouse, {
                     date:Dates.toDateString(me.dateRange.getValue())
                 }, me.onCardRes, me);
             }
            me.setBarTitle(me.cardName);
             //设置线性趋势的全国
            if(me.BarChartName != '区域' || me.BarChartName !='省份' || me.BarChartName != '仓库') {
                me.BarChartName = '全国';
            }
            me.setLineTitle(me.BarChartName, me.cardName);
        },
        /**
         * Card 点击 请求数据后回调
         * @param data
         */
        onCardRes:function (data) {
          var me = this;
          Dialogs.hide();
          var card = me.iconCard.cardName;
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            if(me.rName == 'region'){
              if(card == '现货率'){
                  //区域现货
                  me.region.setBarChartValue(data.goodsNum);
                  //线图
                  me.region.setLineChartValue(data.trendG);
              }
              if(card == '缺货率'){
                  //区域现货
                  me.region.setBarChartValue(data.lack);
                  //线图
                  me.region.setLineChartValue(data.lackTrend);
              }
              if(card == '库存周转率'){
                  //区域现货
                  me.region.setBarChartValue(data.turnover);
                  //线图
                  me.region.setLineChartValue(data.turnTrend);
              }
              if(card == '滞慢销率'){
                  //区域现货
                  me.region.setBarChartValue(data.slowChange);
                  //线图
                  me.region.setLineChartValue(data.trendS);
              }
            }
            if(me.rName == 'province'){
                if(card == '现货率'){
                    //区域现货
                    me.province.setBarChartValue(data.goodsNum);
                    //线图
                    me.province.setLineChartValue(data.trendG);
                }
                if(card == '缺货率'){
                    //区域现货
                    me.province.setBarChartValue(data.lack);
                    //线图
                    me.province.setLineChartValue(data.lackTrend);
                }
                if(card == '库存周转率'){
                    //区域现货
                    me.province.setBarChartValue(data.turnover);
                    //线图
                    me.province.setLineChartValue(data.turnTrend);
                }
                if(card == '滞慢销率'){
                    //区域现货
                    me.province.setBarChartValue(data.slowChange);
                    //线图
                    me.province.setLineChartValue(data.trendS);
                }
            }
            if(me.rName == 'warehouse'){
                if(card == '现货率'){
                    //区域现货
                    me.warehouse.setBarChartValue(data.goodsNum);
                    //线图
                    me.warehouse.setLineChartValue(data.trendG);
                }
                if(card == '缺货率'){
                    //区域现货
                    me.warehouse.setBarChartValue(data.lack);
                    //线图
                    me.warehouse.setLineChartValue(data.lackTrend);
                }
                if(card == '库存周转率'){
                    //区域现货
                    me.warehouse.setBarChartValue(data.turnover);
                    //线图
                    me.warehouse.setLineChartValue(data.turnTrend);
                }
                if(card == '滞慢销率'){
                    //区域现货
                    me.warehouse.setBarChartValue(data.slowChange);
                    //线图
                    me.warehouse.setLineChartValue(data.trendS);
                }
            }
          } else {
            Dialogs.showWarn(data);
          }
        },
        /**
         *  区域省仓库TabPanel图点击事件 回调
         *  @param params
         */
        tabPanleClickRes:function (data) {
            var me = this;
            Dialogs.hide();
            data = _processData(data);
            if (isO(data)) {
                data = data.result;
                if(me.tabPanelName == 'region'){
                    if(me.iconCard.cardName == '现货率'){
                        //区域现货
                        me.region.setBarChartValue(data.goodsNum);
                        //线图
                        me.region.setLineChartValue(data.trendG);
                    }
                    if(me.iconCard.cardName == '缺货率'){
                        //区域现货
                        me.region.setBarChartValue(data.lack);
                        //线图
                        me.region.setLineChartValue(data.lackTrend);
                    }
                    if(me.iconCard.cardName == '库存周转率'){
                        //区域现货
                        me.region.setBarChartValue(data.turnover);
                        //线图
                        me.region.setLineChartValue(data.turnTrend);
                    }
                    if(me.iconCard.cardName == '滞慢销率'){
                        //区域现货
                        me.region.setBarChartValue(data.slowChange);
                        //线图
                        me.region.setLineChartValue(data.trendS);
                    }
                }
                if(me.tabPanelName == 'province'){
                    if(me.iconCard.cardName == '现货率'){
                        //区域现货
                        me.province.setBarChartValue(data.goodsNum);
                        //线图
                        me.province.setLineChartValue(data.trendG);
                    }
                    if(me.iconCard.cardName == '缺货率'){
                        //区域现货
                        me.province.setBarChartValue(data.lack);
                        //线图
                        me.province.setLineChartValue(data.lackTrend);
                    }
                    if(me.iconCard.cardName == '库存周转率'){
                        //区域现货
                        me.province.setBarChartValue(data.turnover);
                        //线图
                        me.province.setLineChartValue(data.turnTrend);
                    }
                    if(me.iconCard.cardName == '滞慢销率'){
                        //区域现货
                        me.province.setBarChartValue(data.slowChange);
                        //线图
                        me.province.setLineChartValue(data.trendS);
                    }
                    if(me.BarChartName != '区域' || me.BarChartName !='省份' || me.BarChartName != '仓库') {
                        me.BarChartName = '全国';
                    }
                    me.setLineTitle(me.BarChartName, me.cardName);

                }
                if(me.tabPanelName == 'warehouse'){
                    if(me.iconCard.cardName == '现货率'){
                        //区域现货
                        me.warehouse.setBarChartValue(data.goodsNum);
                        //线图
                        me.warehouse.setLineChartValue(data.trendG);
                    }
                    if(me.iconCard.cardName == '缺货率'){
                        //区域现货
                        me.warehouse.setBarChartValue(data.lack);
                        //线图
                        me.warehouse.setLineChartValue(data.lackTrend);
                    }
                    if(me.iconCard.cardName == '库存周转率'){
                        //区域现货
                        me.warehouse.setBarChartValue(data.turnover);
                        //线图
                        me.warehouse.setLineChartValue(data.turnTrend);
                    }
                    if(me.iconCard.cardName == '滞慢销率'){
                        //区域现货
                        me.warehouse.setBarChartValue(data.slowChange);
                        //线图
                        me.warehouse.setLineChartValue(data.trendS);
                    }
                    if(me.BarChartName != '区域' || me.BarChartName !='省份' || me.BarChartName != '仓库') {
                        me.BarChartName = '全国';
                    }
                    me.setLineTitle(me.BarChartName, me.cardName);
                }
                //点击指标设各个ID为空
                me.barAreaId = null;
                me.barProvinceId =null;
                me.barWarehouseId =null;
                //缺货数量
                me.oosData = data.lackNum ? data.lackNum : 0;
                //不动销数量
                me.noPinData = data.notSaleNum ? data.notSaleNum : 0;
                //滞慢销数量
                me.unsalableData = data.slowNum ? data.slowNum : 0;
            } else {
                Dialogs.showWarn(data);
                me.oosData = 0;
                me.noPinData = 0;
                me.unsalableData = 0;
                me.barAreaId = null;
                me.barProvinceId =null;
                me.barWarehouseId =null;
            }
            me.setListNum(me.oosData,me.noPinData,me.unsalableData);
        },
        /**
         *  区域柱图点击事件 根据当前点击区域渲染右侧曲线图
         *  @param params
         */
        regionBarClickFn:function (params) {
          var me = this;
          me.BarChartName = params.name;
          me.barAreaId = params.id;
          me.barProvinceId = null;
          me.barWarehouseId = null;
          Dialogs.showWait('正在获取数据，请稍候...');
          Ajax.post(URL.QueryPastArea, {
            date:Dates.toDateString(me.dateRange.getValue()),
            areaId:params.id
          }, me.regionLineChartRes, me);
          me.region.setLineChartTitle(me.BarChartName,me.cardName);
        },
        /**
         * 区域柱图点击后请求数据，数据回调
         * @param data
         */
        regionLineChartRes:function (data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            if(me.iconCard.cardName == '现货率'){
                //线图
                me.region.setLineChartValue(data.trendG);
            }
            if(me.iconCard.cardName == '缺货率'){
                //线图
                me.region.setLineChartValue(data.lackTrend);
            }
            if(me.iconCard.cardName == '库存周转率'){
                me.region.setLineChartValue(data.turnTrend);
            }
            if(me.iconCard.cardName == '滞慢销率'){
                //线图
                me.region.setLineChartValue(data.trendS);
            }
              //缺货数量
              me.oosData = data.lackNum ? data.lackNum : 0;
              //不动销数量
              me.noPinData = data.notSaleNum ? data.notSaleNum : 0;
              //滞慢销数量
              me.unsalableData = data.slowNum ? data.slowNum : 0;
          } else {
              Dialogs.showWarn(data);
              me.oosData = 0;
              me.noPinData = 0;
              me.unsalableData = 0;
          }
          me.setListNum(me.oosData,me.noPinData,me.unsalableData);
        },
        /**
         * 区域线图点击事件 根据当前点击时间渲染底部表格
         * @param params
         */
        regionLineClickFn:function (params) {
          var me = this;
          //根据左侧的柱状图的params.name与右侧曲线图的params.name作为参数传参从而setOptions底部的下拉框
          Dialogs.showWait('正在获取数据，请稍候...');
          Ajax.post(URL.getWarehouses, {
              date:params.name,
              areaId:me.barAreaId
          }, me.regionGridOptRes, me)
        },
        /**
         * 区域点击右侧曲线图后的数据请求后的回调
         * @param data
         */
        regionGridOptRes:function (data) {
          var me = this;
          Dialogs.hide();
          var tab = me.tableTabPanel.now.dataName;
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            me.setOptions(data);
          } else {
            Dialogs.showWarn(data);
          }
        },
        /**
         * 省份柱图点击事件 根据当前点击区域渲染右侧曲线图 请求接口
         * @param params
         */
        provinceBarClickFn:function (params) {
          var me = this;
          me.BarChartName = params.name;
          me.barProvinceId = params.id;
          me.barAreaId = null;
          me.barWarehouseId = null;
          Dialogs.showWait('正在获取数据，请稍候...');
          Ajax.post(URL.QueryPastProvince, {
              date:Dates.toDateString(me.dateRange.getValue()),
              provinceId:params.id
          }, me.provinceLineChartRes, me);
          me.province.setLineChartTitle(me.BarChartName,me.cardName);
        },
        /**
         * 省份柱图点击事件  接口请求后的数据回调
         * @param data
         */
        provinceLineChartRes:function (data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            if(me.iconCard.cardName == '现货率'){
                //线图
                me.province.setLineChartValue(data.trendG);
            }
            if(me.iconCard.cardName == '缺货率'){
                //线图
                me.province.setLineChartValue(data.lackTrend);
            }
            if(me.iconCard.cardName == '库存周转率'){
                //线图
                me.province.setLineChartValue(data.turnTrend);
            }
            if(me.iconCard.cardName == '滞慢销率'){
                //线图
                me.province.setLineChartValue(data.trendS);
            }
            //缺货数量
            me.oosData = data.lackNum ? data.lackNum : 0;
            //不动销数量
            me.noPinData = data.notSaleNum ? data.notSaleNum : 0;
            //滞慢销数量
            me.unsalableData = data.slowNum ? data.slowNum : 0;
          } else {
            Dialogs.showWarn(data);
            me.oosData = 0;
            me.noPinData = 0;
            me.unsalableData = 0;
          }
          me.setListNum(me.oosData,me.noPinData,me.unsalableData);
        },
        /**
         * 省份线图点击事件 根据当前点击时间渲染底部表格
         * @param params
         */
        provinceLineClickFn:function (params) {
          var me = this;
          //根据左侧的柱状图的params.name与右侧曲线图的params.name作为参数传参从而setOptions底部的下拉框
          Dialogs.showWait('正在获取数据，请稍候...');
          Ajax.post(URL.getWarehouses, {
              date:Dates.toDateString(me.dateRange.getValue()),
              provinceId:me.barProvinceId
          }, me.provinceGridOptRes, me);
        },
        /**
         * 省份点击右侧曲线图后的数据请求后的回调
         * @param data
         */
        provinceGridOptRes:function (data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            me.setOptions(data);
          } else {
            Dialogs.showWarn(data);
          }
        },
        /**
         * 仓库柱图点击事件 根据当前点击区域渲染右侧曲线图 请求接口
         * @param params
         */
        warehouseBarClickFn:function (params) {
          var me = this;
          me.BarChartName = params.name;
          me.barWarehouseId = params.id;
          me.barAreaId = null;
          me.barProvinceId = null;
          Dialogs.showWait('正在获取数据，请稍候...');
          Ajax.post(URL.QueryPastWarehouse, {
            date:Dates.toDateString(me.dateRange.getValue()),
            warehouseId:params.id
          }, me.warehouseLineChartRes, me);
          me.warehouse.setLineChartTitle(me.BarChartName,me.cardName);
        },
        /**
         * 仓库柱图点击事件 接口请求后数据回调
         * @param params
         */
        warehouseLineChartRes:function (data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            if(me.iconCard.cardName == '现货率'){
                //线图
                me.warehouse.setLineChartValue(data.trendG);
            }
            if(me.iconCard.cardName == '缺货率'){
                //线图
                me.warehouse.setLineChartValue(data.lackTrend);
            }
            if(me.iconCard.cardName == '库存周转率'){
                //线图
                me.warehouse.setLineChartValue(data.turnTrend);
            }
            if(me.iconCard.cardName == '滞慢销率'){
                //线图
                me.warehouse.setLineChartValue(data.trendS);
            }
              //缺货数量
              me.oosData = data.lackNum ? data.lackNum : 0;
              //不动销数量
              me.noPinData = data.notSaleNum ? data.notSaleNum : 0;
              //滞慢销数量
              me.unsalableData = data.slowNum ? data.slowNum : 0;
          } else {
              Dialogs.showWarn(data);
              me.oosData = 0;
              me.noPinData = 0;
              me.unsalableData = 0;
          }
          me.setListNum(me.oosData,me.noPinData,me.unsalableData);
        },
        /**
         * 仓库线图点击事件 根据当前点击时间渲染底部表格
         * @param params
         */
        warehouseLineClickFn:function (params) {
          var me = this;
          //根据左侧的柱状图的params.name与右侧曲线图的params.name作为参数传参从而setOptions底部的下拉框
          Dialogs.showWait('正在获取数据，请稍候...');
          Ajax.post(URL.getWarehouses, {
              date:Dates.toDateString(me.dateRange.getValue()),
              warehouseId:me.barWarehouseId
          }, me.warehouseGridOptRes, me)
        },
        /**
         * 仓库点击右侧曲线图后的数据请求后的回调
         * @param data
         */
        warehouseGridOptRes:function (data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            me.setOptions(data);
          } else {
            Dialogs.showWarn(data);
          }
        },
        /**
         * 缺货 查询按钮点击事件
         */
        oosClickFn:function (data) {
          var me = this;
          me.filterValue = me.oos.getFilterValue();
          data.provinceId = me.barProvinceId;
          data.areaId = me.barAreaId;
          if(me.barWarehouseId !=undefined && me.barWarehouseId !=null){
            data.warehouseId = me.barWarehouseId;
          }else {
            data.warehouseId = me.filterValue.warehouseId;
          }
          Dialogs.showWait('正在获取数据,请稍候...');
          Ajax.post(URL.GET_LACKGRID, data, me.oosGridRes, me);
        },
        /**
         * 缺货 点击查询后数据请求后回调事件
         * @param data
         */
        oosGridRes:function (data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            me.oos.setValue(data);
          } else {
            Dialogs.showWarn(data);
              /**
               * 查询为空，下面置空
               */
            me.oos.grid.setValue();
            me.oos.pagingBar.setDataResult();
          }
        },
        /**
         * 缺货 导出按钮点击事件
         */
        oosExportFn:function () {
          var me = this;
          var date = Dates.toDateString(me.oos.dateSel.getValue())
          var urlStrong =URL.DOWN_GRID+'?date='+date;
          if(me.barAreaId != undefined && me.barAreaId !=null){
              urlStrong += '?areaId='+me.barAreaId;
          }
          if(me.barProvinceId != undefined && me.barProvinceId !=null){
              urlStrong += '&provinceId='+me.barProvinceId;
          }
          if(me.barWarehouseId != undefined && me.barWarehouseId !=null) {
              urlStrong += '&warehouseId=' + me.barWarehouseId;
          }
          window.location=urlStrong;
        },
        /**
         * 滞销 查询按钮点击事件
         */
        unsalableClickFn:function (data) {
          var me = this;
          me.filterValue = me.unsalable.getFilterValue();
            data.provinceId = me.barProvinceId;
            data.areaId = me.barAreaId;
            if(me.barWarehouseId !=undefined && me.barWarehouseId !=null){
                data.warehouseId = me.barWarehouseId;
            }else {
                data.warehouseId = me.filterValue.warehouseId;
            }
          Dialogs.showWait('正在获取数据,请稍候...');
          Ajax.post(URL.GET_SLOWGRID, data, me.unsalableGridRes, me);
        },
        unsalableGridRes:function (data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            me.unsalable.setValue(data);
          } else {
            Dialogs.showWarn(data);
              /**
               * 查询为空，下面置空
               */
              me.unsalable.grid.setValue();
              me.unsalable.pagingBar.setDataResult();
          }
        },
        /**
         * 滞销 导出按钮点击事件
         */
        unsalableExportFn:function () {
          var me = this;
            var date = Dates.toDateString(me.unsalable.dateSel.getValue())
            var urlStrong =URL.DOWN_GRID+'?date='+date;
            if(me.barAreaId != undefined && me.barAreaId !=null){
                urlStrong += '?areaId='+me.barAreaId;
            }
            if(me.barProvinceId != undefined && me.barProvinceId !=null){
                urlStrong += '&provinceId='+me.barProvinceId;
            }
            if(me.barWarehouseId != undefined && me.barWarehouseId !=null) {
                urlStrong += '&warehouseId=' + me.barWarehouseId;
            }
            window.location=urlStrong;
        },
        /**
         * 不动销 查询按钮点击事件
         */
        noPinClickFn:function (data) {
          var me = this;
          me.filterValue = me.noPin.getFilterValue();
            data.provinceId = me.barProvinceId;
            data.areaId = me.barAreaId;
            if(me.barWarehouseId !=undefined && me.barWarehouseId !=null){
                data.warehouseId = me.barWarehouseId;
            }else {
                data.warehouseId = me.filterValue.warehouseId;
            }
          Dialogs.showWait('正在获取数据,请稍候...');
          Ajax.post(URL.GET_NOTSALEGRID, data, me.noPinGridRes, me);
        },
        noPinGridRes :function (data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            me.noPin.setValue(data);
          } else {
            Dialogs.showWarn(data);
              /**
               * 查询为空，下面置空
               */
              me.noPin.grid.setValue();
              me.noPin.pagingBar.setDataResult();
          }
        },
        /**
         * 不动销 导出按钮点击事件
         */
        noPinExportFn:function () {
          var me = this;
            var date = Dates.toDateString(me.noPin.dateSel.getValue())
            var urlStrong =URL.DOWN_GRID+'?date='+date;
            if(me.barAreaId != undefined && me.barAreaId !=null){
                urlStrong += '?areaId='+me.barAreaId;
            }
            if(me.barProvinceId != undefined && me.barProvinceId !=null){
                urlStrong += '&provinceId='+me.barProvinceId;
            }
            if(me.barWarehouseId != undefined && me.barWarehouseId !=null) {
                urlStrong += '&warehouseId=' + me.barWarehouseId;
            }
            window.location=urlStrong;
        },
        /**
         * 设置仓选项
         * @param options
         */
        setOptions:function (options) {
          var me = this;
          //三个仓库类别
          var lack = options.lackWareList;
          var slow = options.slowWareList;
          var notSale = options.notSaleWareList;
          //缺货仓库
          var arrLack = new Array(lack.length);
          for(var i in lack){
              var warhouse = new Object;
              warhouse.text=lack[i].text+"-"+lack[i].value;
              warhouse.value=lack[i].value;
              arrLack.push(warhouse);
          }
          arrLack.pop();
          me.oos.setOptions(arrLack);
          //滞慢销仓库
          var arrSlow = new Array(slow.length);
            for(var i in slow){
                var warhouse = new Object;
                warhouse.text=slow[i].text+"-"+slow[i].value;
                warhouse.value=slow[i].value;
                arrSlow.push(warhouse);
            }
            arrSlow.pop();
          me.unsalable.setOptions(arrSlow);
          //不动销仓库
          var arrNot = new Array(notSale.length);
            for(var i in notSale){
                var warhouse = new Object;
                warhouse.text=notSale[i].text+"-"+notSale[i].value;
                warhouse.value=notSale[i].value;
                arrNot.push(warhouse);
            }
            arrNot.pop();
          me.noPin.setOptions(arrNot);
        },
        /**
         * 页面初始化数据请求
         */
        initData:function () {
          var me = this;
          Dialogs.showWait('页面数据加载中……');
          /*me.onInitDataRes(); // 真正请求时此行删除*/
          Ajax.post(URL.INIT, {}, me.onInitDataRes, me)
        },
        /**
         * 页面初始化数据请求回调
         */
        onInitDataRes:function (data) {
          var me = this;
          Dialogs.hide();
          data = _processData(data);
          if (isO(data)) {
            data = data.result;
            // 渲染页面加载完成便需要渲染数据的部分
              //健康状态指标
              var chart = {};
              chart.chartData = [{
                  value: data.chartData,
                  name: ''
              }];
              chart.timeprogress = data.chartData,
              me.gaugeChart.setValue(chart);
              //关键指标
              me.iconCard.setValue(data.icondata);
              //区域现货
              me.region.setBarChartValue(data.barData);
              //线图
              me.region.setLineChartValue(data.lineData);
              //缺货数量
              me.oosData = data.lackNum ? data.lackNum : 0;
              //不动销数量
              me.noPinData = data.notSaleNum ? data.notSaleNum : 0;
              //滞慢销数量
              me.unsalableData = data.slowNum ? data.slowNum : 0;
          } else {
            Dialogs.showWarn(data);
            me.oosData = 0;
            me.noPinData = 0;
            me.unsalableData = 0;
          }
          if(Cmp.isDefined(me.oosData) || Cmp.isDefined(me.noPinData) || Cmp.isDefined(me.unsalableData)){
              me.renderTable();
          }
        },
        /**
         * 统一设置柱状图上侧标题文字
         * @param name 已被点击的Card的文字
         */
        setBarTitle : function (name) {
          var me = this;
          me.region.setBarChartTitle(name);
          me.province.setBarChartTitle(name);
          me.warehouse.setBarChartTitle(name);
        },
        /**
         * 统一设置曲线图上侧标题文字
         * @param txt   区域、省份、仓库（柱状图点击后获取到的name）
         * @param name
         */
        setLineTitle : function (txt,name) {
          var me = this;
          me.region.setLineChartTitle(txt,name);
          me.province.setLineChartTitle(txt,name);
          me.warehouse.setLineChartTitle(txt,name);
        },
        resize:function () {
            var me = this;
            me.region.resize();
            me.province.resize();
            me.warehouse.resize();
        }
      })
    }
  })
}())
