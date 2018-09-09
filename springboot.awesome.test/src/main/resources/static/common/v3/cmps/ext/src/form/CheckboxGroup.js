/**
 * 多选选择录入组控件类
 * @class Cmp.form.CheckboxGroup
 * @extend Cmp.form.Field
 *
 * <p>
 * 构建时可以的属性配置说明如下：
 * @cfg {Array} value (可选)初始时处于选中的选项；每一项为一个值
 * @cfg {String} text (可选)右侧提示文字；默认为空的。
 * @cfg {Array} options (可选)候选项对象组成的数组。每一个对象具有以下两个属性
 *		{String} value (必须)选项值
 *		{String} text (可选)选项显示文字,默认等于value
 * @cfg {Boolean} disabled (可选)等于true时认为初始时为失效的，即不可录入值。默认为false。
 * @cfg {Boolean} hideLabel (可选)等于true时，不会绘制标签文字。默认为false
 * @cfg {String/Number} labelWidth (可选)标签文字占用的宽度，如果是一个数值则认为配置的是像素级别的宽度值。默认为: '5rem'；
 * @cfg {Boolean} showAll (可选)等于true时，显示表示全选Checkbox控件；默认为true；
 * @cfg {String/Number} optionWidth (可选)每一候选项所占用的宽度；
 * </p>
 *
 * @version 3.0.0
 * @since 2016-05-31
 * @author Jinhai
 */
(function(){
	Cmp.define('Cmp.form.CheckboxGroup',{
		extend : 'Cmp.form.Field',
		cls : true,
		requires : [
			'Cmp.form.Checkbox'
		],
		factory : function(ext, reqs){
			var superClazz = ext.prototype,
				checkboxClazz = reqs[0];
			return Cmp.extend(ext, {
				/**
				 * 重新设定选项，
				 * @param {Array} options 候选项对象组成的数组。每一个对象具有以下两个属性
				 *		{String} value (必须)选项值
				 *		{String} text (可选)选项显示文字,默认等于value
				 */
				setOptions : function(options){
					var me = this,
						ips = me.inputs,
						len,op,vv,tx,
						i, ip;
						
					//删除之前已经存在的
					if(ips){
						for(i in ips){
							ip = ips[i];
							op = Cmp.get(ip.field.el.dom.parentNode);
							ip.field.destroy();
							op.remove();
						}
						me.inputCount = 0;	
						me.inputs = {};
					}
					me.allInput.toUncheckedMode();
					for(i=0, len = isA(options) ? options.length : 0; i<len; i++){
						op = options[i];
						if(isO(op)){
							vv = op.value;
							if(vv == undefined){
								continue;
							}
							tx = op.text;
							if(!tx){
								tx = vv;
							}
						}
						else if(isS(op)){
							tx = vv = op;
						}
						ip = me.appendCheckbox(tx);
						if(ip){
							me.inputs[ip.getId()] = {
								field : ip,
								value : vv,
								checked : false
							};
							me.inputCount++;
						}	
					}
					
					
				},
				/**
				 * 获得当前录入的值
				 * @return {Array} value 被选中的选项值组成的数组。
				 */
				getValue : function(){
					var me = this,
						ops = me.inputs,
						i,op,rel = [];
						
					for(i in ops){
						op = ops[i];
						if(op.checked){
							rel.push(op.value);
						}
					}	
					return rel;
				},
				/**
				 * @public
				 * 设定当前选中的候选项
				 */
				setValue : function(vs){
					var me = this,
						ops = me.inputs,
						count = isA(vs) ? vs.length : 0,
						i,op,vv;
					if(me.selectCount === 0 && count === 0){
						return ;
					}
					me.onValueChangeding = true;
					for(i in ops){
						op = ops[i];
						if(count > 0 && vs.indexOf(op.value) > -1){
							op.checked = true;
							op.field.toCheckedMode();
						}
						else{
							op.checked = false;
							op.field.toUncheckedMode();
						}
					}
					me.selectCount = count;	
					if(0 === me.selectCount){
						//一个没选
						me.allInput.toUncheckedMode();
					}
					else if(me.inputCount === me.selectCount){
						//全选
						me.allInput.toCheckedMode();
					}
					else{
						//半选
						me.allInput.toHalfCheckedMode();
					}
					
					me.onValueChangeding = false;
				},
				/**
				 * @private
				 * @overwrite
				 */
				initComponent : function(){
					var me = this,
						cls = me.cls;
					if(isA(cls)){
						cls.unshift('c-checkboxgroup');
					}
					else if(isS(cls)){
						cls = ['c-checkboxgroup', cls];
					}
					else{
						cls = 'c-checkboxgroup';
					}
					me.cls = cls;
					superClazz.initComponent.call(me);
				},
				/**
				 * @private
				 * @overwrite
				 */
				renderInput : function(box){
					var me = this,
						ops = me.options,op,fo,tx,vv,
						i = 0,
						len = isA(ops) ? ops.length : 0;
					
					me.allInputBox = box.createChild({
						cls : 'c-checkboxgroup-allinputbox'
					});
					me.allInput = new checkboxClazz({
						hideLabel : true,
						text : '全选'
					});
					me.allInput.on('changed', me.onAllSelectChanged, me);
					me.allInput.render(me.allInputBox);
					
					me.optionBox = box.createChild({
						cls : 'c-checkboxgroup-optionbox'
					});
					
					me.inputs = {};
					me.inputCount = 0;
					me.selectCount = 0;
					for(;i<len;i++){
						op = ops[i];
						if(isO(op)){
							vv = op.value;
							if(!vv){
								continue;
							}
							tx = op.text;
							if(!tx){
								tx = vv;
							}
						}
						else if(isS(op)){
							tx = vv = op;
						}
						fo = me.appendCheckbox(tx);
						if(fo){
							me.inputs[fo.getId()] = {
								field : fo,
								value : vv,
								checked : false
							};
							me.inputCount++;
						}
					}
					if(isA(me.value)){
						me.setValue(me.value);
					}
				},
				/**
				 * @private
				 * 向选项区域内添加一个Checkbox
				 */
				appendCheckbox : function(text){
					var me = this,
						el = me.optionBox,
						box,rel;
					
					box = el.createChild({
						cls : 'c-checkboxgroup-optionitem'
					});
					
					rel = new checkboxClazz({
						hideLabel : true,
						text : text
					});
					rel.on('changed', me.onOptionValueChanged, me);
					rel.render(box);
					return rel;
				},
				/**
				 * @private
				 * 全选控件的选中状态发生改变
				 */
				onAllSelectChanged : function(checkModue, field){
					var me = this,
						inputs = me.inputs,
						i,op;
					if(me.onOptionValueChanging
						|| me.onValueChangeding){
						return ;
					}
					me.onAllSelectChanging = true;
					if(field.isCheckeded()){
						me.selectCount = me.inputCount;
						for(i in inputs){
							op = inputs[i];
							op.checked = true;
							op.field.toCheckedMode();
						}
					}	
					else{
						me.selectCount = 0;
						for(i in inputs){
							op = inputs[i];
							op.checked = false;
							op.field.toUncheckedMode();
						}
					}
					me.onAllSelectChanging = false;
				},
				/**
				 * @private
				 * 选项的选中状态发生改变
				 */
				onOptionValueChanged : function(checkModue, field){
					var me = this,
						inputs = me.inputs,
						cid = field.getId(),
						op = inputs[cid];
					if(me.onAllSelectChanging 
						|| me.onValueChangeding
						|| !op){
						return ;
					}	
					if(field.isCheckeded()){
						op.checked = true;
						me.selectCount++;
					}
					else{
						op.checked = false;
						me.selectCount--;
					}
					me.onOptionValueChanging = true;
					if(0 === me.selectCount){
						//一个没选
						me.allInput.toUncheckedMode();
					}
					else if(me.inputCount === me.selectCount){
						//全选
						me.allInput.toCheckedMode();
					}
					else{
						//半选
						me.allInput.toHalfCheckedMode();
					}
					me.onOptionValueChanging = false;
				}
			});	
		}
	});
}());