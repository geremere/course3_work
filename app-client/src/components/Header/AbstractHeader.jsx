import React, {Component} from "react";
import style from './AbstractHeader.module.css'
import {NavLink} from "react-router-dom";
import {TextAlert} from "../ModalWindow/ModalWindow";
import {Toaster} from "react-hot-toast";

class AbstractHeader extends Component {
    constructor(props) {
        super(props);
        window.alert = TextAlert
    }


    handleClickOut = event => {
        this.props.LogOut();
        window.location.assign('/mainpage');
    };

    render() {
        console.log(this.props.user)
        let path = "https://img.favpng.com/20/21/15/computer-icons-symbol-user-png-favpng-7gAkK6jxCgYYpxfGPuC5yBaWr.jpg";
        if (this.props.user.image != null) {
            path = this.props.user.image.url
        } else {
            path = "https://img.favpng.com/20/21/15/computer-icons-symbol-user-png-favpng-7gAkK6jxCgYYpxfGPuC5yBaWr.jpg"
        }
        let menuItems;
        if (this.props.isAuthenticated) {
            menuItems = [
                <DDMenu path={path} username={this.props.user.username} name={this.props.user.name}
                        LogOut={this.props.LogOut} key="3"/>,
                <NavLink to = "/chat" className={style.chat} key='4'>
                    <img className={style.chat} src="https://riskmanagerbucket.s3.eu-north-1.amazonaws.com/const_resouses/chat.svg"/>
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
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}/>
                <div className={style.HeaderComponents}>
                    {menuItems}
                    <SearchField/>
                    <NavLink className={style.HeaderText} to="/test">Risk Manager</NavLink>
                </div>
            </header>
        )
    };
}

window.onclick = function (event) {
    let ddm = document.getElementById("myDropdown");
    if (ddm != null && event.target.className !== style.dropbtn && event.target.className !== style.ico && event.target.className !== style.u_name)
        document.getElementById("myDropdown").style.display = "none";
    if (event.target.id !== "search-icon" && event.target.id !== "search_field" && event.target.id !== "search_input" && window.location.href.indexOf("searchresults") === -1)
        document.getElementById("search_input").value = "";
};

class DDMenu extends Component {
    constructor(props) {
        super(props);
        this.showDDMenu = this.showDDMenu.bind(this);
        this.handleClickOut = this.handleClickOut.bind(this);
    }

    handleClickOut = event => {
        this.props.LogOut();
        window.location.assign('/mainpage');
    };

    showDDMenu = event => {
        const dd = document.getElementById("myDropdown");
        dd.style.display = "block";
    };


    render() {
        return (
            <div className={style.dropdown}>
                <button onClick={this.showDDMenu} className={style.dropbtn}>
                    <img className={style.ico} src={this.props.path} alt=""/>
                    <div className={style.u_name}>
                        {this.props.name}
                    </div>
                </button>
                <div id="myDropdown" className={style.dropdownContent}>
                    <div className={style.item}>
                        <div className={style.linkText}>Личный кабинет</div>
                        <NavLink to={`/user/${this.props.username}`} className={style.itemLink}/>
                    </div>
                    <div className={style.item}>
                        <div className={style.linkText}>Настройки</div>
                        <NavLink to="/user/settings/editname" className={style.itemLink}/>
                    </div>
                    <div className={style.item}>
                        <div className={style.linkText}>Выход</div>
                        <NavLink to="/mainpage" onClick={this.handleClickOut} className={style.itemLink}/>
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
        const s = document.getElementById("search_input").value;
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
                    <NavLink id="search-icon" className={style.SearchLink} to={this.state.path}>
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