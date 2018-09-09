/**
 * 树节点的数据描述类；
 *
 * @class Cp.form.CateTreeSelectNode
 * @extend Object
 *
 * @version 1.0.1
 * @since 2016-12-22
 * @author WeiHanwei
 */
(function() {
  /**
   * @constructor
   */
  var seq = 10000,
    buildId = function() {
      return 'CTSN-' + (++seq);
    };
  var CateTreeSelectNode = function(cfg, itemFirstCateCd) {
    cfg = cfg || {};
    var me = this,
      id = cfg.id ? cfg.id : buildId(),
      _tree;

    var cns = [],
      cs = cfg.children,
      i = 0,
      len = isA(cs) ? cs.length : 0,
      c;
    for (; i < len; i++) {
      if (typeof cfg.itemFirstCateCd !== 'undefined' && typeof cfg.itemSecondCateCd === 'undefined') {
        c = new CateTreeSelectNode(cs[i], cfg.itemFirstCateCd);
      } else {
        c = new CateTreeSelectNode(cs[i]);
      }
      cns.push(c);
      c.parent = me;
    }
    me.childNodes = cns;
    cfg.itemFirstCateCd = cfg.itemFirstCateCd ? parseInt(cfg.itemFirstCateCd) : 0;
    cfg.itemFirstCateName = cfg.itemFirstCateName ? cfg.itemFirstCateName : "";
    cfg.itemSecondCateCd = cfg.itemSecondCateCd ? parseInt(cfg.itemSecondCateCd) : 0;
    cfg.itemSecondCateName = cfg.itemSecondCateName ? cfg.itemSecondCateName : "";
    cfg.itemThirdCateCd = cfg.itemThirdCateCd ? parseInt(cfg.itemThirdCateCd) : 0;
    cfg.itemThirdCateName = cfg.itemThirdCateName ? cfg.itemThirdCateName : "";
    me.oneId = cfg.itemFirstCateCd;
    me.itemFirstCateName = cfg.itemFirstCateName;
    me.twoId = cfg.itemSecondCateCd;
    me.itemSecondCateName = cfg.itemSecondCateName;
    me.threeId = cfg.itemThirdCateCd;
    me.itemThirdCateName = cfg.itemThirdCateName;
    me.storeCateVolume = cfg.storeCateVolume ? parseInt(cfg.storeCateVolume) : 0;
    me.storeCateQtty = cfg.storeCateQtty ? parseInt(cfg.storeCateQtty) : 0;
    me.isMove = cfg.isMove ? true : false;
    me.isLock = cfg.isLock ? true : false;
    if (typeof itemFirstCateCd !== 'undefined') {
      me.oneId = parseInt(itemFirstCateCd);
    }
    me.data = {
      id: id
    };
    cfg.text = cfg.text ? cfg.text : (cfg.itemThirdCateName || cfg.itemSecondCateName || cfg.itemFirstCateName);
    Cmp.apply(me.data, cfg);

    delete me.data.leaf;
    delete me.data.async;
    delete me.data.children;
    // delete me.data.alwaysReload;
    /**
     * 返回节点标识ID
     */
    me.getId = function() {
      return id;
    };
    /**
     * 返回true表示该节点是不可以展开的叶子节点。
     */
    me.isLeaf = function() {
      return me.getTreeLayer() === 2;
    };

    /**
     * 该方法为TreePanel专用方法。
     * 将该节点绑定在指定的树上。
     * @param {TreePanel} tree
     */
    me.bindTree = function(tree) {
      _tree = tree;
    };
    /**
     * 获得该节点所绑定的树
     * @return {TreePanel}
     */
    me.getTree = function() {
      return _tree;
    };
  };
  CateTreeSelectNode.prototype = {
    /**
     * 获得该节点文字的前置图标
     */
    getIcon: function() {
      return this.data.icon;
    },
    /**
     * 获得此节点的父节点
     * @return {CateTreeSelectNode} 父节点实例；
     */
    getParent: function() {
      return this.parent;
    },
    /**
     * 获得该节点显示的文字
     * @return {String} text 显示文字。
     */
    getText: function() {
      return this.data.text;
    },
    /**
     * 获得该节点从一级到三级的显示名称
     * @author Weihw
     * @date   2016-12-22
     * @return {String} str 显示名称
     */
    getShowText: function() {
      var node = this,
        str = node.getText();
      if (!isO(node.parent)) {
        return str;
      }
      node = node.parent;
      while (node.getTreeLayer() > -1) {
        str = node.getText() + "-" + str;
        if (!isO(node.parent)) {
          break;
        }
        node = node.parent;
      }
      return str;
    },
    /**
     * 获得该节点在所绑定树上的深度级别；
     * 如果该节点为根节点，返回值为0；
     */
    getTreeLayer: function() {
      var me = this;
      if (isN(me.treeLayer)) {
        return me.treeLayer;
      } else {
        var p = me.getParent();
        if (p) {
          me.treeLayer = p.getTreeLayer() + 1;
        } else {
          me.treeLayer = 0;
        }
        return me.treeLayer;
      }
    },
    /**
     * 获得该节点的子节点。
     * @param {Function} cb 回调方法，得到子节点之后，调用该方法。并将子节点传入。
     * @param {Object} scope 调用回调方法时的this对象设定。
     */
    getChildren: function(cb, scope) {
      var me = this;
      if (me.isLeaf()) {
        Cmp.invoke(cb, scope, []);
      } else if (!isA(me.childNodes) || me.childNodes.length == 0) {

        //还没有获取过子节点，或者是每次都需要获取子节点；需要使用TreeLoader获取
        var loader = me.getTree();
        if (loader) {
          loader = loader.getLoader();
          if (loader && isF(loader.get)) {
            var params = {
              level: (me.getTreeLayer() + 1)
            };
            /*
             * 修改请求参数。
             */
            if (me.getTreeLayer() !== -1) {
              if (isN(me.oneId) && me.oneId !== 0) {
                params['oneId'] = me.oneId;
              }
              if (isN(me.twoId) && me.twoId !== 0) {
                params['twoId'] = me.twoId;
              }
              if (isN(me.threeId) && me.threeId !== 0) {
                params['threeId'] = me.threeId;
              }
            } else {
              params['oneId'] = 0;
            }
            loader.get('/geSkuCateList.json', params, function(os) {
              if (os.error) {
                return
              }
              os = os.result;
              os = JSON.parse(os);
              if (os.success !== 1) {
                return
              }
              os = os.cateList;
              var i = 0,
                len = isA(os) ? os.length : 0,
                c, cns = [];

              for (; i < len; i++) {
                c = new CateTreeSelectNode(os[i]);
                c.parent = me;
                /*
                 * 为子node添加属性。
                 */
                if (isN(me.oneId) && me.oneId !== 0) {
                  c.oneId = me.oneId;
                }
                if (isN(me.twoId) && me.twoId !== 0) {
                  c.twoId = me.twoId;
                }
                cns.push(c);
              }

              me.childNodes = cns;
              Cmp.invoke(cb, scope, [cns]);
            });
            return;
          }
        }
        Cmp.invoke(cb, scope, []);

      } else {
        Cmp.invoke(cb, scope, [me.childNodes]);
      }
    },
    /**
     * 判断是否有子节点
     * @author Weihw
     * @date   2016-09-12
     * @return {Boolean}
     */
    hasChild: function() {
      return this.childNodes.length > 0;
    }
  };

  Cmp.define('Cp.form.CateTreeSelectNode', {
    factory: function() {
      return CateTreeSelectNode;
    }
  });
}());
