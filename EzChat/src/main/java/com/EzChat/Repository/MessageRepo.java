package com.EzChat.Repository;

import com.EzChat.Entity.Message;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRepo extends MongoRepository<Message, ObjectId> {
//    void deleteById(Message message);
}
