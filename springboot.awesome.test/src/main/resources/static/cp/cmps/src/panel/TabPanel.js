(function() {
  var HTML = [];
  HTML.push('<div class="cp-tabpanel-tabs"></div>');
  HTML.push('<div class="cp-tabpanel-container"></div>');
  HTML = HTML.join('');
  Cmp.define('Cp.panel.TabPanel', {
    extend: 'Cmp.Widget',
    requires: [],
    cls: true,
    factory: function(ext, reqs) {
      var superClazz = ext.prototype;
      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this;
          superClazz.initComponent.call(me);
        },
        doRender: function() {
          var me = this,
            tab, panel, showIndex = 0;
          superClazz.doRender.call(me);
          me.el.addClass('cp-tabpanel');
          me.el.update(HTML);
          me.tabsContainer = Cmp.get(me.el.dom.firstChild);
          me.panelsContainer = Cmp.get(me.el.dom.lastChild);
          me.items = [];
          // 遍历list，对每一项进行创建操作
          Cmp.each(me.list, function(item, index) {
            var obj, dataName = item.dataName ? item.dataName : index;
            // 生成标签tab
            tab = me.createTab(item.name);
            // 生成panel，并渲染item
            panel = me.createPanel(item.item);
            panel.setHideModal('display');
            if (index !== 0) {
              panel.hide();
            }
            obj = {
              tab: tab,
              panel: panel,
              dataName: dataName
            }
            // tab注册点击事件
            tab.on('click', (function(obj) {
              return function() {
                me.changePanel(obj);
              }
            })(obj));
            me.items.push(obj);
          });
          // 如果有默认显示面板，则显示该面板，否则显示第一个
          if (me.showIndex) {
            showIndex = me.showIndex;
          }
          me.changePanel(me.items[showIndex]);
        },
        /**
         * 创建TAB
         */
        createTab: function(name) {
          var me = this,
            tab;
          tab = me.tabsContainer.createChild({
            tag: 'span',
            cls: 'cp-tabpanel-tab',
            html: name
          });
          return tab;
        },
        /**
         * 创建panel
         */
        createPanel: function(item) {
          var me = this,
            panel;
          panel = me.panelsContainer.createChild({
            tag: 'div',
            cls: 'cp-tabpanel-panel'
          });
          item.render(panel);
          panel.item = item;
          return panel;
        },
        /**
         * @param  {Object} item
         * @param  {CmpElement} item.tab
         * @param  {CmpElement} item.panel
         * @param  {String}     item.dataName
         */
        changePanel: function(item) {
          var me = this,
            tab, panel, dataName;
          tab = item.tab;
          panel = item.panel;
          dataName = item.dataName;
          // 如果已有
          if (isO(me.now)) {
            if (me.now === item) {
              // 如果点击的和当前的一样，不处理
              return;
            }
            me.now.tab.removeClass('on');
            me.now.panel.hide();
          }
          tab.addClass('on');
          panel.show();
          if (isF(panel.item.resize)) {
            panel.item.resize();
          }
          me.now = item;
          me.fireEvent('tabChanged', dataName);
        },

        /*
          设置默认的panel
        */
        setDefaultPanel:function(index){
            var me = this;
            me.changePanel(me.items[index]);
        }
      })
    }
  })
}());
