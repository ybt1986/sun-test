/**
 * @abstract
 * @class Cmp.layout.Layout
 * @extend Object
 * 布局控制器的基本功能抽象实现类；
 * 
 * @version 2.3.0
 * @since 2016-05-31
 * @author Jinhai
 * 
 */
(function(){

	var Layout = function(cfg){
		var me = this;
		if(isO(cfg)){
			Cmp.apply(me, cfg);
		}
	}
	Layout.prototype = {
		/**
		 * @public
		 * 获得指定位置上的显示项
		 * @param {Number} index
		 * @return {Widget}
		 */
		getItemAt : function(index){
			var o = this.items[index];
			return o ? o.cmp : undefined;
		},
		/**
		 * @public
		 * 获得容器上显示部件的数量
		 */
		getItemCount : function(){
			var me = this;
			return isA(me.items) ? me.items.length : 0;
		},
		/**
		 * @public
		 * 对指定的容器进行布局。
		 * 该方法会将容器中设定的各个子部件，按照顺序，依次在容器的承载Element上进行渲染。
		 * 该方法只能被调用一次，调用完成后，该布局管理器则会与该容器进行绑定。如果想要再次进行布局，则需要调用relayout方法。
		 * 
		 * @param {Contaner} contaner 容器实例
		 */
		layout : function(contaner){
			var me = this,
				box = contaner.getLayoutTarget();
			if(me.contaner){
				//已经绘制过了，不能嫁二夫啊
				return ;
			}
			me.contaner = contaner;
			me.items = [];
			
			me.beforeLayout(box);
			
			var items = contaner.items,
				i=0,len = isA(items) ? items.length : 0;
			for(;i<len;i++){
				me.renderItem(items[i], box, i);
			}
		},
		/**
		 * @public
		 * 对设定的容器重新进行布局。
		 * 重新布局的过程中，会重新遍历容器中各个子部件；对还没有渲染得进行渲染。
		 */
		relayout : function(){
			//TODO
		},
		/**
		 * @public 
		 * 在布局容器的最后面增加一个显示不见
		 * @param {Object} item
		 * @return {Boolean} 成功删除返回true。
		 */
		appendItem : function(item){
			//TODO
		},
		/**
		 * @public 
		 * 删除指定的显示部件；
		 * @param {Number} index 所删除部件实例在容器中的次序。
		 * @return {Boolean} 成功删除返回true。
		 */
		removeItem : function(index){
			var me = this,
				it = me.getItemAt(index);
			if(it){
				//从缓存中删除
				me.items.splice(index, 1);
				//从Dom树中删除
				it.cmp.destroy();
				it.el.remove();
				return true;
			}
			
			return false;
		},
		/**
		 * @private
		 * 在为容器绘制子部件之前调用的方法
		 * @param {Element} target 绘制子部件的Element
		 */
		beforeLayout : Cmp.emptyFn, 
		/**
		 * @private
		 * 渲染一个子部件，该方法允许子类进行重写；
		 * @param {Object/Widget} item 子部件
		 * @param {Element} box 
		 * @param {Number} index 绘制部件在配置中的次序。
		 * @reutrn {Widget} 子部件的{Widget}实例
		 */
		renderItem : function(item, box, index){
			var me = this,
				//按照顺序预占
				el = box.createChild({
					cls : 'c-ly-item'
				});
			
			me.items[index] = {
				el : el
			};
			
			if(isO(item)){
				if(!isF(item.render)){
					Cmp.create(item, function(cmp){
						if(isO(cmp) && isF(cmp.render)){
							cmp.render(me.items[index].el);
							me.items[index].cmp = cmp;
						}
						else{
							me.items[index].el.setStyle('display', 'none');
						}
					});
				}
				else{
					item.render(me.items[index].el);
					me.items[index].cmp = item;
				}
			}
			else{
				me.items[index].el.setStyle('display', 'none');
			}
		} 
	};
	Cmp.define('Cmp.layout.Layout',{
		factory : function(ext, reqs){
			return Layout;
		}
	});
}());