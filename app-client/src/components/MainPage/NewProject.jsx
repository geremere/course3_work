import React, {Component} from 'react';
import style from './NewProject.module.css';
import {getAllUsers, searchUser} from "../ServerAPI/userAPI";
import {PROJECT_ICO} from "../ServerAPI/utils";
import {createProject} from "../ServerAPI/ProjectAPI";
import {Button, Spinner} from "react-bootstrap";
import SelectListUsers from "../util/users/SelectListUsers";
import {saveImage} from "../ServerAPI/simpleRequests";
import {AlertInfo} from "../ModalWindow/Alert";

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
            search: {
                value: "",
                correct: false
            },
            users: [],
            selectUsers: null,
            message: {
                head: "",
                content: "",
                show: false
            },
            image: null
        };
        this.UploadClick = this.UploadClick.bind(this);
        this.UploadAvatar = this.UploadAvatar.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.createProject = this.createProject.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
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
        formData.append('image', event.target.files[0]);
        saveImage(formData).then(response => {
            document.getElementById("project_ico").src = response.fileName;
            this.setState({
                message: response.message,
                image: response
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
        searchUser(event.target.value).then(response => {
            const users = response.map(user => {
                for (var it in this.state.selectUsers)
                    if (user.id === this.state.selectUsers[it].id)
                        return {...user, isSelected: true}
                return {...user, isSelected: false}
            }).sort((a, b) => (a.isSelected === b.isSelected) ? 0 : a.isSelected ? -1 : 1)
            this.setState({
                users: users.sort()
            })
        });
    };

    createProject = () => {
        if (this.state.selectUsers != null && this.state.selectUsers.length > 1 && this.state.description.correct && this.state.title.correct) {
            const pr = {
                users: this.state.users,
                title: this.state.title.value,
                description: this.state.description.value,
                image_id: this.state.image !== null ? this.state.image.id : null,
                owner_id: this.props.currentUser.id
            };
            createProject(pr)
                .then(response => {
                    window.location.assign("/project/" + response.id)
                }).catch(error => {
                this.setState({
                    message: {
                        head: "Error",
                        content: error
                    }
                })
            })
        } else {
            this.setState({
                message: {
                    head: "Error",
                    content: "Количество пользователей должно быть больше 1 и описание с название должны быть заполнены",
                    show: true
                }
            })
        }
    };

    closeAlert = (event) => this.setState({
        message: {
            show: false
        }
    })

    componentDidMount() {
        getAllUsers().then(response => {
            this.setState({
                users: response.map(user => ({...user, isSelected: false})),
                isLoaded: true
            });
        })

    }

    render() {

        if (this.state.isLoaded) {
            return (
                <div>
                    <AlertInfo head={this.state.message!=null ?this.state.message.head:""}
                               content={this.state.message!=null ?this.state.message.content:""}
                               show={this.state.message!=null ?this.state.message.show:""}
                               close={this.state.message!=null ?this.closeAlert:""}
                    />
                    <div id={"new_project"} className={style.alert}>
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
                                <SelectListUsers users={this.state.users}
                                                 selectUser={this.selectUser}
                                                 searchUsers={this.searchUsers}/>
                            </div>
                            <Button onClick={this.createProject}>
                                {"Создать новый проект"}
                            </Button>
                        </div>
                    </div>
                </div>
            )
        } else
            return <Spinner animation="border" variant="success"/>
    }
}

export default NewProject;