package com.example.polls.payload.requests;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class VkSignInRequest {

    @NotBlank
    @Size(min = 4, max = 100)
    private String redirect_uri;

    @NotBlank
    @Size(min = 4, max = 40)
    private  String code;


    public String getRedirect_uri() {
        return redirect_uri;
    }

    public void setRedirect_uri(String redirect_uri) {
        this.redirect_uri = redirect_uri;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
