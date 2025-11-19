package com.chat.ws.configs;

import com.chat.ws.controllers.MessageHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Configuration(proxyBeanMethods = false)
@EnableWebSocket
public class WebSocketConfig {

    @Bean
    WebSocketConfigurer webSocketConfigurer(
            final MessageHandler messageHandler,
            final HandshakeInterceptor userIdInterceptor) {
        return registry -> registry
                .addHandler(messageHandler, "/ws/*")
                .addInterceptors(userIdInterceptor)
                .setAllowedOrigins("*");
    }

    @Bean
    public HandshakeInterceptor userIdInterceptor() {
        return new HandshakeInterceptor() {
            @Override
            public boolean beforeHandshake(
                    final ServerHttpRequest request,
                    final ServerHttpResponse response,
                    final WebSocketHandler wsHandler,
                    final Map<String, Object> attributes) {

                // Get the URI segment corresponding to the auction id during handshake
                final String path = request.getURI().getPath();
                final String userId = path.substring(path.lastIndexOf('/') + 1);

                // This will be added to the websocket session
                attributes.put("userId", userId);
                return true;
            }

            @Override
            public void afterHandshake(
                    final ServerHttpRequest request,
                    final ServerHttpResponse response,
                    final WebSocketHandler wsHandler,
                    final Exception exception) {

            }
        };
    }
}
