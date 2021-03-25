import React, {Component} from 'react';
import style from './Authorization.module.css';
import {NavLink} from 'react-router-dom';
import {login} from "../../ServerAPI/AuthApi";
import {TextAlert} from "../../ModalWindow/ModalWindow";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameOrEmail: null,
            password: null,
            message:""
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        login(this.state).then(response => {
            localStorage.setItem('accessToken', response.accessToken);
            this.props.onLogin();
            window.location.assign('/mainpage')
        }).catch(error => {
            document.getElementById('alert').style.display = 'block';
            this.setState({
                message:error.message
            })
        });
    };

    handleChangeName = event => {
        this.setState({usernameOrEmail: event.target.value});
    };

    handleChangePassword = event => {
        this.setState({password: event.target.value});
    };

    render() {
        const redirect=window.location.protocol + "//" + window.location.host + "/vkauth";
        const path = "https://oauth.vk.com/authorize?client_id=7457976&display=popup&redirect_uri=" + redirect + "&scope=photos,email&response_type=code&v=5.103";
        return (
            <div className={style.Main}>
                <TextAlert text={this.state.message}/>
                <form onSubmit={this.handleSubmit}>
                    <div className={style.Inf}>
                        <p id="message">
                            Вход
                        </p>
                    </div>
                    <div>
                        <input className={style.Login} onChange={this.handleChangeName} id='login'>
                        </input>
                    </div>
                    <div>
                        <input className={style.Password} type='password' onChange={this.handleChangePassword}
                               id='pass'>
                        </input>
                    </div>
                    <div className={style.wrapper_hef}>
                        <NavLink className={style.ForgetPassword} to='/forgotpassword'>
                            Забыли пaроль?
                        </NavLink>
                        <div className={style.vk_auth}>
                            <a className={style.ico_wrapper} href={path}>
                                <img className={style.vk_ico}
                                     src="https://lumpics.ru/wp-content/uploads/2018/11/Skachat-VKontakte-dlya-kompyutera.png" alt=""/>
                            </a>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className={style.Check}>
                            Войти
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;