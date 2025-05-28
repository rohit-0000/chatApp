package com.chatapp.chatApp.Services;

import com.chatapp.chatApp.Entity.User;
import com.chatapp.chatApp.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class UserDetailServiceImp implements UserDetailsService {

   @Autowired
   UserRepo userRepo;

   @Override
   public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
       User user=userRepo.findByUserName(identifier);
       if(user==null){
           user=userRepo.findByEmail(identifier);
       }
       if(user!=null){
           UserDetails userDetails= org.springframework.security.core.userdetails.User.builder()
                   .username(user.getUserName())
                   .password(user.getPassword())
                   .roles(user.getRoles().toArray(new String[0]))
                   .build();
           return userDetails;
       }
       else throw new UsernameNotFoundException("User not found with username or email :"+ identifier);
   }
}
