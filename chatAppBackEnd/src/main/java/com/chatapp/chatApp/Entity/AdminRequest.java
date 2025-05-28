package com.chatapp.chatApp.Entity;

import lombok.Data;
import org.bson.types.ObjectId;

@Data
public class AdminRequest {
    private ObjectId userId;
    private String roomKey;
}
