package com.suncht.vertx;

import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;

public class ServerExample {
	public static void main(String[] args) {
		HttpServer server = Vertx.factory.vertx().createHttpServer();

		server.requestHandler(request -> {

			// 每一次请求时，都会调用这个Handler
			HttpServerResponse response = request.response();
			response.putHeader("content-type", "text/plain");

			// 向响应中写入内容，并发送到前端
			response.end("Hello World!");
		});

		server.listen(8080);
	}
}
