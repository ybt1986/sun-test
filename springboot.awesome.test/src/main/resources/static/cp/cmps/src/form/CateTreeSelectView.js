/**
 * 纵向结构树的渲染器
 * @class Cp.form.CateTreeSelectView
 * @extend Object
 *
 * @version 1.0.1
 * @since 2016-12-22
 * @author WeiHanwei
 */
(function() {

  Cmp.define('Cp.form.CateTreeSelectView', {
    requires: [
			'Cp.form.CateTreeSelectNode',
			'Cp.form.CateTreeSelectNodeView'
		],
    factory: function(ext, reqs) {
      var nodeClazz = reqs[0],
        nodeViewClazz = reqs[1];
      /**
       * @param input {Cmp.Element} 指向顶层input的
       */

      var CateTreeSelectView = function(input) {
        var me = this;
        me.nodeViews = {};
        me.delayClick = false;
        me.inputField = input;
        me.finishDaleyByClick = function() {
          me.delayClick = false;
        };
        //存放Node
        me.trueSelect = {};
        //延迟发送点击事件
        me.clickDaley = new Cmp.util.DelayedTask({
          delay: 500,
          handler: me.finishDaleyByClick,
          scope: me
        });
      };
      CateTreeSelectView.prototype = {
        reset: function() {
          var me = this,
            inputDom = me.inputField.dom;
          me.unselectAll(me.rootView);
          me.trueSelect = {};
          inputDom.value = "";
        },
        /**
         * 在指定的容器上渲染指定树
         */
        render: function(tree, target) {
          var me = this;
          if (me.tree) {
            //已经绘制过了
            return;
          }
          me.tree = tree;
          me.treeBox = target;
          me.radio = tree.radio;
          me.autoInit = tree.autoInit;
          if (tree.useArrow) {
            target.addClass('c-tree-usrarrow');
          }


          me.mask = target.createChild({
            cls: 'c-tree-mask'
          });
          me.mask.setHideModal('display');
          me.mask.hide();
          me.rootView = me.renderTreeNode(tree.root, me.treeBox);

          if (tree.hidderRoot) {
            //隐藏了根节点，需要展开这个跟
            me.rootView.node.treeLayer = -1;
            me.rootView.itemBox.setStyle('display', 'none');
            if (me.autoInit) {
              me.doExtendNode(me.rootView);
            } else {
              if (isA(tree.root.children) && tree.root.children.length > 0) {
                me.renderAllChild(me.rootView);
                me.doExtendNode(me.rootView);
              }
            }
          }
        },
        /**
         * @private
         * 绘制一个节点
         */
        renderTreeNode: function(node, box) {
          var me = this;
          if (isO(node)) {
            if (!isF(node.getId)) {
              node = new nodeClazz(node);
            }
            node.bindTree(me.tree);
            var view = me.createTreeNodeView(node);
            view.render(box, me);
            me.nodeViews[node.getId()] = view;
            return view;
          }
          return undefined;
        },
        /**
         * @private
         * 创建指定绘制指定节点的渲染器；
         */
        createTreeNodeView: function(node) {
          return new nodeViewClazz(node, this.radio);
        },
        /**
         * @public
         * 获得指定节点所对应的渲染器实例
         * @param {String/Object/TreeNode} node
         * @return {TreeNodeView}
         */
        getNodeView: function(node) {
          var me = this;
          if (isO(node)) {
            if (isF(node.getId)) {
              node = node.getId();
            } else {
              node = node.id;
            }
          }

          if (isS(node) || isN(node)) {
            return me.nodeViews[node];
          }
          return undefined;
        },
        /**
         * @private
         * 响应树节点上的展开/收缩触发器被点击时的处理
         * @param {String/Object/TreeNode} node
         */
        onClickArrow: function(node) {
          var me = this,
            v = me.getNodeView(node);
          if (!v) {
            return;
          }

          if (v.isExtended()) {
            me.doCollectNode(v);
          } else {
            me.doExtendNode(v);
          }
        },
        /**
         * @private
         * 响应点击树节点上事件
         */
        onClickNode: function(node) {
          var me = this,
            v = me.getNodeView(node);
          if (!v) {
            return;
          }
          if (!me.delayClick) {
            //				putLog('CateTreeSelectView#onClickNode>');
            me.delayClick = true;

            var acv = me.activedView;

            if (acv) {
              acv.unselect();
            }

            if (!acv || acv.getId() !== v.getId()) {
              v.select();
              me.activedView = v;
            } else {
              me.activedView = undefined;
            }
            me.tree.fireEvent('selectedchange', me.activedView ? me.activedView.node : undefined, me.tree);
            me.clickDaley.run();
          }
        },
        /**
         * @private
         * 响应双击树节点上事件
         */
        onDbClickNode: function(node) {
          var me = this,
            v = me.getNodeView(node);
          if (v) {
            me.tree.fireEvent('dblclicknode', v.node, me.tree);
          }
        },
        /**
         * @private
         * 响应当为单选时点击树节点上span.node事件
         */
        onRadioClick: function(node) {
          var me = this;
          //如果有子，子显示灰选状态

          //全体便利，取消所有以选择的节点
          me.unselectAll(me.rootView);
          me.trueSelect = {};
          //将当前选择的值显示到顶层容器
          me.getNodeView(node).check();
          me.inputField.dom.value = "";
          me.showValue(me.rootView);
          me.trueSelect[node.getId()] = node;
          me.tree.collect();
        },
        /**
         * @private
         * 响应当为多选时点击树节点上span.node事件
         */
        onCheckBoxClick: function(node) {
          var me = this,
            v = me.getNodeView(node),
            inputDom = me.inputField.dom,
            inputVal = inputDom.value;
          v.nodeIconBox.removeClass('half-check');
          // 触发向下查询，用于子孙项全选或全不选
          if (v.isChecked()) {
            me.selectAll(v);
          } else {
            me.unselectAll(v);
          }
          //触发向上查询。
          me.judgeParentSelect(v);
          me.inputField.dom.value = "";
          me.showValue(me.rootView);
        },
        /**
         *	向上查询，判定是否父级应自动选择或取消选择
         * @param nodeView {TreeComboBoxNodeView} : 当前操作的NodeView实例
         */
        judgeParentSelect: function(nodeView) {
          var me = this;
          if (!isO(nodeView.node.parent)) {
            return;
          }
          var node = nodeView.node,
            parentNode = node.parent,
            parentNodeView = me.getNodeView(parentNode),
            childViews = parentNodeView.childViews;

          // 判断传入的nodeView的同级View是否全选。
          if (isA(childViews)) {
            var i = 0,
              len = childViews.length,
              allChooseFlag = true,
              hasChooseFlag = false,
              hasHalfChoose = false;
            for (; i < len; i++) {
              if (childViews[i].isChecked()) {
                hasChooseFlag = true;
              } else if (childViews[i].nodeIconBox.hasClass('half-check')) {
                hasHalfChoose = true;
                allChooseFlag = false;
              } else {
                allChooseFlag = false;
              }
            }
            parentNodeView.nodeIconBox.removeClass('half-check');
            parentNodeView.itemBox.removeClass('itemMoved');
            // 如果全选中 flag=true，父NodeView选中，取消父NodeView的childViews在顶层input显示。
            if (allChooseFlag) {
              parentNodeView.check();
              parentNodeView.itemBox.addClass('itemMoved');
            } else {
              if (hasChooseFlag || hasHalfChoose) {
                parentNodeView.nodeIconBox.addClass('half-check');
              } else {
                parentNodeView.nodeIconBox.removeClass('half-check');
              }
              // 如果没有全选中，取消父NodeView在顶层input显示，并显示其选中的子项。
              parentNodeView.uncheck();
            }
          }
          if (isO(parentNode.parent)) {
            arguments.callee.call(me, parentNodeView);
          }
        },
        // 重新排列容器显示信息
        showValue: function(nodeView) {
          var me = this;
          if (nodeView.isChecked()) {
            var text = me.inputField.dom.value ? me.inputField.dom.value + ' , ' : "";
            me.inputField.dom.value = (text + nodeView.node.getShowText());
          } else {
            if (isA(nodeView.childViews)) {
              for (var i = 0; i < nodeView.childViews.length; i++) {
                me.showValue(nodeView.childViews[i]);
              }
            }
          }
        },
        /**
         * 向下查询全选所有子项
         * @param nodeView {TreeComboBoxNodeView} : 根节点
         * @param inputDom {Element} : 顶层容器input DOM元素
         */
        selectAll: function(nodeView) {
          var me = this;
          if (!isA(nodeView.childViews)) {
            me.trueSelect[nodeView.node.getId()] = nodeView.node;
            return;
          }
          var childViews = nodeView.childViews,
            i = 0,
            len = childViews.length;
          for (; i < len; i++) {
            childViews[i].check();
            if (!isA(childViews[i].childViews)) {
              if (childViews[i].node.isLeaf()) {
                me.trueSelect[childViews[i].node.getId()] = childViews[i].node;
              }
            } else {
              me.selectAll(childViews[i]);
            }
          }
        },
        /**
         * 向下查询所有子项uncheck
         * @param nodeView {TreeComboBoxNodeView} : 根节点
         */
        unselectAll: function(nodeView) {
          var me = this;
          if (!isA(nodeView.childViews)) {
            delete me.trueSelect[nodeView.node.getId()];
            return;
          }
          var childViews = nodeView.childViews,
            i = 0,
            len = childViews.length;
          for (; i < len; i++) {
            childViews[i].nodeIconBox.removeClass('half-check');
            if (childViews[i].isChecked()) {
              childViews[i].uncheck();
            }
            if (isA(childViews[i].childViews)) {
              me.unselectAll(childViews[i]);
            } else if (childViews[i].node.isLeaf()) {
              if (!!me.trueSelect[childViews[i].node.getId()]) {
                delete me.trueSelect[childViews[i].node.getId()];
              }
            }
          }
        },
        /**
         * @private
         * 展开指定的节点
         */
        doExtendNode: function(nodeView, cb, scope) {
          var me = this,
            node = nodeView.node;
          if (!nodeView.isRenderedForChildren()) {
            //没有绘制过子节点或者是需要每次都去获取子节点
            me.mask.show();
            nodeView.showLoding();
            node.getChildren(function(cns) {
              me.mask.hide();
              nodeView.hideLoading();
              var box = nodeView.getChildrenBox(),
                i = 0,
                len = isA(cns) ? cns.length : 0,
                cn;

              //清空之前的
              nodeView.clearChilden();

              if (len > 0) {
                for (; i < len; i++) {
                  cn = me.renderTreeNode(cns[i], box);
                  if (cn) {
                    nodeView.addChild(cn);
                  }
                }
              } else {
                cn = me.renderEmptyChild(box, node.getTreeLayer());
                if (cn) {
                  nodeView.addChild(cn);
                }
              }


              nodeView.extend();

              me.tree.fireEvent('extendednode', node, me.tree);

              if (isF(cb)) {
                cb.call(scope);
              }
            });
          } else {
            nodeView.extend();
            me.tree.fireEvent('extendednode', node, me.tree);
            if (isF(cb)) {
              cb.call(scope);
            }
          }

        },
        /**
         * @private
         * 收缩指定的节点
         */
        doCollectNode: function(nodeView) {
          var me = this;
          nodeView.collend();
          me.tree.fireEvent('collectednode', nodeView.node, me.tree);
        },
        /**
         * @private
         * 在指定的位置添加一个表示空子节点的虚拟节点；
         * @reutrn {Element}
         */
        renderEmptyChild: function(box, lv) {
          var me = this,
            el, s;
          s = 0.8 * (lv + 2) + 'rem';

          el = box.createChild({
            cls: 'c-treenode c-treenode-empty',
            html: '<div class="c-treenode-item" style="padding-left:' + s + ';"><div class="c-treenode-warp">空</div></div>'
          });
        },
        renderAllChild: function(nodeView, cb) {
          var me = this,
            node = nodeView.node;
          if (!node.hasChild()) {
            me.judgeParentSelect(nodeView);
            return;
          }
          node.getChildren(function(cns) {
            var box = nodeView.getChildrenBox(),
              i = 0,
              len = isA(cns) ? cns.length : 0,
              cn;

            //清空之前的
            nodeView.clearChilden();

            if (len > 0) {
              for (; i < len; i++) {
                cn = me.renderTreeNode(cns[i], box);
                if (cn) {
                  nodeView.addChild(cn);
                  if (cns[i].isMove) {
                    cn.check();
                  }
                }
              }
            } else {
              cn = me.renderEmptyChild(box, node.getTreeLayer());
              if (cn) {
                nodeView.addChild(cn);
              }
            }

            if (isF(cb)) {
              cb.call(scope);
            }
          });
          for (var i = 0; i < nodeView.childViews.length; i++) {
            arguments.callee.call(me, nodeView.childViews[i]);
          }
        },
        /**
         * 多选时，全部选择
         */
        selAll: function() {
          var me = this;
          if (isB(this.radio) && this.radio) return;
          me.rootView.nodeIconBox.dom.click();
        }
      };
      return CateTreeSelectView;
    }
  });
}());
