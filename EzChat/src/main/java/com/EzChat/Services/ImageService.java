package com.EzChat.Services;


import com.EzChat.Entity.ChatRoom;
import com.EzChat.Entity.User;
import com.EzChat.Repository.ChatRoomRepo;
import com.EzChat.Repository.UserRepo;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class ImageService {
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ChatRoomRepo chatRoomRepo;

    public String uploadImage(MultipartFile file, User user) throws IOException {
        deleteImg(user);
        Map<String,String> upload=cloudinary.uploader().upload(file.getBytes(),new HashMap<>());
        String fileUrl= upload.get("url");
        String publidId=upload.get("public_id");
        user.setUserImageUrl(fileUrl);
        user.setPublic_id(publidId);
        userRepo.save(user);
        return fileUrl;
    }
    public void deleteImg(User user) throws IOException {
        if(user.getUserImageUrl()!=null && !user.getUserImageUrl().isEmpty()){
            cloudinary.uploader().destroy(user.getPublic_id(),new HashMap<>());
            user.setPublic_id("");
            user.setUserImageUrl("");
            userRepo.save(user);
        }
    }

    public String uploadImage(MultipartFile file, User user,String groupId) throws IOException {
        Optional<ChatRoom> room=chatRoomRepo.findById(groupId);
        if(room.isEmpty() || !room.get().getAdmin().contains(user.getId().toHexString())) return "";
        deleteImg(user,groupId);
        Map<String,String> upload=cloudinary.uploader().upload(file.getBytes(),new HashMap<>());
        String fileUrl= upload.get("url");
        String publidId=upload.get("public_id");
        room.get().setGroupImageUrl(fileUrl);
        room.get().setPublic_id(publidId);
        chatRoomRepo.save(room.get());
        userRepo.save(user);
        return fileUrl;
    }
    public void deleteImg(User user,String groupId) throws IOException {
        Optional<ChatRoom> room=chatRoomRepo.findById(groupId);
        if(room.isEmpty() || !room.get().getAdmin().contains(user.getId().toHexString())) throw new IOException("You are not authorized to change image");
        if(room.get().getGroupImageUrl()!=null && !room.get().getGroupImageUrl().isEmpty()){
            cloudinary.uploader().destroy(room.get().getPublic_id(),new HashMap<>());
            room.get().setPublic_id(groupId);
            room.get().setGroupImageUrl("");
            chatRoomRepo.save(room.get());
            userRepo.save(user);
        }
    }

    public List<String> uploadFile(MultipartFile chatFile) throws IOException {
        Map<String,String> upload=cloudinary.uploader().upload(
                chatFile.getBytes(),
                ObjectUtils.asMap("resource_type", "auto")
        );
        String fileUrl= upload.get("url");
        String publidId=upload.get("public_id");
        return new ArrayList<>(Arrays.asList(fileUrl,publidId));
    }

    public void deleteImg(String public_id) throws IOException {
            cloudinary.uploader().destroy(public_id,new HashMap<>());
    }

}
