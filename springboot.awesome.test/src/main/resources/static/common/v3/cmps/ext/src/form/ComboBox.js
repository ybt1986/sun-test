/**
 * @class Cmp.form.ComboBox
 * @extend Cmp.form.Trigger
 * 
 * 下拉框单选控件实现类
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
 * @cfg {Array} options (可选)构建候选项的数据对象组成的数组。数组中每一个对象为一个候选项，候选项排列顺序等于数组顺序。
 *		每一项的数据可以分成连中形式，一种是值；另一种是对象。
 *			第一种范例：['','A','B','C'];
 *			第二种范例：[{value:'',text:'不知道'},{value:'A',text:'选项A'}，{value:'B',text:'选项B'},{value:'C',text:'选项C'}]
 * </p>
 */
(function(){

	Cmp.define('Cmp.form.ComboBox',{
		extend : 'Cmp.form.Trigger',
		requires : [
			'Cmp.util.ArrayTableModel'
		],
		cls : true,
		factory : function(ext, reqs){
			var superClazz = ext.prototype,
				modelClazz = reqs[0];
			
			return Cmp.extend(ext, {
				/**
				 * @public
				 * 重新设定选项；
				 * @param {Array} ops 新设定选项
				 */
				setOptions : function(ops){
					var me = this;
					if(!me.input){
						me.options = ops;
						return ;
					}
						
					var	i = 0,
						len = isA(ops) ? ops.length : 0,
						o,v,t,
						vs = [],
						flag = false;
					for(;i<len;i++){
						o = ops[i];
						if(isO(o)){
							v = o.value;
							t = undefined === o.text ?  v : o.text;
						}
						else if(isS(o)){
							t = v = o;
						}
						
						if(undefined === v || null === v){
							continue;
						}
						if(v === me.value){
							flag = true;
						}
						vs.push([v,t]);
					}
					me.data.reload(vs);
					
					if(flag){
						//之前设定的值还有效，无需处理
					}
					else{
						//之前设定的值已经不存在于新的候选项中
						me.value = undefined;
						me.input.dom.value = '';
					}
					
					return me;
				},
				/**
				 * @overwrite
				 */
				setValue : function(value){
					var me = this;
					if(me.value === value){
						return ;
					}			
					me.value = value;
					if(me.data){
						var v = me.data.find(me.valueIndex, value);
						if(v && v.length > 0){
							v = v[0];
							v = v.get(me.textIndex);
							me.input.dom.value = v;
							
							
							var its = me.optionItems,
								i = 0, len = isA(its) ? its.length : 0,
								it,ix;
							for(;i<len;i++){
								it = its[i];
								if(it.value === value){
									it.active();
									ix = i;
								}
								else{
									it.unactive();
								}
							}
							if(ix > -1){
								me.activeOption = its[ix];
							}
							
						}
						else{
							if(me.activeOption){
								me.activeOption.unactive();
							}
							me.input.dom.value = '';
						}
					}
					me.fireEvent('changed', value, me);
				},	
				/**
				 * @overwrite
				 */
				getValue : function(){
					return this.value;
				},
				/**
				 * 根据传入的选项值，获得该选项值显示的文字；
				 * @param {Object} value
				 */
				getTextByValue : function(value){
					var me = this;
					if(me.data){
						var r = me.data.getById(value);
						
						return r ? r.get(me.textIndex) : value;
					}
					return value;
				},
				/**
				 * @private
				 * 收缩候选项列表
				 */
				collect : function(){
					var me = this;
					if(me.extended){
						me.extended = false;
						var mask = me.getBodyMask();
						mask.hide();
						me.el.removeClass('c-cbx-extended');
						mask.un('click', me.collect, me);
						me.box.hide();
					}
				},	
				/**
				 * @private
				 * 展开候选项列表
				 */
				extend : function(){
					var me = this;
					if(!me.extended){
						me.extended = true;
            var w = me.input.getWidth(),
              h = me.input.getHeight(),
              xy = me.input.getXY();
            var ww = document.children[0].clientWidth || window.outerWidth;
            if(ww - xy[0] - w < 200){
              me.box.setStyle('top', xy[1]+h + 'px');
              me.box.setStyle('right', ww - xy[0] - w + 'px');
            }else{
              me.box.setLeftTop(xy[0], xy[1]+h);
            }
						me.box.setStyle('min-width', w);
						me.box.show();
						me.el.addClass('c-cbx-extended');
						window.setTimeout(function(){
							var mask = me.getBodyMask();
							mask.show();
							mask.on('click', me.collect, me);
						}, 10);
					}
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
						me.collect();
					}
					else{
						me.extend();
					}
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this;
					var cls = ['c-cbx'];
					if(isS(me.cls)){
						cls.push(me.cls);
					}
					else if(isA(me.cls)){
						cls = cls.concat(me.cls);
					}
					me.cls = cls;
					me.readOnly = false !== me.readOnly;
					me.btnType = 'down';
					superClazz.initComponent.call(me);
					
					//构建数据
					if(!isO(me.data) || isA(me.options)){
						var i=0, 
							len = isA(me.options) ? me.options.length : 0, 
							o,v,t, 
							vs = [];
						for(;i<len;i++){
							o = me.options[i];
							if(isO(o)){
								v = o.value;
								t = o.text !== undefined ? o.text : v+'';
								vs.push([v,t]);
							}
							else{
								v = o,
								t = v ? v+'' : '';
								vs.push([v,t]);
							}
						}
						
						me.data = new modelClazz({
							keies : ['value','text'],
							idIndex : 0,
							values : vs
						});
						
						me.valueIndex = 'value';
						me.textIndex = 'text';
					}
					else{
						me.valueIndex = me.valueIndex || 'value';
						me.textIndex = me.textIndex || me.valueIndex;
					}
					
					if(me.data && isF(me.data.on)){
						me.data.on('changed', me.renderOptionItems, me);
					}
				},
				/**
				 * @private
				 * @overwrite
				 */
				renderInput : function(box){
					var me = this;
					superClazz.renderInput.call(me, box);
					me.getBodyMask();
					me.renderOptionView();
					me.renderOptionItems();
				},
				/**
				 * @private
				 * 渲染用于遮挡BODY的遮罩层。该方法将会创建bodyMask属性
				 */
				getBodyMask : function(){
					var me = this;
					if(!me.bodyMask){
						me.bodyMask = Cmp.getBody().createMask('ComboxMask', 900000);
					}
					return me.bodyMask;
				},
				/**
				 * @private
				 * 绘制显示候选项的承载容器
				 */
				renderOptionView : function(){
					var me = this,
						cls = ['c-cbx-opbox'];
						
					if(me.styleCls){
						cls.push(me.styleCls);
					}
					if(me.sizeCls){
						cls.push(me.sizeCls);
					}
						
					me.box = Cmp.getBody().createChild({
						cls : cls
					});
					me.warp = me.box.createChild({
						cls : 'c-cbx-opwarp'
					});
					
					
					
					me.box.setHideModal('display');
					me.box.hide();
					me.box.on('click', me.collect, me);
				},
				/**
				 * @private
				 * 重新绘制各个项。
				 */
				renderOptionItems : function(){
					var me = this;
					
					if(me.optionItems){
						//移除之前绘制的候选项
						for(var i=0, len = me.optionItems.length; i<len; i++){
							me.optionItems[i].remove();
						}
					}
					
					var rs = me.data ? me.data.getRecords() : [],
						i=0, len = rs.length,o,
						items = [];
						
					for(;i<len;i++){
						o = me.renderOptionItem(me.warp, rs[i]);
						if(o){
							items.push(o);
						}
					}	
					
					me.optionItems = items;
				},
				/**
				 * @private
				 * 绘制一个候选项
				 */
				renderOptionItem : function(box, r){
					var me = this,
						el,rel,
						v = r.get(me.valueIndex),
						t = r.get(me.textIndex);
					el = box.createChild({
						cls : 'c-cbx-op-item',
						atts : {
							value : v,
							title : t
						},
						html : t
					});
					rel = {
						el : el,
						value : v,
						actived : false
					}
					
					
					rel.active = function(){
						if(!rel.actived){
							rel.el.addClass('c-cbx-op-item-active');
							rel.actived = true;
						}
						me.activeOption = rel;
					}
					rel.unactive = function(){
						if(rel.actived){
							rel.el.removeClass('c-cbx-op-item-active');
							rel.actived = false;
						}
						me.activeOption = false;
					}
					rel.remove = function(){
						if(rel.el){
							rel.el.remove();
						}
					}
					rel.clickItem = function(){
						if(me.activeOption){
							me.activeOption.unactive();
						}
						rel.active();
						me.setValue(rel.value);
					}
					
					rel.el.on('click', rel.clickItem, rel);
					
					if(me.value == v){
						rel.active();
					}
					
					return rel;
				},
				/**
				 * @private
				 * @overwrite
				 * 防止重复分发事件，覆盖该方法
				 */
				onInputBlur : Cmp.emptyFn
			});
		}
	
	});
}());