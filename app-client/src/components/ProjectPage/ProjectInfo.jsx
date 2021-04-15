import React from "react";
import style from "./ProjectInfo.module.css";
import {NavLink} from "react-router-dom";

function ProjectInfo(props) {
    console.log("PROJECTINFO")
    return (
        <div className={style.Content}>
            <div className={style.InformationAboutCourse}>
                <header className={style.CourseName}>{props.project.title}</header>
                <p align="justify" className={style.TextMainBody}>{props.project.description}</p>

            </div>
            <DescriptionBlock project={props.project}/>
        </div>
    );
}

function DescriptionBlock(props) {
    return (
        <div className={style.Description}>
            <div className={style.DescriptionHeader}>
                <label className={style.DescriptionHeaderText}>
                    Описание Проекта:
                </label>
            </div>
            <hr className={style.Separator}/>
            <DescriptionItem head={"Количесиво участников"} text={props.project.users.length}/>
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

export default ProjectInfo;

