import React, {Component} from "react";
// import style from "./ModalWindow/ModalWindow.module.css";
// import {TextAlert} from "./ModalWindow/ModalWindow";
// import {toVk} from "./ServerAPI/AuthApi";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            userId: null,
            user: null
        }
        this.handleUpdate = this.handleUpdate.bind(this)
    }

    handleUpdate = () => {

    };

    componentDidMount() {
        this.handleUpdate();
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

export default Test;