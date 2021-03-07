package com.example.polls;

import com.example.polls.payload.response.VkAuthResponse;
import com.example.polls.payload.response.VkResponseUser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class testMain {

    public static void main(String[] args) throws JsonProcessingException {
        String json = "{\"response\":[{\"first_name\":\"Радмир\",\"id\":336908281,\"last_name\":\"Имамов\",\"can_access_closed\":true,\"is_closed\":false,\"photo_50\":\"https:\\/\\/sun1-28.userapi.com\\/s\\/v1\\/ig2\\/rxlu2XShXWUiQvEdfkbSxl9xzLgBC3URpFeLqqoLZpJBEMJAKzlnnmflMKfYT7xWCLf3jbsrLrm7INRkVPe21CS9.jpg?size=50x0&quality=96&crop=221,114,884,884&ava=1\",\"domain\":\"geremere\"}]}";
        VkResponseUser user = new ObjectMapper().readValue(json, VkResponseUser.class);

    }
}
