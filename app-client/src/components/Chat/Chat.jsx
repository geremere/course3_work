import React, {Component} from "react";
import style from "./Chat.module.css"
import {getAllUsers} from "../ServerAPI/userAPI";
import LoadingIndicator from "../common/LoadingIndicator";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            allUsers: null,
            isLoaded: false,
            stompClient: null,
            activeContact: null,
            messages: null
        };
        this.loadAllUsers = this.loadAllUsers.bind(this);
        this.connect = this.connect.bind(this);
        this.onError = this.onError.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    loadAllUsers = () => {
        debugger;
        getAllUsers().then(response => {
            this.setState({
                allUsers: response,
                isLoaded: true
            });
            window.alert(response)
        }).catch(error => window.alert(error));
    };

    sendMessage = (msg) => {
        if (msg.trim() !== "") {
            const message = {
                senderId: this.state.currentUser.id,
                recipientId: this.state.activeContact.id,
                senderName: this.state.currentUser.name,
                recipientName: this.state.activeContact.name,
                content: msg,
                timestamp: new Date(),
            };
            this.state.stompClient.send("/app/chat", {}, JSON.stringify(message));

            const newMessages = [...this.state.messages];
            newMessages.push(message);
            this.setState({messages: newMessages});
        }
    };

    onError = (err) => {
        console.log(err);
    };

    connect = () => {
        const Stomp = require("stompjs");
        var SockJS = require("sockjs-client");
        SockJS = new SockJS("http://localhost:8080/ws");
        this.state.stompClient = Stomp.over(SockJS);
        this.state.stompClient.connect({}, this.onConnected, this.onError);
    };

    onConnected = () => {
        console.log("connected");
        console.log(this.state.currentUser);
        this.state.stompClient.subscribe(
            "/user/" + this.state.currentUser.id + "/queue/messages"
        );
    };

    componentDidMount() {
        this.loadAllUsers();
        this.connect();
    }


    render() {
        console.log(this.state);
        const messages = [{"id": "0", "message": "i v rot tebya ebal"}, {
            "id": "1",
            "message": "i v rot tebya ebal"
        }, {"id": "0", "message": "i v rot tebya ebal"}, {"id": "1", "message": "i v rot tebya ebal"}, {
            "id": "0",
            "message": "i v rot tebya ebal"
        }, {"id": "0", "message": "i v rot tebya ebal"}, {"id": "1", "message": "i v rot tebya ebal"}, {
            "id": "1",
            "message": "i v rot tebya ebal"
        }, {"id": "0", "message": "i v rot tebya ebal"}, {"id": "0", "message": "i v rot tebya ebal"}, {
            "id": "0",
            "message": "i v rot tebya ebal"
        }, {"id": "0", "message": "i v rot tebya ebal"}, {"id": "0", "message": "i v rot tebya ebal"}, {
            "id": "0",
            "message": "i v rot tebya ebal"
        }, {"id": "0", "message": "i v rot tebya ebal"}, {"id": "0", "message": "i v rot tebya ebal"}, {
            "id": "0",
            "message": "i v rot tebya ebal"
        },];
        const ownerId = "0"
        const messanges_list = messages.map((message) => {
            if (ownerId == message.id) {
                return (
                    <div className={style.message_div}>
                        <div className={style.owner_message} key={'1'}>
                            {message.message}
                        </div>
                    </div>
                )
            } else
                return (
                    <div className={style.message_div}>
                        <div className={style.recepient_message} key='1'>
                            {message.message}
                        </div>
                    </div>
                )
        });
        if (this.state.isLoaded) {
            const chats = this.state.allUsers.map(user => <Chat_info name={user.name}/>)
            return (
                <div className={style.main_wrapper}>
                    <div className={style.chat_wrapper}>
                        <div className={style.chats}>
                            <div className={style.chats_search}>
                                {"тут типо поиск по чатам"}
                            </div>
                            {chats}
                        </div>
                        <div className={style.messenger}>
                            <div className={style.messanger_info}>
                                {"тут типо хедер мессенджера"}
                            </div>
                            <div className={style.message_wrapper}>
                                    {messanges_list}
                            </div>
                            <div className={style.message_content}>
                                тут будем писать текст
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else
            return (
                <LoadingIndicator/>
            )
    }
}

function Chat_info(props) {
    return (
        <div className={style.chat_info}>
            <div className={style.chat_ico}>
                ico
            </div>
            <div className={style.chat_username}>
                {props.name}
            </div>
            <div>
                last message
            </div>
        </div>
    )
}


export default Chat;