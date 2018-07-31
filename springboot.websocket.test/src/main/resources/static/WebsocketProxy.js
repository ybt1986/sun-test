(function() {
	var StompProxy = function(websocketUrl) {
		this.socket = new SockJS(websocketUrl);
		this.stompClient = Stomp.over(this.socket);
	};
	
	StompProxy.prototype.connect = function(param, connectCallback, errorCallBack) {
		this.stompClient.connect(param||{}, connectCallback, errorCallBack);
	};
	
	StompProxy.prototype.send = function(sendUrl, param, messageJson) {
		this.stompClient.send(sendUrl, param||{}, messageJson);
	};
	
	StompProxy.prototype.subscribe = function(subscribeUrl, subscribeCallback) {
		this.stompClient.subscribe(subscribeUrl, subscribeCallback);
	}
	
	window.WebsocketProxy = StompProxy;
})();