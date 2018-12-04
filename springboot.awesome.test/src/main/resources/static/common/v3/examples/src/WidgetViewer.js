/**
 * 展示部件用的组件
 * 组件分成两部分；左侧为组件部件配置对象的编辑区域；右侧为这个部件的展示区域。
 */
(function(){

	var html = [],
		toString = Object.prototype.toString;
	//左侧
	html.push('<div class="exp-viewer-left"><div class="exp-viewer-view">');
	html.push('<div class="exp-viewer-head">');
	html.push('<div class="exp-label">配置属性</div>');
	html.push('<div class="exp-excbtn">执行</div>');
	html.push('</div>');
	html.push('<div class="exp-viewer-view-body"><div class="exp-viewer-codeview"></div></div>');
	html.push('</div></div>');
	
	//右侧
	html.push('<div class="exp-viewer-right"><div class="exp-viewer-view">');
	html.push('<div class="exp-viewer-head">');
	html.push('<div class="exp-label"><span class="text">预览</span><span class="msg"></span></div>');
	html.push('</div>');
	html.push('<div class="exp-viewer-view-body"><div class="exp-viewer-demoview"></div></div>');
	html.push('</div></div>');
	
	var HTMP_TMP = html.join('');	

	var getTabString = function(layer){
		var r = [];
		for(var i=0;i<layer;i++){
			r.push('\t');
		}
		return r.join('');
	}
	var toStringForDate = function(d){
		return 'new Date('+d.getFullYear()+', '+d.getMonth()+', '+d.getDate()+', '+d.getHours()+', '+d.getMinutes()+', '+d.getSeconds()+')';
	};
	var toStringForFunction = function(fn,layer){
		return fn.toString();
	}
	var toStringForBoolean = function(b){
		return b ? 'true' : 'false';
	}
	var toStringForArray = function(arr, layer, objStack){
		var rel = ['['],
			i = 0,len = arr.length,o,
			nextLayer = layer+1,
			br = false;
		
		for(;i<len;i++){
			o = arr[i];
			//换行符
			if(br){
				rel.push(',');
			}
			else{
				br = true;
			}
			//换行符
			rel.push('\n');
			rel.push(getTabString(nextLayer));
			rel.push(toStringForValue(o, nextLayer, objStack));
		}	
		rel.push('\n');
		rel.push(getTabString(layer));
		rel.push(']');
		return rel.join('');
	}
	var toStringForString = function(s){
		return '"'+s+'"';
	}
	
	var toStringForObject = function(obj, layer, objStack){
		var rel = ['{'],
			i,o,br = false,
			nextLayer = layer+1;
			
		if(isA(objStack)){
			objStack.push(obj);
		}		
		else{
			objStack = [obj];
		}
		for(i in obj){
			o = obj[i];
			if((!isD(o) && !Cmp.isNative(o))
				|| objStack.indexOf(o) >= 0){
				continue;
			}
			if(br){
				rel.push(',');
			}
			else{
				br = true;
			}
			//换行符
			rel.push('\n');
			rel.push(getTabString(nextLayer));
			//属性名 
			rel.push(i);
			//分隔符
			rel.push(' : ');
			//属性值 
			rel.push(toStringForValue(o, nextLayer, objStack));
		}
		
		
		rel.push('\n');
		rel.push(getTabString(layer));
		rel.push('}');
		return rel.join('')
	}

	var toStringForValue = function(v, layer, objStack){
		if(isA(v)){
			return toStringForArray(v, layer, objStack);
		}
		if(isS(v)){
			return toStringForString(v);
		}
		if(isB(v)){
			return toStringForBoolean(v);
		}
		if(isF(v)){
			return toStringForFunction(v,layer);
		}
		if(isD(v)){
			return toStringForDate(v);
		}
		if(isO(v)){
			return toStringForObject(v, layer, objStack);
		}
		if(undefined === v){
			return 'undefined';
		}
		if(null === v){
			return 'null';
		}
		return v.toString();
	}

	Cmp.define('Exp.WidgetViewer',{
		extend : 'Cmp.Widget',
		cls : true,
		factory : function(ext){
			var SP = ext.prototype;
			return Cmp.extend(ext, {
				/**
				 * @cfg {String} module 可以被构建实例的模块标识名；
				 */
				/**
				 * @cfg {String/Object} initConfig 初始样例组件时候的初始化对象或者可以构成对象的一个JSON字符串；
				 */
			
				/**
				 * @private
				 * @overwrite
				 * 重写该方法，用于设定该部件使用的CSS;
				 */
				initComponent : function(){
					var me = this,
						cls = me.cls;
					//设定我们要用的CSS: 'app-logo'
					if(isA(cls)){
						cls.unshift('exp-viewer');
					}	
					else if(isS(cls)){
						cls = ['exp-viewer', cls];
					}
					else{
						cls = 'exp-viewer';
					}
					me.cls = cls;
					SP.initComponent.call(me);
					me.hideMsgTask = new Cmp.util.DelayedTask({
						scope : me
					})
				},
				/**
				 * @private
				 * @overwrite
				 */
				doRender : function(){
					var me = this;
					SP.doRender.call(me);
					me.el.update(HTMP_TMP);
					
					var dom,subDom;
					dom = me.el.dom;
					
					subDom = dom.firstChild.firstChild.firstChild.childNodes[1];
					me.runBtn = Cmp.get(subDom);
					me.runBtn.on('click', me.onClickRunBtn, me);
					
					subDom = dom.firstChild.firstChild.childNodes[1].firstChild;
					me.codeEditorBox = Cmp.get(subDom);
					if(ace){
						me.codeEditor = ace.edit(subDom);
						me.codeEditor.setTheme("ace/theme/clouds");
						me.codeEditor.session.setMode("ace/mode/javascript");
						var code = me.initConfig;
						if(!code){
							code = 'var cfg = {\n}';
						}
						else if(isO(code)){
							code = 'var cfg ='+toStringForObject(code, 0);
						}
						else if(isS(code)){
							code = 'var cfg = '+toStringForObject(eval('('+code+')'), 0);
						}
						me.codeEditor.setValue(code);
					}
					
					subDom = dom.childNodes[1].firstChild.firstChild.firstChild.childNodes[1];
					me.msgBox = Cmp.get(subDom);
					me.msgBox.setHideModal('display');
					me.msgBox.hide();
					subDom = dom.childNodes[1].firstChild.childNodes[1].firstChild;
					me.demoViewBox = Cmp.get(subDom);
					if(isS(me.module)){
						Cmp.require(me.module, me.onRequireModule, me);
					}
				},
				/**
				 * @private
				 */
				onRequireModule : function(clazz){
					var me = this;
					if(isO(clazz)){
						if(isF(clazz.render)){
							clazz.render(me.demoViewBox);
							me.moduleInstance = clazz;
						}
						else{
							me.demoViewBox.update('不能展示指定的模块，模块名：'+me.module+', <br>返回结果：'+JSON.stringify(clazz));
						}
					}
					else if(isF(clazz)){
						me.moduleClazz = clazz;
						if(isS(me.initConfig)){
							me.initConfig = eval('('+me.initConfig+')');
						}
//						putLog(JSON.stringify(me.initConfig));
						me.moduleInstance = new clazz(me.initConfig || {});
						me.moduleInstance.render(me.demoViewBox);
					}
				},
				/**
				 * @private
				 * 当点击'执行'按钮时，响应的方法。
				 */
				onClickRunBtn : function(){
					var me = this;
					if(!me.moduleClazz){
						me.demoLableBox.update('预览<spne style="color : red;padding-left:20px;">无法执行，所请求的模块不是一个构造方法。</span>');
					}
					else{
						var code = me.codeEditor.getValue();
						var ix = code.indexOf('{');
						if(ix >=0){
							code = code.substring(ix);
						}
						code = eval('('+code+')');
						if(me.moduleInstance){
							me.moduleInstance.destroy();
						}
						me.moduleInstance = new me.moduleClazz(code);
						me.moduleInstance.render(me.demoViewBox);
						me.showMsg('执行成功', 'green');
					}
				},
				/**
				 * @private
				 * 显示信息
				 * 
				 */
				showMsg : function(msg, color){
					var me = this;
					me.msgBox.update(msg);
					me.msgBox.setStyle('color', color);
					me.msgBox.show();
					me.hideMsgTask.cancel();
					me.hideMsgTask.run({
						handler : me.hideMsg,
						delay : 5000
					});
				},
				/**
				 * 隐藏信息
				 */
				hideMsg : function(){
					var me = this;
					me.msgBox.setStyle({
						'transition' : '0.5s ease',
						'color' : 'transparent'
					});
					window.setTimeout(function(){
						me.msgBox.setStyle({
							'transition' : '',
							'color' : ''
						});
						me.msgBox.hide();
					}, 600);
				}
			});
		}
	});
}()); 
