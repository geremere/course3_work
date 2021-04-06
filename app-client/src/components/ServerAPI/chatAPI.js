import {request} from "./request.js"
import {ACCESS_TOKEN, API_BASE_URL, API_SOCKET_URL} from "./utils";

export function countNewMessages(senderId, recipientId) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_SOCKET_URL + "/messages/" + senderId + "/" + recipientId + "/count",
        method: "GET",
    });
}

export function findChatMessages(senderId, recipientId) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: API_SOCKET_URL + "/messages/" + senderId + "/" + recipientId,
        method: "GET",
    });
}

export function findChatMessage(id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_SOCKET_URL + "/messages/" + id,
        method: "GET",
    });
}

export function test() {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_SOCKET_URL + "/messages/test",
        method: "GET",
    });
}