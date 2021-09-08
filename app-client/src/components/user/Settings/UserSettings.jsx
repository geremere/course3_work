import React, {Component} from "react";
import style from "./UserSettings.module.css";
import {AlertInfo} from "../../ModalWindow/Alert";
import {Button, Form, FormGroup} from "react-bootstrap";
import {checkEmailAvailability, checkUsernameAvailability} from "../../ServerAPI/AuthApi";
import {changePassword, isDefaultRegType, updateUser} from "../../ServerAPI/userAPI";

class UserSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            user: {
                name: {
                    isValid: true,
                    value: this.props.user.name
                },
                username: {
                    isValid: true,
                    value: this.props.user.username,
                    show: false
                },
                email: {
                    isValid: true,
                    value: this.props.user.email
                },
                password: ""
            },
            showChangePassword: false,
            oldPassword: {
                isValid: true,
                value: "",
                show: false
            },
            firstPassword: "",
            secondPassword: "",
        }
        this.update = this.update.bind(this);
    }

    update = (event) => {
        if (this.state.user.name.isValid && this.state.user.username.isValid && this.state.user.email.isValid) {
            const user = {
                name: this.state.user.name.value,
                username: this.state.user.username.value,
                email: this.state.user.email.value
            }
            updateUser(user, this.props.user.id).then(response => {
                if (response) {
                    this.setState({
                        message: {
                            head: "User Update",
                            content: "User has been successfully updated",
                            show: true
                        }
                    })
                    this.props.loadUser();
                }
            })
        } else {
            this.setState({
                message: {
                    head: "Incorrect Data",
                    content: "Please Check input values",
                    show: true
                }
            })
        }

    }

    componentDidMount() {
        isDefaultRegType().then(response => {
            const oldPassword = this.state.oldPassword;
            oldPassword.show = response.isDefault;
            const user = this.state.user;
            user.username.show = !response.isVk;
            this.setState({
                oldPassword: oldPassword,
                user: user
            })
        })
    }

    render() {
        return (
            <>
                <AlertInfo head={this.state.message != null ? this.state.message.head : ""}
                           content={this.state.message != null ? this.state.message.content : ""}
                           show={this.state.message != null ? this.state.message.show : false}
                           close={() => this.setState({message: {show: false}})}
                />
                <Form>
                    <FormGroup hidden={this.state.showChangePassword}
                               className={style.text}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            style={{height: '30px'}}
                            value={this.state.user.name.value}
                            onChange={(event) => {
                                const user = this.state.user
                                user.name.value = event.target.value
                                this.setState({
                                    user: user
                                })
                            }}
                        />
                    </FormGroup>
                    <FormGroup hidden={this.state.showChangePassword}
                               className={style.text}>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            disabled={!this.state.user.username.show}
                            style={{height: '30px'}}
                            isInvalid={!this.state.user.username.isValid}
                            value={this.state.user.username.value}
                            onChange={(event) => {
                                checkUsernameAvailability(event.target.value).then(response => {
                                        const user = this.state.user;
                                        user.username.isValid = event.target.value === this.props.user.username || response.available
                                        this.setState({
                                            user: user
                                        })
                                    }
                                )
                                const user = this.state.user;
                                user.username.value = event.target.value
                                this.setState({
                                    user: user
                                })
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            This username is already in use
                        </Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup hidden={this.state.showChangePassword}
                               className={style.text}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            style={{height: '30px'}}
                            isInvalid={!this.state.user.email.isValid}
                            value={this.state.user.email.value}
                            onChange={(event) => {
                                checkEmailAvailability(event.target.value).then(response => {
                                        const user = this.state.user;
                                        user.email.isValid = event.target.value === this.props.user.email || response.available
                                        user.email.value = event.target.value
                                        this.setState({
                                            user: user
                                        })
                                    }
                                )
                                const user = this.state.user;
                                user.email.value = event.target.value
                                this.setState({
                                    user: user
                                })
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            This email is already in use
                        </Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup hidden={!this.state.showChangePassword}
                               className={style.text}>
                        <Form.Label hidden={!this.state.oldPassword.show}>Old Password</Form.Label>
                        <Form.Control
                            hidden={!this.state.oldPassword.show}
                            type="password"
                            style={{height: '30px'}}
                            value={this.state.oldPassword.value}
                            isInvalid={!this.state.oldPassword.isValid}
                            onChange={(event) => {
                                const password = this.state.oldPassword
                                password.value = event.target.value
                                this.setState({
                                    oldPassword: password
                                })
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            Password incorrect
                        </Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup hidden={!this.state.showChangePassword}
                               className={style.text}>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            style={{height: '30px'}}
                            value={this.state.firstPassword}
                            onChange={(event) =>
                                this.setState({
                                    firstPassword: event.target.value
                                })
                            }
                        />
                        <Form.Label>Repeat New Password</Form.Label>
                        <Form.Control
                            type="password"
                            style={{height: '30px'}}
                            value={this.state.secondPassword}
                            isInvalid={this.state.secondPassword !== this.state.firstPassword}
                            onInvalidCapture="sfsa"
                            onChange={(event) =>
                                this.setState({
                                    secondPassword: event.target.value
                                })
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            Passwords must be the equals
                        </Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup hidden={!this.state.showChangePassword}
                               className={style.text}>
                        <Button className={style.submit}
                                disabled={this.state.secondPassword !== this.state.firstPassword}
                                onClick={() => {
                                    const requestDto = {
                                        oldPassword: this.state.oldPassword.value,
                                        newPassword: this.state.firstPassword
                                    }
                                    changePassword(requestDto).then(response => {
                                        if (response) {
                                            this.setState({
                                                showChangePassword: false,
                                                oldPassword: {
                                                    isValid: true,
                                                    value: ""
                                                },
                                                firstPassword: "",
                                                secondPassword: ""
                                            })
                                        } else {
                                            const oldPassword = this.state.oldPassword;
                                            oldPassword.isValid = false;
                                            this.setState({
                                                oldPassword: oldPassword
                                            })
                                        }
                                    })

                                }}>
                            Change Password
                        </Button>
                        <Form.Text
                            className={style.change_password}
                            onClick={() => this.setState({showChangePassword: false})}>
                            Close Change Password
                        </Form.Text>
                    </FormGroup>
                    <FormGroup>
                        <Button hidden={this.state.showChangePassword}
                                variant="primary"
                                className={style.submit}
                                onClick={this.update}>
                            Save Changes
                        </Button>
                        <Form.Text hidden={this.state.showChangePassword}
                                   className={style.change_password}
                                   onClick={() => this.setState({showChangePassword: true})}>
                            Change Password
                        </Form.Text>
                    </FormGroup>


                </Form>
            </>
        );
    }
}

export default UserSettings;