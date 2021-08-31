import style from "./UserSummary.module.css"
import {USER_ICO} from "../../ServerAPI/utils";
import React from "react";

function UserSummary(props) {
    return (
        <div className={style.user_info} onClick={() => props.getChat(props.user.id)}>
            <img className={style.user_ico} src={props.user.image !== null ? props.user.image.url : USER_ICO}/>
            <div>
                {props.user.name}
            </div>
        </div>
    )
}

export default UserSummary