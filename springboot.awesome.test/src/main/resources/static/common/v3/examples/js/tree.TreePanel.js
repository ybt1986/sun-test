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
		var node = {
			id : 'root',
			text : '我的电脑',
			children : [{
				id : 'c',
				text : 'C:/',
				children : [
					{id : 'c:/window',text : 'Window',children:[
						{id : 'c:/window/system32',text : 'system32'},
						{id : 'c:/window/fonts',text : 'fonts'}
					]},
					{id : 'c:/Program Files',text : 'Program Files',children:[
						{id : 'c:/Program Files/java',text : 'java'},
						{id : 'c:/Program Files/office',text : 'office'}
					]}
				]
			},{
				id : 'd',
				text : 'D:/',
				children : [{
					id : 'd:/工作用文档',
					text : '工作用文档',
					children : [
						{id:'d:/工作用文档/11月乡村订单',text:'11月乡村订单',children:[
							{id:'d:/工作用文档/11月乡村订单/武汉11月乡村订单.xlsx',text:'武汉11月乡村订单.xlsx',leaf:true},
							{id:'d:/工作用文档/11月乡村订单/成都11月乡村订单.xlsx',text:'成都11月乡村订单.xlsx',leaf:true},
							{id:'d:/工作用文档/11月乡村订单/重庆11月乡村订单.xlsx',text:'重庆11月乡村订单.xlsx',leaf:true},
						]},
						{id:'d:/工作用文档/sn.txt',leaf:true,text:'sn.txt'},
						{id:'d:/工作用文档/工具平台功能介绍.docx',leaf:true,text:'工具平台功能介绍.docx'}
					]
				}]
			}]
		};
		var view = new viewClazz({
			module : 'Cmp.tree.TreePanel',
			initConfig : {
				useArrow : true,
				hidderRoot : false,
				extendNode : ['root','c'],
				root : node
			}
		});	
		view.render(Cmp.getBody());
	}
);