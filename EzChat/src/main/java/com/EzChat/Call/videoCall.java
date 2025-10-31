package com.EzChat.Call;


import com.EzChat.Entity.CallRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class videoCall {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @MessageMapping("/startCall")
    public void startCall(@Payload CallRequest request) {
        String roomId = request.getRoomId();
        simpMessagingTemplate.convertAndSend("/topic/call/" + roomId, roomId);
    }

    @MessageMapping("/endCall")
    public void endCall(@Payload CallRequest request) {
        simpMessagingTemplate.convertAndSend("/topic/call/end/" + request.getRoomId(), request.getRoomId());
    }
}