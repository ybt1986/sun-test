/**
 * 一个多选选择录入控件类
 * @class Cmp.form.Checkbox
 * @extend Cmp.form.Field
 *
 * <p>
 * 构建时可以的属性配置说明如下：
 * @cfg {Object} value (可选)初始值。对于具有录入功能的初始值；默认为空的。
 * @cfg {String} text (可选)右侧提示文字；默认为空的。
 * @cfg {String} label (可选)显示标签文字，默认为空的。
 * @cfg {String} name (可选)录入值的属性名设定，默认为空的。
 * @cfg {Boolean} disabled (可选)等于true时认为初始时为失效的，即不可录入值。默认为false。
 * @cfg {Boolean} hideLabel (可选)等于true时，不会绘制标签文字。默认为false
 * @cfg {String/Number} labelWidth (可选)标签文字，占用的宽度，如果是一个数值则认为配置的是像素级别的宽度值。默认为: '5rem'；
 * @cfg {Boolean/String} checked (可选)等于true或'true'时，该控件处于选中状态；等于false或'false'时处于非选中状态；
 *				等于'half'处于半选状态。默认为false;
 * </p>
 *
 * @version 3.0.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){
	
	Cmp.define('Cmp.form.Checkbox',{
		extend : 'Cmp.form.Field',
		cls : true,
		factory : function(ext, reqs){
			var superClazz = ext.prototype;
			
			return Cmp.extend(ext, {
				/**
				 * 获得当前录入的值
				 * @return {String} value 选中状态值；'checked'为选中，'half'为半选；false为非选中。
				 */
				getValue : function(){
					return this.checkMode;
				},
				/**
				 * 设定值
				 * @param {String} value 选中状态值；'checked'为选中，'half'为半选；false为非选中。
				 */
				setValue : function(value){
					var me = this;
					if('true' === value || true === value){
						value = 'checked'
					}
					else if('false' === value){
						value = false;
					}
					if(me.checkMode === value){
						return ; 
					}
					if('checked' === value){
						me.toCheckedMode();
					}
					else if('half' === value){
						me.toHalfCheckedMode();
					}
					else{
						me.toUncheckedMode();
					}
				},
				/**
				 * 返回true表示当前为选中状态;
				 * 注意：半选状态不属于选中状态
				 * @return {Boolean}
				 */
				isCheckeded : function(){
					return 'checked' === this.checkMode;
				},
				/**
				 * 返回true表示当前为半选中状态
				 * @return {Boolean}
				 */
				isHalfChecked : function(){
					return 'half' === this.checkMode;
				},
				/**
				 * 返回true表示当前为非选中状态
				 * 注意：半选状态不属于非选中状态
				 * @return {Boolean}
				 */
				isUnchecked : function(){
					return false === this.checkMode;
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,
						cls = me.cls;
					if(isA(cls)){
						cls.unshift('c-checkbox');
					}
					else if(isS(cls)){
						cls = ['c-checkbox', cls];
					}
					else{
						cls = 'c-checkbox';
					}
					me.cls = cls;
					superClazz.initComponent.call(me);
					cls = me.checked;
					if('half' === cls){
						cls = 'half';
					}
					else if(true === cls || 'true' === cls){
						cls = 'checked';
					}
					else{
						cls = false;
					}
					me.checkMode = cls;
					delete me.checked;
					
					me.addEvents(
						/**
						 * 当点击录入控件，将要切换选中状态之前，发送次事件；
						 * 如果监听器返回false将放弃本次选中状态的切换
						 *
						 * @param {String} checkmode 当前的选中状态值；'checked'为选中，'half'为半选；false为非选中。
						 * @param {String} afterCheckmode 之后将要选中状态值；'checked'为选中，'half'为半选；false为非选中。
						 * @param {Checkbox} this
						 */
						'click'
					);
				},
				/**
				 * @private
				 * @overwrite
				 */
				renderInput : function(box){
					//text
					var me = this,dom;
					me.warp = box.createChild({
						cls : 'c-checkbox-warp',
						html : '<div class="c-checkbox-input"></div><div class="c-checkbox-text"></div>'
					});
					dom = me.warp.dom;
					me.checkbox = Cmp.get(dom.firstChild);
					me.textBox = Cmp.get(dom.childNodes[1]);
					
					if(isS(me.text)){
						me.textBox.update(me.text);
					}
					if(false !== me.checkMode){
						me.warp.addClass('c-checkbox-'+me.checkMode);
						if('half' === me.checkMode){
							me.checkbox.update('<span class="c-checkbox-half-outer"></span><span class="c-checkbox-half-inner"></span>');
						}
					}
					me.checkbox.on('click', me.onClickInput, me);
				},
				/**
				 * @private
				 */
				onClickInput : function(){
					var me = this;
					if(me.isDisabled()){
						return ; 
					}
					if(false !== me.fireEvent('click', me.checkMode, (me.isCheckeded() ? false:'checked'),me)){
						//允许切换
						if(me.isCheckeded()){
							me.toUncheckedMode();
						}
						else{
							me.toCheckedMode();
						}
					
					}
				},
				/**
				 * @public
				 * 切换至选中状态，并分发'changed'事件
				 */
				toCheckedMode : function(){
					var me = this;
					if(me.isCheckeded()){
						return me;
					}
					if(false !== me.checkMode){
						me.warp.removeClass('c-checkbox-'+me.checkMode);
						me.checkbox.update('');
					}
					
					me.checkMode = 'checked';
					me.warp.addClass('c-checkbox-'+me.checkMode);
					
					me.fireEvent('changed', me.checkMode, me);
					return me;
				},
				/**
				 * @public
				 * 切换至半选中状态，并分发'changed'事件
				 */
				toHalfCheckedMode : function(){
					var me = this;
					if(me.isHalfChecked()){
						return me;
					}
					if(false !== me.checkMode){
						me.warp.removeClass('c-checkbox-'+me.checkMode);
					}
					me.checkMode = 'half';
					me.warp.addClass('c-checkbox-'+me.checkMode);
					me.checkbox.update('<span class="c-checkbox-half-outer"></span><span class="c-checkbox-half-inner"></span>');
					me.fireEvent('changed', me.checkMode, me);
					return me;
				},
				/**
				 * @public
				 * 切换至非选中状态，并分发'changed'事件
				 */
				toUncheckedMode : function(){
					var me = this;
					if(me.isUnchecked()){
						return me;
					}
					me.warp.removeClass('c-checkbox-'+me.checkMode);
					me.checkbox.update('');
					me.checkMode = false;
					me.fireEvent('changed', me.checkMode, me);
					return me;
				}
			}); 
		}
	});
}());