package com.chatapp.chatApp.Entity;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "chatroom")
public class ChatRoom {

    @Id
//    private ObjectId id;
//    @Indexed(unique = true)
    private String roomKey;

    @NonNull
    private String roomName;

    private String description;
    private String groupImageUrl;
    private String public_id;
    private LocalDateTime createdAt;
    private String createdBy;


    private List<String> admin = new ArrayList<>();
    private List<String> member = new ArrayList<>();

    @DBRef
    private List<Message> chat = new ArrayList<>();
}
