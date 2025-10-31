package com.EzChat.Controllers;

import com.EzChat.Entity.EmailRequest;
import com.EzChat.Services.UserServices;
import com.EzChat.Utils.MailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
public class EmailControllers {
    @Autowired
    private MailUtils mailUtils;
    @Autowired
    UserServices userServices;

    @PostMapping("/send")
    public ResponseEntity<?> sendMail(@RequestBody EmailRequest emailRequest){
        try{
                mailUtils.sendMail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
                return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Unexpected Error Ocuurs",HttpStatus.EXPECTATION_FAILED);
        }
    }
}

