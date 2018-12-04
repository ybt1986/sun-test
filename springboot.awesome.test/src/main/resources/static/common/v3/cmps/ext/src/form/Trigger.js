/**
 * 具有触发器的录入控件；该控件为一个抽象实现类
 * @class Cmp.form.Trigger
 * @extend Cmp.form.TextField
 * 
 * <p>
 * 构建时可以的属性配置说明如下：
 * @cfg {Object} value (可选)初始值。对于具有录入功能的初始值；默认为空的。
 * @cfg {String} emptyText (可选)录入控件中的值为空时，出现的提示文字；默认为空的。
 * @cfg {String} label (可选)显示标签文字，默认为空的。
 * @cfg {String} name (可选)录入值的属性名设定，默认为空的。
 * @cfg {Boolean} disabled (可选)等于true时认为初始时为失效的，即不可录入值。默认为false。
 * @cfg {Boolean} hideLabel (可选)等于true时，不会绘制标签文字。默认为false
 * @cfg {String/Number} labelWidth (可选)标签文字，占用的宽度，如果是一个数值则认为配置的是像素级别的宽度值。默认为: '5rem'；
 * @cfg {Boolean} readOnly 等于true时，为只读状态。
 * @cfg {String} btnIcon 触发器按钮图标的自定义样式名，默认为undefined；如果自行定义，需要注意该图标在禁用时的样式。
 * 				如：设定CSS为：'my-btn-icon'；则禁用时的CSS为 '.c-fd-disabled .my-btn-icon'
 * @cfg {String} btnType 触发器按钮图标类型，当没有设定btnIcon值时有效；可以设定的有:
 * 				'search'|'left'|'right'|'up'|'down'|'calendar'|'gear'; 默认为为：'search'
 * </p>
 * 
 * @version 3.0.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){
	var ICON_MAP = {
		'search' : 'fa-search',
		'left' : 'fa-angle-left',
		'right' : 'fa-angle-right',
		'up' : 'fa-angle-up',
		'down' : 'fa-angle-down',
		'calendar' : 'fa-calendar',
		'gear' : 'gear'
	};

	Cmp.define('Cmp.form.Trigger',{
		extend : 'Cmp.form.TextField',
		cls : true,
		
		factory : function(ext, reqs){
			var superClazz = ext.prototype;
			
			return Cmp.extend(ext, {
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this;
					var cls = ['c-trg'];
					if(isS(me.cls)){
						cls.push(me.cls);
					}
					else if(isA(me.cls)){
						cls = cls.concat(me.cls);
					}
					me.cls = cls;
					superClazz.initComponent.call(me);
				},
				/**
				 * @private
				 * @overwrite
				 */
				renderInput : function(box){
					var me = this,cls = ['c-trg-btn','fa'];
					superClazz.renderInput.call(me, box);
					if(isA(me.btnIcon)){
						cls = cls.concat(me.btnIcon);
					}
					else if(isS(me.btnIcon)){
						cls.push(me.btnIcon);
					}
					else{
						cls.push(ICON_MAP[me.btnType] || ICON_MAP['search']);
					}
					me.trigetBtn = box.createChild({
						cls : cls
					});
					me.trigetBtn.on('click', me.onClickTrigger, me);
					if(me.readOnly){
						me.input.on('click', me.onClickTrigger, me);
					}
				},
				/**
				 * @private
				 * @final 子类不要重写该方法
				 */
				onClickTrigger : function(){
					var me = this;
					if(!me.disaebed){
						me.doClickTrigger();
					}
				},
				/**
				 * @private
				 * @abstract 该方法需要子类实现剩余功能。
				 * 当不在失效状态且点击了触发器所调用方法。如果当前处于readOnly状态，那么在点击录入控件时也会调用该方法。
				 */
				doClickTrigger : Cmp.emptyFn
			});
		}
	});
}());