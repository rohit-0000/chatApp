package com.chatapp.chatApp.Controllers;

import com.chatapp.chatApp.Entity.CallMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class callContollers {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/call/signal/{roomId}")
    public void handleSignal(@DestinationVariable String roomId, @Payload CallMessage message){
        messagingTemplate.convertAndSend("/topic/call/"+roomId,message);
    }
}
