package com.EzChat.Services;


import com.EzChat.Entity.User;
import com.EzChat.Repository.UserRepo;
import org.bson.types.ObjectId;
import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

//        API Key and Url
    @Value("${gemini.api.url}")
    private String gemini_api_url;

    @Value("${gemini.api.key}")
    private String gemini_api_key;
    public final WebClient webClient;

    @Autowired
    private UserRepo userRepo;

    public AIService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    public Map<ObjectId, List<String>> getAnswere(String question, User user){

        //        Construct Request as gemini accept in particular manner
        Map<String , Object> requestBody=Map.of("contents",new Object[]{Map.of("parts",new Object[]{Map.of("text",question )})});

        //        API call
        String response =webClient.post()
                .uri(gemini_api_url+gemini_api_key)
                .header("Content-Type",
                        "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class).
                block();

        JSONObject root=new JSONObject(response);
        String text=root.getJSONArray("candidates")
                .getJSONObject(0)
                .getJSONObject("content")
                .getJSONArray("parts")
                .getJSONObject(0)
                .getString("text");
        ObjectId obj=new ObjectId();
        user.getAiQna().put(obj, new ArrayList<>(Arrays.asList(question, text)));

        userRepo.save(user);
        return Map.of(obj,new ArrayList<>(Arrays.asList(question, text)));
    }
}
