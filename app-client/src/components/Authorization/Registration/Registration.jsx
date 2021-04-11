import React, {Component} from "react";
import style from "./Registration.module.css";
import {checkEmailAvailability, checkUsernameAvailability, signUp} from "../../ServerAPI/AuthApi";
import {Form} from "antd";
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../ServerAPI/utils';
import {TextAlert} from "../../ModalWindow/ModalWindow";

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: {
                value: ''
            },
            secondname: {
                value: ''
            },
            username: {
                value: ''
            },
            email: {
                value: ''
            },
            password: {
                value: ''
            },
            message: ""
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        let signupuser = {
            name: document.getElementById('firstname').value,
            surname: document.getElementById('secondname').value,
            email: document.getElementById('mail').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };
        signUp(signupuser).then(response => {
            this.setState({
                message: response.message
            });
            document.getElementById('alert').style.display = 'block';

            if (response.success) {
                window.location.assign('/login');
            }
        }).catch(response => {
            this.setState({
                message: response.message
            });
            document.getElementById('alert').style.display = 'block'
        })
    };

    isFormInvalid() {
        return !(this.state.firstname.validateStatus === 'success' &&
            this.state.secondname.validateStatus === 'success' &&
            this.state.username.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className={style.Main}>
                <TextAlert text={this.state.message}/>
                < Form onSubmit={this.handleSubmit} className={style.Registration}>
                    <div className={style.Inf}>
                        <p>Регистрация</p>
                    </div>
                    <Form.Item className={style.help}
                               validateStatus={this.state.firstname.validateStatus}
                               help={this.state.firstname.errorMsg}>
                        <input className={style.Login}
                               id="firstname"
                               name="firstname"
                               placeholder='Имя'
                               value={this.state.firstname.value}
                               onChange={(event) => this.handleInputChange(event, this.validateName)}/>
                    </Form.Item>
                    <Form.Item className={style.help}
                               validateStatus={this.state.secondname.validateStatus}
                               help={this.state.secondname.errorMsg}>
                        <input className={style.Login}
                               id="secondname"
                               name="secondname"
                               placeholder='Фамилия'
                               value={this.state.secondname.value}
                               onChange={(event) => this.handleInputChange(event, this.validateName)}/>
                    </Form.Item>
                    <Form.Item className={style.help}
                               validateStatus={this.state.username.validateStatus}
                               help={this.state.username.errorMsg}>
                        <input className={style.Login}
                               id="username"
                               placeholder='username'
                               name="username"
                               autoComplete='off'
                               value={this.state.username.value}
                               onBlur={this.validateUsernameAvailability}
                               onChange={(event) => this.handleInputChange(event, this.validateUsername)}/>
                    </Form.Item>
                    <Form.Item className={style.help}
                               validateStatus={this.state.email.validateStatus}
                               help={this.state.email.errorMsg}>
                        <input className={style.Login}
                               id="mail"
                               name="email"
                               placeholder='email'
                               type='email'
                               autoComplete='off'
                               value={this.state.email.value}
                               onBlur={this.validateEmailAvailability}
                               onChange={(event) => this.handleInputChange(event, this.validateEmail)}/>
                    </Form.Item>
                    <Form.Item className={style.help}
                               validateStatus={this.state.password.validateStatus}
                               help={this.state.password.errorMsg}>
                        <input className={style.Password}
                               type='password'
                               placeholder='Пароль'
                               name="password"
                               value={this.state.password.value}
                               onChange={(event) => this.handleInputChange(event, this.validatePassword)}
                               id="password"/>
                    </Form.Item>
                    <Form.Item>
                        <button className={style.Register} onClick={this.handleSubmit}
                                disabled={this.isFormInvalid() }>
                            Зарегистрироваться
                        </button>
                    </Form.Item>
                </Form>
            </div>
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
                validateStatus: 'error',
                errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };

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

    validateUsername = (username) => {
        if (username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
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
                if (response.available) {
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
                if (response.available) {
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

    validatePassword = (password) => {
        if (password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }
}

export default SignUp;