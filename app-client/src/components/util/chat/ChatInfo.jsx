import style from "../../Chat/Chat.module.css";
import React from "react";


export function ChatInfo(props) {
    return (
        <div className={style.chat_info}
             key={props.chat.id + "key"}
             onClick={() => props.changeChat(props.chat)}>
            <div className={style.chat_ico}>
                <img className={style.ico}
                     src={props.chat.image !== null ? props.chat.image.url : "https://img.favpng.com/20/21/15/computer-icons-symbol-user-png-favpng-7gAkK6jxCgYYpxfGPuC5yBaWr.jpg"}/>
            </div>
            <div className={style.chat_username}>
                {props.chat.title}
            </div>
            <div>
                {props.chat.lastMessage}
            </div>
        </div>
    )
}