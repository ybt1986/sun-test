(function() {

  /**
   * 用于将原始数据或被移入数据加工成数结构
   * @author Weihw
   * @date   2016-10-09
   * @param  {Array}   data   传入的品类列表
   * @return {Array}   level1 经过转化后的适用于TreeSelect的树结构数据
   */
  function _transformToTree(data) {
    var list = data,
      level1 = {},
      level2 = {},
      temp, i, x, len;

    // 遍历一级,进行一级分类
    for (i = 0, len = list.length; i < len; i++) {
      if (level1[list[i].itemFirstCateCd]) {
        level1[list[i].itemFirstCateCd].children.push(list[i]);
      } else {
        level1[list[i].itemFirstCateCd] = {
          itemFirstCateCd: list[i].itemFirstCateCd,
          itemFirstCateName: list[i].itemFirstCateName,
          children: []
        };
        level1[list[i].itemFirstCateCd].children.push(list[i]);
      }
    }
    temp = [];
    for (x in level1) {
      temp.push(level1[x]);
    }
    level1 = temp;

    // 进行二级分类
    temp = [];
    // 遍历所有一级
    for (i = 0, len = level1.length; i < len; i++) {
      var children = level1[i].children;
      // 遍历每个一级的二级，进行分类
      for (var j = 0, subLen = children.length; j < subLen; j++) {
        if (level2[children[j].itemSecondCateCd]) {
          level2[children[j].itemSecondCateCd].children.push(children[j]);
        } else {
          level2[children[j].itemSecondCateCd] = {
            // parentId : level1[i].itemFirstCateCd,
            itemSecondCateCd: children[j].itemSecondCateCd,
            itemSecondCateName: children[j].itemSecondCateName,
            children: []
          };
          level2[children[j].itemSecondCateCd].children.push(children[j]);
        }
      }
      temp = [];
      for (x in level2) {
        temp.push(level2[x]);
      }
      level2 = temp;
      level1[i].children = level2;
      level2 = {};
    }
    return level1;
  }
  var HTML = [];
  HTML.push('<div class="cp-col-4"></div>');
  HTML.push('<div class="cp-col-4"></div>');
  HTML.push('<div class="cp-col-2 cp-btn-bar"></div>');
  HTML.push('<div class="cp-col-2 cp-time"></div>');
  HTML = HTML.join('');
  Cmp.define('Cp.realtime.TopFilter', {
    extend: 'Cmp.Widget',
    requires: [
      'Cmp.Button',
      'Cp.form.SearchComboBox',
      'Cp.form.CateTreeSelect',
      'Cp.util.Moment'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var SP = ext.prototype,
        Button = reqs[0],
        SearchComboBox = reqs[1],
        CateTreeSelect = reqs[2],
        Moment = reqs[3];

      return Cmp.extend(ext, {
        initComponent: function() {
          var me = this;
          me.cls = 'cp-topfilter';
          SP.initComponent.call(me);
          me.moment = new Moment();
        },
        doRender: function() {
          var me = this,
            doms,timeBox;
            me.refreshTime = me.moment().format('YYYY-MM-DD HH:mm:ss');
          SP.doRender.call(me);
          me.el.update(HTML);
          doms = me.el.dom.childNodes;
          // 品类选择框
          me.cateSelect = new CateTreeSelect({
            label: '商品分类',
            name: 'cateSelect',
            disabled: true,
            hidderRoot: true,
            emptyText: '空',
            useArrow: true,
            autoInit: false
          });
          me.cateSelect.on('changed', me.tryEnableQuery, me);
          me.cateSelect.render(doms[0]);

          // 商品名称模糊查询框
          me.goods = new SearchComboBox({
            label: '商品名称',
            queryUrl: me.searchUrl,
            readOnly: false
          });
          me.goods.render(doms[1]);

          // 查询按钮
          me.topQBtn = new Button({
            cls: 'cp-main-normal',
            text: '查询',
            handler: me.onClickQuery,
            scope: me
          });
          me.topQBtn.render(doms[2]);
          //更新时间
          me.timeBox = Cmp.get(doms[3]);
        },
        /**
         * 判断是否查询按钮可点
         */
        tryEnableQuery: function() {
          var me = this,
            res;
          res = me.getValue();
          if ((isA(res.cate) && res.cate.length > 0) || isO(res.goods)) {
            // 品类或商品有其一即可查询
            me.topQBtn.enable();
          } else {
            me.topQBtn.disable();
          }
        },
        /**
         * 查询按钮点击事件处理
         */
        onClickQuery: function() {
            this.fireEvent('query', this.getValue());
        },
        /**
         * 设置初始数据
         * @param  {Array} data
         */
        setOption: function(data) {
          var me = this;
          data = _transformToTree(data);
          me.cateSelect.setOptions(data);
          me.cateSelect.selAll();
          me.cateSelect.enable();
          me.onClickQuery();
        },
        /**
         * 获取数据
         * @returns {object}
         */
        getValue: function() {
          var me = this,
            result = {};
          result.cate = me.cateSelect.getValue();
            result.goods = me.goods.getValue();
            result.goodsName = me.goods.getTextByValue(result.goods);
          return result;
        },
          /**
           * 设置时间变量
           * @param time 字符串
           */
          setRefreshTime:function (time) {
              var me = this;
              if(isS(time) || isN(time)){
                me.refreshTime = time
              }
              me.timeBox.update('数据更新时间：'+me.refreshTime);
          }
      })
    }
  })
}());
