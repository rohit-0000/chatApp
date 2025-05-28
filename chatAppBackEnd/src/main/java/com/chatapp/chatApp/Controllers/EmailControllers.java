package com.chatapp.chatApp.Controllers;

import com.chatapp.chatApp.Entity.EmailRequest;
import com.chatapp.chatApp.Entity.User;
import com.chatapp.chatApp.Services.EmailService;
import com.chatapp.chatApp.Services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("email")
public class EmailControllers {
    @Autowired
    EmailService emailService;
    @Autowired
    UserServices userServices;

    @PostMapping("/send")
    public ResponseEntity<?> sendMail(@RequestBody EmailRequest emailRequest){
        try{
                emailService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
                return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Unexpected Error Ocuurs",HttpStatus.EXPECTATION_FAILED);
        }
    }
}

