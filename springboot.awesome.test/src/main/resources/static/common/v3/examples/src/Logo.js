/**
 * JD Logo显示部件；
 */
Cmp.define('App.Logo',{
	//扩展基础的显示部件
	extend : 'Cmp.Widget',
	//需要加载同名同位置的CSS文件
	cls : true,
	//模块工厂方法，用于生成具体模块
	factory : function(ext, reqs){
		//ext就是扩展模块'Cmp.Widget'的实例，它是一个构造方法；我们直接利用Cmp.extend方法再去扩展它的功能
		
		//方便使用Cmp.Widget的原型，我们在这里声明它；
		var superClass = ext.prototype;
		return Cmp.extend(ext, {
			/**
			 * @private
			 * @overwrite
			 * 重写该方法，用于设定该部件使用的CSS;
			 */
			initComponent : function(){
				var me = this,
					cls = me.cls;
				//设定我们要用的CSS: 'app-logo'
				if(isA(cls)){
					cls.unshift('app-logo');
				}	
				else if(isS(cls)){
					cls = ['app-logo', cls];
				}
				else{
					cls = 'app-logo';
				}
				me.cls = cls;
				superClass.initComponent.call(me);
			}
		});
	}
});