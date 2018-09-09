/**
 * @static Cmp.util.AjaxProxy
 * 使用Ajax进行数据传输/发送的工具类
 * 
 *
 * @version 1.0.0
 * @since 2016-06-10
 * @author Jinhai
 */
(function(){

		//最大同时执行Ajax任务的配置数量；	
	var limitTaskCount = 20,
		//等待请求的最长时间，默认: 30秒
		timeoutTimes = 30000,
		//等待超时后，重试的最大次数；
		retryTimes = 3,
		//当前执行任务的数量；
		activeCount = 0,
		//等待执行的任务队列；先进先出；
	 	taskList = [];
	 	
	 var toUrlParamString = function(o){
	 	var n,v,rel = [],flag = false,s;
	 	for(n in o){
	 		if(flag){
	 			rel.push('&');
	 		}
	 		else{
	 			flag = true;
	 		}
	 		v = o[n];
	 		rel.push(n);
	 		rel.push('=');
	 		if(isS(v) || isN(v)){
	 			rel.push(v);
	 		}
	 		else if(isB(v)){
	 			rel.push(v?'true':'false');
	 		}
	 		else if(isA(v)){
	 			rel.push(v.join(','));
	 		}
	 		else if(isO(v)){
	 			rel.push(JSON.stringify(v));
	 		}
	 		else if(isD(v)){
	 			//年 
				rel.push(v.getFullYear());	
				//月
				rel.push('-');
				s = v.getMonth()+1;
				if(s < 10){
					rel.push('0');	
				}
				rel.push(s);
				//日	
				rel.push('-');
				s = v.getDate();
				if(sv < 10){
					rel.push('0');	
				}
				rel.push(s);	
				//小时
				rel.push(' ');
				s = v.getHours();
				if(s<10){
					rel.push('0');
				}
				rel.push(s);
				//分
				rel.push(':');	
				s = v.getMinutes();
				if(s<10){
					rel.push('0');
				}
				rel.push(s);
				//秒
				rel.push(':');	
				s = v.getSeconds();
				if(s<10){
					rel.push('0');
				}
				rel.push(s);
				
	 		}
	 	}
 		return rel.join('');
	 }	

	/**
	 * HTTP请求代理，为了屏蔽低版本IE以及其他的没有XMLHttpRequest对象的时候；
	 * 
	 * @param {String} method (必须)方法名，'GET'或'POST'
	 * @param {String} url (必须)访问地址；
	 * @param {String} paramString (可选)发送的字符串数据
	 * @param {Object} headerConfig (可选)报头配置
	 * @param {Function} cb 回调方法;传入对象；error为错误信息；没有错误时；
	 *			result 获得的原生数据为一个字符串； 
	 */
	var HttpRequest = function(method, url, paramString, headerConfig, cb){
		var me = this,
			_request,
			_isLowVer = false;
		
		//创建XMLHttpRequest对象
		var createHttpRequest = function(){
			if(window.XMLHttpRequest){
				_request = new XMLHttpRequest();
			}
			else if (window.ActiveXObject){
				//低版本
				_request = new ActiveXObject("Microsoft.XMLHTTP");
				_isLowVer = true;
			}	
		}
		me.requst = function(){
			createHttpRequest();
			_request.open(method || 'GET',url,true);
			if('POST' === method && isS(paramString)){
				_request.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");
			}
			else{
				_request.setRequestHeader("Content-type","charset=UTF-8");
			}
			_request.send(paramString);
			_request.onreadystatechange = function(){
				if(_request.readyState==4){
					//成功了
					if(_request.status==200){
						cb({
							result : _request.responseText
						});
					}
					else{
						if(_request.status >= 500 && _request.status < 600){
							cb({
								error : '服务器出现错误'
							});
						}
						else{
							cb({
								error : '指定的路径不存在'
							});
						}
					}
				}
			}
		}
	}

	var Task = function(cfg){
		var me = this,
			paramString = isO(cfg.param) ? toUrlParamString(cfg.param) : undefined,
			_requsting = false,
			_runTime = 0,
			_tryTime = 0,
			_timeout = 0,
			_querySeq = 0;
		
		
		
		
		/**
		 * @private
		 * 当超时之后，调用的方法；
		 */
		var onTimeout = function(){
			if(_requsting === true){
				if(_runTime < _tryTime){
					putLog('连接超时，自动重试连接次数:'+_runTime, 2);
					startRequst();
				}
				else{
					Cmp.invoke(cfg.callback, cfg.scope, [{
						error : '连接超时'
					}]);
				}
			}
		}
		
		me.timeoutTask = new Cmp.util.DelayedTask({
			handler : onTimeout,
			scope : me 
		});
		
		var doRequst = function(seq){
			//method, url, paramString, headerConfig, cb
			var url = [cfg.url];
			//在最后增加当前时间和随机数
			if(cfg.url.indexOf('?') > -1){
				url.push('&rbtv=');
			}
			else{
				url.push('?rbtv=');
			}
			url.push(new Date().getTime());
			var req = new HttpRequest(cfg.type, url.join(''), paramString, {}, function(result){
				if(_querySeq === seq){
					me.timeoutTask.cancel();
					_requsting = false;
					Cmp.invoke(cfg.callback, cfg.scope, [result]);
				}
			});
			req.requst();
		}
		
		var startRequst = function(){
			_runTime++;
			doRequst(++_querySeq);
			me.timeoutTask.run({delay:_timeout});
		}
		
		/**
		 * 执行数据请求；
		 * @param {Number} timeout 超时时间
		 * @param {Number} tryTime 重试次数
		 */
		me.execute = function(timeout, tryTime){
			if(_requsting){
				return false;
			}
			_requsting = true;
			_tryTime = tryTime;
			_timeout = timeout;
			startRequst();
		}
		
	}
	
	/**
	 * 检测当前执行任务的数量，如果没有超过最大限制，则从队列中取出一个任务；
	 * 否则继续等待；
	 */
	var executeTask = function(){
		if(activeCount < limitTaskCount && taskList.length > 0){
			var t = taskList.shift();
			t.execute(timeoutTimes, retryTimes);
		}
	}

	var Proxy = {
		/**
		 * 设定每次请求等待的最长时间；默认配置为30秒；
		 * @param {Number} timeout 时间值，单位：毫秒；不得小于10秒数；
		 */
		setTimeout : function(timeout){
			if(isN(timeout) && timeout > 10000){
				timeoutTimes = timeout;
			}
			else{
				timeoutTimes = 30000;
			}
		},
		/**
		 * 设定超时后的重试次数，默认配置为3次
		 * @param {Number} time 重试次数，不得小于1；
		 */
		setRetryTime : function(time){
			if(isN(time) && time > 0){
				retryTimes = time;
			}
			else{
				retryTimes = 3;
			}
		},
		/**
		 * 设定最大的同时执行数据请求任务的数量，默认值为20；
		 * @pamra {Number} count 数量
		 */
		setMaxTaskCount : function(count){
			if(isN(count) && count > 1){
				limitTaskCount = count;
			}
			else{
				limitTaskCount = 20;
			}
		},
		/**
		 * 采用GET形式请求结果，该形式多用于数据查询；
		 *
		 * @param {String} url 链接地址
		 * @param {Object} param 传递的数据；要使用名值对形式对数据进行封装；
		 *		并且每个属性值都可以使用JSON.stringify方法对其字符串化；
		 * @param {Function} callback 获得返回数据后或者出现错误后调用的方法。届时传入数据对象，如下：
		 *		{String} error 错误信息；如果正常返回数据，该属性等于undifined或false;
		 *		{String} result 获得的原生数据为一个字符串； 
		 * @param {Object} scope 调用回调方法时的this设定
		 */
		get : function(url, param, callback, scope){
			//拼接url
			var rel = [url],
				flag, n,v;
			
			if(isO(param)){
				if(url.indexOf('?') > -1){
					rel.push('&');
				}
				else{
					rel.push('?');
				}
				rel.push(toUrlParamString(param));
			}
		
			var task = new Task({
				type : 'GET',
				url : rel.join(''),
				param : undefined,
				callback : callback,
				scope : scope
			});
			taskList.push(task);
			executeTask();
		},
		/**
		 * 采用POST形式请求结果，该形式多用于数据提交；
		 *
		 * @param {String} url 链接地址
		 * @param {Object} param 传递的数据；要使用名值对形式对数据进行封装；
		 *		并且每个属性值都可以使用JSON.stringify方法对其字符串化；
		 * @param {Function} callback 获得返回数据后或者出现错误后调用的方法。届时传入数据对象，如下：
		 *		{String} error 错误信息；如果正常返回数据，该属性等于undifined或false;
		 *		{String} result 获得的原生数据为一个字符串； 
		 * @param {Object} scope 调用回调方法时的this设定
		 */
		post : function(url, param, callback, scope){
			var task = new Task({
				type : 'POST',
				url : url,
				param : param,
				callback : callback,
				scope : scope
			});
			taskList.push(task);
			executeTask();
		}
		
	}
	
	Cmp.define('Cmp.util.AjaxProxy',{
		factory : function(){
			return Proxy;
		}
	});
}());