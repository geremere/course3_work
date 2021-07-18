import React, {Component} from 'react';
import style from './NewProject.module.css';
import {getAllUsers, searchUser, uploadAvatar} from "../ServerAPI/userAPI";
import {PROJECT_ICO, USER_ICO} from "../ServerAPI/utils";
import {TextAlert} from "../ModalWindow/ModalWindow";
import {createProject, uploadImageProject} from "../ServerAPI/ProjectAPI";
import {forEach} from "react-bootstrap/ElementChildren";
import {Alert, Spinner} from "react-bootstrap";
import SelectListUsers from "../util/SelectListUsers";

class NewProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                value: "",
                correct: false
            },
            description: {
                value: "",
                correct: false
            },
            image_id: "",
            search: {
                value: "",
                correct: false
            },
            users: [],
            selectUsers: [],
            message: "",
            image: null
        };
        this.UploadClick = this.UploadClick.bind(this);
        this.UploadAvatar = this.UploadAvatar.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.createProject = this.createProject.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.selectUser = this.selectUser.bind(this)
    }

    selectUser = (userId) => {
        let users = this.state.users.map(user => {
            if (user.id === userId)
                user.isSelected = !user.isSelected
            return user
        })
        this.setState({
            users: users,
            selectUsers: users.filter(user => user.isSelected)
        })
    };

    UploadClick = () => {
        const file = document.getElementById('file_project');
        file.click();
    };

    UploadAvatar = (event) => {
        let formData = new FormData();
        formData.append('file_project', event.target.files[0]);
        uploadImageProject(formData).then(response => {
            document.getElementById("project_ico").src = response.fileName;
            this.setState({
                message: response.message
            });
        }).catch(response => {
            this.setState({
                message: response.message
            });
        });
    };

    handleInputChange(event) {
        this.setState({
            [event.target.name]: {
                value: event.target.value,
                correct: event.target.value.length !== 0
            }
        });
    }

    resizeInput = (event) => {
        const input = event.target;
        input.style.height = 0;
        input.style.height = input.scrollHeight + "px";
    };

    searchUsers = (event) => {
        this.handleInputChange(event);
        if (event.target.value !== "")
            searchUser(event.target.value).then(response => {
                const users = this.state.users.map(user => {
                    for (const it in this.state.selectUsers)
                        if (user.id === it.id)
                            user.isSelected = true
                    return user
                })
                this.setState({
                    users: users
                })
            });
    };

    createProject = () => {
        if (this.state.selectUsers.length > 1 && this.state.description.correct && this.state.title.correct) {
            const pr = {
                users: this.state.users,
                title: this.state.title.value,
                description: this.state.description.value,
            };
            createProject(pr)
                .then(response => {
                    window.location.assign("/project/" + response.id)
                }).catch(error => {
                console.log("error")
            })
        } else {
            return (
                <Alert>
                    lksjflksjlkdsjflk
                </Alert>
            )
        }


    };

    componentDidMount() {
        getAllUsers().then(response => {
            this.setState({
                users: response.map(user => ({...user, isSelected: false})),
                isLoaded: true
            });
        })
    }

    render() {
        if (this.state.isLoaded)
            return (
                <div>
                    <div id={"new_project"} className={style.alert}>
                        <TextAlert text={this.state.message}/>
                        <div id={"window_new_project"} className={style.window}>
                            <input id="file_project" type="file" className={style.upload} onChange={this.UploadAvatar}/>
                            <span className={style.close}
                                  onClick={() => document.getElementById('new_project').style.display = 'none'}>x</span>
                            <div className={style.avatar_wrapper} onClick={this.UploadClick}>
                                <img id='project_ico' className={style.avatar}
                                     src={PROJECT_ICO}
                                     alt=''/>
                                <div className={style.hover_wrapper}>
                                    <img className={style.avatar_hover}
                                         src="https://cdn.pixabay.com/photo/2016/12/18/13/44/download-1915749_1280.png"
                                         alt=""/>
                                </div>
                            </div>
                            <div className={style.info_wrapper}>
                                <textarea onKeyUp={(event) => this.resizeInput(event)} name='title'
                                          className={style.input}
                                          placeholder='Название проекта'
                                          onChange={(event) => this.handleInputChange(event)}/>
                                <textarea name='description' onKeyUp={(event) => this.resizeInput(event)}
                                          className={style.input}
                                          placeholder='Описание' onChange={(event) => this.handleInputChange(event)}/>
                            </div>
                            <div className={style.wrapper_user}>
                                <SelectListUsers users={this.state.users} selectUser={this.selectUser} searc
                                                 hUsers={this.searchUsers}/>
                            </div>
                            <button onClick={this.createProject}>
                                {"Создать новый проект"}
                            </button>
                        </div>
                    </div>
                </div>
            )
        else
            return <Spinner animation="border" variant="success"/>
    }
}

export default NewProject;