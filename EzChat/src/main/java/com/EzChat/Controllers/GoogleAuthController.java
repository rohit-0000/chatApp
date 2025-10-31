package com.EzChat.Controllers;


import com.EzChat.Entity.User;
import com.EzChat.Repository.UserRepo;
import com.EzChat.Services.UserDetailServiceImp;
import com.EzChat.Utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/auth/google")
public class GoogleAuthController {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;
    @Value("${backend.url}")
    private String redirect_uri;
    @Value("${redirect.url.frontend}")
    private String frontend_redirect_uri;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private UserDetailServiceImp userDetailServiceImp;


    @GetMapping("/callback")
    public ResponseEntity<?> handleGoogleCallback(@RequestParam String code){
        try{
            String tokenEndpoint = "https://oauth2.googleapis.com/token";
            MultiValueMap<String,String> params = new LinkedMultiValueMap<>();
            params.add("code",code);
            params.add("client_id",clientId);
            params.add("client_secret",clientSecret);
            params.add("redirect_uri",redirect_uri+"/auth/google/callback");
            params.add("grant_type","authorization_code");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String,String>> request = new HttpEntity<>(params,headers);
            ResponseEntity<Map> tokenResponse=restTemplate.postForEntity(tokenEndpoint,request,Map.class);
            String idToken = (String) tokenResponse.getBody().get("id_token");
            String userInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token="+idToken;
            ResponseEntity<Map> userInfoResponse = restTemplate.getForEntity(userInfoUrl,Map.class);
            if (userInfoResponse.getStatusCode() == HttpStatus.OK){
                Map<String,Object> userInfo = userInfoResponse.getBody();
                String email = (String) userInfo.get("email");
                try{
                    userDetailServiceImp.loadUserByUsername(email);
                }
                catch (Exception e){
                    User user=new User();
                    user.setEmail(email);
                    user.setUserName(email);
                    user.setName((String)userInfo.get("name"));
                    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    user.setRoles(Arrays.asList("USER"));
                    userRepo.save(user);
                }
//                UsernamePasswordAuthenticationToken authentication =
//                        new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
//                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwtToken=jwtUtils.generateToken(email);
                String redirectUrl = frontend_redirect_uri + jwtToken;
                return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();

            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }catch(Exception e){
            log.error("Exception occurred "+e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
