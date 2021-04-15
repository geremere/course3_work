import {ACCESS_TOKEN, API_BASE_URL, BASE_URL} from "./utils";
import {request} from "./request";

const risk_url = API_BASE_URL + "/risk";

export function getAllTypes() {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: risk_url + "/all/types",
        method: "GET",
    });
}

export function getRisksByType(id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: risk_url + "/by/type/" + id,
        method: "GET",
    });
}

export function getAvileableUsers(prId,riskId) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: BASE_URL + "/risk/users/available/"+prId+"/"+riskId,
        method: 'GET'
    });
}

export function getRisk(riskId) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: BASE_URL + "/risk/"+riskId,
        method: 'GET'
    });
}
