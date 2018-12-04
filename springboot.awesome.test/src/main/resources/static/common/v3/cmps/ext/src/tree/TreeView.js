/**
 * 纵向结构树的渲染器
 * @class Cmp.tree.TreeView
 * @extend Object
 * 
 * @version 2.1.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){

	Cmp.define('Cmp.tree.TreeView',{
		requires : [
			'Cmp.tree.TreeNode',
			'Cmp.tree.TreeNodeView'
		],
		factory : function(ext, reqs){
			var nodeClazz = reqs[0],
				nodeViewClazz = reqs[1];
			
			var TreeView = function(){
				var me = this;
				me.nodeViews = {};
				me.delayClick = false;
				
				me.finishDaleyByClick = function(){
					me.delayClick = false;
				}
				
				//延迟发送点击事件
				me.clickDaley = new Cmp.util.DelayedTask({
					delay : 500,				
					handler : me.finishDaleyByClick,
					scope : me			
				});
			} 
			TreeView.prototype = {
				
				/**
				 * 在指定的容器上渲染指定树
				 */
				render : function(tree, target){
					var me = this;
					if(me.tree){
						//已经绘制过了
						return ;
					}
					me.tree = tree;
					me.treeBox = target;
					
					if(tree.useArrow){
						target.addClass('c-tree-usrarrow');
					}
					
					
					me.mask = target.createChild({
						cls : 'c-tree-mask'
					});
					me.mask.setHideModal('display');
					me.mask.hide();
					var rootView = me.renderTreeNode(tree.root, me.treeBox);
					
					if(tree.hidderRoot){
						//隐藏了根节点，需要展开这个跟
						rootView.node.treeLayer = -1;
						rootView.itemBox.setStyle('display','none');
						me.doExtendNode(rootView);
					}
				},
				/**
				 * @private
				 * 绘制一个节点
				 */
				renderTreeNode : function(node, box){
					var me = this;
					if(isO(node)){
						if(!isF(node.getId)){
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
				createTreeNodeView : function(node){
					return new nodeViewClazz(node);
				},
				/**
				 * @public
				 * 获得指定节点所对应的渲染器实例
				 * @param {String/Object/TreeNode} node
				 * @return {TreeNodeView} 
				 */
				getNodeView : function(node){
					var me = this;
					if(isO(node)){
						if(isF(node.getId)){
							node = node.getId();
						}
						else{
							node = node.id;
						}
					}
					
					if(isS(node)){
						return me.nodeViews[node];
					}
					return undefined;
				},
				/**
				 * @private
				 * 响应树节点上的展开/收缩触发器被点击时的处理
				 * @param {String/Object/TreeNode} node
				 */
				onClickArrow : function(node){
					var me = this,
						v = me.getNodeView(node);
					if(!v){
						return ;
					}
					
					if(v.isExtended()){
						me.doCollectNode(v);
					}
					else{
						me.doExtendNode(v);
					}
				},
				/**
				 * @private
				 * 响应点击树节点上事件
				 */
				onClickNode : function(node){
					var me = this,
						v = me.getNodeView(node);
					if(!v){
						return ;
					}
					if(!me.delayClick){
		//				putLog('TreeView#onClickNode>');
						me.delayClick = true;
						
						var acv = me.activedView;
						
						if(acv){
							acv.unselect();
						}
						
						if(!acv || acv.getId() !== v.getId()){
							v.select();
							me.activedView = v;
						}
						else{
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
				onDbClickNode : function(node){
					var me = this,
						v = me.getNodeView(node);
					if(v){
						me.tree.fireEvent('dblclicknode', v.node, me.tree);
					}	
				},
				/**
				 * @private
				 * 展开指定的节点
				 */
				doExtendNode : function(nodeView, cb, scope){
					var me = this,
						node = nodeView.node;
					
					if(!nodeView.isRenderedForChildren()
						|| node.isAlwaysReload()){
						//没有绘制过子节点或者是需要每次都去获取子节点
						me.mask.show();
						nodeView.showLoding();
						node.getChildren(function(cns){
							me.mask.hide();
							nodeView.hideLoading();
							var box = nodeView.getChildrenBox(),
								i = 0,
								len = isA(cns) ? cns.length : 0,
								cn;
							
							//清空之前的
							nodeView.clearChilden();
							
							if(len > 0){
								for(;i<len;i++){
									cn = me.renderTreeNode(cns[i], box);
									if(cn){
										nodeView.addChild(cn);
									}
								}
							}
							else{
								cn = me.renderEmptyChild(box, node.getTreeLayer());
								if(cn){
									nodeView.addChild(cn);
								}
							}
							
							
							nodeView.extend();
						
							me.tree.fireEvent('extendednode', node, me.tree);
							
							if(isF(cb)){
								cb.call(scope);
							}
						});
					}
					else{
						nodeView.extend();
						me.tree.fireEvent('extendednode', node, me.tree);
						if(isF(cb)){
							cb.call(scope);
						}
					}
					
				},
				/**
				 * @private
				 * 收缩指定的节点
				 */
				doCollectNode : function(nodeView){
					var me = this;
					nodeView.collend();
					me.tree.fireEvent('collectednode', nodeView.node, me.tree);
				},
				/**
				 * @private
				 * 在指定的位置添加一个表示空子节点的虚拟节点；
				 * @reutrn {Element} 
				 */
				renderEmptyChild : function(box, lv){
					var me = this,el;
					s = 0.8*(lv+2)+'rem';
					
					el = box.createChild({
						cls : 'c-treenode c-treenode-empty',
						html : '<div class="c-treenode-item" style="padding-left:'+s+';"><div class="c-treenode-warp">空</div></div>'
					});
				}
			}			
			return TreeView;
		}
	});
}());