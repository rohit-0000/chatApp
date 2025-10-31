package com.EzChat.Repository;

import com.EzChat.Entity.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepo extends MongoRepository<ChatRoom, String> {
//    public ChatRoom findByRoomKey(String key);
//    public void deleteByRoomKey*String
}
