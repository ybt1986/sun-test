/**
 * @class Cmp.Tooltip
 * @extend Cmp.Widget
 * 
 * 提示信息控件
 * 取代原声title的提示信息功能，提供更佳视觉样式和功能的牛x部件。
 * <p>
 * 构建时可以的属性配置说明如下：
 * @cfg {Boolean} closable (可选)等于true时，表示需要出现关闭按钮，并可以被手动关闭。默认为true;
 * @cfg {Number} autoCloseDelay (可选)自动关闭提示信息的延迟时间，单位：毫秒。小于1000时表示永远不关闭。
 *			当closable等于false时默认为：3000；等于true时等于0。 
 * </p>
 * 
 * @version 3.0.0
 * @since 2016-06-10
 * @author Jinhai
 */
(function(){
		var DH = Cmp.util.DomHelper,
		UV = Cmp.util.ValueHelper,
		HTML_TMP,
		html = [];
		
	
	html.push('<div class="c-tip-box">');
	html.push('<div class="c-tip-inner">');
	html.push('<div class="c-tip-icon">');
	html.push('</div><div class="c-tip-body">&nbsp;</div>');
	html.push('<div class="c-tip-close">');
	html.push('</div></div>');
	html.push('<div class="c-tip-arrow"></div></div>');
	html.push('</div>');//End box
	
	HTML_TMP = 	html.join('');
	/**
	 * @private
	 * 获得在目标上方，左侧对齐的位置信息；
	 * @param {Array} txy 目标位置
	 * @param {Object} tsz 目标大小
	 * @param {Object} sz 本体大小
	 * @reutrn {Object} 具有以下属性的对象：
	 * 	<li> {String} arrowCls : 设定指向箭头使用的CSS
	 *	<li> {Array} xy 显示位置
	 */
	var getTooltipPosInfoByTL = function(txy, tsz, sz){
		var x = txy[0],
			y = txy[1]-sz.height;
		
		return {
			xy : [x,y],
			arrowCls : 'c-tip-blarrow'
		}	
	}
	/**
	 * @private
	 * 获得在目标上方，右侧对齐的位置信息；
	 * @param {Array} txy 目标位置
	 * @param {Object} tsz 目标大小
	 * @param {Object} sz 本体大小
	 * @reutrn {Object} 具有以下属性的对象：
	 * 	<li> {String} arrowCls : 设定指向箭头使用的CSS
	 *	<li> {Array} xy 显示位置
	 */
	var getTooltipPosInfoByTR = function(txy, tsz, sz){
		var x = txy[0]-sz.width+tsz.width,
			y = txy[1]-sz.height;
		
		return {
			xy : [x,y],
			arrowCls : 'c-tip-brarrow'
		}	
	}
	/**
	 * @private
	 * 获得在目标下方，左侧对齐的位置信息；
	 * @param {Array} txy 目标位置
	 * @param {Object} tsz 目标大小
	 * @param {Object} sz 本体大小
	 * @reutrn {Object} 具有以下属性的对象：
	 * 	<li> {String} arrowCls : 设定指向箭头使用的CSS
	 *	<li> {Array} xy 显示位置
	 */
	var getTooltipPosInfoByBL = function(txy, tsz, sz){
		var x = txy[0],
			y = txy[1]+tsz.height;
		
		return {
			xy : [x,y],
			arrowCls : 'c-tip-tlarrow'
		}	
	}
	/**
	 * @private
	 * 获得在目标下方，右侧对齐的位置信息；
	 * @param {Array} txy 目标位置
	 * @param {Object} tsz 目标大小
	 * @param {Object} sz 本体大小
	 * @reutrn {Object} 具有以下属性的对象：
	 * 	<li> {String} arrowCls : 设定指向箭头使用的CSS
	 *	<li> {Array} xy 显示位置
	 */
	var getTooltipPosInfoByBR = function(txy, tsz, sz){
		var x = txy[0]-sz.width+tsz.width,
			y = txy[1]+tsz.height;
		
		return {
			xy : [x,y],
			arrowCls : 'c-tip-trarrow'
		}	
	}
	
	/**
	 * @private
	 * 获得在目标左侧，上边对齐的位置信息；
	 * @param {Array} txy 目标位置
	 * @param {Object} tsz 目标大小
	 * @param {Object} sz 本体大小
	 * @reutrn {Object} 具有以下属性的对象：
	 * 	<li> {String} arrowCls : 设定指向箭头使用的CSS
	 *	<li> {Array} xy 显示位置
	 */
	var getTooltipPosInfoByLT = function(txy, tsz, sz){
		var x = txy[0]-sz.width,
			y = txy[1];
		
		return {
			xy : [x,y],
			arrowCls : 'c-tip-rtarrow'
		}	
	}
	
	/**
	 * @private
	 * 获得在目标左侧，下边对齐的位置信息；
	 * @param {Array} txy 目标位置
	 * @param {Object} tsz 目标大小
	 * @param {Object} sz 本体大小
	 * @reutrn {Object} 具有以下属性的对象：
	 * 	<li> {String} arrowCls : 设定指向箭头使用的CSS
	 *	<li> {Array} xy 显示位置
	 */
	var getTooltipPosInfoByLB = function(txy, tsz, sz){
		var x = txy[0]-sz.width,
			y = txy[1]+tsz.height-sz.height;
		
		return {
			xy : [x,y],
			arrowCls : 'c-tip-rbarrow'
		}	
	}
	
	/**
	 * @private
	 * 获得在目标左侧，上边对齐的位置信息；
	 * @param {Array} txy 目标位置
	 * @param {Object} tsz 目标大小
	 * @param {Object} sz 本体大小
	 * @reutrn {Object} 具有以下属性的对象：
	 * 	<li> {String} arrowCls : 设定指向箭头使用的CSS
	 *	<li> {Array} xy 显示位置
	 */
	var getTooltipPosInfoByRT = function(txy, tsz, sz){
		var x = txy[0]+tsz.width,
			y = txy[1];
		
		return {
			xy : [x,y],
			arrowCls : 'c-tip-ltarrow'
		}	
	}
	
	/**
	 * @private
	 * 获得在目标左侧，下边对齐的位置信息；
	 * @param {Array} txy 目标位置
	 * @param {Object} tsz 目标大小
	 * @param {Object} sz 本体大小
	 * @reutrn {Object} 具有以下属性的对象：
	 * 	<li> {String} arrowCls : 设定指向箭头使用的CSS
	 *	<li> {Array} xy 显示位置
	 */
	var getTooltipPosInfoByRB = function(txy, tsz, sz){
		var x = txy[0]+tsz.width,
			y = txy[1]+tsz.height-sz.height;
		
		return {
			xy : [x,y],
			arrowCls : 'c-tip-lbarrow'
		}	
	}
	
	var POS_HANDLERS = {
		'tl':getTooltipPosInfoByTL,
		'tr':getTooltipPosInfoByTR,
		'bl':getTooltipPosInfoByBL,
		'br':getTooltipPosInfoByBR,
		'lt':getTooltipPosInfoByLT,
		'lb':getTooltipPosInfoByLB,
		'rt':getTooltipPosInfoByRT,
		'rb':getTooltipPosInfoByRB
	};

	/**
	 * @private
	 * 自动计算最佳的显示位置；
	 * 优先级排名：下方左对齐，下方右对齐，上方左对齐，上方右对齐；
	 */
	var getTooltipPosInfoByAuto = function(txy, tsz, sz){
		var me = this,r;
		//TODO 检测是否溢出；
		//下方左侧对齐
//		r = getTooltipPosInfoByBL.call(me, txy, tsz, sz);
		//下方右侧对齐
//		r = getTooltipPosInfoByBR.call(me, txy, tsz, sz);
		//上方左侧对齐
//		r = getTooltipPosInfoByTL.call(me, txy, tsz, sz);
		//上方右侧对齐
//		r = getTooltipPosInfoByTR.call(me, txy, tsz, sz);
		
		r = getTooltipPosInfoByRT.call(me, txy, tsz, sz);
		return r;
	}

	/**
	 * @private
	 *
	 * 根据目标位置和当前提示信息的大小获得最终提示信息的显示位置和指向箭头策略。
	 *
	 * @reutrn {Object} 具有以下属性的对象：
	 * 	<li> {String} arrowCls : 设定指向箭头使用的CSS
	 *	<li> {Array} xy 显示位置
	 */
	var getTooltipPosInfo = function(target, pos, showArrow){
		var me = this,
			sz = me.el.getSize(),
			txy,tsz,dom,fn,rel;
		if(!target){
			return false;
		}
		if(isE(target)){
			dom = target;
		}
		else if(isO(target)){
			//是Widget实例
			if(isF(target.render)){
				dom = target.el.dom;
			}
			else{
				dom = target.dom;
			}
		}
		else if(isS(target)){
			dom = document.getElementById(target);
		}
		//target不存在
		if(!dom){
			return false;
		}	
		txy = DH.getXY(dom);
		tsz = {
			width : DH.getWidth(dom),
			height : DH.getHeight(dom)
		};
		fn = POS_HANDLERS[pos];
		if(!isF(fn)){
			fn = getTooltipPosInfoByAuto;
		}
		rel = fn.call(me, txy,tsz,sz);
		if(false === showArrow){
			rel.arrowCls = 'c-tip-noarrow';
		}
		return rel;
	}
	
	
	Cmp.define('Cmp.Tooltip',{
		extend : 'Cmp.Widget',
		cls : true,
		factory : function(ext, reqs){
			var superclass = ext.prototype;
			return Cmp.extend(ext, {
				/**
				 * @public
				 * 在指定显示容器位置旁，显示该提示信息。
				 * 该方法将触发'show'事件
				 * 
				 * @param {HTMLElement/Element/Widget/String} el (必须)一个HTMLElement实例或一个Element实例或Widget实例或者是一个HTMLElement的ID字串。
				 * @param {String} pos (可选)位置；默认为自动计算；可以设定以下值
				 * 		<li> auto : 自动计算使用下面选项。(默认)
				 *		<li> bl : 在容器下方，且左边对齐
				 *		<li> br : 在容器下方，且右边对齐
				 *		<li> tl : 在容器上方，且左边对齐
				 *		<li> tr : 在容器上方，且右边对齐
				 *		<li> lt : 在容器左侧，且上边对齐
				 *		<li> lb : 在容器左侧，且下边对齐
				 *		<li> rt : 在容器右侧，且上边对齐
				 *		<li> rb : 在容器右侧，且下边对齐
				 * @param {Boolean} showArrow (可选)等于true时将出现指向箭头，否则不出现。默认为true。
				 */
				showBy : function(el, pos, showArrow){
					var me = this;
					if(!me.rendered){
						me.render(Cmp.getBody());
						window.setTimeout(function(){
							me.showBy(el, pos, showArrow);
						},10);
						return ;
					}
					else{
						me.show();
					}
					var ps = getTooltipPosInfo.call(me, el, pos, showArrow),
						v;
					if(!ps){
						return ;
					}
					
					//指向箭头策略
					v = ps.arrowCls;
					if(me._arrowCls !== v){
						if(me._arrowCls){
							me.el.removeClass(me._arrowCls);
						}
						me.el.addClass(v);
						me._arrowCls = v;
					}
					
					//位置
					v = ps.xy;
					me.el.setStyle({
						left : v[0]+'px',
						top : v[1]+'px'
					});
					//分发事件
					me.fireEvent('show', me);
				},
				/**
				 * @public
				 * @overwrite
				 */
				show : function(){
					var me = this;
					superclass.show.call(me);
					if(me.autoHideTask){
						me.autoHideTask.run();
					}
				},
				/**
				 * @public
				 * @overwrite
				 */
				hide : function(){
					var me = this;
					if(me.autoHideTask){
						me.autoHideTask.cancel();
					}
					superclass.hide.call(me);
					//分发事件
					me.fireEvent('hide', me);
				},
				/**
				 * 设定提示信息显示的内容
				 *
				 * @param {Object/String} tip 提示信息对象或者只是提示信息的文字内容。当为一个对象时具有以下属性：
				 *		{String} text 提示信息的文字内容
				 *		{Array/String} icon 提示信息中提示图标的CSS样式名或者是这些样式名组成的数组。当没有设定时，将不会显示提示图标。
				 */
				setTooltip : function(tip){
					var me = this,
						tx,ic;
					
					if(!me.rendered){
						me.initTip = tip;
						return ;
					}
					
					if(isS(tip)){
						tx = tip;
					}	
					else if(isO(tip)){
						tx = tip.text;
						ic = tip.icon;
					}
					
					me.bodyBox.update(tx||'&nbsp;');
					if(isS(ic) || isA(ic)){
						me.el.removeClass('c-tip-noicon');
						
						var cs = ['c-tip-icon'];
						if(isS(ic)){
							cs.push(ic);
						}
						else{
							cs = cs.concat(ic);
						}
						
						me.iconBox.setClass(cs);
					}
					else{
						me.el.addClass('c-tip-noicon');
					}
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,v;
					superclass.initComponent.call(me);
					var cls = ['c-tip'];
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
						 * 当提示信息控件显示后，分发此事件。
						 * @param {Tooltip} this
						 */
						'show',
						/**
						 * @event
						 * 当提示信息控件隐藏后，分发此事件。
						 * @param {Tooltip} this
						 */
						'hide'
					);
					
					//是否需要出现关闭按钮
					me.closable = me.closable === false ? false : true;
					//自动关闭时间
					v = me.closable ? 0:3000;//默认值不同
					v = UV.toInteger(me.autoCloseDelay, v);
					if(v > 999){
						//一秒钟以上的显示，才属于正常显示
						me.autoHideTask = new Cmp.util.DelayedTask({
							delay : v,
							handler : me.hide,
							scope : me
						})
						delete me.autoCloseDelay;
					}
				},
				/**
				 * @private
				 * @overwrite
				 */
				doRender : function(){
					var me = this,cns;
					superclass.doRender.call(me);
					me.el.setHideModal('display');
					me.el.update(HTML_TMP);
					cns = me.el.dom.firstChild.firstChild.childNodes;
					
					me.box = Cmp.get(me.el.dom.firstChild);
					me.iconBox = Cmp.get(cns[0]);
					me.bodyBox = Cmp.get(cns[1]);
					me.closeBox = Cmp.get(cns[2]);
					me.closeBox.on('click', me.onClickClose, me);
					
					if(!me.closable){
						me.el.addClass('c-tip-noclose');
					}
					
					if(me.initTip){
						var tx,ic;
						if(isS(me.initTip)){
							tx = me.initTip;
						}
						else if(isO(me.initTip)){
							tx = me.initTip.text;
							ic = me.initTip.icon;
						}
						
						me.bodyBox.update(tx || '&nbsp;');
						if(ic){
							me.iconBox.addClass(ic);
						}
						else{
							me.el.addClass('c-tip-noicon');
						}
						delete me.initTip;
					}
					else{
						me.el.addClass('c-tip-noicon');
					}
				},
				/**
				 * @private
				 */
				onClickClose : function(){
					this.hide();
				}
			});
		}
	});
}());