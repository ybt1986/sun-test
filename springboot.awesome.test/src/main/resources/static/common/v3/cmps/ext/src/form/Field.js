/**
 * 录入控件基础类
 * @class Cmp.form.Field
 * @extend Cmp.Widget
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
 * </p>
 *
 * @version 3.0.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){

	Cmp.define('Cmp.form.Field',{
		extend : 'Cmp.Widget',
		cls : true,
		factory : function(ext, reqs){
			var superClazz = ext.prototype;
			
			return Cmp.extend(ext, {
				/**
				 * 置为可用状态
				 */
				enable : function(){
					var me = this;
					if(me.disabled){
						me.doEnable();
						me.disabled = false;
					}
				},
				/**
				 * 置为不可用状态
				 * @final 子类不可重写，需要实现请重写#doDisable()方法
				 */
				disable : function(){
					var me = this;
					if(!me.disabled){
						me.doDisable();
						me.disabled = true;
					}
				},
				/**
				 * 返回true表示当前空间处于失效状态
				 */
				isDisabled : function(){
					return this.disabled;
				},
				/**
				 * @abstract
				 * 设定值
				 * @param {Object} value
				 */
				setValue : Cmp.emptyFn,
				/**
				 * @abstract
				 * 获得当前录入的值
				 * @return {Object} value
				 */
				getValue : Cmp.emptyFn,
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this;
					var cls = ['c-fd'];
					if(isS(me.cls)){
						cls.push(me.cls);
					}
					else if(isA(me.cls)){
						cls = cls.concat(me.cls);
					}
					me.cls = cls;
					superClazz.initComponent.call(me);
					
					me.addEvents(
						/**
						 * @event
						 * 当值发生改变时，分发此事件。
						 * @param {Object} value 变化后的值
						 * @param {Field} this
						 */
						'changed'
					);
				},
				/**
				 * @private
				 * @overwrite
				 */
				doRender : function(){
					var me = this;
					superClazz.doRender.call(me);
					//
					me.hideLabel = !!me.hideLabel;
					var el, lw = '0px';
					if(!me.hideLabel){
						lw = me.labelWidth;
						if(isN(lw)){
							lw = lw+'px'
						}
						if(!isS(lw)){
							lw = '5rem';
						}
						el = me.el.createChild({
							cls : 'c-fd-lb',
							style : {
								width : lw
							},
							html : '<strong>'+(me.label||'')+'</strong><i></i><b></b>'
						});
						me.labelBox = Cmp.get(el.dom.firstChild);
					}
					
					el = me.el.createChild({
						cls : 'c-fd-inbox',
						style : {
							paddingLeft : lw
						},
						html : '<div class="c-fd-inwarp"></div>'
					});
					me.inputBox = Cmp.get(el.dom.firstChild);
					me.renderInput(me.inputBox);
					
					me.errorBox = me.inputBox.createChild({
						cls : 'c-fd-error-msg'
					});
					
					me.el.setStyle({
						minWidth : lw
					});
					
					el = !!me.disabled;
					me.disabled = false;
					if(el){
						me.disable();
					}
					
					if(me.value != undefined){
						el = me.value;
						me.value = undefined;
						me.setValue(el);
					}
				},
				/**
				 * @private
				 * 执行将本空间置为可用状态样式的切换实现方法
				 * 子类重写时需要先调用超类
				 */
				doEnable : function(){
					var me = this;
					if(me.el){
						me.el.removeClass('c-fd-disabled');
					}
				},
				/**
				 * @private
				 * 执行将本空间置为失效状态样式的切换实现方法
				 * 子类重写时需要先调用超类
				 */
				doDisable : function(){
					var me = this;
					if(me.el){
						me.el.addClass('c-fd-disabled');
					}
				},
				/**
				 * 设置到错误状态，并显示指定的错误信息
				 */
				showError : function(msg){
					var me = this;
					if(!me._hasError){
						me._hasError = true;
						me.el.addClass('c-fd-error');
					}
					me.updateErrorMsg(msg);
				},
				/**
				 * 退出错误状态，并隐藏指定的错误信息。
				 */
				hideError : function(){
					var me = this;
					if(me._hasError){
						me._hasError = false;
						me.el.removeClass('c-fd-error');
					}
					me.updateErrorMsg();
				},
				/**
				 * @private
				 * 更新错误信息。
				 */
				updateErrorMsg : function(msg){
					var me = this;
					if(me.errorBox){
						me.errorBox.update(msg||'');
					}
				},
				/**
				 * @abstract
				 * @private
				 * 子类负责实现的绘制录入控件
				 *
				 * @param {Element} el 渲染Input控件的承载Dom封装对象;它为一个div节点。
				 */
				renderInput : Cmp.emptyFn
			});
		}
	});
}());