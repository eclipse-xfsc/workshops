package gxfs.ws.drinks.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;


/**
 * Specifies the application's security configuration.
 */
@Configuration
@EnableWebSecurity //(debug = true)
public class SecurityConfig { 

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
          .csrf()
          .disable()
          .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
          .oauth2Login(oauth2Login -> oauth2Login.loginPage("/oauth2/authorization/fc-client-oidc"))
          .oauth2Client(Customizer.withDefaults());
        return http.build();
    }
       
}