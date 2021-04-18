import React, {useState, useEffect} from "react";
import style from "./ProjectInfo.module.css";
import {NavLink} from "react-router-dom";
import Select from "react-select";
import {getAllUsers} from "../ServerAPI/userAPI";

function ProjectInfo(props) {
    return (
        <div className={style.Content}>
            <div className={style.InformationAboutCourse}>
                <header className={style.CourseName}>{props.project.title}</header>
                <p align="justify" className={style.TextMainBody}>{props.project.description}</p>

            </div>
            <DescriptionBlock project={props.project} sel={props.project.users.map(user => new Option(user.name))}/>
        </div>
    );
}

function DescriptionBlock(props) {
    const [users, setUsers] = useState([]);

    useEffect(() => { // Component Did Mount
        getAllUsers().then(response => setUsers(response)).catch(error => console.log(error))
    }, []);
    return (
        <div className={style.Description}>
            <div className={style.DescriptionHeader}>
                <label className={style.DescriptionHeaderText}>
                    Описание Проекта:
                </label>
            </div>
            <hr className={style.Separator}/>
            <DescriptionItem head={"Количесиво участников"} text={props.project.users.length}/>
            <Select isMulti options={users.map(user=> new Option(user.id,user.name))} defaultValue={props.sel}/>
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

