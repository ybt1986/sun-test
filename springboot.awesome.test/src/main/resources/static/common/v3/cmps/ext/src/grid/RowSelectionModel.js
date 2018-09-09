/**
 * 表格组件中的行选择功能控制器
 *
 * @class Cmp.grid.RowSelectionModel
 * @extend Cmp.grid.SelectionModel
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){

	Cmp.define('Cmp.grid.RowSelectionModel',{
		extend : 'Cmp.grid.SelectionModel',
		factory : function(ext){
			var superClass = ext.prototype;
			
			
			return Cmp.extend(ext, {
				/**
				 * @cfg {Boolean} single 等于true时表示为单行选中模式，否则为多行选中。默认为false.
				 */
				/**
				 * @overwrite
				 */
				initStyle : function(grid){
					var me = this;
					superClass.initStyle.call(me, grid);
					if(me.isAllowedSelect() && grid && grid.el){
						grid.el.addClass('c-grid-rowselect');
					}
					me.rows = {};
				},
				/**
				 * @overwrite
				 */
				bindRowEvent : function(row){
					var me = this;
					if(me.isAllowedSelect()){
						row.on('click', me.onClickRow, me);
					}
				},
				/**
				 * @overwrite
				 */
				releaseRowEvent : function(row){
					var me = this;
					row.un('click', me.onClickRow, me);
				},
				/**
				 * @private
				 */
				onClickRow : function(event, row){
					var me = this,
						rid = row.getId();
					if(row.selected){
						me._removeSelection(row);
						me.unSelected(row);
					}	
					else{
						me._addSelection(row);
						me.toSelected(row);
					}
				},
				/**
				 * @private
				 */
				_addSelection : function(row){
					var me = this,
						r = row.record;
					if(!me.single){
						var ss = me.getSelections();
						if(ss){
							ss.push(r);
						}
						else{
							ss = [r]; 
						}
						me.setSelections(ss);
					}
					else{
						if(me.selectedRow){
							me.unSelected(me.selectedRow);
						}
						me.setSelections([r]);
						me.selectedRow = row;
					}
				},
				/**
				 * @private
				 */
				_removeSelection : function(row){
					var me = this;
					if(me.single){
						//单选
						me.setSelections();
						me.selectedRow = undefined;
					}
					else{
						//多选
						var ss = me.getSelections(),
							r = row.record;
						ss = ss.slice(0);
						for(var i=0,len = ss.length;i<len;i++){
							if(ss[i] === r){
								ss.splice(i, 1);
								break;
							}
						}
						me.setSelections(ss);
					}
				},
				/**
				 * @private
				 */
				toSelected : function(row){
					row.el.addClass('c-grid-selected');
					row.selected = true;	
				},
				/**
				 * @private
				 */
				unSelected : function(row){
					row.el.removeClass('c-grid-selected');
					row.selected = false;	
				}
			});
		}
	});
}());