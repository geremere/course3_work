import React from "react";
import style from "./AboutCourse.module.css";
import {NavLink} from "react-router-dom";
import Player from "../PlayerForCourses/Player";

function AboutCourse(props) {
    return (
        <div className={style.Content}>
            <div className={style.InformationAboutCourse}>
                <header className={style.CourseName}>{props.course.title}</header>
                <header className={style.head_of_course}>О курсе</header>
                <div className={style.InformationMainBody}>
                    <div className={style.PlayerWrapper}>
                        <Player video={props.course.introVideoUrl} img={props.course.imageUrl}
                                id={props.course.courseId}
                                className={style.intro_video}/>
                    </div>
                    <br/>
                    <div className={style.TextMainBodyWrapper}>
                        <p align="justify" className={style.TextMainBody}>{props.course.descriptionLong}</p>
                    </div>
                </div>
            </div>
            <div className={style.MarkOfTheCourse}>
                <label className={style.MarkNumber}>
                    {props.course.mark.toPrecision(2)}
                </label>
                <RatingBlock mark={props.course.mark.toPrecision(1)}/>
                <NavLink to={"/course/" + props.course.courseId + "/feedback"}
                         className={style.FeedbackSend}>Оставить отзыв</NavLink>
            </div>
            <br/>
            <br/>
            <br/>
            <DescriptionBlock course={props.course}/>
        </div>
    );
}

function RatingBlock(props) {
    return (
        <div className={style.rating_block}>
            <label className={props.mark > 4 ? style.label_rating1 : style.label_rating2}/>

            <label className={props.mark > 3 ? style.label_rating1 : style.label_rating2}/>

            <label className={props.mark > 2 ? style.label_rating1 : style.label_rating2}/>

            <label className={props.mark > 1 ? style.label_rating1 : style.label_rating2}/>

            <label className={props.mark > 0 ? style.label_rating1 : style.label_rating2}/>
        </div>
    );
}

function DescriptionBlock(props) {
    return (
        <div className={style.Description}>
            <div className={style.DescriptionHeader}>
                <label className={style.DescriptionHeaderText}>
                    Описание курса:
                </label>
            </div>
            <hr className={style.Separator}/>
            <DescriptionItem head={"Категория"} text={props.course.category}/>
            <DescriptionItem head={"Язык"} text={props.course.language}/>
            <DescriptionItem head={"Продолжительнось"} text={props.course.load}/>
            <DescriptionItem head={"Количество подписчиков"} text={props.course.subsNumber}/>
            <DescriptionItem head={"Количество уроков"} text={props.course.lessonsNumber}/>
            <DescriptionItem head={"Оценили"} text={props.course.marksNumber}/>
        </div>
    );
}

function DescriptionItem(props) {
    return (
        <div className={style.DescriptionItem}>
            <label className={style.DescriptionItemHeaderText}>
                {props.head + ":   "}
            </label>
            <label className={style.DescriptionItemText}>
                {props.text}
            </label>
        </div>
    );
}

export default AboutCourse;
