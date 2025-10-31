package com.EzChat.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CallRequest {
    private String roomId;
    private String callerId;
    private String callType;
    private String action;
}
