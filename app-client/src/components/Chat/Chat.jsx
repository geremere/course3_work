import React, {Component} from "react";
import style from "./Chat.module.css"
import {getAllUsers} from "../ServerAPI/userAPI";
import LoadingIndicator from "../common/LoadingIndicator";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {ACCESS_TOKEN, API_BASE_URL, API_SOCKET_URL} from "../ServerAPI/utils";
import {findChatMessage} from "../ServerAPI/chatAPI";

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
        this.onMessageReceived = this.onMessageReceived.bind(this);
    }

    loadAllUsers = () => {
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

    onMessageReceived = (msg) => {
        const notification = JSON.parse(msg.body);
        const active = JSON.parse(sessionStorage.getItem("recoil-persist"))
            .chatActiveContact;

        if (active.id === notification.senderId) {
            findChatMessage(notification.id).then((message) => {
                const newMessages = JSON.parse(sessionStorage.getItem("recoil-persist"))
                    .chatMessages;
                newMessages.push(message);
                this.setState({
                    message: newMessages
                })
            });
        } else {
            this.state.message.info("Received a new message from " + notification.senderName);
        }
        this.loadAllUsers();
    };

    onError = (err) => {
        window.alert(err);
    };

    connect = () => {
        const socket = new SockJS(API_SOCKET_URL + "/ws",
            null,
            {
                transports: ['xhr-streaming'],
                headers: {'Authorization': 'Bearer '+ localStorage.getItem(ACCESS_TOKEN)}
            });
        console.log(socket);
        console.log(Stomp.over(socket));
        this.state.stompClient = Stomp.over(socket);
        this.state.stompClient.connect({'Authorization': 'Bearer '+ localStorage.getItem(ACCESS_TOKEN)}, this.onConnected, this.onError);
    };

    onConnected = () => {
        console.log("connected");
        console.log(this.state.currentUser);
        this.state.stompClient.subscribe(
            "/user/" + this.state.currentUser.id + "/queue/messages", this.onMessageReceived
        );
        debugger;
    };

    componentDidMount() {
        this.connect();
        this.loadAllUsers();
    }


    render() {
        // console.log(this.state);
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
        const ownerId = "0";
        var i = 0;
        const messanges_list = messages.map((message) => {
            if (ownerId === message.id) {
                return (
                    <div className={style.message_div} key={i++}>
                        <div className={style.owner_message}>
                            {message.message}
                        </div>
                    </div>
                )
            } else
                return (
                    <div className={style.message_div} key={i++}>
                        <div className={style.recepient_message}>
                            {message.message}
                        </div>
                    </div>
                )
        });
        var i = 0;
        if (this.state.isLoaded) {
            const chats = this.state.allUsers.map(user => <Chat_info name={user.name} key={i++}/>)
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
    var i = 0;
    return (
        <div className={style.chat_info} key={i++}>
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