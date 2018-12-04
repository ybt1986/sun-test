/**
 * 模态对话框实现类；
 * @class Cmp.Dialog
 * @extend Cmp.Widget
 * <p>
 * 构建对话框时的属性配置说明如下：
 * @cfg {Function} handler (可选)当点击该按钮，且按钮没有处于失效状态时；调用该方法。
 * @cfg {Object} scope (可选)调用handler方法时的this设定对象
 * </p>
 * @version 2.3.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){

	var HTML_TMP = [];
	HTML_TMP.push('<div class="c-dlg-box">');
	//头部，用于显示标题
	HTML_TMP.push('<div class="c-dlg-top"><div class="c-dlg-title">请稍等</div></div>');
	//主体部分，用显示内容
	HTML_TMP.push('<div class="c-dlg-center"><div class="c-dlg-center-inner"></div></div>');
	
	//底部部分，用于显示按钮
	HTML_TMP.push('<div class="c-dlg-bottom"><div class="c-dlg-bottom-inner"></div></div>');
	
	HTML_TMP.push('</div>');
	
	HTML_TMP = HTML_TMP.join('');
	
	var BTNS_CONFIG = {
		'ok' : {
			text : '确定'
		},
		'cancel' : {
			text : '取消'
		}
	};

	Cmp.define('Cmp.Dialog',{
		extend : 'Cmp.Widget',
		requires : [
			'Cmp.Button'
		],
		cls : true,
		factory : function(ext, reqs){
			var superClass = ext.prototype,
				btnClz = reqs[0];
			return Cmp.extend(ext, {
				/**
				 * 更新主体内容
				 *
				 * @param {String} bodyHtml 主体HTML
				 * @param {String/Array} dlgCls 设定到Dialog本体上的Css设定；
				 * @return {Element} bodyEl
				 */
				updateBody : function(bodyHtml, dlgCls){
					var me = this,
						subDoms,el;
					
					//删除之前设定内容
					subDoms = me.body.dom.childNodes;
					if(subDoms && subDoms.length > 0){
						while(subDoms.length > 0){
							el = Cmp.get(subDoms[subDoms.length-1]);
							el.remove();
						}
					}
					if(me.definedCls){
						me.el.removeClass(me.definedCls);
					}
					
					me.body.update(bodyHtml);
					me.el.addClass(dlgCls);
					me.definedCls = dlgCls;
				},
			
				/**
				 * 显示头部内容和底部按钮
				 *
				 * @param {String} title 标题文字
				 * @param {Array} btns 按钮配置对象组成的数组；每项为需要显示按钮的配置；其中必须包含用于标识按钮的id属性，可以设定的有: 'ok','cancel'
				 */
				showBoth : function(title, btns){
					var me = this;
					me.showTitle(title);
					me.showBottom(btns);
				},
				/**
				 * 隐藏头部内容和底部按钮
				 */
				hideBoth : function(){
					var me = this;
					me.hideTitle();
					me.hideBottom();
				},
				/**
				 * 隐藏头部内容
				 */
				hideTitle : function(){
					var me = this;
					if(!me.hiddenTitie){
						me.hiddenTitie = true;
						me.el.addClass('c-dlg-notop');
					}
				},
				/**
				 * 显示头部内容
				 */
				showTitle : function(title){
					var me = this;
					if(me.hiddenTitie){
						me.hiddenTitie = false;
						me.el.removeClass('c-dlg-notop');
					}
					me.titleBox.update(title || '');
				},
				/**
				 * 显示底部按钮
				 */
				showBottom : function(btns){
					var me = this,
						i,len,o,btn,cfg;
					if(me.hiddenBottom){
						me.hiddenBottom = false;
						me.el.removeClass('c-dlg-nobottom');
					}
					//隐藏所有按钮
					for(i in me.bottons){
						btn = me.bottons[i];
						btn.hide();
					}
					
					if(isA(btns) && btns.length > 0){
						for(i=0, len = btns.length; i<len; i++){
							o = btns[i];
							btn = me.bottons[o.id];
							if(btn){
								cfg = BTNS_CONFIG[o.id];
								//文字
								if(isS(o.text)){
									btn.setText(o.text);
								}
								else{
									btn.setText(cfg.text);
								}
								
								//操作
								if(isF(o.handler)){
									btn.handler = o.handler.createDelegate(o.scope, [o.id]);
								}
								else{
									btn.handler = undefined;
								}
								
								btn.show();
							}
						}
					}
				},
				/**
				 * 隐藏底部按钮
				 */
				hideBottom : function(){
					var me = this;
					if(!me.hiddenBottom){
						me.hiddenBottom = true;
						me.el.addClass('c-dlg-nobottom');
					}
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this;
					superClass.initComponent.call(me);
					var cls = ['c-dlg'];
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
					var me = this,dom,subDom;
					superClass.doRender.call(me);
					me.el.setHideModal('display');
					me.el.update(HTML_TMP);
					
					dom = me.el.dom.firstChild;
					
					subDom = dom.childNodes[0].firstChild;
					me.titleBox = Cmp.get(subDom);
					
					subDom = dom.childNodes[1].firstChild;
					me.body = Cmp.get(subDom);
					
					subDom = dom.childNodes[2].firstChild;
					me.buttonBox = Cmp.get(subDom);
					var btns = {};
					btns.ok = new btnClz({
						cls : 'c-btn-ok',
						text : '确定'
					});
					btns.ok.render(me.buttonBox);
					btns.ok.el.setHideModal('display');
					
					btns.cancel = new btnClz({
						cls : 'c-btn-cancel',
						text : '取消'
					});
					btns.cancel.render(me.buttonBox);
					btns.cancel.el.setHideModal('display');
					
					me.bottons = btns;
				},
				/**
				 * @public
				 * @overwrite
				 */
				show : function(){
					var me = this;
					superClass.show.call(me);
					me.getBodyMask().show();
				},
				/**
				 * @public
				 * @overwrite
				 */
				hide : function(){
					var me = this;
					superClass.hide.call(me);
					me.getBodyMask().hide();
				},
				getBodyMask : function(){
					var me = this;
					if(!me.bodyMask){
						me.bodyMask = Cmp.getBody().createMask('DialogMask', 900000);
						me.bodyMask.addClass('c-dlg-mask');
					}
					return me.bodyMask;
				}
			});	
		}
	});
}());