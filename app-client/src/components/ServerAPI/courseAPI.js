import {request} from "./request.js"
import {ACCESS_TOKEN, API_BASE_URL} from "./utils";

export function getCoursesOfUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: API_BASE_URL + "/courses/me/dto",
        method: 'GET'
    });
}

export function getRandomCourses() {
    return request({
        url: API_BASE_URL + "/courses/dto",
        method: 'GET'
    });
}

export function getCourseById(courseId) {
    return request({
        url: API_BASE_URL + "/course/" + courseId + "/dto",
        method: 'GET',
    });
}

export function getReportList(courseId) {
    return request({
        url: API_BASE_URL + "/course/" + courseId + "/reviews",
        method: 'GET',
    });
}

export function postReport(courseId, data) {
    return request({
        url: API_BASE_URL + "/course/" + courseId + "/feedback",
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function getLessons(courseId) {
    return request({
        url: API_BASE_URL + "/course/" + courseId + "/lessons",
        method: 'GET'
    });
}

export function isViewed(lessonId) {
    return request({
        url: API_BASE_URL + "/lesson/" + lessonId + "/view",
        method: 'POST'
    });
}

export function getCategory(categoryId) {
    return request({
        url: API_BASE_URL + '/courses/category/' + categoryId + '/dto',
        method: 'GET'
    });
}

export function search(substring) {
    return request({
        url: API_BASE_URL + '/courses/search/dto?s=' + substring,
        method: 'GET'
    });
}

export function getMainImage() {
    return request({
        url: API_BASE_URL + "/resources/image/mainpage",
        method: 'GET'
    });
}

export function filterCourses(category, substring, sort) {
    return request({
        url: API_BASE_URL + "/courses/filter?category=" + category + "&substring=" + substring + "&sort=" + sort,
        method: 'GET'
    });
}