package com.chatapp.chatApp.Repository;

import com.chatapp.chatApp.Entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends MongoRepository<User, ObjectId> {
    public User findByUserName(String userName);
    public  User findByEmail(String email);
}
