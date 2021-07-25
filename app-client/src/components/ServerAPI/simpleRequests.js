import {request, requestNotJSON} from "./request";
import {API_BASE_URL} from "./utils";

const image_url = API_BASE_URL + "/file/image";

export function saveImage(file) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return requestNotJSON({
        url: image_url + "/create",
        method: "POST",
        body: file
    });
}