import React, {Component} from "react";
import style from "./Chat.module.css";


class Messaging_Block extends Component {
    constructor(props) {
        super(props)
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
        if (this.props.activeContact === null) {
            return (
                <div className={style.messenger}>
                    {"select chat to start messaging"}
                </div>
            )
        } else {
            let i = 0;
            const messages_list = this.props.messages.map((message) => {
                if (this.props.activeContact.id === message.senderId) {
                    return (
                        <div className={style.message_div} key={i++}>
                            <div className={style.owner_message}>
                                {message.content}
                            </div>
                        </div>
                    )
                } else
                    return (
                        <div className={style.message_div} key={i++}>
                            <div className={style.recepient_message}>
                                {message.content}
                            </div>
                        </div>
                    )
            });
            return (
                <div className={style.messenger}>
                    <div className={style.messanger_info}>
                        {this.props.activeContact.name}
                    </div>
                    <div className={style.message_wrapper}>
                        {messages_list}
                        <div ref={this.messagesEndRef}/>
                    </div>
                    <div className={style.message_content}>
                        <button onClick={this.props.sendMessage} >
                            Send
                        </button>
                        <input value = {this.props.msg} onChange={this.props.handleInputChange} onKeyPress={(event)=>{
                            debugger;
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