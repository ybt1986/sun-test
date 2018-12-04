/**
 * 表格选择功能控制器
 *
 * @abstract
 * @class Cmp.grid.SelectionModel
 * @extend Object
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){

	var SelectionModel = function(cfg){
		var me = this;
		if(cfg){
			Cmp.apply(me, cfg);
		}
		me.inited = false;
	}
	SelectionModel.prototype = {
		/**
		 * 初始化表格样式；
		 * @param {GridPanel} grid 表格实例
		 */
		initStyle : function(grid){
			var me = this;
			me.grid = grid;
			grid.addEvents(
				/**
				 * @event
				 * 选择发生变化后，分发此事件
				 * @param {SelectionModel} this
				 */
				'selchanged'
			);
		},
		/**
		 * 返回true表示允许进行选中操作
		 * 
		 */
		isAllowedSelect : function(){
			return !this.noselect;
		},
		/**
		 * 获得当前选中的数量
		 */
		getCount : function(){
			var me = this;
			if(me.noselect){
				return 0;
			}
			return isA(me.selections) ? me.selections.length : 0;
		},
		/**
		 * 清空所有选择的数据，并分发选择变化事件。
		 *　该方法相当于无参数调用了setSelections
		 */
		clearSelection : function(){
			this.setSelections();
		},
		/**
		 * 设定选中的内容。并分发选择变化事件。
		 * @param {Array} sels 已选中的数据,具体格式根据不同的选择模型控制器有所不同。
		 */
		setSelections : function(sels){
			var me = this;
			if(me.noselect){
				return ;	
			}
			me.selections = sels;
			me.fireEvent('selchanged', me, me.grid);
		},
		/**
		 * 获得当前选择的内容
		 * @return {Array} 已选中的数据,具体格式根据不同的选择模型控制器有所不同。
		 */
		getSelections : function(){
			var me = this;
			if(me.noselect){
				return [];	
			}
			return me.selections;
		},
		/**
		 * 获得最后选中的内容。
		 * @return {Object} 最后选中的数据,具体格式根据不同的选择模型控制器有所不同。
		 */
		getSelected : function(){
			var me = this;
			if(me.noselect){
				return undefined;	
			}
			return isA(me.selections) && me.selections.length > 0 ?
				me.selections[me.selections.length-1] : undefined;
		},
		/**
		 * 绑定行事件
		 * @param {Row} row 表格中每一行的数据信息
		 */
		bindRowEvent : Cmp.emptyFn, 
		/**
		 * 释放行事件
		 * @param {Row} row 表格中每一行的数据信息
		 */
		releaseRowEvent : Cmp.emptyFn,
		/**
		 * 绑定单元格事件
		 *
		 * @param {Element} cell 单元格的承载容器
		 * @param {Object} value 单元格上显示的值
		 * @param {Record} record 绘制该行的数据
		 * @param {Number} rowIndex 该单元格在当前表格上的行次序
		 * @param {Number} colIndex 该单元格在当前表格上的列次序
		 */ 
		bindCellEvent : Cmp.emptyFn, 
		/**
		 * 释放单元格事件
		 * @param {Element} cell 单元格的承载容器
		 * @param {Number} rowIndex 该单元格在当前表格上的行次序
		 * @param {Number} colIndex 该单元格在当前表格上的列次序
		 */ 
		releaseCellEvent : Cmp.emptyFn,
		/**
		 * @private
		 */
		fireEvent : function(){
			var grid = this.grid;
			if(grid){
				grid.fireEvent.apply(grid, arguments);
			}
		}
	};
	Cmp.define('Cmp.grid.SelectionModel',{
		factory : function(){
			return SelectionModel;
		}
	});
}());