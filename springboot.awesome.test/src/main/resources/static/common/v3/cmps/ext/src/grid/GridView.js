/**
 * 表格部件的绘制控制器。负责具体的绘制工作。
 * 
 * @class Cmp.grid.GridView
 * @extend Object
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){
	/**
	 * @private 
	 */
	var DH = Cmp.util.DomHelper;
	
	var EMPTY_TABEL_HTML = ['<table cellpadding="0" cellspacing="0">'];
	EMPTY_TABEL_HTML.push('<tbody></tbody></table>');
	EMPTY_TABEL_HTML = EMPTY_TABEL_HTML.join('');
	
	/**
	 * @private
	 * 数据模型发生变化时调用的方法
	 */
	var onDataChanged = function(){
		var me = this,
			view = me.view,
			grid = me.grid;
		grid.getSelectionModel().clearSelection();	
		view.renderBody(grid);	
		view.layoutRows(grid);
	}
	/**
	 * @constructor
	 */
	var GridView = function(cfg){
		var me = this;
		if(isO(cfg)){
			Cmp.apply(me, cfg);
		}
	}
	GridView.prototype = {
		/**
		 * 渲染指定的表格组件
		 * @param {GridPanel} grid 所渲染的表格
		 */
		render : function(grid){
			var me = this,
				box = grid.body || grid.el,
				el,o;
			
			//
			if(true !== grid.hideHeader){
				el = box.createChild({
					cls : 'c-grid-head',
					html : '<div class="c-grid-row"></div>'
				});
				grid.headBox = Cmp.get(el.dom.firstChild);
				me.renderHead(grid);
				grid.headWarp = el;
			}
			else{
				box.addClass('c-grid-noheader');
			}
			
			el = box.createChild({
				cls : 'c-grid-body',
				html : '<div class="c-grid-bodybox"></div>'
			});
			grid.bodyBox = Cmp.get(el.dom.firstChild);
			me.renderBody(grid);
			
			//表底部
			o = grid.footer;
			if(o){
				if(isO(o) 
					&& !isF(o.render)){
//					o = new PK.PagingBar(o);
					o = false;
				}
				if(!o || !isF(o.render)){
					o = false;
				}
			}
			
			if(o){
				el = box.createChild({
					cls : 'c-grid-foot',
					html : '<div class="c-grid-footbox"></div>'
				});
				grid.footBox = Cmp.get(el.dom.firstChild);
				o.render(grid.footBox);
				grid.footer = o;
			}
			else{
				box.addClass('c-grid-nofoot');
			}
			
			var sm = grid.getSelectionModel();
			if(sm){
				if(isF(sm.initStyle)){
					sm.initStyle(grid);
				}
			}
			if(grid.striped){
				box.addClass('c-grid-striped');
			}
			
			//绑定事件
			if(grid.headWarp){
				grid.bodyBox.on('scroll', function(){
					grid.headWarp.dom.scrollLeft = grid.bodyBox.dom.scrollLeft;
				});
			}
			me.bindDataEvent(grid);
			
			me.layoutRows(grid, true);
		},
		/**
		 * @private
		 */
		bindDataEvent : function(grid){
			if(grid.data && isF(grid.data.on)){
				grid.data.on('changed', onDataChanged, {
					view : this,
					grid : grid
				});
			}
		},
		/**
		 * @private
		 */
		releaseDataEvent : function(grid){
			if(grid.data && isF(grid.data.un)){
				grid.data.un('changed', onDataChanged, {
					view : this,
					grid : grid
				});
			}
		},
		/**
		 * @private
		 */
		layoutRows : function(grid, includHead){
			var cm = grid.getColumnModel(),
				i=0, len = cm.getCount(),c,
				rw = grid.bodyBox.getScrollWidth(),
				bw = grid.bodyBox.getWidth(),	
				rm = grid.getRowModel(),
				w = 0;
				
			for(;i<len;i++){
				c = cm.getColumn(i);
				w += c.getColumnWidth();
			}
			
			if(rm.getRowsHeight() > grid.bodyBox.getHeight()){
				bw = bw - rw;
			}
			
			w = bw > w ? bw : w;
			
			
			rm.setRowWidth(w);
			
			if(includHead){
				grid.headBox.setWidth(w+rw);
			}
		},
		/**
		 * @private
		 * 渲染指定表格中的表头部分
		 * @param {GridPanel} grid 表格
		 */
		renderHead : function(grid){
			var box = grid.headBox,bd,cm,tr,td,inner;
			if(!box){
				return ;
			}
			box.update(EMPTY_TABEL_HTML);
			bd = box.dom.firstChild.firstChild;
			cm = grid.getColumnModel();
			var i=0, len = cm.getCount(),c;
			tr = DH.createDom({tag:'tr',parentNode:bd});
			for(;i<len;i++){
				c = cm.getColumn(i);
				td = DH.createDom({tag:'td',parentNode:tr});
				inner = Cmp.get(DH.createDom({tag:'div',parentNode:td,cls:'c-grid-cell'}));
				c.renderHead(inner, i, grid.data);
			}
		},
		/**
		 * 渲染指定表格中的主体部分
		 * @param {GridPanel} grid 表格
		 */
		renderBody : function(grid){
			var me = this,
				box = grid.bodyBox,
				rm = grid.getRowModel(),
				data = grid.data,
				rs = data && isF(data.getRecords) ? data.getRecords() : [];
			rm.renderRows(box, rs);
		}
	};
	
	
	
	Cmp.define('Cmp.grid.GridView',{
		factory : function(){
			return GridView;
		}
	});
}());