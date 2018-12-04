/**
 * @abstract
 * @class Cmp.layout.FormLayout
 * @extend Cmp.layout.Layout
 * 布局控制器的基本功能抽象实现类；
 * 
 * @version 2.3.0
 * @since 2016-05-31
 * @author Jinhai
 * 
 */
(function(){
	Cmp.define('Cmp.layout.FormLayout',{
		extend : 'Cmp.layout.Layout',
		cls :  true,
		factory : function(ext, reqs){
			var superClazz = ext.prototype;
			
			return Cmp.extend(ext, {
				/**
				 * @private
				 * @overwrite
				 */
				beforeLayout : function(box){
					box.addClass('c-formlayout');
				}
			});
		}
	});
}());