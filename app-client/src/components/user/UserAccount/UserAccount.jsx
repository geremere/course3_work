import React, {Component} from "react";
import style from "./UserAccount.module.css";
import {getCoursesOfUser} from "../../ServerAPI/courseAPI";
// import {uploadAvatar} from "../../ServerAPI/userAPI";
import {Loading} from "../../common/Loading/Loading";
import {Switch, NavLink, Route} from "react-router-dom";
import Settings from "../Settings/Settings";
import {TextAlert} from "../../ModalWindow/ModalWindow";
import {uploadAvatar} from "../../ServerAPI/userAPI";

class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            message:""
        };
        this.UploadAvatar = this.UploadAvatar.bind(this);
        // this.getCourses = this.getCourses.bind(this);
    }


    UploadAvatar = (event) => {
        let formData = new FormData();
        formData.append('file', event.target.files[0]);
        uploadAvatar(formData).then(response => {
            document.getElementById("avatar").src = response.fileName;
            this.setState({
                message:response.message
            });
        }).catch(response => {
            this.setState({
                message:response.message
            });
        });
        // document.getElementById('alert').style.display = 'block';
    };

    UploadClick = () => {
        debugger;
        const file = document.getElementById('file');
        file.click();
    };

    componentDidMount() {
        this.props.loadUser();
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <div className={style.Wrapper}>
                    <TextAlert text={this.state.message}/>
                    <UserInformation user={this.props.user} UploadAvatar={this.UploadAvatar}
                                     UploadClick={this.UploadClick}/>
                    <UserNavBar username={this.props.user.username}/>
                    <hr className={style.separator}/>
                    <Switch>
                        <Route path={"/user/" + this.props.user.username}
                               render={(props) => <UserCourses courses={this.state.coursesInProcess}/>}/>
                        {/*<Route exact path={"/user/completed"}*/}
                        {/*       render={(props) => <UserCourses courses={this.state.coursesCompleted}/>}/>*/}
                        <Route path={"/user/settings/"}
                               render={(props) => <Settings user={this.props.user}/>}/>
                    </Switch>
                </div>
            );
        } else {
            return (
                <div className={style.Wrapper}>
                    <UserInformation user={this.props.user} UploadAvatar={this.UploadAvatar}
                                     UploadClick={this.UploadClick}/>
                    <UserNavBar/>
                    <hr className={style.separator}/>
                    <div className={style.courses}>
                        <Loading/>
                    </div>
                </div>
            )
        }
    }
}

function UserInformation(props) {
    return (
        <div className={style.user_info}>
            <input id="file" type="file" className={style.upload} onChange={props.UploadAvatar}/>
            <div className={style.avatar_wrapper} onClick={props.UploadClick}>
                <img id='avatar' className={style.avatar}
                     src={props.user.image === null ? "https://www.stickpng.com/assets/images/585e4bcdcb11b227491c3396.png" : props.user.image.url}
                     alt=''/>
                <div className={style.hover_wrapper}>
                    <img className={style.avatar_hover}
                         src="https://cdn.pixabay.com/photo/2016/12/18/13/44/download-1915749_1280.png" alt=""/>
                </div>
            </div>
            <div className={style.user_personal}>
                <label className={style.user_name}>{props.user.surname} {props.user.name}</label>
                {/*<label className={style.user_description}>Количество просмотенных*/}
                {/*    курсов: {props.user.completedCourses}</label>*/}
                {/*<label className={style.user_description}>Количество курсов в*/}
                {/*    процессе: {props.user.coursesInProgress}</label>*/}
                {/*<label className={style.user_description}>Количество просмотренных минут: {props.user.minutes}</label>*/}
            </div>
        </div>
    )

}

function UserNavBar(props) {
    return (
        <div className={style.secondHead}>
            <ul className={style.NavBar}>
                <li className={style.SettingsItem}>
                    <NavLink to={"/user/" + props.username} className={style.SettingsLink}
                             exact activeClassName={style.selected_link}>Активные проекты</NavLink>
                </li>
                <li className={style.SettingsItem}>
                    <NavLink to={"/user/completed"}
                             className={style.SettingsLink}
                             activeClassName={style.selected_link}>Завершенные проекты</NavLink>
                </li>
                <li className={style.SettingsItem}>
                    <NavLink to={"/user/settings/editname"}
                             className={style.SettingsLink}
                             activeClassName={style.selected_link}>Настройки</NavLink>
                </li>
            </ul>
        </div>
    )
}

function UserCourses(props) {
    const coursesList = props.courses.map((course) => <CourseBlock course={course} key={course.courseId}/>);
    if (coursesList.length !== 0) {
        return (
            <div className={style.courses}>
                {coursesList}
            </div>
        );
    } else {
        return (
            <div className={style.courses}>
                Здесь пока нет курсов
            </div>
        );
    }
}

function CourseBlock(props) {
    let path = "";
    if (props.course.imageUrl === null) {
        path = "https://yt3.ggpht.com/a/AGF-l7_tM_jmkKQ_T1sNRNBf-s7GZuhzFWbdEkSfHA=s900-c-k-c0xffffffff-no-rj-mo";
    } else {
        path = props.course.imageUrl;
    }

    let pathtocourse = "../course/" + props.course.courseId;

    if (!props.course.completed) {
        return (
            <div className={style.CourseBlockWrapper}>
                <NavLink className={style.CourseBlock} to={pathtocourse}>
                    <img className={style.ImgCourse} src={path} alt=""/>
                    <p className={style.CourseName}>{props.course.title}</p>
                    <p className={style.CourseDescription}>{props.course.description}</p>
                    <label className={style.progress}>
                        пройдено: {props.course.lessonsViewed / props.course.lessonsNumber * 100}%
                    </label>
                    <table className={style.table}/>
                    <label className={style.progress}>
                        уроков осталось: {props.course.lessonsNumber - props.course.lessonsViewed}
                    </label>
                </NavLink>
                <NavLink className={style.to_lessons} to={"/course/" + props.course.courseId + "/content"}>
                    Продолжить
                </NavLink>
            </div>
        )
    } else {
        return (
            <div className={style.CourseBlockWrapper}>
                <NavLink className={style.CourseBlock} to={pathtocourse}>
                    <img className={style.ImgCourse} src={path} alt=""/>
                    <p className={style.CourseName}>{props.course.title}</p>
                    <p className={style.CourseDescription}>{props.course.description}</p>
                    <label className={style.progress}>
                        пройдено: {props.course.lessonsViewed}
                    </label>
                </NavLink>
            </div>
        )
    }
}

export default UserAccount;