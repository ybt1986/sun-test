/**
 * @class Cmp.form.DateRange
 * @extend Cmp.form.Field
 * 可以输入两个日期，表示开始日期和结束日期的录入控件
 *
 * <p>
 * 构建时可以的属性配置说明如下：
 * @cfg {Object} value (可选)初始值。对于具有录入功能的初始值；默认为空的。
 * @cfg {String} label (可选)显示标签文字，默认为空的。
 * @cfg {String} name (可选)录入值的属性名设定，默认为空的。
 * @cfg {Boolean} disabled (可选)等于true时认为初始时为失效的，即不可录入值。默认为false。
 * @cfg {Boolean} hideLabel (可选)等于true时，不会绘制标签文字。默认为false
 * @cfg {String/Number} labelWidth (可选)标签文字，占用的宽度，如果是一个数值则认为配置的是像素级别的宽度值。默认为: '9rem'；
 * @cfg {String/Number} inputWidth (可选)每个日期录入控件所占用的宽度，如果是一个数值则认为配置的是像素级别的宽度值。默认为: '9rem'；
 * @cfg {String} startEmptyText (可选)开始日期录入控件中的值为空时，出现的提示文字；默认为'起始日期'。
 * @cfg {String} endEmptyText (可选)结束日期录入控件中的值为空时，出现的提示文字；默认为'截止日期'。
 * @cfg {String} text (可选)开始日期与结束日期录入控件之间的文字；默认为'至'
 * @cfg {Date} minValue 日期范围中的最早日期值设定，默认为：1970-01-01
 * @cfg {Date} maxValue 日期范围中的最晚日期值设定，默认为：2099-12-31
 * 
 * </p>
 *
 * @version 3.0.0
 * @since 2016-05-31
 * @author Jinhai
 */
 (function(){
 	//一天所经历的毫秒数
 	var DAY_TIMES = 86400000;
 	/**
 	 * 获得指定日期的下一天日期值
 	 */
 	var toNextDay = function(d){
 		var t = d.getTime() + DAY_TIMES;
 		return new Date(t);
 	}
 	/**
 	 * 获得指定日期的上一天日期值
 	 */
 	var toBackDay = function(d){
 		var t = d.getTime() - DAY_TIMES;
 		return new Date(t);
 	}
 
 	Cmp.define('Cmp.form.DateRange',{
 		extend : 'Cmp.form.Field',
 		requires : [
			'Cmp.form.DateField'
		],
		cls : true,
		factory : function(ext, reqs){
			var superClazz = ext.prototype,
				dateFieldClazz = reqs[0];
			
			return Cmp.extend(ext, {
				/**
				 * 设定日期设定范围，设定对象属性如下
				 * 	{Date} minValue 日期范围中的最早日期值设定，默认为：1970-01-01
				 * 	{Date} maxValue 日期范围中的最晚日期值设定，默认为：2099-12-31
				 * 
				 * @param {Object} range 日期范围设定
				 */
				setValueRange : function(range){
					range = range || {};
					var me = this,
						min = isD(range.minValue) ? range.minValue : new Date(1970,0,1),
						max = isD(range.maxValue) ? range.maxValue : new Date(2099,11, 31),
						sv,ev,time;
				
					me.minValue = min;
					me.maxValue = max;
				
					if(!me.startInput){
						//还没有绘制，则不再继续
						return ;
					}
					
					min = min.getTime(),
					max = max.getTime(),
					sv = me.startInput.getValue(),
					ev = me.endInput.getValue();
					
					if(sv){
						//如果开始日期超出范围，则设定值为最早日期为它的值
						time = sv.getTime();
						if(time < min || time > max){
							me.startInput.setValue(me.minValue);
						}
					} 
					
					if(ev){
						//如果结束日期超出范围，则设定最晚日期为它的值
						time = ev.getTime();
						if(time < min || time > max){
							me.endInput.setValue(me.maxValue);
						}
					}
					
					//设定开始日期和结束日期的范围
					me.startInput.setValueRange(me.minValue, toBackDay(me.maxValue));
					me.endInput.setValueRange(toNextDay(me.minValue), me.maxValue);
					
				},
				/**
				 * 设定值;为一个对象，属性说明如下：
				 * 	{Date} start : 开始日期，默认为空的
				 * 	{Date} end : 结束日期，默认为空的
				 * 
				 * @param {Object} value 
				 */
				setValue : function(value){
					value = value || {};
					var me = this,
						sv = value.start,
						ev = value.end;
					
					if(me.startInput && me.endInput){
						me.startInput.setValue(sv);
						if(isD(sv)){
							me.endInput.setMinValue(toNextDay(sv));
						}
						else{
							me.endInput.setMinValue(toNextDay(me.minValue));
						}
						me.endInput.setValue(ev);
						if(isD(ev)){
							me.startInput.setMaxValue(toBackDay(ev));
						}
						else{
							me.startInput.setMaxValue(toBackDay(me.maxValue));
						}
					}
					else{
						//还没有绘制 
						me.value = value;
					}	
				},
				/**
				 * 获得当前录入的值
				 * @return {Object} value 为一个对象，属性说明如下：
				 * 	{Date} start : 开始日期
				 * 	{Date} end : 结束日期
				 */
				getValue : function(){
					var me = this;
					if(me.startInput && me.endInput){
						return {
							start : me.startInput.getValue(),
							end : me.endInput.getValue()
						};
					}
					else{
						return me.value;
					}
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,v,cls;
					cls = ['c-daterange'];
					if(isS(me.cls)){
						cls.push(me.cls);
					}
					else if(isA(me.cls)){
						cls = cls.concat(me.cls);
					}
					me.cls = cls;
					superClazz.initComponent.call(me);
					
					
					v = me.minValue;
					if(!isD(v)){
						v = new Date(1970,0,1);
					}
					me.minValue = v;
					
					v = me.maxValue;
					if(!isD(v)){
						v = new Date(2099, 11, 31);
					}
					me.maxValue = v;
				},
				/**
				 * @abstract
				 * @private
				 * 子类负责实现的绘制录入控件
				 *
				 * @param {Element} el 渲染Input控件的承载Dom封装对象;它为一个div节点。
				 */
				renderInput : function(el){
					var me = this;
					superClazz.renderInput.call(me, el);
					var w = me.inputWidth;
					if(isN(w)){
						w = w+'px';
					}
					me.startBox = el.createChild({
						cls : 'c-daterange-start'
					});
					
					me.textBox = el.createChild({
						tag : 'span',
						cls : 'c-daterange-text',
						html : me.text || '至'
					});
					
					me.endBox = el.createChild({
						cls : 'c-daterange-end'
					});
					if(isS(w)){
						me.startBox.setStyle('width', w);
						me.endBox.setStyle('width', w);
					}
					
					me.startInput = new dateFieldClazz({
						hideLabel : true,
						minValue : me.minValue,
						maxValue : toBackDay(me.maxValue), 
						emptyText : me.startEmptyText || '起始日期'
					});
					me.startInput.render(me.startBox);
					me.endInput = new dateFieldClazz({
						hideLabel : true,
						minValue : toNextDay(me.minValue),
						maxValue : me.maxValue, 
						emptyText : me.endEmptyText || '截止日期'
					});
					me.endInput.render(me.endBox);
					
					//开始控件与结束控件事件联动
					me.startInput.on('changed', me.onStartValueChanged, me);
					me.endInput.on('changed', me.onEndValueChanged, me);
					
					if(me.value){
						v = me.value;
						delete me.value;
						me.setValue(v);
					}
				},
				/**
				 * @private
				 * 响应开始日期值变化事件的处理方法
				 */
				onStartValueChanged : function(newValue, oldValue, field){
					var me = this;
					//导致结束日期的最小日期变化
					me.endInput.setMinValue(toNextDay(newValue));
				},
				/**
				 * @private
				 * 响应结束日期值变化事件的处理方法
				 */
				onEndValueChanged : function(newValue, oldValue, field){
					var me = this;
					//导致开始日期的最晚日期变化
					me.startInput.setMaxValue(toBackDay(newValue));
				}
			});
		}
		
 	});
 }());