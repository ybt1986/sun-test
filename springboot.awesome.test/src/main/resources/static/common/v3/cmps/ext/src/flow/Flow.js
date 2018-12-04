/**
 * @class Cmp.flow.Flow
 * @extend Cmp.Widget
 *
 * 步骤类进度导航条部件；
 * <p>
 * 构建部件时可以的属性配置说明如下：
 * @cfg {Array} stepItems 按照流程步骤列举的步骤项配置；具有以下属性：
 *			{String} key 步骤项标识；当变化步骤时会使用该值；
 *			{String} label 该步骤项的步骤文字；
 *			{String} anchorText 该步骤项在流程中的文字设定；默认使用次序数值+1；
 *			{Boolean} allowedClick 等于true时，表示该项为激活状态时是可以被点击的;
 * @cfg {Number} activeIndex 初始时处于焦点的步骤次序；如果为第一个，则设定为0；默认值：0；早于该步骤的状态为激活状态；晚于该步骤的为失效状态；
 * @cfg {Numbe/Width} itemWidth 每一个步骤项占用的宽度；默认为:'6rem'
 * </p>
 * 
 * @version 2.3.0
 * @since 2016-06-10
 * @author Jinhai
 */
(function(){
	Cmp.define('Cmp.flow.Flow',{
		extend : 'Cmp.Widget',
		cls : true,
		requires : [
			'Cmp.flow.FlowItem'
		],
		factory : function(ext, reqs){
			var superclass = ext.prototype,
				FlowItem = reqs[0];
			return Cmp.extend(ext, {
				/**
				 * 设定当前处于焦点状态的步骤次序；如果小于0；则全部步骤项为禁用状态；如果大于等于步骤项数量，则全部为激活状态
				 * @parma {Number} ix 当前处于激活状态的步骤次序值;当不是一个数字时，不予处理；
				 */
				setActiveIndex : function(ix){
					var me = this;
					if(!isN(ix) || me.activeIndex === ix){
						return ;
					}
					var i=0,len = isA(me.flowItems) ? me.flowItems.length : 0,it;
					for(;i<len;i++){
						it = me.flowItems[i];
						if(i < ix){
							//小于指定值，为激活状态
							it.enable();
						}
						else if(i === ix){
							//等于设定值，为焦点状态
							it.active();
						}
						else {
							//剩下的就是大于设定值为禁用状态
							it.disable();
						}
					}
					me.activeIndex = ix;
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,
						cls = me.cls;
					if(isA(cls)){
						cls.unshift('c-flow');
					}
					else if(isS(cls)){
						cls = ['c-flow', cls];
					}
					else{
						cls = 'c-flow';
					}
					me.cls = cls;
					superclass.initComponent.call(me);
					me.addEvents(
						/**
						 * @event 
						 * 点击一个有效状态的步骤项时分发此事件；
						 * @param {String} itemKey 步骤项标识
						 */
						'clickitem'
					);
				},
				/**
				 * @private
				 * @overwrite
				 */
				doRender : function(){
					var me = this;
					superclass.doRender.call(me);
					var its = me.stepItems,
						i = 0,
						len = isA(its) ? its.length : 0,
						it,
						iits = [];
					for(;i<len;i++){
						it = Cmp.apply({}, its[i]); 
						if(me.itemWidth){
							it.width = me.itemWidth; 
						}
						if(!isS(it.anchorText)){
							it.anchor = (i+1)+'';
						}
						else{
							it.anchor = it.anchorText;
						}
						delete it.anchorText;
						it = new FlowItem(it);
						it.render(me.el);
						iits.push(it);
					}	
					delete me.stepItems;
					me.flowItems = iits;
					
					var ix = isN(me.activeIndex) ? me.activeIndex : 0;
					delete me.activeIndex;
					me.setActiveIndex(ix);
				}
			});	
		}
	
	});
	
}());