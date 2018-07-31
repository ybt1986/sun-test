package com.sample.suncht.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.sample.suncht.model.ServerMessage;

@Service
public class MessageProductor {
	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	// 客户端只要订阅了/topic/subscribeTest主题，调用这个方法即可
	public void templateTest(String uuid) {
		messagingTemplate.convertAndSend("/topic/subscribeTest", new ServerMessage("服务器主动推的数据 : " + uuid));
	}
}
