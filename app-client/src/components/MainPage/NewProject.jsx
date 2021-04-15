import React, {Component} from 'react';
import style from './NewProject.module.css';
import {searchUser, uploadAvatar} from "../ServerAPI/userAPI";
import {PROJECT_ICO, USER_ICO} from "../ServerAPI/utils";
import {TextAlert} from "../ModalWindow/ModalWindow";
import {createProject, uploadImageProject} from "../ServerAPI/ProjectAPI";

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
            found_users: [],
            users: [],
            message: "",
            image: null
        };
        this.UploadClick = this.UploadClick.bind(this);
        this.UploadAvatar = this.UploadAvatar.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.addUser = this.addUser.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.createProject = this.createProject.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

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
                this.setState({
                    found_users: response
                })
            });
    };

    addUser = (user) => {
        const users = this.state.users;
        users.push(user);
        this.setState({
            users: users
        })
    };

    removeUser = (user) => {
        const users = this.state.users;
        users.pop(user);
        this.setState({
            users: users
        })
    };

    createProject = () => {
        debugger;

        if (!this.state.title.correct) {
            this.setState({
                message: "поле название проекта пусто"
            });
            document.getElementById('alert').style.display = 'block'
        }
        if (!this.state.description.correct) {
            this.setState({
                message: "поле опсиание проекта проекта пусто"
            });
            document.getElementById('alert').style.display = 'block'
        }
        if (this.state.users.length === 0) {
            this.setState({
                message: "Добавьте хотя бы одного пользователя"
            });
            document.getElementById('alert').style.display = 'block'
        }
        console.log(this.state);
        if (this.state.users.length !== 0 && this.state.description.correct && this.state.title.correct){
            const pr = {
                users: this.state.users,
                title: this.state.title.value,
                description: this.state.description.value,
            };
            createProject(pr)
                .then(response => {
                    this.setState({
                        message: response
                    });
                    document.getElementById('alert').style.display = 'block'
                }).catch(error => {

                console.log("error")
            })
        }

    };

    componentDidMount() {

    }

    render() {
        const users = this.state.found_users.map(user => <UserSummary changeUser={this.addUser} user={user}
                                                                      newChat={this.newChat}/>);
        const choose_users = this.state.users.map(user => <UserSummary changeUser={this.removeUser} user={user}
                                                                       newChat={this.newChat}/>);

        return (
            <div>
                <div id={"new_project"} className={style.alert}>
                    {/*// onClick={() => document.getElementById('new_project').style.display = 'none'}>*/}
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
                            <textarea onKeyUp={(event) => this.resizeInput(event)} name='title' className={style.input}
                                      placeholder='Название проекта'
                                      onChange={(event) => this.handleInputChange(event)}/>
                            <textarea name='description' onKeyUp={(event) => this.resizeInput(event)}
                                      className={style.input}
                                      placeholder='Описание' onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                        <div className={style.wrapper_user}>
                            <div className={style.chooseUsers}>
                                <input name='search'
                                       placeholder="Поиск пользователей"
                                       autoComplete="off"
                                       className={style.search}
                                       onChange={(event) => this.searchUsers(event)}/>
                                {users}
                            </div>
                            <div className={style.selectedUsers}>
                                <label className={style.search}>
                                    {"Участники проекта"}
                                </label>
                                {choose_users}
                            </div>
                        </div>
                        <button onClick={this.createProject}>
                            {"Создать новый проект"}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}


function UserSummary(props) {
    return (
        <div className={style.user_info} onClick={() => props.changeUser(props.user)}>
            <img className={style.user_ico} src={props.user.image !== null ? props.user.image.url : USER_ICO}/>
            <div className={style.username}>
                {props.user.name}
            </div>
        </div>
    )

}

export default NewProject;