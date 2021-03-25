import {toVk} from "../../ServerAPI/AuthApi";
import React, {Component} from "react";
import {Loading} from "../../common/Loading/Loading";

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
                <Loading/>
            </div>
        )
    }

}
export default VKAuth;