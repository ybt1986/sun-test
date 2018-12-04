/**
 * 单行文字录入控件类
 * @class Cmp.form.TextField
 * @extend Cmp.form.Field
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
 * </p>
 *
 * @version 3.0.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){
	
	Cmp.define('Cmp.form.TextField',{
		extend : 'Cmp.form.Field',
		cls : true,
		
		factory : function(ext, reqs){
			var superClazz = ext.prototype;
			
			return Cmp.extend(ext, {
				/**
				 * 获得当前录入的值
				 * @return {String} value 录入值
				 */
				getValue : function(){
					var me = this;
					if(me.input){
						return me.input.dom.value;
					}
					else{
						return me.value;
					}
				},
				setValue : function(value){
					var me = this;
					if(me.input){
						me.input.dom.value = value || '';
					}
				},
				/**
				 * 设定当前录入控件的 readOnly状态值
				 */
				setReadOnly : function(readOnly){
					var me = this;
					readOnly = !!readOnly;
					if(me.input){
						if(readOnly){
							me.input.dom.readOnly = true;
							me.inputBox.addClass('c-fd-readonly');
						}
						else{
							me.input.dom.readOnly = false;
							me.inputBox.removeClass('c-fd-readonly');
						}
					}
					
					me.readOnly = readOnly;
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,
						cls = me.cls;
					if(isA(cls)){
						cls.unshift('c-tfd');
					}
					else if(isS(cls)){
						cls = ['c-tfd', cls];
					}
					else{
						cls = 'c-tfd';
					}
					me.cls = cls;
					superClazz.initComponent.call(me);
				},
				/**
				 * @private
				 * @overwrite
				 */
				renderInput : function(box){
					var me = this;
					superClazz.renderInput.call(me, box);
					me.input = box.createChild({
						tag : 'input',
						atts : {
							placeholder : me.emptyText || '',
							type : 'password' === me.type ? 'password' : 'text',
							name : me.name || '',
							maxLength : me.maxLength || undefined
						}
					});
					if(me.readOnly){
						me.input.dom.readOnly = true;
						box.addClass('c-fd-readonly');
					}
					
					me.input.on('blur', me.onInputBlur, me);
					
					if(me.value){
						var v = me.value;
						delete me.value;
						me.setValue(v);
					}
				},
				/**
				 * @private
				 * 响应录入失去焦点时的处理方法。
				 */
				onInputBlur : function(){
					var me = this;
					me.fireEvent('changed', me.getValue(), me);
				},
				/**
				 * @private
				 * @overwrite
				 */
				doDisable : function(){
					var me = this;
					superClazz.doDisable.call(me);
					me.input.dom.disabled = true;
				},
				/**
				 * @private
				 * @overwrite
				 */
				doEnable : function(){
					var me = this;
					superClazz.doEnable.call(me);
					me.input.dom.disabled = false;
				}
			});
		}
	});
}());