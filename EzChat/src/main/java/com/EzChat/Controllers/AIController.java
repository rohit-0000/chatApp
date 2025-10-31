package com.EzChat.Controllers;


import com.EzChat.Entity.User;
import com.EzChat.Repository.UserRepo;
import com.EzChat.Services.AIService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/qna")
public class AIController {
    @Autowired
    private AIService aiService;
    @Autowired
    private UserRepo userRepo;
    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(@RequestBody String question){
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();
            User user = userRepo.findByUserName(userName);
            Map<ObjectId, List<String>> answer = aiService.getAnswere(question, user);
            return new ResponseEntity<>(answer, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Unexpected error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
