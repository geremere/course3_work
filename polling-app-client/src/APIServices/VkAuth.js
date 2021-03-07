import React, {Component} from "react";
import {API_BASE_URL} from "../constants";
import {request} from "../util/APIUtils"

class VKAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect_uri: window.location.protocol + "//" + window.location.host + "/vkauth",
            code: window.location.href.match(/code=(\w+)/)[1]
        };
        this.loadVkUser = this.loadVkUser.bind(this);
    }

    loadVkUser() {
        debugger;
        const pr =this.state
        toVk(this.state).then(response => {
            localStorage.setItem('accessToken', response.accessToken);
            window.location.assign("/mainpage");
        }).catch(response=>console.log(response))
    }

    componentDidMount() {
        this.loadVkUser();
    }

    render() {
        return (
            <div>
                {"loading..."}
            </div>
        )
    }

}

function toVk(vk_data) {
    return request({
        url: API_BASE_URL + "/auth/signin/vk",
        method: 'POST',
        body: JSON.stringify(vk_data)
    });
}


export default VKAuth;
