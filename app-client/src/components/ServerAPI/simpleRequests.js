import {request} from "./request";
import {API_BASE_URL} from "./utils";

const image_url = API_BASE_URL + "/image";

export function uploadImage(file) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: image_url,
        method: "POST",
        body: file
    });
}