package com.example.polls.payload.response;

import com.example.polls.payload.VkUser;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

public class VkResponseUser {
    public VkResponseUser(){}
    public @JsonProperty("response") VkUser[] response;
}
