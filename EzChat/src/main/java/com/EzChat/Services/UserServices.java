package com.EzChat.Services;


import com.EzChat.Entity.ChatRoom;
import com.EzChat.Entity.User;
import com.EzChat.Repository.UserRepo;
import com.EzChat.Utils.MailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

@Service
public class UserServices {
   @Autowired
   public UserRepo userRepo;
   @Autowired
   private ChatRoomService chatRoomService;
   @Autowired
   private MailUtils mailUtils;
   private static final PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();
   public User findByUsername(String userName){
       return userRepo.findByUserName(userName);
   }
   public User findByEmail(String email){
       return userRepo.findByEmail(email);
   }
   @Transactional
   public void createNewUser(User user) throws IOException {
       user.setPassword(passwordEncoder.encode(user.getPassword()));
       user.setRoles(Arrays.asList("USER"));
       userRepo.save(user);
       String html = new String(Files.readAllBytes(Paths.get("src/main/resources/static/welcome.html")));
       html = html.replace("{{name}}", user.getName());
       html = html.replace("{{year}}", String.valueOf(LocalDateTime.now().getYear()));
       mailUtils.sendMail(user.getEmail(), "Welcome to EZ Chat 🎉", html);
   }

   public ResponseEntity<?> updateUser(User newUser,User oldUser){
       if(newUser.getUserName()!=null && !newUser.getUserName().isEmpty() && !newUser.getUserName().equals(oldUser.getUserName())){
           User updatedUser=userRepo.findByUserName(newUser.getUserName());
           if(updatedUser!=null) return new ResponseEntity<>("user already exist with this userName", HttpStatus.BAD_REQUEST);
           oldUser.setUserName(newUser.getUserName());
       }
       if(newUser.getUserName()!=null&&!newUser.getPassword().isEmpty()){
           oldUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
       }
       if(newUser.getName()!=null && !newUser.getName().isEmpty() && !newUser.getName().equals(oldUser.getName())) {
            oldUser.setName(newUser.getName());
       }
       if(newUser.getEmail()!=null && !newUser.getEmail().isEmpty() && !newUser.getEmail().equals(oldUser.getEmail())){
            User updatedUser=userRepo.findByEmail(newUser.getEmail());
            if(updatedUser!=null)  return new ResponseEntity<>("user already exist with this email", HttpStatus.BAD_REQUEST);
            oldUser.setEmail(newUser.getEmail());
       }
       if(newUser.getAbout()!=null && !newUser.getAbout().isEmpty() && !newUser.getAbout().equals(oldUser.getAbout())){
           oldUser.setAbout(newUser.getAbout());
       }
       userRepo.save(oldUser);
       return new ResponseEntity<>(oldUser,HttpStatus.CREATED);
   }

   public void deleteUser(User user){
       userRepo.delete(user);
   }

   public void leaveChatRoom(User user,String roomKey){
       Optional<ChatRoom> chatRoom=chatRoomService.chatRoomRepo.findById(roomKey);
       if(chatRoom.get().getAdmin().contains(user)){

           chatRoom.get().getAdmin().remove(user);
           if(chatRoom.get().getAdmin().isEmpty() && chatRoom.get().getMember().size()>0)
            chatRoom.get().getAdmin().add(chatRoom.get().getMember().get(0));
           else chatRoomService.deleteRoom(roomKey,user);
       }
       else{
           chatRoom.get().getMember().remove(user);
           user.getGroup().remove(roomKey);
           chatRoomService.chatRoomRepo.save(chatRoom.get());
           userRepo.save(user);
       }
   }
}
