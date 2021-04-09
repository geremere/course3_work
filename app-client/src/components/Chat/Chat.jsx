import React, {Component} from "react";
import style from "./Chat.module.css"
import {getAllUsers} from "../ServerAPI/userAPI";
import LoadingIndicator from "../common/LoadingIndicator";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {ACCESS_TOKEN, API_BASE_URL, API_SOCKET_URL} from "../ServerAPI/utils";
import {findChatMessage, findChatMessages, test} from "../ServerAPI/chatAPI";
import Messaging_Block from "./Messaging_Block";
import toast, {Toaster} from 'react-hot-toast';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            allUsers: null,
            isLoaded: false,
            stompClient: null,
            activeContact: null,
            messages: null,
            msg: "",
            notReadMsg: null
        };

        this.loadAllUsers = this.loadAllUsers.bind(this);
        this.connect = this.connect.bind(this);
        this.onError = this.onError.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        // this.changeMessageEnd = this.changeMessageEnd.bind(this);
        // this.scrollToBottom = this.scrollToBottom.bind(this);
    }


    sendMessage = () => {
        if (this.state.msg.trim() !== "") {
            const message = {
                senderId: this.state.currentUser.id,
                recipientId: this.state.activeContact.id,
                senderName: this.state.currentUser.name,
                recipientName: this.state.activeContact.name,
                content: this.state.msg,
                // timestamp: new Date(),
            };
            this.state.stompClient.send("/app/chat", {}, JSON.stringify(message));

            const newMessages = [...this.state.messages];
            newMessages.push(message);
            this.setState({
                messages: newMessages,
                msg: ""
            });
        }
    };

    changeChat = (user) => {
        findChatMessages(this.state.currentUser.id, user.id).then(response => {
            this.setState({
                activeContact: user,
                messages: response
            })
        }).catch(error => {
            console.log(error)
        });
    };

    loadAllUsers = () => {
        getAllUsers().then(response => {
            this.setState({
                allUsers: response,
                isLoaded: true
            });
        }).catch(error => window.alert(error));
    };


    onMessageReceived = (msg) => {
        const notification = JSON.parse(msg.body);
        if (this.state.activeContact !== null && this.state.activeContact.id === notification.senderId) {
            findChatMessage(notification.id).then((message) => {
                const newMessages = [...this.state.messages];
                newMessages.push(message);
                this.setState({messages: newMessages});
                this.setState({message: newMessages})
            });
        } else {
            toast("Received a new message from " + notification.senderName);
        }
        // this.loadAllUsers();
    };

    onError = (err) => {
        console.log(err);
    };

    connect = () => {
        const socket = new SockJS(API_SOCKET_URL + "/ws");
        // console.log(socket);
        // console.log(Stomp.over(socket));
        this.state.stompClient = Stomp.over(socket);
        this.state.stompClient.connect({}, this.onConnected, this.onError);
    };

    onConnected = () => {
        // console.log("connected");
        // console.log(this.state.currentUser);
        this.state.stompClient.subscribe(
            "/user/" + this.state.currentUser.id + "/queue/messages", this.onMessageReceived
        );
    };

    componentDidMount() {
        console.log(this.state.activeContact);
        this.connect();
        this.loadAllUsers();
        this.setState({messages: []});
        // this.scrollToBottom();
    }


    handleInputChange = (event) => {
        this.setState({msg: event.target.value})
    };


    render() {
        if (this.state.isLoaded) {
            let i = 0;
            const chats = this.state.allUsers.map(user => <Chat_info user={user} changeChat={this.changeChat}
                                                                     k={i++}/>);
            return (
                <div className={style.main_wrapper}>
                    <div className={style.chat_wrapper}>
                        <div className={style.chats}>
                            <div className={style.chats_search}>
                                {"тут типо поиск по чатам"}
                            </div>
                            {chats}
                        </div>
                        <div>
                            <Messaging_Block msg={this.state.msg} messages={this.state.messages}
                                             currentUser={this.state.currentUser}
                                             activeContact={this.state.activeContact}
                                             handleInputChange={this.handleInputChange} sendMessage={this.sendMessage}/>
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
        <div className={style.chat_info} key={props.k} onClick={() => props.changeChat(props.user)}>
            <div className={style.chat_ico}>
                ico
            </div>
            <div className={style.chat_username}>
                {props.user.name}
            </div>
            <div>
                last message
            </div>
        </div>
    )
}


export default Chat;