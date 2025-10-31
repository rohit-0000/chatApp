package com.EzChat.Entity;

import lombok.Data;
import org.bson.types.ObjectId;

@Data
public class AdminRequest {
    private ObjectId userId;
    private String roomKey;
}
