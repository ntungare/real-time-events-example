package com.chat.server.configs;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class GatewayConfig {

    @Bean
    RouteLocator routeLocator(RouteLocatorBuilder routeLocatorBuilder) {
        return routeLocatorBuilder.routes()
                .route(routerFn -> routerFn
                        .path("/get")
                        .filters(f -> f.addRequestHeader("Hello", "World"))
                        .uri("http://httpbin.org:80"))
                .route(routerFn -> routerFn
                        .path("/ui/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("http://localhost:8181"))
                .route(routerFn -> routerFn
                        .path("/assets/**")
                        .uri("http://localhost:8181"))
                .route(routerFn -> routerFn
                        .path("/chatNode/ws/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("ws://localhost:8282"))
                .route(routerFn -> routerFn
                        .path("/chatNode/other/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8282"))
                .route(routerFn -> routerFn
                        .path("/chatSpring/ws/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("ws://localhost:8383"))
                .route(routerFn -> routerFn
                        .path("/chatSpring/other/**")
                        .filters(f -> f.stripPrefix(2))
                        .uri("http://localhost:8383"))
                .route(routerFn -> routerFn
                        .path("/chatSse/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("http://localhost:8484"))
                .build();
    }
}
