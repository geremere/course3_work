import React, {Component} from "react";
import style from "./UserAccount.module.css";
import {TextAlert} from "../../ModalWindow/ModalWindow";
import {uploadAvatar} from "../../ServerAPI/userAPI";
import {Nav, Spinner} from "react-bootstrap";
import UserSettings from "../Settings/UserSettings";
import {USER_ICO} from "../../ServerAPI/utils";
import {ProjectSummary} from "../../MainPage/MainPage";
import {getAllProjectsByIdClosed, getProjectsById} from "../../ServerAPI/ProjectAPI";

class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: true,
            message: "",
            eventKey: "/active",
            active: [],
            closed: []
        }
        ;
        this.UploadAvatar = this.UploadAvatar.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
    }

    UploadAvatar = (event) => {
        let formData = new FormData();
        formData.append('file', event.target.files[0]);
        uploadAvatar(formData).then(response => {
            document.getElementById("avatar").src = response.fileName;
            this.setState({
                message: response.message
            });
        }).catch(response => {
            this.setState({
                message: response.message
            });
        });
    };

    UploadClick = () => {
        const file = document.getElementById('file');
        file.click();
    };

    componentDidMount() {
        this.props.loadUser();
        getAllProjectsByIdClosed(this.props.user.id).then(response => {
            this.setState({
                closed: response
            })
        })
        getProjectsById(this.props.user.id).then(response => {
            this.setState({
                active: response
            })
        })
    }

    handleSelected = () => {
        switch (this.state.eventKey) {
            case "/closed":
                return (
                    <div>
                        {this.state.closed.map(project => <ProjectSummary currentUser={this.props.user}
                                                                          project={project}
                                                                          key={project.id}/>)}
                    </div>
                )
            case "/active":
                return (
                    <div>
                        {this.state.active.map(project => <ProjectSummary currentUser={this.props.user}
                                                                          project={project}
                                                                          key={project.id}/>)}

                    </div>
                )
            case "/settings":
                return (
                    <UserSettings loadUser={() => this.props.loadUser()}
                                  user={this.props.user}/>
                )

        }
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <div className={style.wrapper}>
                    <TextAlert text={this.state.message}/>
                    <UserInformation user={this.props.user}
                                     UploadAvatar={this.UploadAvatar}
                                     UploadClick={this.UploadClick}/>
                    <Nav variant="tabs" defaultActiveKey={"/active"}
                         onSelect={(eventKey => {
                             this.setState({
                                 eventKey: eventKey
                             })
                         })}>
                        <Nav.Item>
                            <Nav.Link eventKey="/active">Active Projects</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={"/closed"}>Closed Projects</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={"/settings"}>
                                Settings
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {this.handleSelected()}
                </div>
            );
        } else {
            return (
                <div className={style.wrapper}>
                    <Spinner animation="border" variant="success"/>
                </div>
            )
        }
    }
}

function UserInformation(props) {
    return (
        <div className={style.user_wrapper}>
            <input id="file" type="file" className={style.upload} onChange={props.UploadAvatar}/>
            <div className={style.avatar_wrapper} onClick={props.UploadClick}>
                <img id='avatar' className={style.avatar}
                     src={props.user.image === null ? USER_ICO : props.user.image.url}
                     alt=''/>
                <div className={style.hover_wrapper}>
                    <img className={style.avatar_hover}
                         src="https://cdn.pixabay.com/photo/2016/12/18/13/44/download-1915749_1280.png" alt=""/>
                </div>
            </div>
            <div className={style.user_info}>
                <label className={style.user_name}>
                    {props.user.name}
                </label>
                <label className={style.user_username}>
                    {props.user.username}
                </label>
            </div>
        </div>
    )

}

export default UserAccount;