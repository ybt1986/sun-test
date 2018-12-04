/**
 * 标准操作按钮实现类，按钮属于控件的一种
 * @class Cmp.Button
 * @extend Cmp.Widget
 * <p>
 * 构建按钮时可以的属性配置说明如下：
 * @cfg {String/Array} icon (可选)图标的CSS样式设定；如果没有设定则认为是不需要显示图标。
 * @cfg {String} text (可选)按钮的文字设定，如果没有设定，则认为不需要显示文字。
 * @cfg {String} tooltip (可选)提示文字内容
 * @cfg {Function} handler (可选)当点击该按钮，且按钮没有处于失效状态时；调用该方法。
 * @cfg {Object} scope (可选)调用handler方法时的this设定对象
 * @cfg {Boolean} actived (可选)等于true时为选中状态；默认为false；
 * @cfg {Boolean} disabled (可选)等于true时该按钮为禁用状态；否则为可用状态。默认为false。
 * </p>
 * @version 2.3.0
 * @since 2016-05-31
 * @author Jinhai
 */ 
Cmp.define('Cmp.Button',{
	extend : 'Cmp.Widget',
	cls : true,
	
	
	factory : function(ext, reqs){
		//TODO
		var SP = ext.prototype;
		return Cmp.extend(ext, {
			/**
			 * 重新设定显示文字。
			 */
			setText : function(text){
				var me = this;
				me.text = text;
				if(me.textBox){
					me.textBox.update(text||'');
					if(text){
						me.el.removeClass('c-btn-notext');
					}
					else{
						me.el.addClass('c-btn-notext');
					}
				}
			},
			/**
			 * 重新设定显示的图标
			 * @param {Array/String} icon 设定图标的CSS样式名，或者是样式名组成的数组。
			 */
			setIcon : function(icon){
				var me = this;
				if(me.icon){
					me.iconBox.removeClass(me.icon);
					if(!icon){
						//之前有，之后没有
						me.el.addClass('c-btn-noicon');
					}
				}
				if(icon){
					me.iconBox.addClass(icon);
					if(!me.icon){
						//之后有，之前没有
						me.el.removeClass('c-btn-noicon');
					}
				}
				me.icon = icon;
			},
			/**
			 * 将该按钮设定为选中状态
			 */
			active : function(){
				var me = this;
				if(!me.actived){
					me.el.setAttribute('actived', 'actived');
				}
				me.actived = true;
			},
			/**
			 * 将该按钮设定为非选中状态
			 */
			unactive : function(){
				var me = this;
				if(me.actived){
					me.el.removeAttribute('actived');
				}
				me.actived = false;
			},
			/**
			 * 将按钮置为可用状态
			 */
			enable : function(){
				var me = this;
				if(me.disabled){
					me.disabled = false;
					if(me.el){
						me.el.removeClass('c-btn-disabled');
						me.el.dom.disabled = false;
					}
				}
			},
			/**
			 * 将按钮置为不可用状态
			 */
			disable : function(){
				var me = this;
				if(!me.disabled){
					me.disabled = true;
					if(me.el){
						me.el.addClass('c-btn-disabled');
						me.el.dom.disabled = true;
					}
				}
			},
			/**
			 * 设定按钮的提示信息
			 * @param {String} tooltip 提示信息文字
			 */
			setTooltip : function(tooltip){
				var me = this;
				if(me.el){
					me.el.setAttribute('title', tooltip || '');
				}
				else{
					me.tooltip = tooltip;
				}
			},
			/**
			 * @private
			 * @overwrite
			 */
			initComponent : function(){
				var me = this;
				SP.initComponent.call(me);
				me.tagName = 'button';
				var cls = ['c-btn'];
				if(isS(me.cls)){
					cls.push(me.cls);
				}
				else if(isA(me.cls)){
					cls = cls.concat(me.cls);
				}
				me.cls = cls;
			},
			/**
			 * @private
			 * @overwrite
			 */
			doRender : function(){
				var me = this;
				SP.doRender.call(me);
				me.el.setHideModal('display');
				me.iconBox = me.el.createChild({
					tag : 'i'
				});
				if(me.icon){
					me.iconBox.addClass(me.icon);
				}
				else{
					me.el.addClass('c-btn-noicon');
				}
				me.textBox = me.el.createChild({
					tag : 'b',
					cls : me.textCls || undefined
				});
				
				if(me.text){
					me.textBox.update(me.text);
				}
				else{
					me.el.addClass('c-btn-notext');
				}
				
				if(me.tooltip){
					me.el.setAttribute('title', me.tooltip);
				}
				
				if(isS(me.btnCls) || isA(me.btnCls)){
					me.el.addClass(me.btnCls);
				}
				me.disabled = !!me.disabled;
				if(me.disabled){
					me.el.addClass('c-btn-disabled');
					me.el.dom.disabled = true;
				}
				
				me.actived = !!me.actived;
				if(me.actived){
					me.el.setAttribute('actived', true);
				}
				
				me.el.on('click', me.onClickButton, me);
			},
			/**
			 * 响应点击按钮时的处理逻辑
			 */
			onClickButton : function(){
				var me = this;
				if(!me.disabled && isF(me.handler)){
					me.handler.call(me.scope || me, me);
				}
			}
		});
	}
});