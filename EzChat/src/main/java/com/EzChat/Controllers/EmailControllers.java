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

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;

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
                String html = new String(Files.readAllBytes(Paths.get("src/main/resources/static/emailVerification.html")));
                html = html.replace("{{name}}", emailRequest.getName());
                html = html.replace("{{year}}", String.valueOf(LocalDateTime.now().getYear()));
                html = html.replace("{{otp}}", emailRequest.getBody());
                mailUtils.sendMail(emailRequest.getTo(), emailRequest.getSubject(), html);
                return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Unexpected Error Ocuurs",HttpStatus.EXPECTATION_FAILED);
        }
    }
}

