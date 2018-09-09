/**
 * @class Cmp.DateList
 * @extend Cmp.Widget
 * 日历展示列表
 * 
 * <p>
 * 构建时可以的属性配置说明如下：
 * @cfg {Date} value 初始时选中的日期； 
 * @cfg {Date} minValue 允许设定的最小日期值，在没有设定的时候，默认为: 1970年1月1日
 * @cfg {Date} maxValue 允许设定的最大日期值，在没有设定的时候，默认为: 2099年12月31日
 * </p>
 * 
 * @version 1.0.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){

	var DATALIST_BOX_HTML = [],
		MONTH_TEXT = [
			'一月','二月','三月','四月',
			'五月','六月','七月','八月',
			'九月','十月','十一','十二'
		];
	
	/**
	 * 获得在某月的天数
	 * @param {Number} year (必须)年份值，如：2016
	 * @param {Number} month (必须)月份值，取值范围：0~11，
	 */	
	var getDaysOfMonth = function(year, month){
		switch(month){
			//四月
			case 3:
			//六月
			case 5:
			//九月
			case 8:
			//十一月
			case 10:
				return 30;
			case 1:
				if(0 === year % 400 || (0 !== year % 100 && 0 === year % 4)){
					//闰年
					return 29;
				}
				else{
					//平年
					return 28;
				}
				
			default :
				return 31	
		}
	}
	
	var buildDayRow = function(rowClss){
		var html = [];
		html.push('<div class="c-datelist-row ');
		html.push(rowClss);
		html.push('">');
		html.push('<div class="c-datelist-cell"><span class="c-datelist-cell-inner c-datelist-sun">日</span></div>');
		html.push('<div class="c-datelist-cell"><span class="c-datelist-cell-inner c-datelist-mon">一</span></div>');
		html.push('<div class="c-datelist-cell"><span class="c-datelist-cell-inner c-datelist-tue">二</span></div>');
		html.push('<div class="c-datelist-cell"><span class="c-datelist-cell-inner c-datelist-wed">三</span></div>');
		html.push('<div class="c-datelist-cell"><span class="c-datelist-cell-inner c-datelist-thu">四</span></div>');
		html.push('<div class="c-datelist-cell"><span class="c-datelist-cell-inner c-datelist-fri">五</span></div>');
		html.push('<div class="c-datelist-cell"><span class="c-datelist-cell-inner c-datelist-sat">六</span></div>');
		
		html.push('</div>');
		return html.join('');
	}
	
	var html = [];	
	//HEAD Start
	html.push('<div class="c-datelist-head">');
	html.push('<div class="c-datelist-head-left">');
	html.push('<div class="c-datelist-headbtn fa fa-fast-backward" title="上一年"></div>');
	html.push('<div class="c-datelist-headbtn fa fa-step-backward" title="上一月"></div>');
	html.push('</div>');
	html.push('<div class="c-datelist-head-center"></div>');
	html.push('<div class="c-datelist-head-right">');
	html.push('<div class="c-datelist-headbtn fa fa-fast-forward" title="下一年"></div>');
	html.push('<div class="c-datelist-headbtn fa fa-step-forward" title="下一月"></div>');
	html.push('</div></div>');
	//HEAD End
	//BODY Start
	html.push('<div class="c-datelist-body">');
	//一个表示星期的标头
	html.push(buildDayRow('c-datelist-week'));
	//7行日期
	for(var i=0; i<6;i++){
		html.push(buildDayRow('c-datelist-day'));
	}
	html.push('</div>');
	//BODY End
	DATALIST_BOX_HTML = html.join('');
	
	/**
	 * 呈现日期的按钮
	 */
	var DayButtom = function(dom, handler, scope){
		var me = this;
		me.el = Cmp.get(dom);
		me.textEl = Cmp.get(dom.firstChild);
		me.disabled = false;
		me.selected = false;
		me.currentMonth = true;
		me.handler = handler;
		me.scope = scope;
		
		me.el.on('click', me.onClick, me);
	};
	
	DayButtom.prototype = {
		/**
		 * 设定日期值
		 * @param {Array} day 格式为：[year,month,dayOfMonth]的日期值
		 * @param {Boolean} noCurrentMonth 等于true时，使用非当前月的显示模式
		 * @param {Array} nowDay 格式为：[year,month,dayOfMonth]的当前日期值
		 */
		setValue : function(day, noCurrentMonth, nowDay){
			var me = this,
				t = day[2];
				
			if(t < 10){
				t = '0'+t;
			}	
			me.textEl.update(t);
			me.value = day;
			if(!!noCurrentMonth && true === me.currentMonth){
				me.el.addClass('c-datelist-nocurrent');
				me.currentMonth = false;
			}
			else if(!noCurrentMonth && false === me.currentMonth){
				me.el.removeClass('c-datelist-nocurrent');
				me.currentMonth = true;
			}
			
			if(day[0] === nowDay[0]
				&& day[1] === nowDay[1]
				&& day[2] === nowDay[2]){
				me.el.addClass('c-datelist-today');
			}
			else{
				me.el.removeClass('c-datelist-today');
			}
		},
		/**
		 * 返回true表示当前按钮为选中状态
		 */
		isSelected : function(){
			return !!this.selected;
		},
		/**
		 * 将该按钮呈现为选中状态
		 */
		select : function(){
			var me = this;
			if(!me.isSelected()){
				me.el.addClass('c-datelist-selected');
				me.selected = true;
			}
		
		},
		/**
		 * 将该按钮呈现为非选中状态
		 */
		unselect : function(){
			var me = this;
			if(me.isSelected()){
				me.el.removeClass('c-datelist-selected');
				me.selected = false;
			}
		},
		/**
		 * 返回true表示当前为失效状态。
		 */
		isDisabled : function(){
			return !!this.disabled;
		},
		/**
		 * 禁用该按钮，不再响应点击事件。
		 */
		disable : function(){
			var me = this;
			if(!me.isDisabled()){
				me.el.addClass('c-datelist-btn-disabled');
				me.el.setAttribute('disabled', true);
				me.disabled = true;
			}
		},
		/**
		 * 激活该按钮，开始响应点击事件。
		 */
		enable : function(){
			var me = this;
			if(me.isDisabled()){
				me.el.removeClass('c-datelist-btn-disabled');
				me.el.removeAttribute('disabled');
				me.disabled = false;
			}
		},
		/**
		 * @private
		 */
		onClick : function(){
			var me = this;
			if(!me.isDisabled() && isF(me.handler)){
				me.handler.call(me.scope, me.value, me);
			}
		}
	};
	
	/**
	 * 比较两个日期，如果d1大于d2则返回正数；小于返回负数相等返回0
	 * @param {Array} d1 格式如[year,month,day]的日期数据
	 * @param {Array} d2 格式如[year,month,day]的日期数据
	 */
	var compareOfDay = function(d1, d2){
		for(var i=0,v;i<3;i++){
			v = d1[i] - d2[i];
			if(v != 0){
				return v;
			}	
		}
		return 0;
	}

/**
	 * 为指定的Dom对象绑定上类似于Button那样的功能方法。
	 * @param {HTMLElement} dom
	 * @param {Function} handler 点击时触发方法
	 * @param {Object} value 绑定的值
	 */
	var buildBtnObject = function(dom, handler, value){
		var me = this,
			rel = {
				el : Cmp.get(dom),
				disabled : false,
				handler : handler,
				scope : me,
				value : value
			};
		
		rel.el.on('click', function(){
			if(false === rel.disabled){
				rel.handler.call(rel.scope || me, rel.value);
			}
		});	
		
		rel.disable = function(){
			if(false === rel.disabled){
				rel.el.addClass('c-datelist-headbtn-disabled');
				rel.disabled = true;
			}
		}
		rel.enable = function(){
			if(true === rel.disabled){
				rel.el.removeClass('c-datelist-headbtn-disabled');
				rel.disabled = false;
			}
		}
		
		return rel;
	}
	
	/** 
	 * 创建日期按钮
	 */
	var buildDayBtn = function(dom){
		var me = this;
		return new DayButtom(dom, me.onClickDayBtn, me);
	}
	
	/**
	 * 刷新组件显示内容
	 * @param {Number} year (必须)年份值，如：2016
	 * @param {Number} month (必须)月份值，取值范围：0~11
	 */
	var refreshCmps = function(year, month){
		var me = this,
			cmps = me.cmps,
			dayBtns = cmps.dayBtns,
			minDay = [me.minYear,me.minMonth,me.minDay],
			maxDay = [me.maxYear,me.maxMonth,me.maxDay],
			nowDay = new Date();
		nowDay = [
			nowDay.getFullYear(),
			nowDay.getMonth(),
			nowDay.getDate()
		];	
		var setSelectedStatus = function(btn, dv){
			if(!me.value){
				btn.unselect();
			}
			else{
				var y = me.value.getFullYear(),
					m = me.value.getMonth(),
					d = me.value.getDate();
				
				if(dv[0] === y && dv[1] === m && dv[2] === d){
					btn.select();
				}	
				else{
					btn.unselect();
				}
			}
		}
		var setDisabledStatus = function(btn, dv){
			var y = dv[0],m=dv[1],d = dv[2];
			if(compareOfDay(minDay, dv) < 1 
				&& compareOfDay(maxDay, dv) > -1){
				btn.enable();
			}
			else{
				btn.disable();
			}
		}
		
		
		//切换前一年的状态
		if(me.minYear === year){
			cmps.forwardYearBtn.disable();
			if(me.minMonth >= month){
				cmps.forwardMonthBtn.disable();
			}
			else{
				cmps.forwardMonthBtn.enable();
			}
		}
		else if(me.minYear > year){
			cmps.forwardYearBtn.disable();
			cmps.forwardMonthBtn.disable();
		}
		else{
			cmps.forwardYearBtn.enable();
			cmps.forwardMonthBtn.enable();
		}
		
		//切换后一年的状态
		if(me.maxYear > year){
			cmps.nextYearBtn.enable();
			cmps.nextMonthBtn.enable();
		}
		else if(me.maxYear === year){
			cmps.nextYearBtn.disable();
			if(me.maxMonth <= month){
				cmps.nextMonthBtn.disable();
			}
			else{
				cmps.nextMonthBtn.enable();
			}
		}
		else{
			cmps.nextYearBtn.disable();
			cmps.nextMonthBtn.disable();
		}
		
		//刷新当前月份提示
		cmps.currentMonthBox.update(year+'年,'+(month+1)+'月');
		
		//刷新日期		
		var monthFirstDay = new Date(year, month, 1), //当前月的第一天。
		 	dayOfWeek = monthFirstDay.getDay(),//当前月的第一天的周中日;
		 	//上月的年份值，月份值
		 	//下一个月的年份值，月份值
		 	ly,lm,
		 	startDay, //日期列表中第一个位置的日期值
		 	//每月的天数
		 	mds,
		 	ix,i,len,di,d;
		 
		 dayOfWeek = dayOfWeek == 0 ? 7 : dayOfWeek;
		 	
		 //上一个月
		 if(month > 0){
		 	ly = year,
		 	lm = month-1;
		 }
		 else{
		 	ly = year-1;
		 	lm = 11;
		 }
		 
		 //上一个月的
		 mds = getDaysOfMonth(ly, lm);	
		 startDay = mds - dayOfWeek;
		 for(i=0,len = dayOfWeek; i < len; i++){
		 	di = dayBtns[i];
		 	d = [ly,lm,startDay+1+i];
		 	di.setValue(d, true, nowDay);
		 	setSelectedStatus(di, d);
		 	setDisabledStatus(di, d);
		 }
		 
		 //当前月
		 mds = getDaysOfMonth(year, month);	
		 for(i=0, len = mds; i<len;i++){
		 	ix = dayOfWeek+i;
		 	di = dayBtns[ix];
		 	d = [year, month,i+1];
		 	di.setValue(d, false, nowDay);
		 	setSelectedStatus(di, d);
		 	setDisabledStatus(di, d);
		 }
		 
		 //下一个月
		 if(month == 11){
		 	ly = year+1,lm = 0;
		 }
		 else{
		 	ly = year,lm = month+1;
		 }
		 len = mds+dayOfWeek;
		 if(dayBtns.length > len){
		 	i = len, len = dayBtns.length,ix=1;
		 	for(;i<len;i++,ix++){
		 		di = dayBtns[i];
		 		d = [ly,lm,ix];
		 		di.setValue(d, true, nowDay);
		 		setSelectedStatus(di, d);
			 	setDisabledStatus(di, d);
		 	}
		 }
	}//End refreshCmps Function		

	Cmp.define('Cmp.DateList',{
		extend : 'Cmp.Widget',
		cls : true,
		factory : function(ext, reqs){
			var superClazz = ext.prototype;
			
			return Cmp.extend(ext, {
				/**
				 * 设定选中的时间
				 * @param {Data} date 时间对象；如果不设定，则说明没有被选中的。
				 * @param {Boolean} refresh 等于true时会强制刷新;
				 */
				setValue : function(date, refresh){
					var me = this;
					if(me.value === date && !refresh){
						return ;
					}
					me.value = date;
					if(me.cmps){
						var y,m;
						if(isD(date)){
							y = date.getFullYear();
							m = date.getMonth();
						}
						else{
							date = new Date();
							y = date.getFullYear();
							m = date.getMonth();
						}
						me.currentYear = y;
						me.currentMonth = m;
						
						refreshCmps.call(me, y, m);
					}
				},
				/**
				 * @public
				 * 设定取值范围
				 * @param {Date} min 最早日期设定，默认为: 1970年1月1日
				 * @param {Date} max 最晚日期设定，默认为: 2099年12月31日
				 */
				setValueRange : function(min, max){
					var me = this,v;
					if(isD(min) && isD(max)){
						if(min.getTime() > max.getTime()){
							v = min;
							min = max;
							max = v;
						}
					}
					if(!isD(min)){
						me.minYear = 1970;
						me.minMonth = 0;
						me.minDay = 1;
					}
					else{
						me.minYear = min.getFullYear();
						me.minMonth = min.getMonth();
						me.minDay = min.getDate();
					}
					if(!isD(max)){
						me.maxYear = 2099;
						me.maxMonth = 11;
						me.maxDay = 31;
					}
					else{
						me.maxYear = max.getFullYear();
						me.maxMonth = max.getMonth();
						me.maxDay = max.getDate();
					}
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,v = me.cls;
					
					if(isA(v)){
						v.unshift('c-datelist');
					}
					else if(isS(v)){
						v = ['c-datelist', v];
					}
					else{
						v = 'c-datelist';
					}
					me.cls = v;
					superClazz.initComponent.call(me);
					
					me.setValueRange(me.minValue, me.maxValue);
					delete me.minValue;
					delete me.maxValue;
					
					me.addEvents(
						/**
						 * @event
						 * 点击当前月的日期按钮时，分发此事件
						 * @param {Date} day 点中日期的数据对象
						 * @return {Boolean} 返回false将不会进行更新选中日期的操作，同时也不会在分发'selectedchanged'事件
						 */
						'clickday',
						/**
						 * @event
						 * 当通过鼠标选中日期，且不与之前设定的日期一样的时候，分发此事件。
						 * @param {Date} day 选择后的日期数据对象
						 */
						'selectedchanged'
					);
				},
				/**
				 * @private
				 * @overwrite
				 */
				doRender : function(){
					var me = this,
						box,dom,subDoms,el,
						cmps = {};
					superClazz.doRender.call(me);	
					
					el = me.el.createChild({
						cls : 'c-datelist-box',
						html : DATALIST_BOX_HTML
					});
					me.el.createChild({
						cls : 'c-datelist-arrow'
					});
					dom = el.dom.firstChild;
					subDoms = dom.childNodes;
					cmps.forwardYearBtn = buildBtnObject.call(me, subDoms[0].firstChild, me.onClickForwardYear);
					cmps.forwardMonthBtn = buildBtnObject.call(me, subDoms[0].childNodes[1],me.onClickForwardMonth);
					
					cmps.currentMonthBox = Cmp.get(subDoms[1]);
					cmps.nextYearBtn = buildBtnObject.call(me, subDoms[2].firstChild, me.onClickNextYear);
					cmps.nextMonthBtn = buildBtnObject.call(me, subDoms[2].childNodes[1], me.onClickNextMonth);
					
					
					//
					dom = el.dom.childNodes[1];
					subDoms = dom.childNodes;
					var i=1,j,sd,dayBtns = [],row;
					for(;i<7;i++){
						row = subDoms[i];
						sd = row.childNodes;
						for(j=0;j<7;j++){
							dayBtns.push(buildDayBtn.call(me, sd[j]));
						}
					}
					cmps.dayBtns = dayBtns;
					me.cmps = cmps;
					var v = me.value;
					me.value = false;
					me.setValue(v);
				},
				/**
				 * @private
				 * 刷新到上一年同一个月
				 */
				onClickForwardYear : function(){
					var me = this,
						y = me.currentYear-1,
						m = me.currentMonth;
						
					if(me.minYear === y && me.minMonth > m){
						m = me.minMonth;
					} 	
						
					me.currentYear = y;
					me.currentMonth = m;
					refreshCmps.call(me, y, m);
				},
				/**
				 * @private
				 * 刷新到上一个月
				 */
				onClickForwardMonth : function(){
					var me = this,
						y,m;
					
					if(0 === me.currentMonth){
						m = 11;
						y = me.currentYear-1;
					}
					else{
						m = me.currentMonth-1;
						y = me.currentYear;
					}
					
					me.currentYear = y;
					me.currentMonth = m;
					refreshCmps.call(me, y, m);
				},
				/**
				 * @private
				 * 刷新到下一年同一个月
				 */
				onClickNextYear : function(){
					var me = this,
						y = me.currentYear+1,
						m = me.currentMonth;
						
					
					if(me.maxYear === y && me.maxMonth < m){
						m = me.maxMonth;
					}	
						
					me.currentYear = y;
					me.currentMonth = m;
					refreshCmps.call(me, y, m);
				},
				/**
				 * @private
				 * 刷新到下一个月
				 */
				onClickNextMonth : function(){
					var me = this,
						y,m;
					
					if(11 === me.currentMonth){
						m = 0;
						y = me.currentYear+1;
					}
					else{
						m = me.currentMonth+1;
						y = me.currentYear;
					}
					
					me.currentYear = y;
					me.currentMonth = m;
					refreshCmps.call(me, y, m);
				},
				/**
				 * @private
				 * 切换日期
				 * @param {Array} 格式如[year,month,day]的日期数据
				 */
				doChangeValue : function(day){
					var me = this,
						y = day[0],
						m = day[1]
						d = new Date(y, m, day[2]);
					//发送'clickday'事件
					if(false !== me.fireEvent('clickday', d, me)){
						if(me.value && me.value.getFullYear() === y 
								&& me.value.getMonth() === m
								&& me.value.getDate() === day[2]){
								//无变化
						}
						else{
							me.value = d;
							refreshCmps.call(me, y, m);
							me.fireEvent('selectedchanged', d);
						}
					}	
				},
				/**
				 * @private
				 * 点击任意一个日期按钮时的响应方法
				 */
				onClickDayBtn : function(day, btn){
					var me = this,
						y = day[0],
						m = day[1];
					
					if(y === me.currentYear && m === me.currentMonth){
						//当前月份 
						me.doChangeValue(day);
					}	
					else if(y === me.currentYear){
						//年份相等，月份不同
						if(m > me.currentMonth){
							me.onClickNextMonth();
						}
						else{
							me.onClickForwardMonth();
						}
					}
					else{
						//年份不同
						if(y > me.currentYear){
							me.onClickNextMonth();
						}
						else{
							me.onClickForwardMonth();
						}
					}
					
				}
			});
		}
	});		

}());