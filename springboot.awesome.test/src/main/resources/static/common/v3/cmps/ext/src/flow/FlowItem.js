/**
 * @class Cmp.flow.FlowItem
 * @extend Cmp.Widget
 * 步骤类进度导航条中的一个步骤的显示部件；
 * 
 * <p>
 * 构建部件时可以的属性配置说明如下：
 * @cfg {String} label (可选)下方文字内容
 * @cfg {String} anchor (可选)在步骤条上的文字；此文字不宜超过1个字符；但是可以设定一个类似<i class="fa fa-checked"></i> 这样的一个HTML片段；
 * @cfg {Boolean} allowedClick (可选)等于true时表示该步骤为激活状态时是可以被点击的；
 * @cfg {Function} handler (可选)当点击该步骤时的回调方法；注意，只有allowedClick配置等于true且处于'enabled'状态时点击才会调用该方法； 
 * @cfg {Object} scope (可选)调用handler方法时的this设定对象
 * @cfg {String} state (可选)初始时状态值；可以设定的有：'active'|'disabled'|'enabled'; 分别表示：当前激活且处于焦点；失效的；激活的；默认为:'enabled'
 * </p>
 * 
 * @version 2.3.0
 * @since 2016-06-10
 * @author Jinhai
 */
(function(){

	var HTML = [];
	HTML.push('<div class="c-flowitem-bar">');
	HTML.push('<div class="c-flowitem-bk"></div>');
	HTML.push('<div class="c-flowitem-anchor"><div class="c-flowitem-anchor-inner"></div></div>');
	HTML.push('</div>');
	HTML.push('<div class="c-flowitem-label"></div>');
	HTML = HTML.join('');

	Cmp.define('Cmp.flow.FlowItem',{
		extend : 'Cmp.Widget',
		cls : true,
		factory : function(ext, reqs){
			var superclass = ext.prototype;
			return Cmp.extend(ext, {
			
				/**
				 * @public
				 * 设定标签文字
				 * @param {String} label 标签文字
				 */
				setLabel : function(label){
					var me = this;
					if(me.labelBox){
						me.labelBox.update(label);
					}
					else{
						me.label = label;
					}
				}, 
				/**
				 * @public
				 * 在步骤条上的文字
				 * @param {String} text 步骤条上的文字；此文字不宜超过1个字符；但是可以设定一个类似<i class="fa fa-checked"></i> 这样的一个HTML片段；
				 */
				setAnchorText : function(text){
					var me = this;
					if(me.anchorBox){
						me.anchorBox.update(text);
					}
					else{
						me.anchor = text;
					}
				},
				/**
				 * @public
				 * 置为激活且处于焦点的状态
				 */
				active : function(){
					this.setState('active');
				},
				/**
				 * @public
				 * 置为失效状态
				 */
				disable : function(){
					this.setState('disabled');
				},
				/**
				 * @public
				 * 置为失效状态
				 */
				enable : function(){
					this.setState('enabled');
				},
				/**
				 * @public
				 * 设定步骤状态；
				 *
				 * @param {String} state (可选)初始时状态值；可以设定的有：'active'|'disabled'|'enabled'; 分别表示：当前激活且处于焦点；失效的；激活的；默认为:'enabled'
				 */
				setState : function(state){
					var me = this;
					if('active' !== state && 'disabled' !== state){
						state = 'enabled';
					}
					if(me.state === state){
						return ;
					}
					if('enabled' !== me.state){
						me.el.removeClass('c-flowitem-'+me.state);
					}
					if('enabled' !== state){
						me.el.addClass('c-flowitem-'+state);
					}
					me.state = state;
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,
						cls = me.cls;
					if(isA(cls)){
						cls.unshift('c-flowitem');
					}
					else if(isS(cls)){
						cls = ['c-flowitem', cls];
					}
					else{
						cls = 'c-flowitem';
					}
					me.cls = cls;
					superclass.initComponent.call(me);
				},
				/**
				 * @private
				 * @overwrite
				 */
				doRender : function(){
					var me = this,dom,v;
					superclass.doRender.call(me);
					me.el.update(HTML);
					
					if(true === me.allowedClick){
						me.el.setAttribute('clickable','clickable');
					}
					
					if('disabled' === me.state){
						me.el.addClass('c-flowitem-disabled');
					}
					else if('active' === me.state){
						me.el.addClass('c-flowitem-active');
					}
					else{
						me.state = 'enabled';
					}
					
					dom = me.el.dom.firstChild.childNodes[1].firstChild;
					me.anchorBox = Cmp.get(dom);

					dom = me.el.dom.childNodes[1];
					me.labelBox = Cmp.get(dom);
					
					//
					v = me.anchor;
					delete me.anchor;
					if(isS(v)){
						me.setAnchorText(v);
					}
					
					v = me.label;
					delete me.label;
					if(isS(v)){
						me.setLabel(v);
					}
					
					me.el.on('click', me.onClick, me);
				},
				/**
				 * @private
				 */
				onClick : function(){
					var me = this;
					if(true === me.allowedClick && 'enabled' === me.state && isF(me.handler)){
						me.handler.call(me.scope||me, me);
					}
				}
			});
		}
	});
	
}());