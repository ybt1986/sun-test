(function() {
	/**
	 * Stomp的API可查看：https://blog.csdn.net/jqsad/article/details/77745379
	 */
	var StompProxy = function(websocketUrl, heartbeat) {
		this.socket = new SockJS(websocketUrl);
		this.stompClient = Stomp.over(this.socket);
		if(heartbeat) {
			//心跳检测机制
			this.stompClient.heartbeat.outgoing = heartbeat.outgoing || 20000;
			this.stompClient.heartbeat.incoming = heartbeat.incoming || 0;
		}
	};
	
	/**
	 * 发起连接
	 * headers表示客户端的认证信息
	 * connectCallback 表示连接成功时（服务器响应 CONNECTED 帧）的回调方法； 
		errorCallback 表示连接失败时（服务器响应 ERROR 帧）的回调方法，非必须；
	 */
	StompProxy.prototype.connect = function(headers, connectCallback, errorCallBack) {
		this.stompClient.connect(headers||{}, connectCallback, errorCallBack);
	};
	
	/**
	 * 断开连接
	 */
	StompProxy.prototype.disconnect = function(disconnectCallback) {
		disconnectCallback && disconnectCallback();
	};
	
	/**
	 * 发送信息
	 * destination url 为服务器 controller中 @MessageMapping 中匹配的URL，字符串，必须参数； 
		headers 为发送信息的header，JavaScript 对象，可选参数； 
		body 为发送信息的 body，字符串，可选参数；
	 */
	StompProxy.prototype.send = function(sendUrl, param, messageJson) {
		this.stompClient.send(sendUrl, param||{}, messageJson);
	};
	
	/**
	 * 订阅、接收信息
	 * destination url 为服务器 @SendTo 匹配的 URL，字符串； 
		callback 为每次收到服务器推送的消息时的回调方法，该方法包含参数 message； 
		headers 为附加的headers，JavaScript 对象；什么作用？ 
		该方法返回一个包含了id属性的 JavaScript 对象，可作为 unsubscribe() 方法的参数；
	 */
	StompProxy.prototype.subscribe = function(subscribeUrl, subscribeCallback, headers) {
		var subscribeObj = this.stompClient.subscribe(subscribeUrl, subscribeCallback, headers||{});
		return subscribeObj;
	};
	
	/**
	 * 取消订阅
	 */
	StompProxy.prototype.unsubscribe = function(subscribeObj) {
		subscribeObj && subscribeObj.unsubscribe();
	};
	
	/**
	 * STOMP 客户端默认将传输过程中的所有 debug 信息以 console.log() 形式输出到客户端浏览器
	 */
	StompProxy.prototype.debug = function(debugCallback) {
		this.stompClient.debug = function(str) {
			window.console && window.console.log(str);
			debugCallback && debugCallback(str);
		};
	};
	
	window.WebsocketProxy = StompProxy;
})();