import React, {Component} from 'react';
import style from './ProjectSetting.module.css';
import {getAllUsers, getCurrentUser, searchUser, uploadAvatar} from "../ServerAPI/userAPI";
import {PROJECT_ICO, USER_ICO} from "../ServerAPI/utils";
import {updateProject} from "../ServerAPI/ProjectAPI";
import {Button, Form, FormControl, FormGroup, OverlayTrigger, Spinner, Tooltip} from "react-bootstrap";
import SelectListUsers from "../util/users/SelectListUsers";
import {saveImage, uploadImage} from "../ServerAPI/simpleRequests";
import {AlertInfo} from "../ModalWindow/Alert";

class ProjectSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: this.props.project.description,
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
        this.uploadAvatar = this.uploadAvatar.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.update = this.update.bind(this);
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

    uploadAvatar = (event) => {
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

    renderTooltipTitle = (props) => (
        <Tooltip hidden={this.state.isTeammate} id="button-tooltip" {...props}>
            You can`t change risk title
        </Tooltip>
    );

    update = () => {
        if (this.state.selectUsers != null && this.state.selectUsers.length > 1 && this.state.description.correct && this.state.title.correct) {
            const pr = {
                users: this.state.users,
                title: this.props.project.title,
                description: this.state.description.value,
                image_id: this.state.image !== null ? this.state.image.id : null,
                owner_id: this.props.currentUser.id
            };
            updateProject(pr)
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

    getIsTeammate(user) {
        return this.props.project.users.map(user => user.id).indexOf(user.id) !== -1;
    }

    componentDidMount() {
        getAllUsers().then(response => {
            this.setState({
                users: response.map(user => ({...user, isSelected: this.getIsTeammate(user)})),
                isLoaded: true
            });
        })
    }

    render() {

        if (this.state.isLoaded) {
            return (
                <div>
                    <AlertInfo head={this.state.message != null ? this.state.message.head : ""}
                               content={this.state.message != null ? this.state.message.content : ""}
                               show={this.state.message != null ? this.state.message.show : ""}
                               close={this.state.message != null ? this.closeAlert : ""}
                    />
                    <Form className={style.form}>
                        <FormGroup className={style.ico_wrap}>
                            <input id="file_project" type="file" className={style.upload} onChange={this.uploadAvatar}/>
                            <div className={style.avatar_wrapper} onClick={this.UploadClick}>
                                <img id='project_ico' className={style.avatar}
                                     src={this.props.project.image_url == null ? PROJECT_ICO : this.props.project.image_url}
                                     alt=''/>
                                <img className={style.hover_wrapper}
                                     src="https://cdn.pixabay.com/photo/2016/12/18/13/44/download-1915749_1280.png"
                                     alt=""/>
                            </div>
                        </FormGroup>
                        <FormGroup className={style.text}>
                            <Form.Label>Project Title</Form.Label>
                            <OverlayTrigger placement="left"
                                            overlay={this.renderTooltipTitle}>
                                <Form.Control
                                    style={{height: '25px'}}
                                    value={this.props.project.title}
                                    disabled={true}
                                />
                            </OverlayTrigger>
                        </FormGroup>
                        <FormGroup className={style.text}>
                            <Form.Label>Project Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                style={{height: '50px'}}
                                value={this.state.description}
                                onChange={(event) => this.setState({description: event.target.value})}
                            />
                        </FormGroup>
                        <FormGroup className={style.text}>
                            <Form.Label>Change Users On Project</Form.Label>
                            <SelectListUsers users={this.state.users}
                                             selectUser={this.selectUser}
                                             searchUsers={this.searchUsers}/>
                        </FormGroup>
                        <Button variant="primary" onClick={this.update}>
                            Save Changes
                        </Button>
                    </Form>
                </div>
            )
        } else
            return <Spinner animation="border" variant="success"/>
    }
}

export default ProjectSettings;