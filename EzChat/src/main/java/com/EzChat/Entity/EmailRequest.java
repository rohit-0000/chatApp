package com.EzChat.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmailRequest {
    private String userName;
    private String to;
    private String subject;
    private String body;
}
