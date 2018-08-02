package com.sample.suncht.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

import com.sample.suncht.websocket.HttpSessionIdHandshakeInterceptor;
import com.sample.suncht.websocket.PresenceChannelInterceptor;

/**
 * 
 * @ClassName: WebSocketStompConfig
 * @Description: springboot websocket stomp配置 
 * 参考：
 * 	https://docs.spring.io/spring/docs/4.0.1.RELEASE/spring-framework-reference/html/websocket.html
 *	https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#websocket-fallback-sockjs-client
 */

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketStompConfig extends AbstractWebSocketMessageBrokerConfigurer {

	/**
	 * 注册stomp的端点（必须）
	 */
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// 允许使用socketJs方式访问，访问点为webSocketServer
		// 在网页上我们就可以通过这个链接 http://localhost:8080/webSocketServer 来和服务器的WebSocket连接
		registry.addEndpoint("/webSocketServer").withSockJS();
	}

	/**
	 * 配置信息代理（必须）
	 */
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		// 订阅Broker名称
		registry.enableSimpleBroker("/queue", "/topic");
		// 全局使用的消息前缀（客户端订阅路径上会体现出来）
		registry.setApplicationDestinationPrefixes("/ms");
		// 点对点使用的订阅前缀（客户端订阅路径上会体现出来），不设置的话，默认也是/user/
		// registry.setUserDestinationPrefix("/user/");
	}

	/**
	 * 消息传输参数配置（可选）
	 */
	@Override
	public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
		registry.setMessageSizeLimit(8192) //设置消息字节数大小
				.setSendBufferSizeLimit(8192)//设置消息缓存大小
				.setSendTimeLimit(10000); //设置消息发送时间限制毫秒
	}

	/**
	 * 输入通道参数设置（可选）
	 */
	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.taskExecutor().corePoolSize(4) //设置消息输入通道的线程池线程数
				.maxPoolSize(8)//最大线程数
				.keepAliveSeconds(60);//线程活动时间
		registration.setInterceptors(presenceChannelInterceptor());
	}

	/**
	 * 输出通道参数设置（可选）
	 */
	@Override
	public void configureClientOutboundChannel(ChannelRegistration registration) {
		registration.taskExecutor().corePoolSize(4).maxPoolSize(8);
		registration.setInterceptors(presenceChannelInterceptor());
	}

	@Bean
	public HttpSessionIdHandshakeInterceptor httpSessionIdHandshakeInterceptor() {
		return new HttpSessionIdHandshakeInterceptor();
	}

	@Bean
	public PresenceChannelInterceptor presenceChannelInterceptor() {
		return new PresenceChannelInterceptor();
	}

}