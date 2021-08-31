import {request} from "./request.js"
import {API_BASE_URL, BASE_URL} from "./utils";

export function getChats() {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/chat",
        method: "GET",
    });
}

export function sendMessage(message) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: BASE_URL + "/chat",
        method: "POST",
        body: message
    });
}

export function getOrCreate(userId) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/chat/" + userId,
        method: "GET"
    });
}