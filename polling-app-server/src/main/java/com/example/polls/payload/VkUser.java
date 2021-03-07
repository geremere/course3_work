package com.example.polls.payload;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties
public class VkUser {
    private @JsonProperty("id") String id;
    private String first_name;
    private String last_name;
    private @JsonProperty("is_closed") Boolean is_closed;
    private @JsonProperty("can_access_closed") Boolean can_access_closed;
    private String domain;
    private @JsonProperty("photo_50") String photo_50;

    public VkUser(){}
    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }
}
