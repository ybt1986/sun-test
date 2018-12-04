/**
 * 表格组件中的带有CheckBox选择控件的行选择功能控制器
 *
 * @class Cmp.grid.CheckboxSelectionModel
 * @extend Cmp.grid.RowSelectionModel
 * @implement Cmp.grid.Column
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){
	var HTML = '<i class="fa"></i>';
	
	Cmp.define('Cmp.grid.CheckboxSelectionModel',{
		extend : 'Cmp.grid.RowSelectionModel',
		factory : function(ext){
			var superClass = ext.prototype;
			return Cmp.extend(ext, {
				/**
				 * @overwrite
				 */
				setSelections : function(ss){
					var me = this;
					var count = isA(ss) ? ss.length : 0,
						rowCount = me.grid.getRowModel().getCount();
					superClass.setSelections.call(me, ss);
					if(0 === count){
						if(me.headCls){
							me.headBox.removeClass(me.headCls);
							me.headCls = undefined;
						}
					}
					else if(rowCount === count){
						var cls = 'c-grid-checkboxsel-full';
						if(me.headCls !== cls){
							if(me.headCls){
								me.headBox.removeClass(me.headCls);
							}
							me.headBox.addClass(cls);
							me.headCls = cls;
						}
					}
					else{
						var cls = 'c-grid-checkboxsel-part';
						if(me.headCls !== cls){
							if(me.headCls){
								me.headBox.removeClass(me.headCls);
							}
							me.headBox.addClass(cls);
							me.headCls = cls;
						}
					}
				},
				/**
				 * @impl Cmp.grid.Column#getColumnWidth()
				 */
				getColumnWidth : function(){
					return this.columnWidth || 0;
				},
				/**
				 * 绘制头部
				 * @impl Cmp.grid.Column#renderHead()
				 * @param {Element} box 承载头部内容的Element
				 * @param {Number} colIndex 该列次序值
				 * @param {TableModel} data 所在表格绑定的数据源
				 */
				renderHead : function(box, colIndex, data){
					var me = this;
					box.addClass('c-grid-checkboxsel');
					if(true !== me.single){
						box.update(HTML);
						box.on('click', me.onClickHeadBox, me);
					}
					
					if(isN(me.width)){
						me.width = me.width+'px';
					}
					if(isS(me.width)){
						box.setWidth(me.width);
					}
					me.columnWidth = box.getWidth();
					me.headBox = box;
				},
				/**
				 * @private
				 */
				onClickHeadBox : function(ev){
					var me = this,
						rows = me.grid.getRowModel().getRows(),
						i=0,len = rows.length,r;
					if('c-grid-checkboxsel-full' === me.headCls){
						//当前为全部选中状态；
						for(;i<len;i++){
							me.unSelected(rows[i]);
						}
						
						me.clearSelection();
					}
					else{
						//部分选中或一个都没选中；
						var ss = [];
						for(;i<len;i++){
							r = rows[i];
							me.toSelected(r);
							ss.push(r.record);
						}
						me.setSelections(ss);
					}
				},
				/**
				 * 获知表体中该列的一个单元格。
				 * @impl Cmp.grid.Column#renderCell()
				 *
				 * @param {Element} box 承载头部内容的Element
				 * @param {Record} record 该行数据
				 * @param {Element} row 显示该行数据的Element
				 * @param {Number} rowIndex 该行数据所在的次序值
				 * @param {Number} colIndex 该列次序值
				 * @param {TableModel} data 所在表格绑定的数据源
				 * @return {Object} 绘制该单元格时用的从record获取的原始值
				 */
				renderCell : function(box, record, row, rowIndex, colIndex, data){
					var me = this;
					box.addClass('c-grid-checkboxsel');
					box.update(HTML);
					if(isS(me.width)){
						box.setWidth(me.width);
					}
				}
			});
		}
	});
}());