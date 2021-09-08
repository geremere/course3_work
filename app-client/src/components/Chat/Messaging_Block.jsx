import React, {Component} from "react";
import style from "./Messaging_Block.module.css";
import {Card} from "react-bootstrap";


class Messaging_Block extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
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
            const messages_list = this.props.chat.messages.map((message) =>
                <Card style={{width: '200px'}}>
                    <Card.Body>
                        <Card.Title>{message.sender.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{message.updatedAt}</Card.Subtitle>
                        <Card.Text>
                            {message.content}
                        </Card.Text>
                    </Card.Body>
                </Card>);
            return (
                <div className={style.messenger}>
                    <div className={style.messenger_info}>
                        {this.props.chat.title}
                    </div>
                    <div className={style.message_wrapper}>
                        {messages_list}
                        <div ref={this.messagesEndRef}/>
                    </div>
                    <div className={style.message_content}>
                        <textarea name="msg" value={this.state.message}
                                  onChange={(event) => this.setState({message: event.target.value})}
                                  className={style.input_msg}
                                  onKeyPress={(event) => {
                                      if (event.key === "Enter") {
                                          this.props.sendMessage(this.state.message);
                                      }
                                  }}/>
                        <button className={style.sendMes} onClick={() => this.props.sendMessage(this.state.message)}>
                            Отправить
                        </button>
                    </div>
                </div>
            )

        }
    }


}

export default Messaging_Block;