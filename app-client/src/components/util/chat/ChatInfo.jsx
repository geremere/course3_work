import style from "../../Chat/Chat.module.css";
import React from "react";


export function ChatInfo(props) {
    console.log(props.chat.countNewMessage)
    return (
        <div className={props.chat.countNewMessage>0?style.chat_info_with_new_messages:style.chat_info}
             key={props.chat.id + "key"}
             onClick={() => props.changeChat(props.chat.id)}>
            <div className={style.chat_ico}>
                <img className={style.ico}
                     src={props.chat.image !== null ? props.chat.image.url : "https://img.favpng.com/20/21/15/computer-icons-symbol-user-png-favpng-7gAkK6jxCgYYpxfGPuC5yBaWr.jpg"}/>
            </div>
            <div className={style.chat_username}>
                {props.chat.title}
            </div>
            <div>
                {
                    props.chat.lastMessage != null ?
                        props.chat.lastMessage.sender.name + ": " + props.chat.lastMessage.content : ""
                }
            </div>
            <div>
                {
                    props.chat.countNewMessage >0 ?
                        "count new messages: " + props.chat.countNewMessage : ""
                }
            </div>
        </div>
    )
}