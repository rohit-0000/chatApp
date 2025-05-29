package com.chatapp.chatApp.Controllers;

import com.chatapp.chatApp.Entity.AdminRequest;
import com.chatapp.chatApp.Entity.ChatRoom;
import com.chatapp.chatApp.Entity.Friends;
import com.chatapp.chatApp.Entity.User;
import com.chatapp.chatApp.Repository.ChatRoomRepo;
import com.chatapp.chatApp.Services.ChatRoomService;
import com.chatapp.chatApp.Services.ImageService;
import com.chatapp.chatApp.Services.UserServices;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/chatroom")
public class ChatRoomController {
    @Autowired
    ChatRoomService chatRoomService;
    @Autowired
    UserServices userServices;
    @Autowired
    private ImageService imageService;
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    ChatRoomRepo chatRoomRepo;

    @PostMapping("/create")
    public ResponseEntity<?> createChatRoom(@RequestBody ChatRoom chatRoom){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        User userInDb=userServices.findByUsername(userName);
        return chatRoomService.createChatRoom(chatRoom,userInDb);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteChatRoom(@PathVariable String id){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        User user=userServices.findByUsername(userName);

        chatRoomService.deleteRoom(id,user);
        simpMessagingTemplate.convertAndSend("/topic/chatroom/delete", id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PutMapping("update-room")
    public ResponseEntity<?> updateroom(@RequestBody ChatRoom chatRoom) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userServices.findByUsername(userName);

        return chatRoomService.update(user, chatRoom);
    }

    @PostMapping("/join-group")
    public ResponseEntity<?> addMember(@RequestBody String roomKey){
        Authentication authentication =SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        return chatRoomService.JoinRoom(userName,roomKey);
    }

    @PostMapping("/leave-group")
    public ResponseEntity<?> removeMember(@RequestBody String roomKey) throws IOException {
        Authentication authentication =SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        chatRoomService.leaveGroup(userName,roomKey);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PostMapping("/add-admin")
    public ResponseEntity<?> makeAdmin(@RequestBody AdminRequest adminRequest){
        Authentication authentication =SecurityContextHolder.getContext().getAuthentication();

        if(adminRequest.getUserId()==null) System.out.println("userId");
        if(adminRequest.getRoomKey()==null) System.out.println("roomKey");
        String userName=authentication.getName();
        chatRoomService.makeAdmin(userName,adminRequest.getUserId(),adminRequest.getRoomKey());
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PostMapping("/remove-admin")
    public  ResponseEntity<?> removeAdmin(@RequestBody AdminRequest adminRequest){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        chatRoomService.removeAdmin(userName,adminRequest.getUserId(),adminRequest.getRoomKey());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/remove-Member")
    public  ResponseEntity<?> removeMember(@RequestBody AdminRequest adminRequest){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        chatRoomService.removeMember(userName,adminRequest.getUserId(),adminRequest.getRoomKey());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/group-img/{groupId}")
    public ResponseEntity<String> uploadImg(@RequestParam("image") MultipartFile groupImg,@PathVariable String groupId ){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        User userInDb=userServices.findByUsername(userName);
        if(!groupImg.getContentType().startsWith("image/")){
            return new ResponseEntity<>("Invalid file type",HttpStatus.BAD_REQUEST);
        }
        try{
            String imageurl=imageService.uploadImage(groupImg,userInDb,groupId);
            if (imageurl.isEmpty()) return new ResponseEntity<>("UnAuthorized to change group image",HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(imageurl,HttpStatus.OK);
        }
        catch(IOException e){
            return new ResponseEntity<>("Image upload failed"+e,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete-img/{groupId}")
    public ResponseEntity<?> deleteImg(@PathVariable String groupId ){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        User userInDb=userServices.findByUsername(userName);
        try{
            imageService.deleteImg(userInDb,groupId);
            return new ResponseEntity<>("",HttpStatus.OK);
        }
        catch(IOException e){
            return new ResponseEntity<>("faile to delete",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/roomMembers")
    public ResponseEntity<?> getRoomMembers(@RequestParam String roomKey){
        SecurityContextHolder.getContext().getAuthentication();
        Optional<ChatRoom> room=chatRoomRepo.findById(roomKey);
        Map<ObjectId,Friends> ans=new HashMap<>();
        for(int i=0;i<room.get().getMember().size();i++){
            Optional<User> getUser=userServices.userRepo.findById(new ObjectId(room.get().getMember().get(i)));
            ans.put(getUser.get().getId(), new Friends(
                    getUser.get().getUserName(),
                    getUser.get().getName(),
                    getUser.get().getAbout(),
                    getUser.get().getUserImageUrl()
            ));
        }
        return new ResponseEntity<>(ans,HttpStatus.OK);
    }
}
