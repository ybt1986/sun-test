/**
 * 纵向结构树显示面板
 *
 * @class Cmp.tree.TreePanel
 * @extend Cmp.Widget
 * 
 * @version 2.1.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){
	/**
	 * 展开树上指定的节点
	 */
	var extendNodes = function(tree, nodes){
		var view = tree.getView(),
			i=0,len = nodes.length,v;
		
		for(;i<len;i++){
			v = view.getNodeView(nodes[i]);
			if(!v || v.isExtended()){
				//不存在，或者是已经处于展开状态
				continue;
			}
			else{
				//存在，并且没有展开呢；
				view.doExtendNode(v, function(){
					extendNodes(tree, nodes);
				});
				
				return;
			}
		}	
	}
	
	Cmp.define('Cmp.tree.TreePanel',{
		extend : 'Cmp.Widget',
		requires : [
			'Cmp.tree.TreeView'
		],
		cls : true,
		factory : function(ext, reqs){
			var superClazz = ext.prototype,
				treeViewClazz = reqs[0];
			
			return Cmp.extend(ext, {
				/**
				 * @cfg {Boolean} useArrow 等于true时使用箭头形式来表现节点的展开/收缩状态；等于false时使用加/减号来表现。
				 *		默认为false。
				 */
				
				/**
				 * @cfg {TreeNode/Object} root 树根节点或者是创建根节点的配置对象 
				 */
				
				/**
				 * @cfg {Boolean} hidderRoot 等于true时，隐藏根节点。
				 */
				
				/**
				 * @cfg {TreeLoader} treeLoader 子节点数据读取器; 当树上有节点为异步获取子节点时，会使用该配置。
				 */
				 
				/**
				 * @cfg {String/Array} extendNode 初始时，需要展开的节点。
				 *		注意：因为节点可能采用的异步获取子节点的形式；因此在配置展开节点的时候，要从根向下进行配置。
				 */ 
				/**
				 * 获得该树所配置的子节点数据读取器。
				 * @return {TreeLoader} 子节点数据读取器
				 */
				getLoader : function(){
					return this.treeLoader;
				},
				/**
				 * 更新指定树节点的显示内容
				 * @parm {TreeNode/Object} node 树节点显示配置(全量)；如果是一个对象，那么必须配置有id属性；
				 */
				updateNodeView : function(node){
					//TODO
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,
						cls = me.cls;
					
					if(isA(cls)){
						cls.unshift('c-tree');
					}	
					else if(isS(cls)){
						cls = ['c-tree',cls];
					}
					else{
						cls = 'c-tree';
					}
					me.cls = cls;
					superClazz.initComponent.call(me);
					me.addEvents(
						/**
						 * @event
						 * 双击节点发生变化后，分发此事件
						 * @param {TreeNode} node 双击的节点
						 * @param {TreePanel} this
						 */
						'dblclicknode',
						/**
						 * @event
						 * 选中的节点发生变化后，分发此事件
						 * @param {TreeNode} node 当前选中的节点
						 * @param {TreePanel} this
						 */
						'selectedchange',
						/**
						 * @event
						 * 节点展开后，分发此事件
						 * @param {TreeNode} node 收缩的节点
						 * @param {TreePanel} this
						 */
						'extendednode',
						/**
						 * @event
						 * 节点收缩后，分发此事件
						 * @param {TreeNode} node 收缩的节点
						 * @param {TreePanel} this
						 */
						'collectednode'
					);
				},
				/**
				 * @private
				 * 获得实际控制该部件进行渲染得树渲染其
				 */
				getView : function(){
					var me = this;
					if(!me.view){
						me.view = new treeViewClazz();
					}
					return me.view; 
				},
				/**
				 * @private
				 * @overwrite
				 */
				doRender : function(){
					var me = this;
					superClazz.doRender.call(me);
					var view = me.getView();
					view.render(me, me.el);
					
					var ens = isS(me.extendNode) ? [me.extendNode] : me.extendNode;
					if(isA(ens) && ens.length > 0){
						extendNodes(me, ens);
					}
					delete me.extendNode;
				},
				/**
				 * 获得当前选中的树节点；
				 */
				getSelected : function(){
					var me = this,
						v = me.getView().activedView;
					if(v){
						return v.node;
					}	
					return undefined;
				}
			});
		}
	});
}());