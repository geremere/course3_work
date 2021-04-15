import React, {Component} from "react";
import {filterCourses} from "../ServerAPI/courseAPI";
import style from "./MainPage.module.css";

class Menu extends Component {
    constructor(props) {
        super(props);
        this.loadCoursesByCategory = this.loadCoursesByCategory.bind(this);
    }

    loadCoursesByCategory(category) {
        this.props.changeLoaded();
        filterCourses(category, "", "1").then(response => {
            this.props.handler(response);
        });
    }

    render() {
        return (
            <div className={style.Menu}>
                <div className={style.MenuHead}> Открытый доступ ко всем направлениям искусства</div>
                <div className={style.MenuCategories}>
                    <button className={style.MenuItem} onClick={() => this.loadCoursesByCategory("")}>
                        Все категории
                    </button>
                    <button className={style.MenuItem} onClick={() => this.loadCoursesByCategory("1")}>
                        Музыка
                    </button>
                    <button className={style.MenuItem} onClick={() => this.loadCoursesByCategory("2")}>
                        Литература
                    </button>
                    <button className={style.MenuItem} onClick={() => this.loadCoursesByCategory("3")}>
                        Архитектура
                    </button>
                    <button className={style.MenuItem} onClick={() => this.loadCoursesByCategory("4")}>
                        Искусство
                    </button>
                    <button className={style.MenuItem} onClick={() => this.loadCoursesByCategory("5")}>
                        Дизайн
                    </button>
                    <button className={style.MenuItem} onClick={() => this.loadCoursesByCategory("6")}>
                        Каллиграфия
                    </button>
                    <button className={style.MenuItem} onClick={() => this.loadCoursesByCategory("7")}>
                        Кино
                    </button>
                    <button className={style.MenuItem} onClick={() => this.loadCoursesByCategory("8")}>
                        Пение
                    </button>
                </div>
            </div>
        );
    }
}
 export default Menu;