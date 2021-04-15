import {API_BASE_URL} from "./utils";
import {request} from "./request";

const project_url = API_BASE_URL + "/project";

export function createProject(project) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: project_url + "/create",
        method: "POST",
        body: JSON.stringify(project)
    });
}

export function uploadImageProject(file) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: project_url + "/setimage",
        method: "POST",
        body: file
    });
}

export function getAllProjects() {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: project_url + "/all",
        method: "GET",
    });
}

export function getProjectById(id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: project_url + "/"+id,
        method: "GET"
    });
}