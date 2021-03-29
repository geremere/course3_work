import {ACCESS_TOKEN, API_BASE_URL} from "./utils";
import {request} from "./request.js"


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}


export function editPassword(Password) {
    return request({
        url: API_BASE_URL + "/user/me/edit/password",
        method: 'PUT',
        body: JSON.stringify(Password)
    });
}
export function editEmail(email) {
    debugger;
    return request({
        url: API_BASE_URL + "/user/me/edit/email?email="+email,
        method: 'PUT',
        body: JSON.stringify(email)
    });
}

export function editUsername(username) {
    return request({
        url: API_BASE_URL + "/user/me/edit/username?username=" + username,
        method: 'PUT',
        body: JSON.stringify(username)
    });
}

export function editName(name) {
    return request({
        url: API_BASE_URL + "/user/me/edit/name?name=" + name,
        method: 'PUT',
        body: JSON.stringify(name)
    });
}

export function editSurName(surname) {
    return request({
        url: API_BASE_URL + "/user/me/edit/surname?surname=" + surname,
        method: 'PUT',
        body: JSON.stringify(surname)
    });
}

export function subscribe(courseId) {
    return request({
        url: API_BASE_URL + "/course/" + courseId,
        method: 'POST'
    });
}

export function recoverThePassword(usernameOrEmail) {
    return request({
        url: API_BASE_URL + "/auth/forgotpassword?usernameOrEmail=" + usernameOrEmail,
        method: 'POST',
    });
}

export function getAllUsers() {
    return request({
        url: API_BASE_URL + "/users/all",
        method: 'GET'
    });
}

