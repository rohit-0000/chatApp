package com.chatapp.chatApp.Repository;

import com.chatapp.chatApp.Entity.ChatRoom;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepo extends MongoRepository<ChatRoom, String> {
//    public ChatRoom findByRoomKey(String key);
//    public void deleteByRoomKey*String
}
