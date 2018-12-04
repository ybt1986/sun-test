/**
 * 树节点的绘制渲染器
 *
 * <p>
 * @class Cmp.tree.TreeNodeView
 * @extend Object
 * 
 * @version 2.1.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){
	
	var seq = 10000,
		buildId = function(){
			return 'tv-'+(++seq);
		},
		HTML_TMP,
		html = [];
	
	//节点前的	
	html.push('<div class="c-treenode-warp">');
	//打开/关闭/节点图标+
	html.push('<div class="c-treenode-trigger"><span class="arrow"></span><span class="node"></span></div>');
	//内容区
	html.push('<div class="c-treenode-inner">');
	html.push('<div class="c-treenode-body"><span class="icon"></span><span class="text"></span></div>');
	html.push('</div></div>');
	HTML_TMP = html.join('');
	
	TreeNodeView = function(node){
		var me = this;
		me.node = node;
		me.id = buildId();
	}
	TreeNodeView.prototype = {
		/**
		 * 
		 */
		getId : function(){
			return this.id;
		},
		/**
		 * 返回true表示正处于展开状态
		 */
		isExtended : function(){
			return !!this.extended;
		},
		/**
		 * 将该节点的状态置为收缩状态
		 */
		collend : function(){
			var me = this;
			if(me.isExtended()){
				me.itemBox.removeClass('c-treenode-extended');
				me.childrenBox.hide();
				me.extended = false;
			}
		},
		/**
		 * 将该节点的状态置为展开状态
		 * 展开该节点
		 */
		extend : function(){
			var me = this;
			if(!me.isExtended()){
				me.itemBox.addClass('c-treenode-extended');
				me.childrenBox.show();
				me.extended = true;
			}
		},
		/**
		 * 返回true表示该节点为选中状态
		 */
		isSelected : function(){
			return !!this.selected;
		},
		/**
		 * 将该节点置为选中状态
		 */
		select : function(){
			var me = this;
			if(!me.isSelected()){
				me.itemBox.addClass('c-treenode-selected');
				me.selected = true;
			}
		},
		/**
		 * 将该节点置为非选中状态
		 */
		unselect : function(){
			var me = this;
			if(me.isSelected()){
				me.itemBox.removeClass('c-treenode-selected');
				me.selected = false;
			}
		},
		/**
		 * 显示为读取状态
		 */
		showLoding : function(){
			var me = this,
				oldCls = me.nodeIconBox.dom.className;
			
			me.nodeIconBox.dom.className = 'fa fa-spinner fa-pulse';
			me.nodeIconBox.oldCls = oldCls;	
		},
		/**
		 * 隐藏读取状态，恢复之前的状态
		 */
		hideLoading : function(){
			var me = this;
			me.nodeIconBox.dom.className = me.nodeIconBox.oldCls;
			delete 	me.nodeIconBox.oldCls;
		},
		/**
		 * 获得承载子节点的承载容器
		 */
		getChildrenBox : function(){
			var me = this;
			if(!me.childrenBox){
				me.childrenBox = me.el.createChild({
					cls : 'c-treenode-childbox'
				});
				me.childrenBox.setHideModal('display');
				me.childrenBox.hide();
			}
			return me.childrenBox;
		},
		/**
		 * 清空挂在该节点下的子孙节点的渲染器
		 */
		clearChilden : function(){
			var me = this,
				vs = me.childViews,
				i = 0,
				len = isA(vs) ? vs.length : 0;
			for(;i<len;i++){
				vs[i].remove();
			}
			me.childViews = undefined;
		},
		/**
		 * 从显示的树上，删除该节点的渲染器实例；如果之下包含有子节点，则一并删除。
		 * PS：只是删除渲染器实例，对于数据节点是不负责删除的。
		 */
		remove : function(){
			var me = this;
			//先删除子节点
			me.clearChilden();

			//清除指向数据对象的引用
			delete me.node;
			
			//删除本身
			me.el.remove();
		},
		
		
		/**
		 * 添加一个挂在节点下的子节点
		 */
		addChild : function(view){
			var me = this;
			if(!isA(me.childViews)){
				me.childViews = [];
			}
			me.childViews.push(view);
		},
		/**
		 * 返回true表示渲染过子节点
		 * 
		 */
		isRenderedForChildren : function(){
			return !!this.childrenBox;
		},
		
		/**
		 * @public 
		 * 在指定的容器上渲染所配置的节点
		 * @param {Element} box 容器
		 * @param {TreeView} view 树渲染器
		 */
		render : function(box, view){
			var me = this,
				n = me.node,
				lv = n.getTreeLayer(),
				v,
				dom,subDom,cns;
			
//			putLog('render> node id:'+n.getId()+', text:'+n.getText()+', layer:'+lv);
			
			me.el = box.createChild({
				cls : 'c-treenode'
			});
			me.itemBox = me.el.createChild({
				cls : 'c-treenode-item',
				html : HTML_TMP
			});
			if(lv > 0){
				me.itemBox.setStyle('paddingLeft',0.8*lv+'rem');
			}
			
			
			dom = me.itemBox.dom.firstChild;
			
			me.nodeIconBox = Cmp.get(dom.firstChild.childNodes[1]);
			
			cns = dom.childNodes[1].firstChild.childNodes;
			me.iconBox = Cmp.get(cns[0]);
			me.textBox = Cmp.get(cns[1]);
			
			v = n.getIcon();
			if(isS(v)){
				v = ['icon',v];
			}
			else if(isA(v)){
				v = v.unshift('icon');
			}
			else{
				v = false;
			}
			
			if(v){
				me.iconBox.setClass(v);
				me.itemBox.removeClass('c-treenode-noicon');
			}
			else{
				me.iconBox.setClass('icon');
				me.itemBox.addClass('c-treenode-noicon');
			}
			me.textBox.update(n.getText() || '');
			
			
			
			if(n.isLeaf()){
				me.itemBox.addClass('c-treenode-leaf');
			}
			else{
				me.itemBox.addClass(['c-treenode-folder']);
				subDom = dom.firstChild.firstChild;
				me.arrowBox = Cmp.get(subDom);
				me.arrowBox.on('click', function(ev){
					ev.stopPropagation();
					view.onClickArrow(n);
				});
			}
			
			//单击
			me.itemBox.on('click', function(ev){
				ev.stopPropagation();
				view.onClickNode(n);
			});
			//双击
			me.itemBox.on('dblclick', function(ev){
				ev.stopPropagation();
				view.onDbClickNode(n);
			});		
		}
	}
	
	Cmp.define('Cmp.tree.TreeNodeView',{
		factory : function(){
			return TreeNodeView;
		}
	});
	
}());