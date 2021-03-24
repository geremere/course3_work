package com.example.polls.controller;

import com.example.polls.exception.AppException;
import com.example.polls.model.user.RegType;
import com.example.polls.model.user.RegTypeName;
import com.example.polls.model.user.Role;
import com.example.polls.model.user.TypeName;
import com.example.polls.model.user.User;
import com.example.polls.payload.VkUser;
import com.example.polls.payload.requests.VkSignInRequest;
import com.example.polls.payload.response.ApiResponse;
import com.example.polls.payload.response.JwtAuthenticationResponse;
import com.example.polls.payload.requests.LoginRequest;
import com.example.polls.payload.requests.SignUpRequest;
import com.example.polls.payload.response.VkAuthResponse;
import com.example.polls.payload.response.VkResponseUser;
import com.example.polls.repository.RegTypeRepository;
import com.example.polls.repository.RoleRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.security.JwtTokenProvider;
import com.example.polls.service.UserService;
import com.example.polls.util.AppConstants;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    RegTypeRepository regTypeRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    UserService userService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Validated @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/signin/vk")
    public ResponseEntity<?> authenticateVkUser(@Validated @RequestBody VkSignInRequest vkSignInRequest) throws IOException {
        String jwt = "";
        OkHttpClient vk = new OkHttpClient();

        ObjectMapper objectMapper = new ObjectMapper();

        MediaType mediaType = MediaType.parse("text/plain");
        com.squareup.okhttp.RequestBody body = com.squareup.okhttp.RequestBody.create(mediaType, "");


        Request request = new Request.Builder()
                .url("https://oauth.vk.com/access_token?client_id=" + AppConstants.client_id + "&client_secret=" + AppConstants.client_secret
                        + "&redirect_uri=" + vkSignInRequest.getRedirect_uri() + "&code=" + vkSignInRequest.getCode())
                .method("POST", body)
                .addHeader("Cookie", "remixlang=0")
                .build();
        Response response2 = vk.newCall(request).execute();
        String b = response2.body().string();

        VkAuthResponse accessTokenVkResponse = objectMapper.readValue(b, VkAuthResponse.class);

        OkHttpClient client = new OkHttpClient();
        Request vkRequest = new Request.Builder()
                .url("https://api.vk.com/method/users.get?user_ids=" + accessTokenVkResponse.getUser_id()
                        + "&fields=photo_50,domain&access_token=" + accessTokenVkResponse.getAccess_token() + "&v=5.103")
                .method("GET", null)
                .addHeader("Authorization", accessTokenVkResponse.getAccess_token())
                .addHeader("Content-Type", "jsonp")
                .build();
        Response response = client.newCall(vkRequest).execute();

        String a = response.body().string();
        VkResponseUser vkResponse = objectMapper.readValue(a, VkResponseUser.class);

        VkUser user = vkResponse.response[0];
        if (userRepository.existsByUsername(user.getDomain()) && userService.isVkUser(user.getDomain())) {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getDomain(),
                            user.getDomain()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            jwt = tokenProvider.generateToken(authentication);

        } else {
//            if (userRepository.existsByEmail(accessTokenVkResponse.getEmail())) {
//                return new ResponseEntity<>(new ApiResponse(false, "Такой email уже привзяан к другому аккаунту!"),
//                        HttpStatus.BAD_REQUEST);
//            }

            User newUser = new User(user.getFirst_name(), user.getDomain(), (accessTokenVkResponse.getEmail() == "" || accessTokenVkResponse.getEmail() == null) ? "default@mail.ru" : accessTokenVkResponse.getEmail(),
                    user.getDomain());

            Role userRole = roleRepository.findByName(TypeName.ROLE_USER).
                    orElseThrow(() -> new AppException("User Role not set."));

            newUser.setRoles(Collections.singleton(userRole));
            RegType userRegType = regTypeRepository.findByName(RegTypeName.VK)
                    .orElseThrow(() -> new AppException("User RegType not set."));

            newUser.setRegTypes(Collections.singleton(userRegType));

//            if (userRole == null)
//                throw new RuntimeException("User Role not set");
//            newUser.setRoles(Collections.singleton(userRole));

//            Image image = new Image(user.getPhoto_50(), "image/jpeg");
//
//            fileRepository.save(image);

//            newUser.setImage(image);

            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

            User result = userRepository.save(newUser);

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getDomain(),
                            user.getDomain()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            jwt = tokenProvider.generateToken(authentication);
        }
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));

    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Validated @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return new ResponseEntity(new ApiResponse(false, "Username is already taken!"),
                    HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new ResponseEntity(new ApiResponse(false, "Email Address already in use!"),
                    HttpStatus.BAD_REQUEST);
        }

        // Creating user's account
        User user = new User(signUpRequest.getName(), signUpRequest.getUsername(),
                signUpRequest.getEmail(), signUpRequest.getPassword());

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role userRole = roleRepository.findByName(TypeName.ROLE_USER)
                .orElseThrow(() -> new AppException("User Role not set."));

        user.setRoles(Collections.singleton(userRole));
        RegType userRegType = regTypeRepository.findByName(RegTypeName.DEFAULT)
                .orElseThrow(() -> new AppException("User RegType not set."));

        user.setRegTypes(Collections.singleton(userRegType));

        User result = userRepository.save(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/users/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
    }

}
