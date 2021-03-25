// import fetchJsonp from "fetch-jsonp";
import {request} from "./request";
import {API_BASE_URL} from "./utils";

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function toVk(vk_data) {
    return request({
        url: API_BASE_URL + "/auth/signin/vk",
        method: 'POST',
        body: JSON.stringify(vk_data)
    });
}

export function signUp(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}


export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}
