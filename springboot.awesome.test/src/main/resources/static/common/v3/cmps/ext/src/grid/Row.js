/**
 * 表格中每一行的数据信息。
 * @class Cmp.grid.Row
 * @extend Object
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){

	var DH = Cmp.util.DomHelper;
	var EMPTY_TABEL_HTML = ['<table cellpadding="0" cellspacing="0">'];
	EMPTY_TABEL_HTML.push('<tbody></tbody></table>');
	EMPTY_TABEL_HTML = EMPTY_TABEL_HTML.join('');
	
	var Row = function(record, rowIndex, grid){
		var me = this;
		me.record = record;
		me.rowIndex = rowIndex;
		me.grid = grid;
		me.cells = [];
		me.events = {};
	}
	Row.prototype = {
		/**
		 * 在绘制行的Element上添加一个事件监听方法;调用回调方法时参数1为事件数据,参数2为该行
		 * 
		 * @param {String} eventName 事件名
		 * @param {String} handler 回调方法
		 * @param {String} scope 调用回调方法时设定的this对象
		 */
		addListener : function(eventName, handler, scope){
			if(!eventName || !isF(handler)){
				return ;
			}
			var me = this,
				en = me.events[eventName];
				
			if(!en){
				en = new Cmp.util.EventProxy();
				me.events[eventName] = en;
				
				if(me.rendered){
					me.el.on(eventName, me.onEvent, me);
				}
			}	
			
			en.addListener(handler, scope);
		},
		/**
		 * 在绘制行的Element上移除一个事件的监听;
		 * @param {String} eventName 事件名
		 * @param {String} handler 回调方法
		 * @param {String} scope 调用回调方法时设定的this对象
		 */
		removeListener : function(eventName, handler, scope){
			if(!eventName || !isF(handler)){
				return ;
			}
			var me = this,
				en = me.events[eventName];
			if(en){
				en.removeListener(handler, scope);
			}	
		},
		/**
		 * 获得该行占用高度
		 */
		getHeight : function(){
			var me = this;
			if(me.el){
				return me.el.getHeight();
			}
			return 0;
		},
		/**
		 * 设定该行的宽度
		 */
		setWidth : function(w){
			var me = this;
			if(me.el){
				me.el.setWidth(w);
			}
		},
		/**
		 * 获得该行键值
		 */
		getId : function(){
			var me = this;
			if(!me.id){
				me.id = 'Row-'+me.rowIndex;
			}
			return me.id;
		},
		/**
		 * 在指定的容器内绘制该行
		 */
		render : function(box){
			var me = this,
				g = me.grid,
				cm = g.getColumnModel(),
				sm = g.getSelectionModel(),
				row,bd,tr,td,inner,
				cls = ['c-grid-row'];
			if(me.rendered){
				return; 
			}	
			me.rendered = true;
			
			if(isF(g.getRowClass)){
				row = g.getRowClass(me.record, me.rowIndex);
				if(isA(row)){
					cls = cls.concat(row);
				}
				else if(isS(row)){
					cls.push(row);
				}
			}
			
			
			row = box.createChild({
				cls : cls,
				html : EMPTY_TABEL_HTML
			});
			me.el = row;
			bd = row.dom.firstChild.firstChild;
			tr = DH.createDom({tag:'tr',parentNode:bd});
			var i=0, len = cm.getCount(),c;
			
			for(;i<len;i++){
				td = DH.createDom({tag:'td',parentNode:tr});
				inner = Cmp.get(DH.createDom({tag:'div',parentNode:td,cls:'c-grid-cell'}));
				me.cells.push({
					el : inner,
					rowIndex : me.rowIndex,
					colIndex : i
				});
				c = cm.getColumn(i);
				c = c.renderCell(inner, me.record, row, me.rowIndex, i, g.data);
				if(sm){
					sm.bindCellEvent(inner, c, me.record, me.rowIndex, i);
				}
			}
			
			if(sm){
				sm.bindRowEvent(me);
			}
			
		},
		/**
		 * 移除该行
		 */
		remove : function(){
			var me = this,
				sm = me.grid.getSelectionModel(),
				cs = me.cells,
				i,len,o;
			
			//注销选择控制器的事件监听
			if(sm){
				//单元格
				for(i=0,len = cs.length; i<len;i++){
					c = cs[i];
					sm.releaseCellEvent(c.el, c.rowIndex, c.colIndex);
				}
				
				//行
				sm.releaseRowEvent(me);
			}
			
			//事件代理
			cs = me.events;
			for(i in cs){
				c = cs[i];
				me.el.un(i, me.onEvent, me);
				c.destory();
			}
			
			me.el.remove();
		},
		/**
		 * @private
		 */
		onEvent : function(ev){
			var me = this,
				type = ev.type,
				en = me.events[type];
			if(en){
				en.fire(ev, me);
			}	
		}
	};
	
	Row.prototype.on = Row.prototype.addListener;
	Row.prototype.un = Row.prototype.removeListener;
	
	Cmp.define('Cmp.grid.Row',{
		factory : function(){
			return Row;
		}
	});
}());