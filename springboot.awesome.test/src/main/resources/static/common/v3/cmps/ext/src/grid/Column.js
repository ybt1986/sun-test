/**
 * 表格中每一列的绘制工具类
 * @class Cmp.grid.Column
 * @extend Object
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){
	var SORT_BOX_HTML = [],
		toString = Object.prototype.toString;
		
	SORT_BOX_HTML.push('<div class="c-grid-sort-uparrow fa fa-caret-up"></div>');	
	SORT_BOX_HTML.push('<div class="c-grid-sort-downarrow fa fa-caret-down"></div>');
	SORT_BOX_HTML = SORT_BOX_HTML.join('');
	
	var Column = function(config){
		var me = this;
		if(config){
			Cmp.apply(me, config);
		}
		
		me.width = isN(me.width) ? me.width+'px' : me.width;
	}
	Column.prototype = {
		
		/**
		 * @cfg {String} dataIndex 绘制该列单元格时从数据中取值上使用字段索引；如果不设定，则默认取到的值为'';
		 */
		
		/**
		 * @cfg {String} text 该列在表头上的显示文字。
		 */
		
		/**
		 * @cfg {Function} render 绘制单元格的自定义绘制方法。通过该方法获取单元格内的innerHTML字串值。
		 *		如果不设定，则使用取到值的字符串；调用方法时，传入的参数如下：
		 * 			@param {Object} value 取到的原生数据
		 * 			@param {Record} record 该行数据
		 * 			@param {Number} rowIndex 该行数据所在的次序值
		 * 			@param {Number} colIndex 该列次序值
		 * 			@param {TableModel} data 所在表格绑定的数据源
		 */
		
		/**
		 * @cfg {Object} scope 调用render方法时的this对象设定。
		 */
		
		/**
		 * @cfg {String/Number} width 该列宽度设定。如果为一个数值则认为设定的像素值，否则是具体设定值。默认为：'4rem'
		 */
		
		/**
		 * @cfg {Boolean} sortable 等于true时，认为该列可以排序。
		 */
		
		/**
		 * @cfg {Object} style 渲染值单元格时的样式设定；
		 */
		 
		/**
		 * @cfg {Boolean} displayTooltip 等于true时，会将显示值设定到tooltip上，防止因为溢出无法显示；默认为false;
		 */ 
		 
		/**
		 * 获得当前列占用的宽度
		 */ 
		getColumnWidth : function(){
			return this.columnWidth || 0;
		},
		
		/**
		 * 绘制头部
		 * @param {Element} box 承载头部内容的Element
		 * @param {Number} colIndex 该列次序值
		 * @param {TableModel} data 所在表格绑定的数据源
		 */
		renderHead : function(box, colIndex, data){
			var me = this,el;
			//排序
			if(true === me.sortable){
				me.sortBox = box.createChild({
					cls : 'c-grid-sortbox',
					html : SORT_BOX_HTML
				});
				box.on('click', function(){
					me.onClickHead(data);
				});
				me.changeSotrStyle(data.sortInfo);
			}
			else{
				box.addClass('c-grid-nosort');
			}
			
			//文字 <strong>名称</strong>
			me.textBox = box.createChild({
				tag : 'strong',
				html : me.text||''
			});
			if(isS(me.width)){
				box.setStyle('width', me.width);
			}
			
			me.columnWidth = box.getWidth();
			
			data.on('changed', me.onDataChanged, me);
		},
		/**
		 * 获知表体中该列的一个单元格。
		 *
		 * @param {Element} box 承载单元格内容的Element
		 * @param {Record} record 该行数据
		 * @param {Element} row 显示该行数据的Element
		 * @param {Number} rowIndex 该行数据所在的次序值
		 * @param {Number} colIndex 该列次序值
		 * @param {TableModel} data 所在表格绑定的数据源
		 * @return {Object} 绘制该单元格时用的从record获取的原始值
		 */
		renderCell : function(box, record, row, rowIndex, colIndex, data){
			var me = this,
				nm = me.dataIndex,
				v = nm ? record.get(nm) : undefined,
				html;
			
			if(isF(me.render)){
				html = me.render.call(me.scope || window, v, record, rowIndex, colIndex, data);
				html = html || '';
			}
			else{
				html = v ? v+'' : '';
			}	
			box.update(html);
			
			if(true === me.displayTooltip){
				box.setAttribute('title', html);
			}
			
			if(isS(me.width)){
				box.setStyle('width', me.width);
			}
			
			if(me.style){
				html = me.style;
				//不准设定宽度
				delete html.width;
				box.setStyle(html);
			}
			if(!me.columnWidth){
				me.columnWidth = box.getWidth();
			}
			return v;
		},
		onDataChanged : function(type, data){
			this.changeSotrStyle(data.sortInfo);
		},
		/**
		 * 
		 */
		changeSotrStyle : function(sort){
			var me = this,
				nm = me.dataIndex,
				dir = me.sortDir,
				nnm = sort ? sort.key : false,
				ndir = sort ? sort.dir : 'asc';
			if(!me.sortBox){
				return ;
			}
//			putLog('changeSotrStyle> dataIndex:'+nm+', dir:'+dir+', datasort:'+nnm+', datadir:'+ndir);
			if(nm !== nnm){
				//不再是当前列
				if(dir){
					me.sortBox.removeClass(dir === 'desc' ? 'c-grid-sort-down' : 'c-grid-sort-up');
				}
				me.sortDir = false;
			}
			else{
				//还是当前列
				if(ndir !== dir){
					me.sortBox.removeClass(dir === 'desc' ? 'c-grid-sort-down' : 'c-grid-sort-up');
					me.sortBox.addClass(ndir === 'desc' ? 'c-grid-sort-down' : 'c-grid-sort-up');
				}
				me.sortDir = ndir;
			}	
		},
		/**
		 * 点击一个可以排序表头时的响应方法
		 */
		onClickHead : function(data){
			var me = this,
				nm = me.dataIndex,
				dir = me.sortDir;
			if(nm){
				data.sort(nm, 'asc' === dir ? 'desc':'asc');	
			}
		}
	};
	Cmp.define('Cmp.grid.Column',{
		factory : function(){
			return Column;
		}
	});
}());