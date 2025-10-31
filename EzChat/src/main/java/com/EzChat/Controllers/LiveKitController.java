package com.EzChat.Controllers;//package com.chatapp.chatApp.Controllers;
//import io.livekit.server.AccessToken;
//import io.livekit.server.grants.VideoGrant;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/video")
//public class LiveKitController {
//
//    @Value("${livekit.api.key}")
//    private String apiKey;
//
//    @Value("${livekit.api.secret}")
//    private String apiSecret;
//
//    @Value("${livekit.url}")
//    private String livekitUrl;
//
//    @PostMapping("/get-token")
//    public Map<String, String> getToken(@RequestParam String userName, @RequestParam String roomName) {
//        AccessToken token = new AccessToken(apiKey, apiSecret)
//                .setIdentity(UUID.randomUUID().toString())
//                .setName(userName)
//                .withGrants(new VideoGrant(roomName));
//
//        String jwt = token.toJwt();
//
//        return Map.of(
//                "url", livekitUrl,
//                "token", jwt
//        );
//    }
//}