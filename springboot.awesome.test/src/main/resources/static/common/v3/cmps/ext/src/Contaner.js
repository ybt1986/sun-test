/**
 * @class Cmp.Contaner
 * @extend Cmp.Widget
 * 容器基准类
 * <p>
 * 容器指的是可以容纳其他部件并且使用布局器负责绘制布局的通用部件。
 * 容器内的各个子部件是依靠使用布局管理器来进行绘制的；
 * 
 * 
 * <p>
 * 构建按钮时可以的属性配置说明如下：
 * @cfg {String|Layout} layout (可选)容器的布局控制器实例或者是通过可以通过Cmp.require方法获得一个布局管理器构造方法的模块标识字串。
 * @cfg {Object} layoutConfig (可选)设定的layout属性为一个字符串时有效；创建布局控制器实例时的配置对象；
 * @cfg {Widget|Object|Array} items (可选)部件{Widget}实例或者是可以通过Cmp.create方法创建部件{Widget}实例的对象，或对象数组。
 * </p>
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){

	Cmp.define('Cmp.Contaner',{
		extend : 'Cmp.Widget',
		requires : [
			'Cmp.layout.Layout'
		],
		factory : function(ext, reqs){
			var superClazz = ext.prototype,
				layoutClazz = reqs[0];
			
			return Cmp.extend(ext, {
				/**
				 * @public
				 * 获得指定位置上的显示部件;如果还没有绘制，则返回undefined;
				 * @param {Number} index
				 * @return {Widget}
				 */
				getItemAt : function(index){
					var me = this;
					if(me.layoutReady){
						return me.getLayout().getItemAt(index);
					}
					else{
						return undefined;
					}
				},
				/**
				 * 获得容器上显示部件的数量;
				 * 如果还没有绘制，则返回配置数量；否则返回实际绘制的数量。
				 */
				getItemCount : function(){
					var me = this;
					if(me.layoutReady){
						return me.getLayout().getItemCount();
					}
					else{
						return isA(me.items) ? me.items.length : 0;
					}
				},
				/**
				 * @public
				 * 增加一个显示部件
				 * @param {Widget/Object} item 部件实例或者可以一个部件的初始化配置对象。
				 * @return {Contaner} this
				 */
				addItem : function(item){
					var me = this;
					if(me.layoutReady){
						return me.getLayout().appendItem(item);
					}
					else{
						if(isA(me.items)){
							me.items.push(item);
						}
						else if(isO(me.items)){
							me.items = [me.items, item];
						}
						else{
							me.items = [item];
						}
					}
				},
				/**
				 * @public
				 * 根据索引值删除容器中的一个显示部件。
				 * @param {Number} index 索引值，
				 * @return {Boolean} 如果成功删除，则返回true。
				 */
				removeItemAt : function(index){
					return this.getLayout().removeItem(index);	
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,
						ly = me.layout;
					superClazz.initComponent.call(me);
					me.layoutReady = false;
					//创建布局管理器
					if(isS(ly)){
						//布局的模块标识
						Cmp.require(ly, function(clz){
							if(isF(clz)){
								var lyo = new clz(me.layoutConfig || {});
								if(isF(lyo.layout)){
									me.layout = lyo;
									me.layoutReady = true;
									me.fireLayoutReady();
								}
								else{
									putLog('根据名称获得的布局管理器，没有实现布局方法,将使用默认的；设定的管理器名称：'+JSON.stringify(ly));
									me.layout = new layoutClazz(me.layoutConfig || {});
									me.layoutReady = true;
									me.fireLayoutReady();
								}
							}
							else{
								putLog('无法获取指定的布局管理器,将使用默认的；设定的管理器标识名：'+ly);
								me.layout = new layoutClazz(me.layoutConfig || {});
								me.layoutReady = true;
								me.fireLayoutReady();
							}
						});
					}
					else if(isO(ly)){
						if(isF(ly.layout)){
							me.layout = ly;
							me.layoutReady = true;
							me.fireLayoutReady();
						}
						else{
							Cmp.create(ly, function(lyo){
								if(isF(lyo.layout)){
									me.layout = lyo;
									me.layoutReady = true;
									me.fireLayoutReady();
								}
								else{
									putLog('无法获取指定的布局管理器,将使用默认的；设定的管理器：'+JSON.stringify(ly));
									me.layout = new layoutClazz(me.layoutConfig || {});
									me.layoutReady = true;
									me.fireLayoutReady();
								}
							});
						}
					}
				},
				/**
				 * 获取该容器在绘制子部件的承载Element
				 */
				getLayoutTarget : function(){
					return this.el;
				},
				/**
				 * 获得当前使用的布局管理器；
				 * @return {Layout} 当前使用的布局管理器。
				 */
				getLayout : function(){
					return this.layout;
				},
				/**
				 * @private
				 * @rewrite
				 */
				doRender : function(){
					var me = this;
					superClazz.doRender.call(me);
					if(me.layoutReady){
						me.doLayout();
					}
					else{
						me.onReadyCreateLayout(me.doLayout, me);
					}
				},
				/**
				 * @private
				 */
				doLayout : function(){
					var me = this;
					me.getLayout().layout(me);
				},
				/**
				 * @private
				 */	
				onReadyCreateLayout : function(fn, scope){
					var me = this;
					if(me.layoutReady){
						Cmp.invoke(fn, scope);
					}
					else{
						if(!me.readLayoutListeners){
							me.readLayoutListeners = [];
						}
						me.readLayoutListeners.push({
							fn : fn,
							scope : scope
						});
					}
				}, 
				/**
				 * @private
				 */
				fireLayoutReady : function(){
					var me = this,
						i = 0, o,
						len = isA(me.readLayoutListeners) ? me.readLayoutListeners.length : 0;
					for(;i<len;i++){
						o = me.readLayoutListeners[i];
						Cmp.invoke(o.fn, o.scope);
					}	
				}
			});	
		}
	});
}());