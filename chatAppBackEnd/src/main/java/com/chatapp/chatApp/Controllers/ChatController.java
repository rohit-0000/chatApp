package com.chatapp.chatApp.Controllers;

import com.chatapp.chatApp.Entity.ChatRoom;
import com.chatapp.chatApp.Entity.Message;
import com.chatapp.chatApp.Entity.User;
import com.chatapp.chatApp.Repository.MessageRepo;
import com.chatapp.chatApp.Services.ChatRoomService;
import com.chatapp.chatApp.Services.ImageService;
import com.chatapp.chatApp.Services.UserServices;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;


@RestController
@CrossOrigin("http://localhost:5173")
public class ChatController {
    @Autowired
    private ChatRoomService chatRoomService;
    @Autowired
    private ImageService imageService;
    @Autowired
    private UserServices userServices;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private MessageRepo messageRepo;

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId, @RequestBody Message message) {
        Optional<ChatRoom> chatRoom=chatRoomService.chatRoomRepo.findById(roomId);
        if(!chatRoom.get().getMember().contains(message.getSenderId().toHexString())) return null;
        chatRoomService.sendMessage(roomId, message);
        return message;
    }

    @Transactional
    @PostMapping("/sendChatMedia/{groupId}")
    public ResponseEntity<?> uploadChatFile(@RequestParam("chatFile") MultipartFile chatFile, @RequestPart("message") Message message,@PathVariable String groupId ){
        SecurityContextHolder.getContext().getAuthentication();

        try{
            List<String> fileID =imageService.uploadFile(chatFile);
            if (fileID.isEmpty()) return new ResponseEntity<>("Error in sending email",HttpStatus.BAD_REQUEST);
            message.setMessage(fileID.get(0));
            message.setPublic_Id(fileID.get(1));
//            simpMessagingTemplate.convertAndSend("/topic/room/"+groupId,message);
            sendMessage(groupId,message);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch(IOException e){
            return new ResponseEntity<>("Failed to send file",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/chat/delete/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable ObjectId id, @RequestBody String roomKey) throws IOException {
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        User user=userServices.userRepo.findByUserName(userName);
        Optional<ChatRoom> chatRoom=chatRoomService.chatRoomRepo.findById(roomKey);
        Optional<Message> message=messageRepo.findById(id);
        if(user.getId().equals(message.get().getSenderId()) ||chatRoom.get().getAdmin().contains(user.getId().toHexString())) {
            if(message.get().getPublic_Id()!=null) {
                imageService.deleteImg(message.get().getPublic_Id());
            }
            messageRepo.deleteById(id);
            simpMessagingTemplate.convertAndSend("/topic/room/"+roomKey+"/delete",id.toHexString());
            return  new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
