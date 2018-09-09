/**
 * @class Cmp.form.DateField
 * @extend Cmp.form.Trigger
 * 
 * 日期选择控件实现类
 * <p>
 * 构建时可以的属性配置说明如下：
 * @cfg {Object} value (可选)初始值。对于具有录入功能的初始值；默认为空的。
 * @cfg {String} emptyText (可选)录入控件中的值为空时，出现的提示文字；默认为空的。
 * @cfg {String} label (可选)显示标签文字，默认为空的。
 * @cfg {String} name (可选)录入值的属性名设定，默认为空的。
 * @cfg {Boolean} disabled (可选)等于true时认为初始时为失效的，即不可录入值。默认为false。
 * @cfg {Boolean} hideLabel (可选)等于true时，不会绘制标签文字。默认为false
 * @cfg {String/Number} labelWidth (可选)标签文字，占用的宽度，如果是一个数值则认为配置的是像素级别的宽度值。默认为: '5rem'；
 * @cfg {Boolean} readOnly 等于true时，为只读状态。
 * @cfg {Date} minValue 最早日期值设定，默认为：1970-01-01
 * @cfg {Date} maxValue 最晚日期值设定，默认为：2099-01-01
 * </p>
 */
(function(){
	
	var dateList;
	
	var getDateList = function(listClazz){
		if(dateList){
			return dateList;
		}
		var rel = {
			warp : Cmp.getBody().createChild({cls:'c-datefield-listwarp'}),
			dataList : new listClazz({
				cls : 'c-detelist-tlarrow'
			}),
			mask : Cmp.getBody().createMask('ComboxMask', 900000),
			showed : false
		};
		rel.invokeCallback = function(date){
			if(isF(rel.callback)){
				rel.callback.call(rel.scope, date);
			}
		}
		rel.dataList.on('clickday', rel.invokeCallback, rel);
		rel.warp.setHideModal('display');
		rel.dataList.render(rel.warp);
		rel.warp.hide();
		
		/**
		 * 设定选中的时间
		 * @param {Data} date 时间对象；如果不设定，则说明没有被选中的。
		 */
		rel.setValue = function(value, refresh){
			rel.dataList.setValue(value, refresh);
		}
		
		/**
		 * 设定取值范围
		 * @param {Date} min 最早日期设定，默认为: 1970年1月1日
		 * @param {Date} max 最晚日期设定，默认为: 2099年12月31日
		 */
		rel.setValueRange = function(min, max){
			rel.dataList.setValueRange(min, max);
		}
		
		/**
		 * 返回true表示DataList已经显示
		 * 
		 */
		rel.isShowed = function(){
			return rel.showed;
		}
		rel.hide = function(){
			var me = this;
			rel.showed = false;
			rel.warp.hide();
			rel.mask.hide();
			rel.mask.un('click', rel.invokeCallback, rel);
		}
		
		/**
		 * 在指定的位置显示，并绑定回调方法。
		 * @param {Array} xy 格式如[left,top]的位置数据
		 * @param {Function} callback 绑定的回调方法
		 * @param {Object} scope 调用回调方法时的this对象设定。
		 */
		rel.show = function(xy, callback, scope){
			if(rel.isShowed()){
				return ;
			}
			rel.showed = true;
			rel.warp.setStyle({
				left : xy[0]+'px',
				top : xy[1]+'px'
			});
			rel.warp.show();
			rel.mask.show();
			rel.mask.on('click', rel.invokeCallback, rel);
			rel.callback = callback;
			rel.scope = scope;
		}
		
		dateList = rel;
		return dateList;
	}

	/**
	 * 
	 */
	var toString = function(date){
		var rel = [],v;
		rel.push(date.getFullYear());	
		rel.push('年');
		v = date.getMonth()+1;
		if(v < 10){
			rel.push('0');	
		}
		rel.push(v);	
		rel.push('月');
		v = date.getDate();
		if(v < 10){
			rel.push('0');	
		}
		rel.push(v);	
		rel.push('日');
		
		return rel.join('');
	}
	
	var equals = function(d1, d2){
		if(d1 === d2){
			return true;
		}
		
		return false;
	}
	
	Cmp.define('Cmp.form.DateField',{
		extend : 'Cmp.form.Trigger',
		requires : [
			'Cmp.DateList'
		],
		cls : true,
		factory : function(ext, reqs){
			var superClazz = ext.prototype,
				dateListClazz = reqs[0];
			return Cmp.extend(ext, {
				/**
				 * @public
				 * 设定最早日期，
				 * @param {Date} minValue 最早日期值设定，默认为：1970-01-01
				 */
				setMinValue : function(minValue){
					var me = this;
					me.setValueRange(minValue, me.maxValue);
				},
				/**
				 * @public
				 * 设定最早日期，
				 * @param {Date} maxValue 最晚日期值设定，默认为：2099-01-01
				 */
				setMaxValue : function(maxValue){
					var me = this;
					me.setValueRange(me.minValue, maxValue);
				},
				/**
				 * @public
				 * 设定取值范围
				 * @param {Date} minValue 最早日期值设定，默认为：1970-01-01
				 * @param {Date} maxValue 最晚日期值设定，默认为：2099-01-01
				 */
				setValueRange : function(minValue, maxValue){
					var me = this;
					v = minValue;
					if(!isD(v)){
						v = new Date(1970,0,1);
					}
					me.minValue = v;
					v = maxValue;
					if(!isD(v)){
						v = new Date(2099, 11, 31);
					}
					me.maxValue = v;
					
					if(me.minValue.getTime() > me.maxValue.getTime()){
						v = me.minValue;
						me.minValue = me.maxValue;
						me.maxValue = v;
					}
					
					v = me.value; 
					if(isD(v)){
						v = v.getTime(); 
						if(v > me.maxValue.getTime()){
							me.value = me.maxValue;
						}
						else if(v < me.minValue.getTime()){
							me.value = me.minValue;
						}
					}
				},
				/**
				 * @overwrite
				 */
				getValue : function(){
					return this.value;
				},
				/**
				 * @overwrite
				 */
				setValue : function(value){
					var me = this;
					if(isD(value)){
						me.value = value;
					}
					else{
						me.value = undefined;
					}
					if(me.input){
						me.input.dom.value = me.value ? toString(me.value) : '';
					}
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,v;
					me.btnType = 'calendar';
					me.readOnly = true;
					v = me.cls;
					if(isA(v)){
						v.unshift('c-datefield');
					}
					else if(isS(v)){
						v = ['c-datefield', v];
					}
					else{
						v = 'c-datefield';
					}
					me.cls = v;
					
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
					
					if(me.minValue.getTime() > me.maxValue.getTime()){
						v = me.minValue;
						me.minValue = me.maxValue;
						me.maxValue = v;
					}
					
					me.addEvents(
						/**
						 * @event
						 * 当展开的日期列表被收缩后，分发此事件
						 * @param {DateField} this
						 */
						'collect',
						/**
						 * @event
						 * 当日期列表被展开显示后，分发此事件
						 * @param {DateField} this
						 */
						'extend'
					);
				},
				/**
				 * @private
				 * @overwrite
				 */
				doClickTrigger : function(){
					var me = this;
					if(me.disabled) {
						return;
					}
					if(me.extended){
						me.doCollect();
					}
					else{
						me.doExtend();
					}
				},
				/**
				 * @private
				 */
				doExtend : function(){
					var me = this;
					if(!me.extended){
						me.extended = true;
						
						var list = me.getDateList(),
							h = me.input.getHeight(),
							xy = me.input.getXY();
						list.setValueRange(me.minValue, me.maxValue);	
						list.setValue(me.getValue(), true);
						list.show([xy[0], xy[1]+h], me.doListCallback, me);
						me.el.addClass('c-datefield-extended');
						me.fireEvent('extend', me);
					}	
				},
				/**
				 * @private
				 */
				doListCallback : function(value){
					var me = this,
						ov = me.value;
					if(isD(value)){
						me.value = value;
						me.input.dom.value = toString(value);
					}
					me.doCollect();
					
					if(isD(value) && !equals(ov, value)){
						me.fireEvent('changed', value, ov, me);
					}
				},
				/**
				 * @private
				 */
				doCollect : function(){
					var me = this;
					if(!!me.extended){
						me.extended = false;
						var list = me.getDateList();
						list.hide();
						me.el.removeClass('c-datefield-extended');
						me.fireEvent('collect', me);
					}
				},
				/**
				 * @private
				 */
				getDateList : function(){
					return getDateList(dateListClazz);
				}
			});
		}
	});
}());