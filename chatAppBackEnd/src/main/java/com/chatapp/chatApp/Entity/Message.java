package com.chatapp.chatApp.Entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "message")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Message {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId senderId;
    private String senderName;
    private String senderImg;
    private String message;
    private String public_Id;
    private LocalDateTime time;
    private String msgType;
    private String fileName;


    public Message(ObjectId senderId,String message){
        this.senderId=senderId;
        this.message=message;
        this.time= LocalDateTime.now();
    }

}
