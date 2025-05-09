package com.chatapp.chatApp.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class Cors {
//    @Value("${frontend.url}")
//    String frontEndUrl1;
//    @Value("${frontend.url2}")
//    String frontEndUrl2;
    @Value("${frontend.local}")
    String frontEndLocal;

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE) // Ensure it runs early
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of(frontEndLocal));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "*"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
