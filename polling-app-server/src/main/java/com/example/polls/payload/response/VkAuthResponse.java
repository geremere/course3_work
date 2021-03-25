package com.example.polls.payload.response;


public class VkAuthResponse {
    private String access_token;
    private String expires_in;
    private String user_id;
    private String email;


    public VkAuthResponse(){}
    public VkAuthResponse(String access_token, String expires_in, String user_id, String email) {
        this.access_token = access_token;
        this.email = email;
        this.expires_in =expires_in;
        this.user_id=user_id;
    }

    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public String getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(String expires_in) {
        this.expires_in = expires_in;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
