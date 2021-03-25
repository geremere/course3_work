import React, {Component} from "react";
import style from "./DDMenuCategory.module.css";
import {filterCourses} from "../ServerAPI/courseAPI"
import {NavLink} from "react-router-dom";

class DDMenuCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "По категории"
        };
        this.showDDMenu = this.showDDMenu.bind(this);
        this.filterByCategory = this.filterByCategory.bind(this);
    }

    showDDMenu = event => {
        const dd = document.getElementById("DDMenuCategory");
        dd.style.display = "block";
    };


    filterByCategory(id, text) {
        this.props.changeIsLoaded();
        this.setState({
            text: text
        });
        filterCourses(id, this.props.substr, "1").then(response => {
            if (id === "")
                id = "9";
            this.props.handler(response, parseInt(id));
        });
    };

    render() {
        return (
            <div className={style.dropdown}>
                <button onClick={this.showDDMenu} className={style.dropbtn} id="dropbtn1">
                    <div className={style.u_name} id="ddtext1">
                        {this.state.text}
                    </div>
                </button>
                <div id="DDMenuCategory" className={style.dropdownContent}>
                    <NavLink className={style.item} onClick={() => this.filterByCategory("1", "Музыка")}
                             to="./1" style={{borderRadius: `7px 7px 0 0`}}>
                        Музыка
                    </NavLink>
                    <NavLink className={style.item} onClick={() => this.filterByCategory("2", "Литература")}
                             to="./2">
                        Литература
                    </NavLink>
                    <NavLink className={style.item} onClick={() => this.filterByCategory("3", "Архитектура")}
                             to="./3">
                        Архитектура
                    </NavLink>
                    <NavLink className={style.item} onClick={() => this.filterByCategory("4", "Искусство")}
                             to="./4">
                        Искусство
                    </NavLink>
                    <NavLink className={style.item} onClick={() => this.filterByCategory("5", "Дизайн")}
                             to="./5">
                        Дизайн
                    </NavLink>
                    <NavLink className={style.item} onClick={() => this.filterByCategory("6", "Каллиграфия")}
                             to="./6">
                        Каллиграфия
                    </NavLink>
                    <NavLink className={style.item} onClick={() => this.filterByCategory("7", "Кино")}
                             to="./7">
                        Кино
                    </NavLink>
                    <NavLink className={style.item} onClick={() => this.filterByCategory("8", "Пение")}
                             to="./8">
                        Пение
                    </NavLink>
                    <NavLink className={style.item} onClick={() => this.filterByCategory("", "Все категории")}
                             to="./" style={{borderRadius: `0 0 7px 7px`}}>
                        Все категории
                    </NavLink>
                </div>
            </div>
        )
    }
}

export default DDMenuCategory;