/**
 * @class Cmp.util.KeyMap
 * @extend Object
 * 键盘操作影射；对于键盘的各种键位字符处理影射。
 * 
 * @version 2.0.0
 * @since 2016-03-31
 * @author Jinhai
 */
(function(){

	/**
	 * 
	 * @param {Element} target 本次键盘事件绑定的目标对象；
	 * @param {String} keyEventName 所要绑定的键盘事件名，可以设定的值有：'keypress','keydown','keyup'
	 */
	var Rel = function(target, keyEventName){
		var me = this,
			//白名单标记
			prevented = false,
			//已经绑定事件的标记
			bingedKeyEvent = false;
		me.keyMaps = {};
		me.eventProxy = new Cmp.util.EventProxy();
		
		/**
		 * @private
		 * 响应键盘事件的处理方法
		 */
		var onKeyEvent = function(ev){
			var c = ev.keyCode;
			c = c ? c+'' : false;
//			putLog('KeyMap#onKeyEvent> keyCode:'+c);
			c = me.keyMaps[c];
			if(c){
				if(isF(c.handler)){
					var args = [ev, target];
					if(isA(c.args)){
						args = args.concat(c.args);
					}
					if(false !== c.handler.apply(c.scope || window, args)){
						me.eventProxy.fire(ev, target);
					}
				}
				else{
					me.eventProxy.fire(ev, target);
				}
			}
			else if(!prevented){
				me.eventProxy.fire(ev, target);
			}
			else{
				ev.preventDefault();
			}
		}
		
		/**
		 *  绑定键盘事件，如果已经绑定则忽略本次请求。
		 */
		me.bindKeyEvent = function(){
			if(!bingedKeyEvent){
				bingedKeyEvent = true;
				target.on(keyEventName, onKeyEvent, me);
			}
		}
		/**
		 * 释放键盘事件
		 */
		me.releaseKeyEvent = function(){
			if(bingedKeyEvent){
				bingedKeyEvent = false;
				target.un(keyEventName, onKeyEvent, me);
			}
		}
		
		/**
		 * 将键盘事件分发策略为白名单性质。
		 * 暨当键盘按下的键不再列表中时，将不再继续分发事件(参考：JavaScript关于Event#stopPropagation()的说明)，并禁止浏览器对该事件进行响应(参考：JavaScript关于Event#preventDefault()的说明)。
		 */
		me.preventKeyEvent = function(){
			prevented = true;
		}
		
		/**
		 * 将键盘事件分发策略不再使用白名单。
		 */
		me.unpreventKeyEvent = function(){
			prevented = false;
		}
		
		/**
		 * 销毁该影射，并释放所有监听的事件
		 */
		me.distory = function(){
			me.releaseKeyEvent();
			
			me.eventProxy.destory();

			delete me.keyMaps;
			delete me.eventProxy;
		}
	};
	
	Rel.prototype = {
	
		/**
		 * 添加键盘事件监听方法。
		 * 所添加的方法会在键为指定方法调用后，被调用。调用该方法时，会传入所发生的event对象，绑定的Dom对象；
		 * @param {Fucntion} handler 功能方法
		 * @param {Object} scope 调用功能方法时设定的this对象
		 */
		addListener : function(handler, scope){
			if(isF(handler)){
				this.eventProxy.addListener(handler, scope);
			}
		},
		/**
		 * 移除键盘事件监听方法。
		 * @param {Fucntion} handler 功能方法
		 * @param {Object} scope 调用功能方法时设定的this对象
		 */
		removeListener : function(handler, scope){
			if(isF(handler)){
				this.eventProxy.removeListener(handler, scope);
			}
		},
		/**
		 * 对指定的键进行响应。
		 *
		 * @param {String} keyCode (必须)键编码值或者是由编码值与调用方法组成的对象：
		 * @param {Fucntion} handler (可选)响应事件的回调方法，调用该方法时，会传入所发生的event对象，绑定的Dom对象，以及传入的追加参数。
		 *		如果被调用方法返回false；将不再调用通过#addListener()方法传入的方法。
		 * @param {Object} scope (可选)调用handler时设定的this对象
		 * @param {Array} args (可选)调用handler时，追加的其他参数。
		 */
		addKey : function(keyCode, handler, scope, args){
			var me = this;
			if(isO(keyCode)){
				scope = keyCode.scope;
				args = keyCode.args;
				var	i,v;
				for(i in keyCode){
					if('scope' === i
						|| 'args' === i){
						continue;
					}
					v = keyCode[i];
					i = i+'';
					me.keyMaps[i] = {
						handler : v,
						scope : scope,
						args : args
					};
				}
			}
			else if(isN(keyCode) || isS(keyCode)){
				keyCode = keyCode + '';
				me.keyMaps[keyCode] = {
					handler : handler,
					scope : scope,
					args : args
				};
			}
		},
		/**
		 * 移除对指定键的响应；
		 * @param {String/Number/Array} keyCode (必须)键编码值或编码值组成的数组；
		 */
		removeKey : function(keyCode){
			var me = this;
			
			if(isA(keyCode)){
				for(var i=0,len = keyCode.length, n; i<len;i++){
					n = keyCode[i]+'';
					delete me.keyMaps[n];
				}
			}
			else if(isN(keyCode) || isS(keyCode)){
				keyCode = keyCode+'';
				delete me.keyMaps[keyCode];
			}
		}
	};
	Rel.prototype.on = Rel.prototype.addListener;
	Rel.prototype.un = Rel.prototype.removeListener;
	
	Cmp.define('Cmp.util.KeyMap',{
		factory : function(){
			return Rel;
		}
	});
}());