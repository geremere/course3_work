import style from "./UserSummary.module.css"
import {USER_ICO} from "../ServerAPI/utils";
import React from "react";
import {ToggleButton} from "react-bootstrap";

function UserSummary(props) {
    debugger;
    console.log(props.user.isSelected)
    return (
        <div className={style.user_info} onClick={()=>props.selectUser(props.user.id)}>
            <img className={style.user_ico} src={props.user.image !== null ? props.user.image.url : USER_ICO}/>
            <div className={style.username}>
                {props.user.name}
            </div>
            <ToggleButton type="checkbox"
                          checked={props.user.isSelected}
                          className={style.is_selected}/>
        </div>
    )

}

export default UserSummary