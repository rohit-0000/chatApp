package com.EzChat.Services;


import com.EzChat.Entity.ChatRoom;
import com.EzChat.Entity.Message;
import com.EzChat.Entity.User;
import com.EzChat.Repository.ChatRoomRepo;
import com.EzChat.Repository.MessageRepo;
import com.EzChat.Repository.UserRepo;
import com.cloudinary.Cloudinary;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;

@Service
public class ChatRoomService {
    @Autowired
    public ChatRoomRepo chatRoomRepo;
    @Autowired
    UserRepo userRepo;
    @Autowired
    MessageRepo messageRepo;
    @Autowired
    private Cloudinary cloudinary;

    public ResponseEntity<?> createChatRoom(ChatRoom chatRoom, User user){

        if (chatRoomRepo.findById(chatRoom.getRoomKey()).isPresent()) {
            return new ResponseEntity<>("Room Already Exist with key" + chatRoom.getRoomKey(), HttpStatus.BAD_REQUEST);
        }
        if(chatRoom.getRoomKey()==null) return new ResponseEntity<>("Id can not be null",HttpStatus.BAD_REQUEST);
        chatRoom.getAdmin().add(user.getId().toHexString());
        chatRoom.getMember().add(user.getId().toHexString());
        chatRoom.setCreatedAt(LocalDateTime.now());
        chatRoom.setCreatedBy(user.getName());
        ChatRoom savedRoom=chatRoomRepo.save(chatRoom);
        user.getGroup().add(savedRoom);
        userRepo.save(user);
        return new ResponseEntity<>(user,HttpStatus.OK);
    }
    @Transactional
    public void deleteRoom(String roomKey,User user){
        try {
            Optional<ChatRoom> chatRoom = chatRoomRepo.findById(roomKey);
            if (chatRoom.isPresent()) {
                if (chatRoom.get().getAdmin().contains(user.getId().toHexString())) {
                    if(chatRoom.get().getPublic_id()!=null)
                        cloudinary.uploader().destroy(chatRoom.get().getPublic_id(),new HashMap<>());
                    for(int i=0;i<chatRoom.get().getMember().size();i++){
                        Optional<User> member=userRepo.findById(new ObjectId(chatRoom.get().getMember().get(i)));
                        member.get().getGroup().remove(chatRoom.get());
                    }
                    for (int i = 0; i < chatRoom.get().getChat().size(); i++) {
                        deleteChats(chatRoom.get().getChat().get(i).getId());
                    }
                    userRepo.save(user);
                    chatRoomRepo.deleteById(chatRoom.get().getRoomKey());
                }
            }
        }
        catch (Exception e){
            throw new RuntimeException("Unexpected error" + e);
        }

    }

    public ResponseEntity<?> update(User user, ChatRoom chatRoom) {
        Optional<ChatRoom> roomInDb = chatRoomRepo.findById(chatRoom.getRoomKey());

        if (roomInDb.isPresent()) {
            ChatRoom existingRoom = roomInDb.get();

            if (existingRoom.getAdmin().contains(user.getId().toHexString())) {
                if (!chatRoom.getRoomName().isEmpty())
                    existingRoom.setRoomName(chatRoom.getRoomName());

                if (chatRoom.getDescription() != null && !chatRoom.getDescription().isEmpty())
                    existingRoom.setDescription(chatRoom.getDescription());

                chatRoomRepo.save(existingRoom);
                user = userRepo.findById(user.getId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                return new ResponseEntity<>(user, HttpStatus.OK);
            }
        }

        return new ResponseEntity<>("You are not Allowed to change group details", HttpStatus.BAD_REQUEST);
    }

    public void sendMessage(String roomId, Message message){
        Optional<ChatRoom> room=chatRoomRepo.findById(roomId);
        if(room.isEmpty()) {
            throw new RuntimeException("room id not found");
        }
        if(!room.get().getMember().contains(message.getSenderId().toHexString())){
            return;
        }
        messageRepo.save(message);
        room.get().getChat().add(message);
        chatRoomRepo.save(room.get());
    }

    public ResponseEntity<?>  JoinRoom(String userName,String roomKey){
        User user=userRepo.findByUserName(userName);
        Optional<ChatRoom> room=chatRoomRepo.findById(roomKey);
        if(room.isEmpty()) return new ResponseEntity<>("Room not present",HttpStatus.BAD_REQUEST);
        if(user.getGroup().contains(room.get())) return new ResponseEntity<>("You are already in Group",HttpStatus.BAD_REQUEST);
        user.getGroup().add(room.get());

        room.get().getMember().add(user.getId().toHexString());

        userRepo.save(user);
        chatRoomRepo.save(room.get());
        return new ResponseEntity<>(user,HttpStatus.OK);
    }
    @Transactional
    public void leaveGroup(String userName,String roomKey) throws IOException {
        User user=userRepo.findByUserName(userName);
        Optional<ChatRoom> room=chatRoomRepo.findById(roomKey);
        if (room.isPresent()) {
            user.getGroup().remove(room.get());
            userRepo.save(user);
            room.get().getMember().remove(user.getId().toHexString());
            room.get().getAdmin().remove(user.getId().toHexString());
            if(room.get().getAdmin().isEmpty()){
                if(room.get().getMember().isEmpty()) {
                    if(room.get().getPublic_id()!=null)
                        cloudinary.uploader().destroy(room.get().getPublic_id(),new HashMap<>());
                    for(int i=0;i<room.get().getChat().size();i++){
                        deleteChats(room.get().getChat().get(i).getId());
                    }
                    chatRoomRepo.delete(room.get());
                    return ;
                }
                else
                    room.get().getAdmin().add(room.get().getMember().getFirst());
            }
            chatRoomRepo.save(room.get());
        }
    }
    public void makeAdmin(String userName, ObjectId userId, String roomKey){
        User admin=userRepo.findByUserName(userName);
        Optional<ChatRoom> room=chatRoomRepo.findById(roomKey);
        if(room.isPresent() && room.get().getAdmin().contains(admin.getId().toHexString())){
            room.get().getAdmin().add(userId.toHexString());
            chatRoomRepo.save(room.get());
        }
    }
    public void removeAdmin(String userName,ObjectId userId,String roomKey){
        User admin=userRepo.findByUserName(userName);
        Optional<ChatRoom> room=chatRoomRepo.findById(roomKey);
        if(room.isPresent() && room.get().getAdmin().contains(admin.getId().toHexString())){
            room.get().getAdmin().remove(userId.toHexString());
            chatRoomRepo.save(room.get());
        }
    }

    public void removeMember(String userName, ObjectId userId, String roomKey) {
        User admin=userRepo.findByUserName(userName);
        Optional<ChatRoom> room=chatRoomRepo.findById(roomKey);
        if(room.isPresent() && room.get().getAdmin().contains(admin.getId().toHexString())){
            Optional<User> user = userRepo.findById(userId);
            user.get().getGroup().remove(room.get());
            userRepo.save(user.get());
            room.get().getMember().remove(userId.toHexString());
            room.get().getAdmin().remove(userId.toHexString());
            chatRoomRepo.save(room.get());
        }
    }
    public void deleteChats(ObjectId id) throws IOException {
        Optional<Message> message=messageRepo.findById(id);
        if (message.get().getPublic_Id() == null) {
            messageRepo.deleteById(id);
        } else if(message.get().getPublic_Id()!=null) {
            cloudinary.uploader().destroy(message.get().getPublic_Id(),new HashMap<>());
            messageRepo.deleteById(id);
        }
    }

    public Optional<ChatRoom> findById(String roomId) {
        return chatRoomRepo.findById(roomId);
    }
}
