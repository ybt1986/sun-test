/**
 * 表格列控制器
 *
 * @class Cmp.grid.ColumnModel
 * @extend Object
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){
	/**
	 * @private {Cmp.grid.Column} Column模块的构造方法；初始化之后有值 
	 */
	var Column;
	
	/**
	 * 
	 */
	var ColumnModel = function(columns){
		var me = this;
		if(isA(columns)){
			var i=0,len = columns.length,c,cols = [];
			for(;i<len;i++){
				c = columns[i];
				if(isO(c)){
					if(!isF(c.renderHead)){
						c = new Column(c);
					}
					cols.push(c);
				}
			}
			me.columns = cols;
		}
		else{
			me.columns = [];
		}
	}
	ColumnModel.prototype = {
		/**
		 * 获得列数量 
		 */
		getCount : function(){
			return this.columns.length;
		},
		/**
		 * 获得指定的列
		 * @param {Number} colIndex 列次序
		 * @return {Column}
		 */
		getColumn : function(colIndex){
			return this.columns[colIndex];
		}
	}
	
	Cmp.define('Cmp.grid.ColumnModel',{
		requires : ['Cmp.grid.Column'],
		factory : function(ext, reqs){
			Column = reqs[0];
			return ColumnModel;
		}
	});
	
	
}());