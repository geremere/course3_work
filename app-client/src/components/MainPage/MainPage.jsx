import React, {Component} from "react";
import style from "./MainPage.module.css"
import {getRandomCourses, getMainImage, filterCourses} from "../ServerAPI/courseAPI";
import {NavLink} from "react-router-dom";
import {Loading} from "../common/Loading/Loading";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            isLoaded: false,
            imageUrl: ''
        };
        this.loadCourses = this.loadCourses.bind(this);
        this.changeCourses = this.changeCourses.bind(this);
        this.changeLoaded = this.changeLoaded.bind(this);
    }

    loadCourses() {
        getRandomCourses().then(response => {
            this.setState({
                courses: response,
                isLoaded: true
            });
        });
    }

    loadMainImage() {
        getMainImage().then(response => {
            this.setState({
                imageUrl: response.url
            });
        });
    }

    componentDidMount() {
        this.loadCourses();
        this.loadMainImage();
    }

    changeCourses(courses) {
        this.setState({
            courses: courses,
            isLoaded: true
        });
    }

    changeLoaded(){
        this.setState({
            isLoaded: false
        });
    }

    render() {
        const coursesList = [];
        this.state.courses.forEach((course) => {
            coursesList.push(<CourseBlock course={course} key={course.courseId}/>);
        });
        if (coursesList.length === 0){
            coursesList.push(<div>Пока таких курсов нет</div>);
        }
        if (this.state.isLoaded) {
            return (
                <div className={style.Main}>
                    <Base isAuthenticated={this.props.isAuthenticated}
                          imageUrl={this.state.imageUrl === null ? "https://lacbucket.s3.eu-west-2.amazonaws.com/resources/mainpage/02e5dec6cb402882221e4e6ba1a6649b.png" : this.state.imageUrl}/>
                    <Menu handler={this.changeCourses} changeLoaded={this.changeLoaded}/>
                    {coursesList}
                </div>);
        } else {
            return (
                <div className={style.Main}>
                    <Base isAuthenticated={this.props.isAuthenticated}
                          imageUrl={this.state.imageUrl === null ? "https://lacbucket.s3.eu-west-2.amazonaws.com/resources/mainpage/02e5dec6cb402882221e4e6ba1a6649b.png" : this.state.imageUrl}/>
                    <Menu handler={this.changeCourses} changeLoaded={this.changeLoaded}/>
                    <Loading/>
                </div>
            );
        }
    }
}

function Base(props) {
    if (props.isAuthenticated) {
        return (
            <div className={style.Label}
                 style={{
                     backgroundImage: `url(${props.imageUrl})`
                 }}>
                <div className={style.MPTitle}>
                    <p className={style.head_text}>LEARN AND CREATE</p>
                    <br/>
                </div>
            </div>
        );
    } else {
        return (
            <div className={style.Label}
                 style={{
                     backgroundImage: `url(${props.imageUrl})`
                 }}>
                <div className={style.MPTitle}>
                    <p className={style.head_text}>LEARN AND CREATE</p>
                    <NavLink className={style.TryButton} to='/registration'>Попробовать бесплатно</NavLink>
                    <br/>
                </div>
            </div>
        );
    }
}

export function CourseBlock(props) {
    let path = "";
    if (props.course.imageUrl === null) {
        path = "https://yt3.ggpht.com/a/AGF-l7_tM_jmkKQ_T1sNRNBf-s7GZuhzFWbdEkSfHA=s900-c-k-c0xffffffff-no-rj-mo";
    } else {
        path = props.course.imageUrl;
    }

    let pathtocourse = "../course/" + props.course.courseId;
    return (
        <NavLink className={style.CourseBlock} to={pathtocourse}>
            <img className={style.ImgCourse} src={path} alt=""/>
            <p className={style.CourseName}>{props.course.title}</p>
            <br/>
            <p className={style.CourseDescription}>{props.course.description}</p>
        </NavLink>
    )
}

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

export default MainPage;