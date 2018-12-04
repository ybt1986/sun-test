/**
 * 表格部件中对于行的管理模型；
 * 
 * @class Cmp.grid.RowModel
 * @extend Object
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){
	var UV = Cmp.util.ValueHelper;
	
	Cmp.define('Cmp.grid.RowModel',{
		requires : ['Cmp.grid.Row'],
		factory : function(ext, reqs){
			var rowClass = reqs[0];
			
			var RowModel = function(grid){
				var me = this;
				me.grid = grid;
				me.rows = {};
			}
			RowModel.prototype = {
				/**
				 * 获得当前所有显示行所占用的总高度 
				 */
				getRowsHeight : function(){
					var me = this,h,i,r;
					if(1 > me.getCount()){
						return 0;
					}
					h = 0;
					for(i in me.rows){
						r = me.rows[i];
						h += r.getHeight();
					}
					return h;
				},
				/**
				 * 获得行的数量
				 */
				getCount : function(){
					return this.count;
				},
				/**
				 * 获得当前所有的Row
				 */
				getRows : function(){
					var me = this,
						rows = me.rows,
						i,r,
						rs = [];
					for(i in rows){
						rs.push(rows[i]);
					}	
					
					rs.sort(function(r1, r2){
						var ri1 = UV.toInteger(r1.rowIndex, -1),
							ri2 = UV.toInteger(r2.rowIndex, -1);
						return ri1 - ri2;	
					});
					return rs;
				},
				/**
				 * 清除之前绘制的行
				 */
				clearRows : function(){
					var me = this,
						rows = me.rows,
						i,r;
						
					for(i in rows){
						r = rows[i];
						r.remove();
					}	
					me.rows = {};
					me.count = 0;
				},
				/**
				 * 清除之前绘制内容，重新绘制指定的数据
				 * @param {Element} box
				 * @param {Array} records 由{Record}对象组成的数组。
				 */
				renderRows : function(box, records){
					var me = this,
						i=0,len = records.length || 0,r;
					me.clearRows();
					
					for(;i<len;i++){
						r = me.renderRow(box, records[i], i);
						me.rows[r.getId()] = r;
					}
					me.count = len;
				},
				/**
				 * 设定每行的宽度
				 */
				setRowWidth : function(w){
					var me = this,
						rs = me.rows,
						i,r;
					for(i in rs){
						r = rs[i];
						r.setWidth(w);
					}	
				},
				
				/**
				 * @private
				 */
				renderRow : function(box, record, rowIndex){
					var me = this,
						row = new rowClass(record, rowIndex, me.grid);
						
					row.render(box);	 
					return row;
				}
				
			};
			return RowModel;
		}
	});
}());