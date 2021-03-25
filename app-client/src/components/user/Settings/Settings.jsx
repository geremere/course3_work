import React, {Component} from "react";
import style from "./Settings.module.css";
import {Switch, Route, NavLink} from "react-router-dom";
import {
    checkEmailAvailability,
    checkUsernameAvailability
} from "../../ServerAPI/AuthApi";
import {editEmail,
    editName,
    editSurName,
    editPassword,
    editUsername} from "../../ServerAPI/userAPI"
import {
    EMAIL_MAX_LENGTH,
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH
} from "../../ServerAPI/utils";
import {Form} from "antd";
import {TextAlert} from "../../ModalWindow/ModalWindow";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
    }

    popUpText = (message) => {
        this.setState({
            message: message
        });
        document.getElementById('alert').style.display = 'block';
    };

    render() {
        const regexp = /\/user\/(\w+\/)/gm;
        let path = window.location.pathname.match(regexp);
        if (path === null)
            path = "/settings/"
        return (
            <div className={style.Settings}>
                <TextAlert text={this.state.message}/>
                <UserSettings path={path}/>
                <Switch>
                    <Route path={path + "editname"} render={(props) => <EditName user={this.props.user} popUpText={this.popUpText}/>}/>
                    <Route path={path + "editsurname"} render={(props) => <EditSurName user={this.props.user} popUpText={this.popUpText}/>}/>
                    <Route path={path + "editusername"} render={(props) => <EditUserName user={this.props.user} popUpText={this.popUpText}/>}/>
                    <Route path={path + "editpassword"} render={(props) => <EditPassword user={this.props.user} popUpText={this.popUpText}/>}/>
                    <Route path={path + "editemail"} render={(props) => <EditEmail user={this.props.user} popUpText={this.popUpText}/>}/>
                </Switch>
            </div>
        );
    }
}

class EditName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateName = this.validateName.bind(this);
    }

    handleSubmit = event => {
        event.preventDefault();
        editName(this.state.name.value).then(response => {
            this.props.popUpText(response.message)
        }).catch(response => {
            this.props.popUpText(response.message)
        });
    };

    handleChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    };

    render() {
        return (
            <Form className={style.MainBlock}>
                <Form.Item className={style.f}
                           validateStatus={this.state.name.validateStatus}
                           help={this.state.name.errorMsg}>
                    <input className={style.Changes}
                           placeholder="новое имя"
                           name="name"
                           onChange={(event) => this.handleChange(event, this.validateName)}/>
                </Form.Item>
                <Form.Item>
                    <button className={style.Submit} onClick={this.handleSubmit}>Сохранить изменения</button>
                </Form.Item>
            </Form>
        );
    }

    validateName = (name) => {
        if (name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };
}

class EditSurName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateName = this.validateName.bind(this);
    }

    handleSubmit = event => {
        event.preventDefault();
        editSurName(this.state.name.value).then(response => {
            this.props.popUpText(response.message)
        }).catch(response => {
            this.props.popUpText(response.message)
        });
    };

    handleChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    };

    render() {
        return (
            <Form className={style.MainBlock}>
                <Form.Item className={style.f}
                           validateStatus={this.state.name.validateStatus}
                           help={this.state.name.errorMsg}>
                    <input className={style.Changes}
                           placeholder="новая фамилия"
                           name="name"
                           onChange={(event) => this.handleChange(event, this.validateName)}/>
                </Form.Item>
                <Form.Item>
                    <button className={style.Submit} onClick={this.handleSubmit}>Сохранить изменения</button>
                </Form.Item>
            </Form>
        );
    }

    validateName = (name) => {
        if (name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Surname is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Surname is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };
}

class EditUserName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: {
                value: ''
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
    }

    handleSubmit = event => {
        event.preventDefault();
        editUsername(this.state.username.value).then(response => {
            this.props.popUpText(response.message)
        }).catch(response => {
            this.props.popUpText(response.message)
        });
    };

    handleChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    };


    render() {
        return (
            <Form className={style.MainBlock} onSubmit={this.handleSubmit}>
                <Form.Item className={style.f}
                           validateStatus={this.state.username.validateStatus}
                           help={this.state.username.errorMsg}>
                    <input className={style.Changes}
                           placeholder="новое имя пользователя"
                           onBlur={this.validateUsernameAvailability}
                           name="username"
                           onChange={(event) => this.handleChange(event, this.validateUsername)}/>
                </Form.Item>
                <Form.Item>
                    <button className={style.Submit}>Сохранить изменения</button>
                </Form.Item>
            </Form>
        );
    }

    validateUsername = (username) => {
        if (username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    };

    validateUsernameAvailability() {
        // First check for client side errors in username
        const usernameValue = this.state.username.value;
        const usernameValidation = this.validateUsername(usernameValue);
        if (usernameValidation.validateStatus === 'error') {
            this.setState({
                username: {
                    value: usernameValue,
                    ...usernameValidation
                }
            });
            return;
        }

        this.setState({
            username: {
                value: usernameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkUsernameAvailability(usernameValue)
            .then(response => {
                if (response.success) {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'error',
                            errorMsg: 'This username is already taken'
                        }
                    });
                }
            }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                username: {
                    value: usernameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    };

}

class EditPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentpassword: {
                value: ''
            },
            firstpassword: {
                value: ''
            },
            secondpassword: {
                value: ''
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateFirstPassword = this.validateFirstPassword.bind(this);
        this.validateSecondPassword = this.validateSecondPassword.bind(this);
    }

    handleSubmit = event => {
        event.preventDefault();
        let PasswordRequest = {
            oldPassword: this.state.currentpassword.value,
            newPassword: this.state.firstpassword.value,
            repeatedPassword: this.state.secondpassword.value
        };
        editPassword(PasswordRequest).then(response => {
            this.props.popUpText(response.message)
        }).catch(response => {
            this.props.popUpText(response.message)
        });
    };

    handleChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    };

    isFormValid() {
        return !(this.state.firstpassword.validateStatus === 'success' &&
            this.state.secondpassword.validateStatus === 'success' &&
            this.state.currentpassword.value !== '');
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit} className={style.MainBlock}>
                <Form.Item className={style.f}>
                    <input className={style.Changes}
                           placeholder="текущий пароль"
                           name="currentpassword"
                           value={this.state.currentpassword.value}
                           onChange={(event) => this.handleChange(event, this.validateFirstPassword)}/>
                </Form.Item>
                <Form.Item className={style.f}
                           validateStatus={this.state.firstpassword.validateStatus}
                           help={this.state.firstpassword.errorMsg}>
                    <input className={style.Changes}
                           placeholder="новый пароль"
                           name="firstpassword"
                           value={this.state.firstpassword.value}
                           onChange={(event) => this.handleChange(event, this.validateFirstPassword)}/>
                </Form.Item>
                <Form.Item className={style.f}
                           validateStatus={this.state.secondpassword.validateStatus}
                           help={this.state.secondpassword.errorMsg}>
                    <input className={style.Changes}
                           placeholder="повторите новый пароль"
                           name="secondpassword"
                           value={this.state.secondpassword.value}
                           onChange={(event) => this.handleChange(event, this.validateSecondPassword)}/>
                </Form.Item>
                <div>
                    <button className={style.Submit} disabled={this.isFormValid}>Сохранить изменения</button>
                </div>
            </Form>
        );
    }

    validateFirstPassword = (password) => {
        if (password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            };
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };

    validateSecondPassword = (password) => {
        if (password !== this.state.firstpassword.value) {
            return {
                validateStatus: 'error',
                errorMsg: `Passwords are not equal)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };
}

class EditEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: {
                value: ''
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
    }

    handleSubmit = event => {
        event.preventDefault();
        editEmail(this.state.email.value).then(response => {
            this.props.popUpText(response.message)
        }).catch(response => {
            this.props.popUpText(response.message)
        });
    };

    handleChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    };


    render() {
        return (
            <Form className={style.MainBlock} onSubmit={this.handleSubmit}>
                <Form.Item className={style.f}
                           validateStatus={this.state.email.validateStatus}
                           help={this.state.email.errorMsg}>
                    <input className={style.Changes}
                           id="mail"
                           name="email"
                           placeholder='email'
                           type='email'
                           autoComplete='off'
                           value={this.state.email.value}
                           onBlur={this.validateEmailAvailability}
                           onChange={(event) => this.handleChange(event, this.validateEmail)}/>
                </Form.Item>
                <Form.Item>
                    <button className={style.Submit}>Сохранить изменения</button>
                </Form.Item>
            </Form>
        );
    }

    validateEmailAvailability() {
        // First check for client side errors in email
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if (emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
            .then(response => {
                if (response.success) {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'error',
                            errorMsg: 'This Email is already registered'
                        }
                    });
                }
            }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmail = (email) => {
        if (!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if (!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if (email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    };

}

function UserSettings(props) {
    return (
        <div className={style.UserSettings}>
            <div className={style.SettingsItem}>
                <NavLink to={props.path + "editname"} className={style.SettingsLink}
                         activeClassName={style.selected_link}>Изменить
                    имя</NavLink>
            </div>
            <div className={style.SettingsItem}>
                <NavLink to={props.path + "editsurname"} className={style.SettingsLink}
                         activeClassName={style.selected_link}>Изменить
                    фамилию</NavLink>
            </div>
            <div className={style.SettingsItem}>
                <NavLink to={props.path + "editusername"} className={style.SettingsLink}
                         activeClassName={style.selected_link}>Изменить
                    имя пользователя</NavLink>
            </div>
            <div className={style.SettingsItem}>
                <NavLink to={props.path + "editpassword"} className={style.SettingsLink}
                         activeClassName={style.selected_link}>Изменить
                    пароль</NavLink>
            </div>
            <div className={style.SettingsItem}>
                <NavLink to={props.path + "editemail"} className={style.SettingsLink}
                         activeClassName={style.selected_link}>Изменить почту</NavLink>
            </div>
        </div>
    )
}

export default Settings;