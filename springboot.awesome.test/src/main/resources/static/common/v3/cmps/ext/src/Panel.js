/**
 * @class Cmp.Panel
 * @extend Cmp.Contaner
 * 展示面板容器实现类
 * <p>
 * 面板类继承于容器类，也就是说面板中的内容可以使用布局管理器进行布局。
 * 另外它还有以下特性：
 * <li> 设定显示面板头部，并在头部位置显示图标、标题和小工具按钮。</li>
 * <li> </li>
 * </p>
 * 
 * <p>
 * 构建按钮时可以的属性配置说明如下：
 * @cfg {String|Layout} layout (可选)容器的布局控制器实例或者是通过可以通过Cmp.require方法获得一个布局管理器构造方法的模块标识字串。
 * @cfg {Object} layoutConfig (可选)设定的layout属性为一个字符串时有效；创建布局控制器实例时的配置对象；
 * @cfg {Widget|Object|Array} items (可选)部件{Widget}实例或者是可以通过Cmp.create方法创建部件{Widget}实例的对象，或对象数组。
 * @cfg {Boolean} shadow (可选)等于true时，会使用阴影效果；默认值为false。
 * @cfg {Boolean} frame (可选)等于true时会使用凸显的面板效果；默认值为false。
 * @cfg {Boolean} actived (可选)等于true时会使用激活的显示效果，默认值为false。
 * @cfg {Boolean} hideTitle 等于true时，隐藏面板图标、标题和小工具所在的行栏。默认为false。
 * @cfg {String} title 标题文字，配置hideTitle等于true时此配置无效。
 * @cfg {String/Array} icon 面板图标，配置hideTitle等于true时此配置无效。
 * @cfg {Boolean} noborder 等于true时，将隐藏面板主体周围的边框。
 * </p>
 */
(function(){
	var HTML_TMP = [],MASK_HTML = [];
	HTML_TMP.push('<div class="c-panel-box">');
	//TOP
	HTML_TMP.push('<div class="c-panel-top">');
	HTML_TMP.push('<div class="c-panel-title"><div class="icon"></div><div class="text"></div></div>');
	HTML_TMP.push('<div class="c-panel-tools"></div>');
	HTML_TMP.push('</div>');
	
	//CENTER
	HTML_TMP.push('<div class="c-panel-center"><div class="c-panel-center-inner">');
	HTML_TMP.push('<div class="c-panel-tbar"></div>');
	HTML_TMP.push('<div class="c-panel-body"><div class="c-panel-body-inner"></div></div>');
	HTML_TMP.push('<div class="c-panel-fbar"></div>');
	HTML_TMP.push('</div></div>');
	
	//BOTTOM
	HTML_TMP.push('<div class="c-panel-bottom"></div>');
	HTML_TMP.push('</div>');

	HTML_TMP = HTML_TMP.join('');
	
	
	//遮罩	
	MASK_HTML.push('<div class="c-panel-mask-inner">');	
	MASK_HTML.push('<div class="c-panel-mask-msgbox">');	
	MASK_HTML.push('<div class="c-panel-mask-icon"></div>');	
	MASK_HTML.push('<div class="c-panel-mask-msg"></div>');	
	MASK_HTML.push('</div></div>');	
	MASK_HTML = MASK_HTML.join('');

	Cmp.define('Cmp.Panel',{
		extend : 'Cmp.Contaner',
		requires : [
			'Cmp.Button'
		],
		cls : true,
		factory : function(ext, reqs){
			var superClazz = ext.prototype,
				buttonClazz = reqs[0];
			
			return Cmp.extend(ext, {
				/**
				 * 显示挡住该面板的遮罩，阻止鼠标在面板上进行鼠标操作，直到调用hideMask方法后。
				 *
				 * @param {String} msg 等待框上的文字信息。
				 */
				showMask : function(msg){
					var me = this;
					if(!me.el){
						//还没有绘制,
						me.maskMsg = msg;
						return ;
					}
					
					if(!me.mask){
						//遮罩为用时才去创建的对象
						me.mask = me.box.createChild({
							cls : 'c-panel-mask',
							html : MASK_HTML
						});
						me.mask.setHideModal('display');
						me.maskMsg = Cmp.get(me.mask.dom.firstChild.firstChild.childNodes[1]);
					}
					me.maskMsg.update(msg || '请稍等...');
					me.mask.show();
				},
				/**
				 * 隐藏挡住该面板的遮罩。
				 */
				hideMask : function(){
					var me = this;
					if(me.mask){
						me.mask.hide();
					}
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,
						cls = me.cls;
					if(isA(cls)){
						cls.unshift('c-panel');
					}	
					else if(isS(cls)){
						cls = ['c-panel', cls];
					}
					else {
						cls = 'c-panel';
					}
					me.cls = cls;
					superClazz.initComponent.call(me);
				},
				/**
				 * @final
				 * @private
				 * @overwrite
				 * 子类不要再重写该方法
				 */
				doRender : function(){
					var me = this,dom, el;
					
					if(true === me.shadow){
						me.el.addClass('c-panel-shadow');
					}
					if(true ===  me.frame){
						me.el.addClass('c-panel-frame');
					}	
					if(true === me.actived){
						me.el.addClass('c-panel-actived');
					}	
					
					//构建基本结构
					me.el.update(HTML_TMP);	
					dom = me.el.dom.firstChild;
					me.box = Cmp.get(dom);

					//top
					dom = me.el.dom.firstChild.firstChild;
					me.topBox = Cmp.get(dom);
					dom = dom.firstChild;
					me.titleIconBox = Cmp.get(dom.firstChild);
					me.titleTextBox = Cmp.get(dom.childNodes[1]);
					
					
					//body
					dom = me.el.dom.firstChild.childNodes[1];
					me.centerBox = Cmp.get(dom);
					dom = dom.firstChild;
					me.tbarBox = Cmp.get(dom.firstChild);
					me.body = Cmp.get(dom.childNodes[1].firstChild);
					me.bbarBox = Cmp.get(dom.childNodes[2]);
					
					//foot
					dom = me.el.dom.firstChild.childNodes[2];
					me.bottomBox = Cmp.get(dom);
					
					
					me.renderTop();
					me.renderCenter();
					me.renderBottom();
					
					//最后再调用父类
					superClazz.doRender.call(me);
					
					if(me.autoSize){
						me.el.addClass('c-panel-autosize');
					}
				},
				/**
				 * 获取该容器在绘制子部件的承载Element
				 * @private
				 * @overwrite
				 */
				getLayoutTarget : function(){
					return this.body;
				},
				/**
				 * @private
				 * 绘制头部
				 */
				renderTop : function(){
					var me = this;
					if(true === me.hideTitle){
						me.el.addClass('c-panel-notop');
					}
					else{
						if(isS(me.icon) || isA(me.icon)){
							me.titleIconBox.addClass(me.icon);
						}
						if(isS(me.title)){
							me.titleTextBox.update(me.title);
						}
					}
				},
				/**
				 * @private
				 * 绘制中间部分
				 */
				renderCenter : function(){
					var me = this;
					
					if(me.noborder){
						me.centerBox.addClass('c-panel-noborder');
					}
					
					if(me.tbar){
						//TODO
						if(isA(me.tbar)){
							//TODO Toolbar
							/*
							me.tbar = new Cmp.Toolbar({
								items : me.tbar
							});
							*/
						}
						else if(isO(me.tbar) && !isF(me.tbar.render)){
//							me.tbar = new Cmp.Toolbar(me.tbar);
						}
						
						if(isF(me.tbar.render)){
							me.tbar.render(me.tbarBox);
						}
					}
					else{
						me.centerBox.addClass('c-panel-notbar');
					}
					
					if(me.bbar){
						//TODO
						if(isF(me.bbar.render)){
							me.tbar.render(me.bbarBox);
						}
					}
					else{
						me.centerBox.addClass('c-panel-nobbar');
					}
				},
				/**
				 * @private
				 * 绘制底部
				 */
				renderBottom : function(){
					var me = this;
					if(isA(me.buttons)){
						var i=0,len = me.buttons.length,b;
						for(;i<len;i++){
							b = me.buttons[i];
							if(b){
								if(!isF(b.render)){
									b = new buttonClazz(b);
								}
								b.render(me.bottomBox);
							}
						}
					}
					else{
						me.el.addClass('c-panel-nobottom');
					}
				}
			});
		}
	});
}());