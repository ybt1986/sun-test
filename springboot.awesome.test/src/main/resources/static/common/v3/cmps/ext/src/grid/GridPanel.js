/**
 * 表格展示部件
 * 
 * @class Cmp.grid.GridPanel
 * @extend Cmp.Componet
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){

	Cmp.define('Cmp.grid.GridPanel',{
		extend : 'Cmp.Widget',
		requires : [
			'Cmp.grid.GridView',
			'Cmp.grid.RowSelectionModel',
			'Cmp.grid.ColumnModel',
			'Cmp.grid.RowModel'
		],
		cls : true,
		factory : function(ext, reqs){
			var superClass = ext.prototype,
				viewClass = reqs[0],
				selModelClass = reqs[1],
				colModelClass = reqs[2],
				rowModelClass = reqs[3];
			return Cmp.extend(ext, {
				/**
				 * @cfg {TableModel} data 该表格初始时绑定的数据模型。 
				 */
				
				/**
				 * @cfg {Array} columns 表格每一列的配置。
				 */ 
			
				/**
				 * @cfg {Boolean} hideHeader (可选)等于true时表示不会绘制标题，默认为false。
				 */
			
				/**
				 * @cfg {Widget/Object} footer (可选)绘制在表格底部的展示部件。当没有配置或配置值等于false时，表示不展示底部内容。
				 *	如果为一个配置对象，则使用该配置对象创建PagingBar实例，并将该PagingBar绘制到底部；
				 *	如果为一个Widget部件实例，则直接将其绘制在表格底部。
				 */
				
				/**
				 * @cfg {Boolean} striped 等于true时采用斑马条纹形式，设定每行的底色，默认为false。
				 */
				
				/**
				 * @cfg {Function} getRowClass
				 * 设定每一个行使用CSS样式的调用方法，当没有设定或者方法返回null时，表示不额外添加CSS样式；
				 * 另外，即使配置了该方法，striped配置继续有效。 调用时，传入参数如下：
				 * @param {Record} record 该行数据
				 * @param {Number} rowIndex 该行在表格中的行次序。
				 */
				 
				/**
				 * 获得该表格部件的绘制控制器
				 */
				getView : function(){
					var me = this;
					if(!me.view){
						me.view = new viewClass();
					}
					return me.view;
				},
				/**
				 * 获得该表格的选择控制器
				 */
				getSelectionModel : function(){
					return this.selModel;
				},				 
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this;
					superClass.initComponent.call(me);
					var cls = ['c-grid'];
					if(isS(me.cls)){
						cls.push(me.cls);
					}
					else if(isA(me.cls)){
						cls = cls.concat(me.cls);
					}
					me.cls = cls;
					me.getColumnModel();
					me.getRowModel();
					if(me.sm || me.selModel){
						me.selModel = me.selModel || me.sm;
						if(isO(me.selModel)){
							if(!isF(me.selModel.setSelections)){
								me.selModel = new selModelClass(me.selModel);
							}
						}
						else{
							me.selModel = new selModelClass();
						}
					}
					else{
						me.selModel = new selModelClass({noselect : true});
					}
				},
				/**
				 * 获得该表格的列管理器
				 */
				getColumnModel : function(){
					var me = this;
					if(!me.columnModel){
						me.columnModel = new colModelClass(me.columns);
					}
					return me.columnModel;
				},
				/**
				 * 获得该表格的行管理器
				 */
				getRowModel : function(){
					var me = this;
					if(!me.rowModel){
						me.rowModel = new rowModelClass(me);
					}
					return me.rowModel;
				},
				/**
				 * @private
				 * @overwrite
				 */
				doRender : function(){
					var me = this;
					superClass.doRender.call(me);
					var view = me.getView();
					view.render(me);
				}
			});	
		}
	});
}());