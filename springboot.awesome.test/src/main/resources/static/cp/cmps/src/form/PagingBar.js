/**
 * @class Cmp.PagingBar
 * @extend Cmp.Widget
 * 翻页控件实现；以事件+设置的形式实现翻页功能；此控件只提供视觉效果；
 *
 * @cfg {Boolean} hidePageSizeSelect (可选)等于true时，表示不去显示每页数量选项；
 * @cfg {Array} pageSizeOptions (可选)每页数量选项值，默认为：[10，20，50];设置数组数量不得超过5个；超过的将被截取；
 * @cfg {Number} pageLimit (可选)每页数量初始值，如果不设定则认为是pageSizeOptions选项的第一个；
 * @cfg {Number} pageIndex (可选)当前选中页，默认为0；
 * @cfg {Number} pageSize (可选)页总数，，默认为0；暨无结果
 *
 * @version 1.0.0
 * @since 2018-03-15
 * @author Weihanwei
 */
(function() {

  var UV = Cmp.util.ValueHelper,
    //标准模板
    HTML_TMP,
    //简化模板
    SIMPLE_HTML_TMP,
    NUMBER_CODE = [
			48, 49, 50, 51, 52,
			53, 54, 55, 56, 57
		],
    html;
  //标准模板
  html = [];
  //页面数量选项
  html.push('<div class="c-pgbar-ops">');
  html.push('<span class="text">每页显示</span><span class="select"></span><span class="text">条</span>');
  html.push('</div>');

  //页面跳转
  html.push('<div class="c-pgbar-jump">');
  html.push('<span class="text">到</span><input type="text"></input><span class="text">页</span>');
  html.push('<button class="c-btn c-pgbar-jumpbtn">确定</button>');
  html.push('</div>');
  //信息提示
  html.push('<div class="c-pgbar-msg">共xxx页</div>');
  //翻页按钮承载容器
  html.push('<div class="c-pgbar-btns">');
  html.push('</div>');
  HTML_TMP = html.join('');

  //简化模板
  html = [];
  //Buttons
  html.push('<div class="c-pgbar-btns">');
  html.push('</div>');
  //页面跳转
  html.push('<div class="c-pgbar-jump">');
  html.push('<span class="text">到</span><input type="text"></input><span class="text">/xxx页</span>');
  html.push('</div>');


  SIMPLE_HTML_TMP = html.join('');

  /**
   *　获得指定数字的位数
   */
  var getDiForNumber = function(v) {
    if (v < 10) {
      return 1;
    } else if (v < 100) {
      return 2;
    } else if (v < 1000) {
      return 3;
    } else if (v < 10000) {
      return 4;
    } else {
      var s = 0,
        t = v;
      while (t > 0) {
        s++;
        t = Math.floor(t / 10);
      }
      return s;
    }
  }
  /**
   * 更新指定按钮的显示样式
   * @param {Button} btn 按钮实例
   * @param {Boolean} isShow 等于false时表示隐藏，此时后面的参数就无所谓了。默认为true；
   */
  var updateBtnStyle = function(btn, isShow, text, pageIndex, actived, icon) {
    if (false === isShow) {
      btn.hide();
      return;
    }
    btn.show();
    btn.setText(text);
    if (undefined !== icon) {
      btn.setIcon(icon);
    }
    if (actived) {
      btn.active();
    } else {
      btn.unactive();
    }
    btn.pageIndex = pageIndex;
  }
  /**
   * @private
   * 创建一个类似于Button那样的一个结构对象
   * @param {HTMLElement} dom
   * @param {Function} handler 调用方法。
   * @param {Object} value 初始设定值
   */
  var createButtonHandler = function(dom, handler, value) {
    var me = this,
      rel;

    rel = {
      value: value,
      actived: false,
      disabled: false,
      el: Cmp.get(dom)
    };

    rel.getValue = function() {
      return rel.value;
    }
    rel.setValue = function(v) {
      rel.value = v;
    }
    rel.setText = function(tx) {
      rel.el.update(tx || '');
    }
    rel.active = function() {
      if (!rel.actived) {
        rel.el.setAttribute('actived', true);
      }
      rel.actived = true;
    }
    rel.unactive = function() {
      if (rel.actived) {
        rel.el.removeAttribute('actived');
      }
      rel.actived = false;
    }
    rel.enable = function() {
      if (rel.disabled) {
        rel.disabled = false;
        if (rel.el) {
          rel.el.removeClass('c-btn-disabled');
          rel.el.dom.disabled = false;
        }
      }
    }
    rel.disable = function() {
      if (!rel.disabled) {
        rel.disabled = true;
        if (rel.el) {
          rel.el.addClass('c-btn-disabled');
          rel.el.dom.disabled = true;
        }
      }
    }
    rel.hide = function() {
      rel.el.hide();
    }
    rel.show = function() {
      rel.el.show();
    }
    rel.el.setHideModal('display');
    //绑定Click事件
    rel.el.on('click', function() {
      handler.call(me, rel);
    });

    return rel;
  };

  /**
   * @private
   * 标准情况下页面总数未超出9页时的按钮刷新
   * @param {Number} pageIndex 页次序，首页时值为0；末页时，值等于pageTotal-1；
   * @param {Number} pageTotal 页总数
   */
  var refreshByStandardWithInrange = function(pageIndex, pageTotal) {
    var me = this,
      btns = me.pageBtns,
      pix = pageIndex + 1,
      pi = 2,
      pmi, pma,
      length = btns.length,
      i = 0,
      len = length < pageTotal ? length : pageTotal - 1,
      btn;

    btn = btns[length - 1];
    btn.el.removeClass('c-pgbar-move');

    for (; i < len; i++) {
      btn = btns[i];
      pi = i + 2;
      updateBtnStyle(btn, true, pi + '', pi, pi === pix, false);
    }

    if (pageTotal < 9) {
      me.lastBtn.hide();
      for (; i < length; i++) {
        btn = btns[i];
        updateBtnStyle(btn, false);
      }
    } else {
      me.lastBtn.show();
      me.lastBtn.setText(pageTotal);
      if (pix === pageTotal) {
        me.lastBtn.active();
      } else {
        me.lastBtn.unactive();
      }
    }
  }

  /**
   * @private
   * 标准情况下页面总数超出9页时的按钮刷新
   * @param {Number} pageIndex 页次序，首页时值为0；末页时，值等于pageTotal-1；
   * @param {Number} pageTotal 页总数
   */
  var refreshByStandardWithOverflow = function(pageIndex, pageTotal) {

    var me = this,
      btns = me.pageBtns,
      pix = pageIndex + 1,
      pi, pmi, pma,
      length = btns.length,
      i, len, btn;

    me.lastBtn.show();
    me.lastBtn.setText(pageTotal);

    if (pix === pageTotal) {
      me.lastBtn.active();
    } else {
      me.lastBtn.unactive();
    }

    if (pageIndex < 5) {
      //btn, isShow, text, pageIndex, actived, icon
      btn = btns[0];
      updateBtnStyle(btn, true, '2', 2, 2 === pix, false);
      btn.el.removeClass('c-pgbar-move');
      for (i = 1, len = length - 1; i < len; i++) {
        pi = i + 2;
        btn = btns[i];
        updateBtnStyle(btn, true, pi + '', pi, pi === pix);
      }
      btn = btns[len];
      updateBtnStyle(btn, true, '', 8, false, ['fa', 'fa-ellipsis-h']);
      btn.el.addClass('c-pgbar-move');
    } else if (pageIndex > pageTotal - 5) {
      pmi = pageTotal - 7;
      btn = btns[0];
      updateBtnStyle(btn, true, '', pmi, false, ['fa', 'fa-ellipsis-h']);
      btn.el.addClass('c-pgbar-move');
      for (i = 1, len = length - 1; i < len; i++) {
        pi = i + pmi;
        btn = btns[i];
        updateBtnStyle(btn, true, pi + '', pi, pi === pix);
      }
      btn = btns[len];
      pma = pageTotal - 1;
      updateBtnStyle(btn, true, pma + '', pma, pma === pix, false);
      btn.el.removeClass('c-pgbar-move');


    } else {
      pmi = pageIndex - 2;
      pma = pageIndex + 2;

      btn = btns[0];
      updateBtnStyle(btn, true, '', pmi - 1, false, ['fa', 'fa-ellipsis-h']);
      btn.el.addClass('c-pgbar-move');
      for (i = 1, len = length - 1; i < len; i++) {
        pi = i + pmi;
        btn = btns[i];
        updateBtnStyle(btn, true, pi + '', pi, pi === pix);
      }

      btn = btns[len];
      updateBtnStyle(btn, true, '', pma + 1, false, ['fa', 'fa-ellipsis-h']);
      btn.el.addClass('c-pgbar-move');
    }
  };
  /**
   * @private
   * 标准模式下的内容刷新
   * @param {Number} pageIndex 页次序，首页时值为0；末页时，值等于pageTotal-1；
   * @param {Number} pageTotal 页总数
   */
  var refreshByStandard = function(pageIndex, pageTotal) {
    var me = this,
      lastPageIndex = pageTotal - 1,
      btns = me.pageBtns,
      length = btns.length,
      i, len, btn;
    //前页
    if (pageIndex > 0) {
      me.backwardBtn.enable();
    } else {
      me.backwardBtn.disable();
    }
    //后页
    if (pageIndex < lastPageIndex) {
      me.forwardBtn.enable();
    } else {
      me.forwardBtn.disable();
    }
    if (pageTotal < 1) {
      //没有结果集
      me.msgBox.update('无数据');
      me.pageIndexInput.dom.disabled = true;
      me.jumpPageBtn.disable();

      me.firstBtn.hide();
      me.lastBtn.hide();
      for (i = 0; i < length; i++) {
        btn = btns[i];
        btn.hide();
      }
      return;
    }

    me.msgBox.update('共' + pageTotal + '页');
    if (pageTotal === 1) {
      me.pageIndexInput.dom.disabled = true;
      me.jumpPageBtn.disable();
    } else {
      me.pageIndexInput.dom.disabled = false;
      me.pageIndexInput.dom.maxLength = getDiForNumber(pageTotal);
      me.jumpPageBtn.enable();
    }

    me.firstBtn.show();
    if (0 === pageIndex) {
      me.firstBtn.active();
    } else {
      me.firstBtn.unactive();
    }

    if (pageTotal < 10) {
      refreshByStandardWithInrange.call(me, pageIndex, pageTotal);
    } else {
      refreshByStandardWithOverflow.call(me, pageIndex, pageTotal);
    }
  }

  Cmp.define('Cp.form.PagingBar', {
    extend: 'Cmp.Widget',
    requires: [
      'Cmp.Button',
      'Cmp.form.ComboBox',
      'Cmp.util.KeyMap'
    ],
    cls: true,
    factory: function(ext, reqs) {
      var superClazz = ext.prototype,
        buttonClazz = reqs[0],
        ComboBox = reqs[1],
        KeyMap = reqs[2];
      return Cmp.extend(ext, {

        /**
         * 设定数据查询结果；
         * @param {Object} rs 数据结果，具有以下几个属性：
         * 			{Number} pageIndex (可选)当前选中页；首页时值为0；末页时，值等于pageTotal-1；默认为0；
         * 			{Number} pageSize (可选)页总数，，默认为0；暨无结果
         *
         */
        setDataResult: function(rs) {
          rs = rs || {};
          var me = this,
            ix = !isN(rs.pageIndex) ? 0 : rs.pageIndex;
          tl = !isN(rs.pageSize) ? 0 : rs.pageSize;

          refreshByStandard.call(me, ix, tl);
          me.pageIndex = ix;
          me.pageSize = tl;
        },
        /**
         * 获得当前页面次序值。如果为首页，则返回0。
         * @return {Number} 游标数值
         */
        getPageIndex: function() {
          return this.pageIndex;
        },
        /**
         * 获得每次请求数据的最大条目数，暨每页显示数据的数量值。
         * @return {Number} 最大条目数
         */
        getPageLimit: function() {
          return this.pageLimit;
        },
        /**
         * @private
         * @overwrite
         */
        initComponent: function() {
          var me = this,
            cls = me.cls;
          if (isA(cls)) {
            cls.unshift('c-pgbar');
          } else if (isS(cls)) {
            cls = ['c-pgbar', cls];
          } else {
            cls = 'c-pgbar';
          }
          me.cls = cls;
          superClazz.initComponent.call(me);

          me.addEvents(
            /**
             * @event
             * 当操作控件上导致的页面次序发生变化前，分发此方法；
             *
             * @param {Number} pageIndex 期望达到的页面次序值；如果是首页，该值等于0；
             * @param {Number} beforePageIndex 之前的页面次序值；如果是首页，该值等于0；
             * @param {PagingBar} this
             */
            'indexchange',
            /**
             * @event
             * 当操作控件上导致的页面显示数据数量发生变化前，分发此方法；
             *
             * @param {Number} limit 期望达到的页面显示数据数量值；
             * @param {Number} beforeLimit 之前的页面显示数据数量值；
             * @param {PagingBar} this
             */
            'limitchange'
          );
          cls = me.pageSizeOptions;
          if (!isA(cls) || cls.length === 0) {
            cls = [10, 20, 30, 50];
          } else {
            if (cls.length > 5) {
              cls = cls.slice(0, 5);
            }
          }
          me.pageSizeOptions = cls;

          cls = me.pageLimit;
          if (!isN(cls) || me.pageSizeOptions.indexOf(cls) < 0) {
            cls = me.pageSizeOptions[0];
          }
          me.pageLimit = cls;

          me.pageSize = !isN(me.pageSize) ? 0 : me.pageSize;

          me.pageIndex = !isN(me.pageIndex) ? 0 : me.pageIndex;
        },
        /**
         * @private
         * @overwrite
         */
        doRender: function() {
          var me = this,
            dom;
          superClazz.doRender.call(me);
          me.doRenderByStandard();

          //初始化
          refreshByStandard.call(me, me.pageIndex, me.pageSize);
        },
        /**
         * @private
         * 标准形式绘制
         */
        doRenderByStandard: function() {
          var me = this,
            dom, k, subDom, el, cns, btns = [],
            i, btn, len, cbxCfg = [],
            box = me.el.createChild({
              cls: 'c-pgbar-box',
              html: HTML_TMP
            });

          dom = box.dom;
          //按钮组
          me.btnBox = Cmp.get(dom.childNodes[3]);

          //前页按钮
          me.backwardBtn = me.appendBtn('forward', undefined, 'c-pgbar-arrow', ['fa', 'fa-angle-double-left'], me.onBackwardPage);
          //首页
          me.firstBtn = me.appendBtn('first', '1', undefined, undefined, me.onFirstPage);

          //7个动态按钮
          for (i = 0; i < 7; i++) {
            k = 'btn-' + i;
            if (i != 6) {
              btns.push(me.appendBtn(k, (2 + i) + '', undefined, undefined, me.onPageIndex));
            } else {
              btns.push(me.appendBtn(k, undefined, 'c-pgbar-move', ['fa', 'fa-ellipsis-h'], me.onPageIndex));
            }
          }
          //末页
          me.lastBtn = me.appendBtn('last', 'Max', undefined, undefined, me.onLastPage);

          //后页
          me.forwardBtn = me.appendBtn('backward', undefined, 'c-pgbar-arrow', ['fa', 'fa-angle-double-right'], me.onForwardPage);

          me.pageBtns = btns;

          //信息
          me.msgBox = Cmp.get(dom.childNodes[2]);

          //页面跳转
          cns = dom.childNodes[1].childNodes;
          me.pageIndexInput = Cmp.get(cns[1]);
          me.keyMap = new KeyMap(me.pageIndexInput, 'keypress');
          me.keyMap.addKey(13, me.onJumpPage, me);
          for (var i = 0; i < 10; i++) {
            me.keyMap.addKey(NUMBER_CODE[i]);
          }
          me.keyMap.preventKeyEvent();
          me.keyMap.bindKeyEvent();
          me.jumpPageBtn = createButtonHandler.call(me, cns[3], me.onJumpPage);


          //控制每页数量的按钮
          if (!me.hidePageSizeSelect) {
            dom = dom.childNodes[0].childNodes[1];
            for (i = 0, len = me.pageSizeOptions.length; i < len; i++) {
              cbxCfg.push({
                text: me.pageSizeOptions[i] + '',
                value: me.pageSizeOptions[i]
              });
            }
            me.pageLimitCbx = new ComboBox({
              hideLabel: true,
              options: cbxCfg,
              width: '3rem'
            });
            me.pageLimitCbx.on('changed', me.fireLimitChangeEvent, me);
            me.pageLimitCbx.render(dom);
            me.pageLimitCbx.setValue(me.pageLimit);
          }
        },
        /**
         * @private
         * 增加一个按钮到按钮绘制区域
         */
        appendBtn: function(key, text, cls, icon, hanlder) {
          var me = this,
            btn = new buttonClazz({
              key: key,
              text: text,
              cls: cls,
              icon: icon,
              handler: hanlder,
              scope: me
            });

          btn.render(me.btnBox);
          return btn;
        },
        /**
         * @private
         * 分发页数量发生改变事件
         */
        fireLimitChangeEvent: function(value) {
          var me = this,
            limit = me.getPageLimit();

          if (value === limit) {
            return;
          }
          me.pageLimit = value;
          if (false !== me.fireEvent('limitchange', value, limit, me)) {} else {
            me.pageLimit = limit;
          }
        },
        /**
         * @private
         * @param {Number} pageIndex 期望到达的界面次序
         */
        fireIndexChangeEvent: function(pageIndex) {
          var me = this;
          me.fireEvent('indexchange', pageIndex, me.getPageIndex(), me);
        },
        /**
         * 点击前一页的处理方法
         */
        onBackwardPage: function(btn) {
          //			putLog('PagingBar#onBackwardPage>');
          var me = this,
            ix = me.getPageIndex() - 1;
          if (ix > -1) {
            me.fireIndexChangeEvent(ix);
          }
        },
        /**
         * 点击后页的处理方法
         */
        onForwardPage: function() {
          var me = this,
            ix = me.getPageIndex() + 1;
          //					putLog('onForwardPage> pageIndex:'+me.getPageIndex()+', to index:'+ix);
          if (ix < me.pageSize) {
            me.fireIndexChangeEvent(ix);
          }
        },
        /**
         * 点击末页的处理方法
         */
        onLastPage: function() {
          var me = this,
            ix = me.pageSize - 1;

          if (me.getPageIndex() !== ix) {
            me.fireIndexChangeEvent(ix);
          }
        },
        /**
         * 点击首页的处理方法
         */
        onFirstPage: function(btn) {
          var me = this;
          if (me.getPageIndex() !== 0) {
            me.fireIndexChangeEvent(0);
          }
        },
        /**
         * 点击指定页数的处理方法
         */
        onPageIndex: function(btn) {
          var me = this,
            ix = btn.pageIndex;
          me.fireIndexChangeEvent(ix - 1);
        },
        /**
         * 跳转至指定页的处理方法
         */
        onJumpPage: function() {
          var me = this,
            ix = me.pageIndexInput.dom.value;
          ix = UV.toInteger(ix, 0);
          if (ix > 0 && ix <= me.pageSize) {
            me.fireIndexChangeEvent(ix - 1);
          }
        }
      });
    }
  });

}());
