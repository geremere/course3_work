import {ACCESS_TOKEN, API_BASE_URL, BASE_URL} from "./utils";
import {request, requestNotJSON} from "./request";

const project_url = API_BASE_URL + "/project";

export function createProject(project) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: project_url,
        method: "POST",
        body: JSON.stringify(project)
    });
}

export function getAllProjects() {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: project_url,
        method: "GET",
    });
}

export function getProjectsById(id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: project_url + "/user/" + id,
        method: "GET",
    });
}

export function getAllProjectsByIdClosed(id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: project_url + "/closed/" + id,
        method: "GET",
    });
}

export function getProjectById(id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: project_url + "/" + id,
        method: "GET"
    });
}

export function updateProject(project) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: project_url + "/" + project.id,
        method: "PUT",
        body: JSON.stringify(project)
    });
}

export function deleteProject(id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: project_url + "/" + id,
        method: "DELETE"
    });
}


export function getRisks() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/risks",
        method: 'GET'
    });
}

export function saveExcel(riskId, file) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return requestNotJSON({
        url: API_BASE_URL + "/risks/file/" + riskId,
        method: 'POST',
        body: file
    });
}

export function getExcelData(riskId) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return requestNotJSON({
        url: API_BASE_URL + "/risks/file/" + riskId,
        method: 'GET'
    });
}