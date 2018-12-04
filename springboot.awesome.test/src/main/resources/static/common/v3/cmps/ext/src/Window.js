/**
 * @class Cmp.Window
 * @extend Cmp.Widget
 * 窗口组件实现类
 * <p>
 * 构建按钮时可以的属性配置说明如下：
 * @cfg {String/Array} cls (可选)自定义添加到窗口容器上的CSS设定；
 * @cfg {Boolean} hideHead (可选)等于true时，隐藏头部内容，此时窗口不会出现标题、小工具按钮；并且拖动功能也会失效；默认为false;
 * @cfg {String/Array} icon (可选)标题前的小图标设定；默认为空的
 * @cfg {String} title (可选)标题文字；
 * @cfg {Boolean} closable (可选)等于true时，表示这个窗口是可以被关闭或隐藏的，此时会出现一个关闭的小工具按钮；
 * @cfg {Boolean} maxsizeble (可选)等于true时，表示这个窗口是可以被最大化的，此时会出现一个最大化的小工具按钮；
 * @cfg {Boolean} modal (可选)等于true时表示该窗口为模式窗口
 * @cfg {Boolean} resizeble (可选)等于true时表示可以改变窗口大小。默认为false。
 * @cfg {Boolean} movesable (可选)等于true时表示可以改变窗口位置。默认为false。hideHead不等于true时有效；
 * @cfg {Object/Button/Array} buttons 位于窗口下部显示的按钮。默认为undefined
 * @cfg {String} buttonAlign 底部按钮的横向对齐设定，可设定得值有：'left','center','right'; 默认为:'right'
 * @cfg {Widget/Object} content (可选)主内容区显示的部件或可以同过Cmp.create方法创建部件的对象；
 * @cfg {String} innerHTML (可选)主内容区所填充的HTML内容；设定content属性后该属性无效；
 * @cfg {Number/String} width 窗口宽度
 * @cfg {Number/String} height 窗口高度 
 * </p>
 * 
 * @version 2.3.0
 * @since 2016-06-10
 * @author Jinhai
 */
(function(){
	var DH = Cmp.util.DomHelper;
	/**
	 * @private 窗口管理模块
	 */
	var WindowMng;
	/**
	 * @private {String} 窗口内部模板
	 */
	var HTML;
	HTML = [];
	HTML.push('<div class="c-win-box">');
	//-- Start HEAD
		HTML.push('<div class="c-win-head">');
			HTML.push('<div class="c-win-headbox">');
				HTML.push('<div class="c-win-title"><div class="c-win-title-inner"><i class="fa"></i><strong></strong></div></div>');
				HTML.push('<div class="c-win-tools"></div>');
			HTML.push('</div>');
		HTML.push('</div>');
	//-- End HEAD
	
	//-- Start Inner
		HTML.push('<div class="c-win-inner">');
			HTML.push('<div class="c-win-innerbox">');
				HTML.push('<div class="c-win-ml"></div>');
				HTML.push('<div class="c-win-mm">');
					HTML.push('<div class="c-win-wrap">');
						//窗口主体 
						HTML.push('<div class="c-win-body"><div class="c-win-body-inner"></div></div>');
						//底部
						HTML.push('<div class="c-win-foot"><div class="c-win-foot-inner"></div></div>');
					HTML.push('</div>');//End Warp
				HTML.push('</div>');
				HTML.push('<div class="c-win-mr"></div>');
				HTML.push('<div class="c-win-bl"></div>');
				HTML.push('<div class="c-win-bm"></div>');
				HTML.push('<div class="c-win-br"></div>');
			HTML.push('</div>');
	//-- End Inner		
		HTML.push('</div>');
		
	HTML.push('</div>');
	HTML = HTML.join('');
	
	var onMouseDownByResize = function(ev){
		var me = this,
			dom = me.el.dom,
			dm = ev.target,
			cls = dm.className,
			mk = WindowMng.getActiveMask();
//		putLog('onMouseDownByResize#className:'+dm.className);	
				
		//该窗口设为焦点。
		me.active();
		
		//设定缓存
		me.resizeCache = {
			dir : dm.className,
			sx : DH.getStyleNumber(dom, 'left'),
			sy : DH.getStyleNumber(dom, 'top'),
			sw : DH.getWidth(dom),
			sh : DH.getHeight(dom),
			mx : ev.clientX,
			my : ev.clientY
		};
//		putLog('Window#onMouseDownByResize>resizeCache:'+JSON.stringify(me.resizeCache));
		mk.on('mousemove', onMouseMoveByResize, me);
		mk.on('mouseup', onMouseUpByResize, me);
		mk.show();
		mk.setStyle('cursor', DH.getStyle(dm, 'cursor'));
	}
	var onMouseMoveByResize = function(ev){
		var me = this,
			dom = me.el.dom,
			c = me.resizeCache,
			dm = ev.target;
			
		if('c-win-ml' === c.dir){
			//左侧，只关注鼠标横坐标
			var off = ev.clientX - c.mx,
				x = c.sx+off,
				w =  c.sw - off;
			if(w >= MIN_WIDTH){
				DH.setStyle(dom, {
					left : x+'px',
					width : w + 'px'
				});
			}	
		}	
		else if('c-win-mr' === c.dir){
			//向右
			var off = ev.clientX - c.mx,
				w =  c.sw + off;
			if(w >= MIN_WIDTH){
				DH.setStyle(dom, {
					width : w + 'px'
				});	
			}
		}
		else if('c-win-bm' === c.dir){
			//向下
			var off = ev.clientY - c.my,
				h = c.sh + off;
				
			if(h >= MIN_HEIGHT){
				DH.setStyle(dom, {
					height : h + 'px'
				});	
			}	
		}
		else if('c-win-bl' === c.dir){
			//向左下
			var offX = ev.clientX - c.mx,
				offY = ev.clientY - c.my,
				x = c.sx+offX,
				w =  c.sw - offX,
				h = c.sh + offY,
				r = false,
				o = {};	
			if(w >= MIN_WIDTH){
				o.left = x+'px';
				o.width = w + 'px';
				r = true;
			}
			if(h >= MIN_HEIGHT){
				o.height = h + 'px';
				r = true;
			}
			if(r){
				DH.setStyle(dom, o);
			}
		}
		else if('c-win-br' === c.dir){
			//向右下
			var offX = ev.clientX - c.mx,
				offY = ev.clientY - c.my,
				w =  c.sw + offX,
				h = c.sh + offY,
				r = false,
				o = {};	
			if(w >= MIN_WIDTH){
				o.width = w + 'px';
				r = true;
			}
			if(h >= MIN_HEIGHT){
				o.height = h + 'px';
				r = true;
			}
			if(r){
				DH.setStyle(dom, o);
			}
		}
	}
	var onMouseUpByResize = function(ev){
		var me = this,
			mk = WindowMng.getActiveMask();
		
		delete me.resizeCache;
		mk.un('mousemove', onMouseMoveByResize, me);
		mk.un('mouseup', onMouseUpByResize, me);
		mk.hide();
		me.fireResizeEvent();
	}
	/**
	 * 在标题栏中处理当鼠标按下时的处理方法
	 */
	var onMouseDownByMove = function(ev){
		var me = this,
			dm = ev.target;
			dom = me.el.dom,
			mk = WindowMng.getActiveMask();
				
		//该窗口设为焦点。
		me.active();
		
		//设定缓存
		me.moveCache = {
			sx : DH.getStyleNumber(dom, 'left'),
			sy : DH.getStyleNumber(dom, 'top'),
			mx : ev.clientX,
			my : ev.clientY
		};
		mk.on('mousemove', onMouseMoveByMove, me);
		mk.on('mouseup', onMouseUpByMove, me);
		mk.show();
	}
	var onMouseMoveByMove = function(ev){
		var me = this,
			dom = me.el.dom,
			c = me.moveCache;
		
		var offX = ev.clientX - c.mx,
			offY = ev.clientY - c.my,
			x = c.sx + offX,
			y = c.sy + offY,
			r = false;
			o = {};
		
		if(x >= 0){
			o.left = x+'px';
			r = true;
		}
		if(y >= 0){
			o.top = y+'px';
			r = true;
		}
		if(r){
			DH.setStyle(dom, o);	
		}
	}	
	var onMouseUpByMove = function(ev){
		var me = this,
			mk = WindowMng.getActiveMask();
		delete me.moveCache;
		mk.un('mousemove', onMouseMoveByMove, me);
		mk.un('mouseup', onMouseUpByMove, me);
		mk.hide();
	}		
	Cmp.define('Cmp.Window',{
		extend : 'Cmp.Widget',
		requires : [
			'Cmp.Button',
			'Cmp.WindowMng'
		],
		cls : true,
		factory : function(ext, reqs){
			var superClass = ext.prototype,
				Button = reqs[0];
			WindowMng = reqs[1];
			
			return Cmp.extend(ext, {
				/**
				 * 设定该窗口为焦点状态。
				 * 
				 */
				active : function(){
					WindowMng.activeWindow(this);
				},
				/**
				 * @public
				 * 重新设定窗口的标题文字。
				 * <p>
				 * 如果设定的是无标题模式，则该设定无效。
				 * 
				 * @param {String} title 标题文字 
				 */
				setTitle : function(title){
					var me = this;
					if(me.titleBox){
						me.titleBox.update(title || '');
					}
					else{
						me.title = title;
					}
				},
				/**
				 * 重新设定窗口图标。
				 * <p>
				 * 如果设定的是无标题模式，则该设定无效。
				 * 
				 * @param {String} title 标题文字 
				 */
				setIcon : function(icon){
					var me = this,
						box = me.iconBox;
					if(!box){
						return ; 
					}
					if(box.icon === icon){
						return ;
					}
					if(box.icon){
						box.removeClass(box.icon);
					}
					if(icon){
						box.addClass(icon);
						if(!box.icon){
							me.head.addClass('c-win-headbox-icon');
						}
					}
					else{
						if(box.icon){
							me.head.removeClass('c-win-headbox-icon');
						}
					}
					box.icon = icon;
				},
				/**
				 * 在制定的位置显示这个窗口。
				 *
				 * @param {Array} xy 格式如[left,top]的位置数据；如果值为数字类型，则认为是以像素为单位的值，
				 *		如果是字符串类型，则认为是可以直接设定到style中的样式属性值。
				 * @param {Boolean} noCenter 等于true的时候，认为设定坐标值定位的时当前窗口的中心点；否则是左上角
				 */
				showAt : function(xy, noCenter){
					WindowMng.showWindow(this, xy, noCenter);
				},
				/**
				 * @public
				 * @overwrite
				 * 拦截此方法，需要调用WindowMng#showWindow方法；
				 */
				show : function(){
					var me = this;
					WindowMng.showWindow(me);
					me.fireEvent('show', me);
				},
				/**
				 * @public
				 * @overwrite
				 * 关闭该窗口，但无需销毁。
				 */
				hide : function(){
					var me = this;
					WindowMng.hideWindow(me);
					me.fireEvent('hide', me);
				},
				/**
				 * 关闭并销毁该窗口。
				 */
				close : function(){
					var me = this;
					me.hide();
					me.destroy();
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this;
					superClass.initComponent.call(me);
					var cls = ['c-win'];
					if(isS(me.cls)){
						cls.push(me.cls);
					}
					else if(isA(me.cls)){
						cls = cls.concat(me.cls);
					}
					me.cls = cls;
					me.addEvents(
						/**
						 * @event
						 * 当窗口关闭或隐藏时分发此事件。
						 * @param {Window} this
						 */
						'hide',
						/**
						 * @event
						 * 当窗口显示时分发此事件。
						 * @param {Window} this
						 */
						'show'
					);
				},
				/**
				 * @private
				 * @overwrite
				 */
				doRender : function(){
					var me = this;
					superClass.doRender.call(me);
					me.el.setHideModal('display');
					me.el.update(HTML);
					dom = me.el.dom.firstChild;
					me.box = Cmp.get(dom);
					
					if(true === me.hideHead){
						me.el.addClass('c-win-nohead');
						//没有标题时，强制不能改变大小。
						me.resizeble = false;
					}	
					else{
						me.initHead(dom);
					}
					
					me.initBody(dom);
					
					if(isO(me.buttons) || (isA(me.buttons) && me.buttons.length > 0)){
						me.initFoot(dom);
					}
					else{
						me.el.addClass('c-win-nofoot');
					}
					
					if(true === me.resizeble){
						me.initResizeEvent(dom);
					}
					else{
						me.el.addClass('c-win-noresize');
					}
				},
				/**
				 * @private
				 * 渲染头部
				 */
				initHead : function(boxDom){
					var me = this,
						dom = boxDom.firstChild.firstChild,
						ddom,btn;
						
					me.head = Cmp.get(dom);
					
					//标题容器
					me.titleWarp = Cmp.get(dom.firstChild);
					ddom = dom.firstChild.firstChild;
					me.titleInner = Cmp.get(ddom);
					
					//标题和图标
					me.iconBox = Cmp.get(ddom.firstChild);
					me.titleBox = Cmp.get(ddom.childNodes[1]);
					me.toolBox= Cmp.get(dom.childNodes[1]);
					
					me.setIcon(me.icon);
					me.setTitle(me.title);	
					
					//工具 TODO
					if(true === me.closable){
						btn = new Button({
							icon : ['fa','fa-times'],
							title : '关闭',
							handler : me.hide,
							scope : me
						}); 
						btn.render(me.toolBox);
					}
					
					//移动窗口绑定事件 movesable
					if(true === me.movesable){
						me.titleInner.on('mousedown', onMouseDownByMove, me);
						me.head.addClass('c-win-movesable');
					}
				},
				
				/**
				 * @private
				 */
				initBody : function(boxDom){
					var me = this,
						dom = boxDom.childNodes[1];
					dom = dom.firstChild.childNodes[1].firstChild.firstChild.firstChild;
					me.body = Cmp.get(dom);
					if(isO(me.content)){
						if(isF(me.content.render)){
							me.content.render(me.body);
						}
						else{
							Cmp.create(me.content, function(o){
								if(o && isF(o.render)){
									me.content = 0;
									me.content.render(me.body);
								}
							});
						}
					}
					else if(isS(me.innerHTML)){
						me.body.update(me.innerHTML);
					}
				},
				/**
				 * @private
				 */
				initFoot : function(boxDom){
					var me = this,
						btns = me.buttons,
						dom = boxDom.childNodes[1];
					dom = boxDom.childNodes[1];
					dom = dom.firstChild.childNodes[1].firstChild.childNodes[1].firstChild;
					me.foot = Cmp.get(dom);
					
					if(isO(btns) && !isA(btns)){
						btns = [btns];
					}
					
					var i=0,len = btns.length, b;
					for(;i<len;i++){
						b = btns[i];
						if(isO(b)){
							if(!isF(b.render)){
								b = new Button(b);
							}
							
							b.render(me.foot);
						}
					}
				},
				/**
				 * @private
				 * 初始化改变大小事件
				 */
				initResizeEvent : function(boxDom){
					var me = this,el,
						dom = boxDom.childNodes[1].firstChild,
						els = {};
						
					//向左
					el = Cmp.get(dom.firstChild);
					el.on('mousedown', onMouseDownByResize, me);
					els.l = el;
					
					//向右
					el = Cmp.get(dom.childNodes[2]);
					el.on('mousedown', onMouseDownByResize, me);
					els.r = el;
					
					//向左下
					el = Cmp.get(dom.childNodes[3]);
					el.on('mousedown', onMouseDownByResize, me);
					els.bl = el;
					//向下
					el = Cmp.get(dom.childNodes[4]);
					el.on('mousedown', onMouseDownByResize, me);
					els.b = el;
					
					//向右下
					el = Cmp.get(dom.childNodes[5]);
					el.on('mousedown', onMouseDownByResize, me);
					els.b = el;
					
					me.resizeBoxs = els;
				},
				/**
				 * @private
				 * @rewrite
				 */
				doDestroy : function(){
					var me = this;
					superClass.doDestroy.call(me);
					//TODO 移除me.resizeBoxs中的监听事件。
				},
				/**
				 * @private
				 * 分发窗口大小变化事件，并调用onResize方法
				 */
				fireResizeEvent : function(){
					var me = this;
						w = me.el.getWidth(),
						h = me.el.getHeight();
					me.onResize();
					me.fireEvent('resize', w, h, me);
				}
			});
		}
	});
}());