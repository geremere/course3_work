import React, {Component} from 'react';
import './CoursePage.module.css';
import {Switch, Route, NavLink} from "react-router-dom";
import {getCourseById} from "../ServerAPI/courseAPI";
import {subscribe} from "../ServerAPI/userAPI";
import style from "./CoursePage.module.css";
import CourseReport from "./CourseReport";
import CourseContent from "./CourseContent"
import AboutCourse from "./AboutCourse";
import {TextAlert} from "../ModalWindow/ModalWindow";
import {Loading} from "../common/Loading/Loading";

class CoursePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: null,
            isLoaded: false,
            isSubscribed: false,
            message: ""
        };
        this.loadCourseInformation = this.loadCourseInformation.bind(this);
        this.updateCourseInformation = this.updateCourseInformation.bind(this);
        this.popUpText = this.popUpText.bind(this);
    }

    loadCourseInformation() {
        getCourseById(this.props.match.params.courseId).then(response => {
            this.setState({
                course: response,
                isLoaded: true,
            });
        }).catch(response => {
            this.setState({
                message: response.message
            });
            document.getElementById('alert').style.display = 'block';
        });
    }

    popUpText(message) {
        this.setState({
            message: message
        });
        document.getElementById('alert').style.display = 'block';
    }

    componentDidMount() {
        this.loadCourseInformation();
    }

    updateCourseInformation() {
        this.loadCourseInformation();
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <div className={style.CoursePage}>
                    <TextAlert text={this.state.message}/>
                    <NavBar course={this.state.course} updateCourseInformation={this.updateCourseInformation}
                            popUpText={this.popUpText}/>
                    <br/>
                    <br/>
                    <Switch>
                        <Route exact path={"/course/" + this.state.course.courseId}
                               render={(props) => <AboutCourse course={this.state.course}/>}/>
                        <Route exact path={"/course/" + this.state.course.courseId + "/feedback"}
                               render={(props) => <CourseReport course={this.state.course}/>}/>
                        <Route exact path={"/course/" + this.state.course.courseId + "/content"}
                               render={(props) => <CourseContent course={this.state.course}/>}/>
                    </Switch>
                    <br/>
                </div>
            );
        } else {
            return (
                <div>
                    <TextAlert text={this.state.message}/>
                    <div className={style.loading_wrapper}>
                        <Loading/>
                    </div>
                </div>
            );
        }
    }
}

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: this.props.course,
            eventBtn: null
        };
        this.handleOnClickSubscribe = this.handleOnClickSubscribe.bind(this);
        this.handleOnClickUnsubscribe = this.handleOnClickUnsubscribe.bind(this);
    }

    handleOnClickSubscribe(event) {
        const target = event.target;
        subscribe(this.props.course.courseId).then(response => {
            target.innerHTML = "Отписаться";
            this.props.updateCourseInformation();
            this.props.popUpText(response.message);
            this.setState({
                eventBtn: this.handleOnClickUnsubscribe,
                course: {
                    subscribed: true
                }
            });

        }).catch(response => {
            this.props.popUpText(response.message);
        });
    };

    handleOnClickUnsubscribe(event) {
        const target = event.target;
        // unsubscribe(this.props.course.courseId).then(response => {
        //     target.innerHTML = "Подписаться";
        //     this.props.updateCourseInformation();
        //     this.props.popUpText(response.message);
        //     this.setState({
        //         eventBtn: this.handleOnClickSubscribe,
        //         course: {
        //             subscribed: false
        //         }
        //     });
        // }).catch(response => {
        //     this.props.popUpText(response.message);
        // });
    };

    componentDidMount() {
        if (this.state.course.subscribed) {
            this.setState({
                eventBtn: this.handleOnClickUnsubscribe
            });
        } else {
            this.setState({
                eventBtn: this.handleOnClickSubscribe
            });
        }
    }


    render() {
        let text = "";
        if (this.state.course.subscribed)
            text = "Отписаться";
        else
            text = "Подписаться";

        return (
            <div className={style.secondHead}>
                <ul className={style.NavBar}>
                    <li className={style.SettingsItem}>
                        <NavLink to={"/course/" + this.props.course.courseId} className={style.SettingsLink}
                                 exact activeClassName={style.selected_link}>О курсе</NavLink>
                    </li>
                    <li className={style.SettingsItem}>
                        <NavLink to={"/course/" + this.props.course.courseId + "/feedback"}
                                 className={style.SettingsLink}
                                 activeClassName={style.selected_link}>Отзывы</NavLink>
                    </li>
                    <li className={style.SettingsItem}>
                        <NavLink to={"/course/" + this.props.course.courseId + "/content"}
                                 className={style.SettingsLink}
                                 activeClassName={style.selected_link}>Содержание</NavLink>
                    </li>
                </ul>
                <button className={style.Subscribe} onClick={this.state.eventBtn}>{text}</button>
            </div>
        )
    };
}


export default CoursePage;