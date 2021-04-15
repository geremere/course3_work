import React, {Component} from "react";
import style from "./Chat.module.css";


class Messaging_Block extends Component {
    constructor(props) {
        super(props);
        this.AlwaysScrollToBottom = this.AlwaysScrollToBottom.bind(this);
    }

    componentDidUpdate() {
        this.AlwaysScrollToBottom();
    }

    componentDidMount() {
        this.AlwaysScrollToBottom();
    }

    messagesEndRef = React.createRef();


    AlwaysScrollToBottom = () => {
        if (this.messagesEndRef.current !== null) {
            this.messagesEndRef.current.scrollIntoView();
        }
    };

    render() {
        if (this.props.chat === null) {
            return (
                <div className={style.messenger}>
                    {"select chat to start messaging"}
                </div>
            )
        } else {
            const messages_list = this.props.messages.map((message) => {
                if (this.props.currentUser.id === message.senderId) {
                    return (
                        <div className={style.message_div} key={message.id}>
                            <div className={style.owner_message}>
                                <label>your message</label>
                                <br/>
                                {message.content}
                            </div>
                        </div>
                    )
                } else
                    return (
                        <div className={style.message_div} key={message.id}>
                            <div className={style.recepient_message}>
                                <label>{"from "+message.senderName}</label>
                                <br/>
                                {message.content}
                            </div>
                        </div>
                    )
            });
            return (
                <div className={style.messenger}>
                    <div className={style.messanger_info}>
                        {this.props.chat.title}
                    </div>
                    <div className={style.message_wrapper}>
                        {messages_list}
                        <div ref={this.messagesEndRef}/>
                    </div>
                    <div className={style.message_content}>
                        <button className={style.sendMes} onClick={this.props.sendMessage}>
                            Отправить
                        </button>
                        <textarea name="msg" value={this.props.msg} onChange={this.props.handleInputChange} className={style.input_msg} onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                this.props.sendMessage(this.props.msg);
                            }
                        }}/>
                    </div>
                </div>
            )

        }
    }


}

export default Messaging_Block;