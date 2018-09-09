/**
 * 声明Cmp扩展模块的位置
 */
Cmp.config([{
	//模块标识: 只需要定义一级模块的名字就行了。
	module : 'Cmp',
	//模块资源位置，注意：路径是相对这个脚本的。
	baseUrl : '../../cmps/ext/src',
	//CSS资源的位置，因为不是一个目录的，所以要另行配置
	baseCssUrl : '../../cmps/css/src'
},{
	module : 'Exp',
	baseUrl : '../src'
}]);
Cmp.require([
	'Exp.WidgetViewer'
],
function(viewClazz){
	var view = new viewClazz({
		module : 'Cmp.form.CheckboxGroup',
		initConfig : {
			label : '配送中心',
			//选项
			options : [
				{text:'全国',value:'0'},
				{text:'上海配送中心',value:'3'},
				{text:'成都配送中心',value:'600'},
				{text:'武汉配送中心',value:'650'},
				{text:'北京配送中心',value:'6'},
				{text:'沈阳配送中心',value:'622'},
				{text:'广州配送中心',value:'10'},
				{text:'西安配送中心',value:'645'},
				{text:'固安配送中心',value:'511'}
			],
			value : ['0','600']
		}
	});	
	view.render(Cmp.getBody());
}
);