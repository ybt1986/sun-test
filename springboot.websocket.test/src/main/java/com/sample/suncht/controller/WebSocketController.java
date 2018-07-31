package com.sample.suncht.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import com.sample.suncht.model.ClientMessage;
import com.sample.suncht.model.ServerMessage;

@Controller
public class WebSocketController {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@MessageMapping("/sendTest")
	@SendTo("/topic/subscribeTest")
	public ServerMessage sendDemo(ClientMessage message) {
		logger.info("接收到了信息" + message.getName());
		return new ServerMessage("你发送的服务返回消息为:" + message.getName());
	}

	@SubscribeMapping("/subscribeTest")
	public ServerMessage sub() {
		logger.info("XXX用户订阅了我。。。");
		return new ServerMessage("感谢你订阅了我。。。");
	}

}