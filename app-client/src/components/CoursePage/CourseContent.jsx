import style from "./CourseContent.module.css"
import React, {Component} from "react";
import {getLessons, isViewed} from "../ServerAPI/courseAPI";
import Player from "../PlayerForCourses/Player";
import {ACCESS_TOKEN} from "../ServerAPI/utils";
import {Loading} from "../common/Loading/Loading";

class CourseContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lessonsList: null,
            isLoaded: false
        };
        this.loadLessons = this.loadLessons.bind(this);
    }

    loadLessons() {
        getLessons(this.props.course.courseId).then(response => {
            this.setState({
                lessonsList: response,
                isLoaded: true
            });
        }).catch(response => {
            alert(response.message);
        })

    }

    componentDidMount() {
        this.loadLessons();
    }

    render() {
        if (this.state.isLoaded) {
            let index = 1;
            const lessons = this.state.lessonsList.map((lesson) => <LessonBlock lesson={lesson} index={index++}
                                                                                key={lesson.lessonId}/>);

            return (
                <div className={style.main_wrapper}>
                    {lessons}
                </div>
            );
        } else {

            return (
                <div className={style.main_wrapper}>
                    <Loading/>
                </div>
            );
        }
    }
}

class LessonBlock extends Component {
    constructor(props) {
        super(props);
        this.clickonVideo = this.clickonVideo.bind(this);
        this.state = {
            isViewed: this.props.lesson.viewed
        }
    }

    clickonVideo = () => {
        document.getElementById(this.props.lesson.lessonId).hidden = false;
        isViewed(this.props.lesson.lessonId).catch(error => {
            alert(error.message)
        });
        this.setState({
            isViewed: true
        })
    };

    render() {
        const id = "tab" + this.props.index;
        if (localStorage.getItem(ACCESS_TOKEN)) {
            return (
                <div className={style.lesson_wrapper}>
                    <input id={id} type="checkbox" name="tabs"/>
                    <div htmlFor={id} className={style.lesson_block} onClick={event => {
                        document.getElementById(id).click()
                    }}>
                        <label className={style.lesson_title}>
                            {this.props.index}. {this.props.lesson.title}
                        </label>
                        <img hidden={!this.props.lesson.viewed} id={this.props.lesson.lessonId}
                             className={style.is_watched}
                             src="https://webcomicms.net/sites/default/files/clipart/134707/green-tick-134707-3795401.jpg"
                             alt="is_watched"/>
                        <label className={style.lesson_info}>
                            {this.props.lesson.duration} минут
                        </label>
                    </div>
                    <div className={style.lesson_content}>
                        <p className={style.description}>
                            {this.props.lesson.description}
                        </p>
                        <div className={style.video} onClick={!this.state.isViewed ? this.clickonVideo : null}>
                            <Player video={this.props.lesson.videoUrl} id={this.props.lesson.videoId} img={null}/>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={style.lesson_wrapper}>
                    <input id={id} type="checkbox" name="tabs"/>
                    <div for={id} className={style.lesson_block} onClick={event => {
                        document.getElementById(id).click()
                    }}>
                        <label className={style.lesson_title}>
                            {this.props.index}. {this.props.lesson.title}
                        </label>
                        <img hidden={!this.props.lesson.viewed} id={this.props.lesson.lessonId}
                             className={style.is_watched}
                             src="https://webcomicms.net/sites/default/files/clipart/134707/green-tick-134707-3795401.jpg"
                             alt="is_watched"/>
                        <lable className={style.lesson_info}>
                            {this.props.lesson.duration} минут
                        </lable>
                    </div>
                    <div className={style.lesson_content}>
                        <p className={style.description}>
                            {this.props.lesson.description}
                        </p>
                    </div>
                </div>
            )
        }
    }

}

export default CourseContent;