/**
 * 声明Cmp扩展模块的位置
 */
Cmp.config([{
	//模块标识: 只需要定义一级模块的名字就行了。
	module : 'Cmp',
	//模块资源位置，注意：路径是相对这个脚本的。
	baseUrl : '../../cmps/ext/src',
	//CSS资源的位置，因为不是一个目录的，所以要另行配置
	baseCssUrl : '../../cmps/css/src',
	path : [
		'../../css/src/Base.css'
	]
},{
	module : 'Exp',
	baseUrl : '../src'
}]);
Cmp.require([
	'Exp.WidgetViewer'
],
function(viewClazz){
	var view = new viewClazz({
		module : 'Cmp.form.DateRange',
		initConfig : {
			label : "日期范围",
			readOnly : true,
			startEmptyText : '开始日期',
			endEmptyText : '结束日期',
			text : '到',
			minValue : new Date(2012,0,1),
			maxValue : new Date(2016, 11, 31),
			value : {
			    start : new Date(2016,1,28),
			    end : new Date(2016,5,18)
			}
		}
	});	
	view.render(Cmp.getBody());
}
);