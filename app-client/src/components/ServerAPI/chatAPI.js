import {request} from "./request.js"
import {ACCESS_TOKEN, API_BASE_URL, BASE_URL} from "./utils";

export function countNewMessages(senderId, recipientId) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: BASE_URL + "/messages/" + senderId + "/" + recipientId + "/count",
        method: "GET",
    });
}

export function findChatMessages(chatId) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: BASE_URL + "/messages/" + chatId,
        method: "GET",
    });
}

export function findChatMessage(id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: BASE_URL + "/message/" + id,
        method: "GET",
    });
}

export function getChats() {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/chats",
        method: "GET",
    });
}

export function sendMessage(message) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: BASE_URL + "/create/chat",
        method: "POST",
        body:message
    });
}