/**
 * 窗口显示管理器，负责管理显示窗口的层次；
 * 
 *　
 * @static Cmp.WindowMng
 * 
 * @version 2.0.0
 * @since 2016-06-10
 * @author Jinhai
 */
(function(){

	var ACTIVE_Z_INDEX = 100000,				//活动Window的z-index
		MASK_Z_INDEX = 99990,					//模式窗口出现时，得mask层
		UNACTIVE_Z_INDEX = 99980,				//非活动Window的最高z-index
		ACTION_MASK_Z_INDEX = ACTIVE_Z_INDEX+5;	//拖动活动窗口时代理div的z-index
	
	var getDefaultXY = function(box, win){
		var bw = box.getWidth(),
			bh = box.getHeight(),
			ww = win.box.getWidth(),
			wh = win.box.getHeight(),
			x = (bw - ww) / 2,
			y = (bh - wh) / 2;
		x = x > 0 ? x : 0,
		y = y > 0 ? y : 0;
			
		return [x,y];	
	}	
	
	/**
	 * 设定窗口位置。
	 */
	var setWinLeftAndTop = function(win, xy, isCenter){
		var x,y;
		if(true === isCenter){
			var w = win.el.getWidth(),
				h = win.el.getHeight();
		}
		else{
			x = xy[0];
			y = xy[1];
			if(isN(x)){
				x = x+'px';
			}
			if(isN(y)){
				y = y+'px';
			}
			
			win.el.setStyle({
				top : y,
				left : x
			});
		}
	}
	
	var winArray = [],
		activeWin;

	/**
	 * 排列各个窗口的次序。
	 * @param {Window} win 处于最高层的窗口
	 */
	var sortWindowLayer = function(win){
		var me = this,wid,i,len;
		if(win){
			wid = win.getId();
			if(activeWin){
				winArray.push(activeWin);
			}
			
			for(i=0,len = winArray.length;i<len;i++){
				if(winArray[i] == wid){
					winArray.splice(i, 1);
				}
			}
			
		}
		else if(winArray.length > 0){
			wid = winArray.pop();
		}
		
		if(wid){
			var sm = false;
			win = Cmp.getCmp(wid);
			if(win.modal){
				sm = true;
			}
			win.el.removeClass('xp-win-unactive');
			win.el.setStyle('zIndex', ACTIVE_Z_INDEX);
			activeWin = wid;
			
			for(i=0,len = winArray.length;i<len;i++){
				wid = winArray[i];
				win = Cmp.getCmp(wid);
				if(win.modal){
					sm = true;
				}
				win.el.addClass('xp-win-unactive');
				win.el.setStyle('zIndex', UNACTIVE_Z_INDEX-len+i);
			}
			if(!sm){
				me.hideMask();
			}
		}
		else{
			activeWin = false;
			me.hideMask();
		}
	}

	
	var Rel = {
		/**
		 * 获取用于拖拽操作的遮罩
		 * 
		 */
		getActiveMask : function(){
			//TODO
			var mask = Rel.activeMask;
			if(!mask){
				mask = Rel.getWindowsBox().createChild({
					cls : 'c-win-actmask',
					style : {
						'zIndex' : ACTION_MASK_Z_INDEX
					}
				});
				mask.setHideModal('display');
				Rel.activeMask = mask;
			}
			return mask;
		},
		/**
		 * 设定指定的窗口为焦点状态。
		 */	
		activeWindow : function(win){
			//TODO
		},
		/**
		 * 显示指定的窗口，如果窗口已经显示则设定为焦点。
		 * @param {Window} win (必须)窗口实例
		 * @param {Array} xy (可选)格式如[left,top]的位置数据；如果值为数字类型，则认为是以像素为单位的值，
		 *		如果是字符串类型，则认为是可以直接设定到style中的样式属性值。
		 * @param {Boolean} isCenter 等于true的时候，认为设定坐标值定位的时当前窗口的中心点位置；否则是左上角。默认为false
		 */
		showWindow : function(win, xy, isCenter){
			var box = Rel.getWindowsBox();
			if(win && isF(win.render)){
				win.render(box);
			}
			//显示			
			win.el.setStyle('display', 'block');
			
			if(true === win.modal){
				Rel.showMask();
			}
			
			//调整位置
			if(!xy){
				xy = getDefaultXY(box, win);
				isCenter = false;
			}
			//
			setWinLeftAndTop(win, xy, isCenter);
			
			//排列次序
			sortWindowLayer.call(Rel, win);
			
		},
		/**
		 * 隐藏指定的窗口，并释放所占用的层。
		 */
		hideWindow : function(win){
			if(!win || !win.el || !isF(win.el.hide)){
				return false;
			}
			var wid = win.getId();
			win.el.hide();
			if(activeWin === wid){
				activeWin = false;
				sortWindowLayer.call(Rel);
			}
			else{
				for(var i=0,len = winArray.length;i<len;i++){
					if(winArray[i] == wid){
						winArray.splice(i, 1);
					}
				}
			}
			return true;
		},
		/**
		 * 获取绘制窗口时使用的父容器；
		 * @return {Element} 
		 */
		getWindowsBox : function(){
			var me = this;
			if(!me.windowBox){
				me.windowBox = Cmp.getBody();
			}
			return me.windowBox;
		},
		/**
		 * 显示遮罩层
		 */
		showMask : function(){
			if(!Rel.mask){
				Rel.mask = Rel.getWindowsBox().createChild({
					cls : 'c-win-mask',
					style : {
						'zIndex' : MASK_Z_INDEX
					}
				});
				Rel.mask.setHideModal('display');
			}
			else{
				Rel.mask.show();
			}
		},
		/**
		 * 隐藏遮罩层
		 */
		hideMask : function(){
			if(Rel.mask){
				Rel.mask.hide();
			}
		}
	}
	
	Cmp.define('Cmp.WindowMng',{
		factory : function(ext, reqs){
			return Rel;
		}
	});
}());