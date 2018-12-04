/**
 * 引入新的模块了，要定义新模块的位置
 */
Cmp.config([{
	//模块标识: 只需要定义一级模块的名字就行了。
	module : 'App',
	//模块资源位置，注意：路径是相对这个脚本的。
	baseUrl : '../src'
}]);

//请求模块
Cmp.require(
	//请求模块标识
	['App.Logo'],
	//回调方法
	function(Logo){
		var logo = new Logo();
		logo.render('DemoView');
	}
);