import React, {Component} from "react";
import style from "./UserAccount.module.css";
// import {uploadAvatar} from "../../ServerAPI/userAPI";
import {Loading} from "../../common/Loading/Loading";
import {Switch, NavLink, Route} from "react-router-dom";
import Settings from "../Settings/Settings";
import {TextAlert} from "../../ModalWindow/ModalWindow";
import {getUserTypes, setRiskTypes, uploadAvatar} from "../../ServerAPI/userAPI";
import Select from "react-select";
import {getAllTypes} from "../../ServerAPI/riskAPI";

class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            message:"",
            user_types:[],
            allTypes:[]
        };
        this.UploadAvatar = this.UploadAvatar.bind(this);
        this.loadTypes = this.loadTypes.bind(this);
        // this.getCourses = this.getCourses.bind(this);
    }

     loadTypes(){
        getAllTypes().then(response=>{
            this.setState({
                allTypes:response,
                isLoaded:this.state.user_types.length!==0
            })
            console.log(response)
        });
         getUserTypes().then(response=>{
             this.setState({
                 user_types:response,
                 isLoaded:this.state.allTypes.length!==0
             })
             console.log(response)

         })

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
        const file = document.getElementById('file');
        file.click();
    };

    setTypes(event){
        console.log(event)
        const req = event.map(ev => parseInt(ev.value));
        setRiskTypes(req).then(res=>console.log(res));
    }

    componentDidMount() {
        this.props.loadUser();
        this.loadTypes();
    }

    render() {
        if (this.state.isLoaded) {
            const options = this.state.allTypes.map(type=>new Option(type.type,type.id));
            const deft = this.state.user_types.map(type=>new Option(type.type,type.id));
            return (
                <div className={style.Wrapper}>
                    <TextAlert text={this.state.message}/>
                    <UserInformation user={this.props.user}
                                     options = {options}
                                     deft = {deft}
                                     UploadAvatar={this.UploadAvatar}
                                     setTypes = {this.setTypes}
                                     UploadClick={this.UploadClick}/>
                    <UserNavBar username={this.props.user.username}/>
                    <hr className={style.separator}/>
                    {/*<Switch>*/}
                    {/*    /!*<Route path={"/user/" + this.props.user.username}*!/*/}
                    {/*    /!*       render={(props) => <UserCourses courses={this.state.coursesInProcess}/>}/>*!/*/}
                    {/*    /!*<Route exact path={"/user/completed"}*!/*/}
                    {/*    /!*       render={(props) => <UserCourses courses={this.state.coursesCompleted}/>}/>*!/*/}
                    {/*    <Route path={"/user/settings/"}*/}
                    {/*           render={(props) => <Settings user={this.props.user}/>}/>*/}
                    {/*</Switch>*/}
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
    console.log(props.deft)
    console.log(props.options)

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
                <label className={style.user_name}> {props.user.name}</label>
                {"Выберете типы рисков с которыми вы сможете работать"}
                <Select
                    isMulti
                    onChange={(event)=>props.setTypes(event)}
                    options={props.options}
                    defaultValue={props.deft}/>
                {/*<label className={style.user_name}> {props.user.username}</label>*/}

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