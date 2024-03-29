import React, {Component} from "react";
import style from './AbstractHeader.module.css'
import {NavLink} from "react-router-dom";
import {TextAlert} from "../ModalWindow/ModalWindow";
import {CHAT_ICO, USER_ICO} from "../ServerAPI/utils";

class AbstractHeader extends Component {
    constructor(props) {
        super(props);
        window.alert = TextAlert
    }


    render() {
        let path = USER_ICO;
        if (this.props.user.image != null) {
            path = this.props.user.image.url
        }
        let menuItems;
        if (this.props.isAuthenticated) {
            menuItems = [
                <DDMenu path={path} username={this.props.user.username} name={this.props.user.name}
                        LogOut={this.props.LogOut} key="3"/>,
                <NavLink to="/chat" className={style.chat} key='4'>
                    <img className={style.chat} src={CHAT_ICO}/>
                </NavLink>,
            ];
        } else {
            menuItems = [
                <NavLink className={style.Reg} to='/registration' key="1"> Регистрация </NavLink>,
                <NavLink className={style.Enter} to='/login' key="2">Вход</NavLink>
            ];
        }
        return (
            <header className={style.AbstractHeader}>
                <div className={style.HeaderComponents}>
                    {menuItems}
                    {/*<SearchField/>*/}
                    <NavLink className={style.HeaderText} to="/mainpage">Risk Manager</NavLink>
                </div>
            </header>
        )
    };
}

class DDMenu extends Component {
    constructor(props) {
        super(props);
        this.handleClickOut = this.handleClickOut.bind(this);
    }

    handleClickOut = event => {
        this.props.LogOut();
        window.location.assign('/mainpage');
    };


    render() {
        return (
            <div className={style.dropdown}>
                <button onFocus={() => document.getElementById("myDropdown").style.display = "block"}
                        className={style.dropbtn}
                        onBlur={() => setTimeout(() => document.getElementById("myDropdown").style.display = "none", 250)}>
                    <img className={style.ico} src={this.props.path} alt=""/>
                    <div className={style.u_name}>
                        {this.props.name}
                    </div>
                </button>
                <div id="myDropdown" className={style.dropdownContent}>
                    <div className={style.item}>
                        <NavLink to={`/user/${this.props.username}`} className={style.itemLink}>
                            <label>
                                Личный кабинет
                            </label>
                        </NavLink>
                    </div>
                    <div className={style.item}>
                        <NavLink to="/mainpage" onClick={this.handleClickOut} className={style.itemLink}>
                            <label>
                                Выход
                            </label>
                        </NavLink>
                    </div>
                </div>
            </div>
        )
    }
}


class SearchField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            path: "/searchresults/все"
        };
    }

    changeHandler = event => {
        const s = event.target.value;
        if (s.length === 0) {
            this.setState(
                {
                    path: "/searchresults/все/"
                }
            )
        } else {
            this.setState(
                {
                    path: "/searchresults/" + s + "/"
                }
            )
        }
    };

    submitHandler = event => {
        event.preventDefault();
    };

    render() {
        return (
            <form className={style.InputForm} onSubmit={this.submitHandler}>
                <div className={style.Search} id="search_field">
                    <NavLink id="search-icon" className={style.SearchLink} to={this.state.path}
                             onClick={() => document.getElementById("search_input").value = ""}>
                        <img src="https://image.flaticon.com/icons/svg/109/109859.svg" alt=""
                             className={style.SearchIcon}/>
                    </NavLink>
                    <input onChange={this.changeHandler} id="search_input" className={style.SearchInput} name="s"
                           placeholder="Что ты хочешь узнать сегодня?"
                           type="search"/>
                </div>
            </form>
        )
    }
}

export default AbstractHeader;