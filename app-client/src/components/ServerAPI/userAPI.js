import {ACCESS_TOKEN, API_BASE_URL} from "./utils";
import {request} from "./request.js"


export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
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

export function getAllUsers() {
    return request({
        url: API_BASE_URL + "/users/all",
        method: 'GET'
    });
}

export function searchUser(path) {
    return request({
        url: API_BASE_URL + "/search/" + path,
        method: 'GET'
    });
}

export function getUserById(id) {
    return request({
        url: API_BASE_URL + "/user/" + id,
        method: 'GET'
    });
}

export function uploadAvatar(file) {
    let options = {
        url: API_BASE_URL + "/user/me/image",
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
        },
        body: file
    };

    return fetch(options.url, options)
        .then(response => {
                debugger;
                response.json().then(json => {
                    if (!response.ok) {
                        return Promise.reject(json);
                    } else {
                        return Promise.resolve(json);
                    }
                })
            }
        );
}

export function changePassword(requestDto) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/password",
        method: "POST",
        body: JSON.stringify(requestDto)
    });
}

export function isDefaultRegType() {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/isDefault",
        method: "GET"
    });
}

export function updateUser(user, id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/" + id,
        method: "PUT",
        body: JSON.stringify(user)
    });
}





