/**
 * 树节点的数据描述类；
 * 
 * @class Cmp.tree.TreeNode
 * @extend Object
 * 
 * @version 2.1.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){
	/**
	 * @constructor
	 */
	var TreeNode = function(cfg){
		cfg = cfg || {};
		var me = this,
			id = cfg.id || buildId(),
			leaf = !!cfg.leaf,
			async = !!cfg.async,
			alwaysReload = !!cfg.alwaysReload,
			_tree;
		if(!async){
			//不需要异步获取，需要创建子节点对象
			var cns = [],
				cs = cfg.children,
				i=0, len = isA(cs) ? cs.length : 0,
				c;
			for(;i<len;i++){
				c = new TreeNode(cs[i]);
				cns.push(c);
				c.parent = me;
			}
			me.childNodes = cns;	
		}
		
		me.data = {id:id};
		Cmp.apply(me.data, cfg);
		
		delete me.data.leaf;
		delete me.data.async;
		delete me.data.children;
		delete me.data.alwaysReload;
		/**
		 * 返回节点标识ID
		 */
		me.getId = function(){
			return id;
		},
		
		/**
		 * 返回true表示需要采用异步获取形式获取子节点
		 */
		me.isAsync = function(){
			return async;
		}
		/**
		 * 返回true表示每次展开时都需要采用异步获取形式获取子节点
		 */
		me.isAlwaysReload = function(){
			return async && alwaysReload;
		}
		
		/**
		 * 返回true表示该节点是不可以展开的叶子节点。
		 */
		me.isLeaf = function(){
			return leaf;
		}
		
		/**
		 * 该方法为TreePanel专用方法。
		 * 将该节点绑定在指定的树上。
		 * @param {TreePanel} tree
		 */
		me.bindTree = function(tree){
			_tree = tree;
		},
		/**
		 * 获得该节点所绑定的树
		 * @return {TreePanel} 
		 */
		me.getTree = function(){
			return _tree;
		}
	}
	TreeNode.prototype = {
		/**
		 * @cfg {String} id (可选)树节点标识ID，在树中这个ID应该是唯一的。
		 */
		/**
		 * @cfg {String/Array} icon (可选)文字的前置图标的配置CSS样式或样式名组成的数组。
		 */
		/**
		 * @cfg {String} text (可选)显示文字。
		 */
		
		/**
		 * @cfg {Boolean} leaf (可选)等于true时表示此节点是不可以展开的叶子节点。默认为false。
		 */
		
		/**
		 * @cfg {Array} children (可选)子节点配置；当async等于true时该配置无效。
		 */
		
		/**
		 * @cfg {Boolean} async (可选配置，leaf不等于true时有效)等于true时表示获取该节点的子节点时需要采用异步形式，
		 *		暨通过绑定树的TreeLoader获取子节点。默认为false。
		 */
		
		/**
		 * @cfg {Boolean} alwaysReload (可选配置，leaf不等于true且async等于true时有效)等于true时表示每次一展开该节点时
		 *		都需要重新从绑定树的TreeLoader获取子节点。默认为false。
		 */
		
		/**
		 * 获得该节点文字的前置图标
		 */
		getIcon : function(){
			return this.data.icon;
		},
		/**
		 * 设定该节点文字的前置图标，如果该节点已经被绑定在某棵树上，则同时更新其显示。
		 * 
		 */
		setIcon : function(icon){
			//TODO
		},
		/**
		 * 获得该节点显示的文字
		 * @return {String} text 显示文字。
		 */
		getText : function(){
			return this.data.text;
		},
		/**
		 * 设定该节点显示的文字，如果该节点已经被绑定在某棵树上，则同时更新其显示。
		 */
		setText : function(text){
			var me = this,
				t = me.getTree();
			if(t){
				if(me.editing){
					//编辑状态
					me.editCache.text = text;
				}
				else{
					me.data.text = text;
				}
				t.updateNodeView(me);
			}
			else{
				me.data.text = text;
			}	
		},
		/**
		 * 获得此节点的父节点
		 * @return {TreeNode} 父节点实例；
		 */
		getParent : function(){
			return this.parent;
		},
		/**
		 * 获得该节点在所绑定树上的深度级别；
		 * 如果该节点为根节点，返回值为0；
		 */
		getTreeLayer : function(){
			var me = this;
			if(isN(me.treeLayer)){
				return me.treeLayer;
			}
			else{
				var p = me.getParent();
				if(p){
					me.treeLayer = p.getTreeLayer()+1;
				}
				else{
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
		getChildren : function(cb, scope){
			var me = this;
			if(me.isLeaf()){
				Cmp.invoke(cb, scope,[]);
			}
			else if(me.isAsync()){
				//异步形式
				if(!isA(me.childNodes) || me.isAlwaysReload()){
					//还没有获取过子节点，或者是每次都需要获取子节点；需要使用TreeLoader获取
					var loader = me.getTree();
					if(loader){
						loader = loader.getLoader();
						if(loader && isF(loader.load)){
							loader.load(me, function(os){
								var i=0,
									len = isA(os) ? os.length : 0,
									c,cns = [];
								
								for(;i<len;i++){
									c = new TreeNode(os[i]);
									c.parent = me;
									cns.push(c);
								}
								
								me.childNodes = cns;
								Cmp.invoke(cb, scope,[cns]);
							});
							return ;
						}
					}
					Cmp.invoke(cb, scope,[]);
				}	
			}
			else{
				Cmp.invoke(cb, scope,[me.childNodes]);
			}
		},
		/**
		 * 使该节点进入编辑状态。此后对该节点进行的set操作将不会同步到显示上。直到调用submitEdit或endEdit方法。
		 */
		startEdit : function(){
			
		},
		/**
		 * 提交属性编辑内容使之同步到显示上，然后继续保持编辑状态。
		 */
		submitEdit : function(){
			//TODO
		},
		/**
		 * 提交属性编辑并结束编辑状态。
		 */
		endEdit : function(){
			//TODO
		}
	};
	
	
	Cmp.define('Cmp.tree.TreeNode',{
		factory : function(){
			return TreeNode;
		}
	});
}());