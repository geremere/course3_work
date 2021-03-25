import React, {Component} from "react";
import style from "./RefactorAccount.module.css"
import {toVk} from "../../ServerAPI/AuthApi";
import {TextAlert} from "../../ModalWindow/ModalWindow";
import {recoverThePassword} from "../../ServerAPI/userAPI";

class RefactorAccount extends Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleRefactor = this.handleRefactor.bind(this);
        this.state = {
            usernameOrEmail: "",
            message: null
        };
    }

    handleOnClick() {
        toVk().then(response => {
            this.setState({
                message: response.message
            });
            document.getElementById('alert').style.display = 'block'
        }).catch(error => {
            this.setState({
                message: error.message
            });
            document.getElementById('alert').style.display = 'block'
        })
    }

    handleRefactor() {
        let email = document.getElementById("input_field").value;
        if (email !== "") {
            recoverThePassword(email).then(response => {
                this.setState({
                    message: response.message
                });
                document.getElementById('alert').style.display = 'block'
            }).catch(error => {
                this.setState({
                    message: error.message
                });
                document.getElementById('alert').style.display = 'block'
            })
        }
    }

    render() {
        return (
            <div className={style.Wrapper}>
                <TextAlert text={this.state.message}/>
                <div className={style.Refactor}>
                    <div className='Inf'>
                        <p>
                            Введите ваш e-mail или имя пользователя<br/>
                            и мы пришлем временный пароль вам на почту
                        </p>
                    </div>
                    <div>
                        <input className={style.Login} placeholder='username or e-mail' name='login' id="input_field">
                        </input>
                    </div>
                    <div>
                        <button className={style.RefactorButton} onClick={this.handleRefactor}>
                            Сбросить пароль
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default RefactorAccount;