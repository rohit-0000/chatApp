package com.EzChat.Entity;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder //just like constructor
public class Friends {
    private  String userName;
    private  String name;
    private String about="";
    private String userImageUrl;
}



