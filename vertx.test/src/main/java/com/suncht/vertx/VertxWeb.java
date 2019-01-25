package com.suncht.vertx;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServer;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;

public class VertxWeb extends AbstractVerticle {
	public static Vertx vertx;

	public static void main(String[] args) {
		vertx = Vertx.vertx();
		// 部署发布rest服务
		vertx.deployVerticle(new VertxWeb());
	}

	@Override
	public void start() throws Exception {
		HttpServer httpServer = vertx.createHttpServer();
		final Router router = Router.router(vertx);
		router.route().handler(CorsHandler.create("*").allowedMethod(HttpMethod.GET).allowedMethod(HttpMethod.POST).allowedMethod(HttpMethod.OPTIONS).allowedHeader("X-PINGARUNER").allowedHeader("Content-Type"));
		router.route().handler(BodyHandler.create());
		router.get("/searchResult").handler(this::searchResult);
		httpServer.requestHandler(router::accept).listen(8080);
	}

	private void searchResult(RoutingContext context) {
		context.response().end("ok");
		System.out.println(context.getBodyAsString());
	}
}
