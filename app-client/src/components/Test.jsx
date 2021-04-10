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
        console.log(this.props.user.image.imageUrl)
    }

    render() {
        return (
            <div className="test">
                <img className="test_img" src="https://s2.best-wallpaper.net/wallpaper/2560x1600/1212/Beautiful-nature-landscape-lake-mountains-trees-village-blue-sky-white-clouds_2560x1600.jpg">
                </img>
            </div>
        )
    }
}

export default Test;