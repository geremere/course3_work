import React, {Component} from "react";
import style from "./Chat.module.css"
import {createChatRoom, getAllUsers, getUserById, searchUser} from "../ServerAPI/userAPI";
import LoadingIndicator from "../common/LoadingIndicator";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {BASE_URL} from "../ServerAPI/utils";
import {findChatMessage, findChatMessages, getChats, sendMessage, test} from "../ServerAPI/chatAPI";
import Messaging_Block from "./Messaging_Block";
import toast from 'react-hot-toast';
import Select from "react-select";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            allUsers: null,
            isLoaded: false,
            stompClient: null,
            activeChat: null,
            messages: [],
            msg: "",
            notReadMsg: null,
            chats: null,
            finded: [],
            path: "",
            chatName: "",
            chatUsers: []
        };

        this.connect = this.connect.bind(this);
        this.onError = this.onError.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getChatByUser = this.getChatByUser.bind(this);
        this.changeChat = this.changeChat.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.newChat = this.newChat.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.createChat = this.createChat.bind(this);
    }


    sendMessage() {
        if (this.state.msg.trim() !== "") {
            debugger;
            const message = {
                senderId: this.state.currentUser.id,
                senderName: this.state.currentUser.name,
                content: this.state.msg,
                chatId: this.state.activeChat.id,
                recipientsId: this.state.activeChat.usersId,
                // content: "sdf",
                // // chatId: null,
                // recipientsId: [4],
                type: "TEXT"
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

    changeChat = (chat) => {
        debugger;
        findChatMessages(chat.id).then(response => {
            this.setState({
                activeChat: chat,
                messages: response
            });
        }).catch(error => {
            console.log(error)
        });
    };

    onMessageReceived = (msg) => {
        const notification = JSON.parse(msg.body);
        console.log(notification);
        if (notification.chatId === null)
            findChatMessage(notification.id).then((message) => {
                const newMessages = [...this.state.messages];
                if (this.state.currentUser.id !== message.senderId) {
                    newMessages.push(message);
                    this.setState({messages: newMessages});
                }
            }).catch(error => console.log(error));
        else {
            if (this.state.activeChat.id == null) {
                const chat = this.state.activeChat;
                chat.id = notification.chatId;
                this.setState({activeChat: chat})
            }
        }
        if (notification.senderName !== null)
            toast("Received a new message from " + notification.senderName);

    };

    onError = (err) => {
        console.log(err);
    };

    connect = () => {
        const socket = new SockJS(BASE_URL + "/ws");
        this.state.stompClient = Stomp.over(socket);
        this.state.stompClient.connect({}, this.onConnected, this.onError);
    };

    onConnected = () => {
        this.state.stompClient.subscribe(
            "/user/" + this.state.currentUser.id + "/queue/messages", this.onMessageReceived
        );
    };

    getAllUsers() {
        getAllUsers().then(response =>
            this.setState({
                finded: response
            }))
    }

    componentDidMount() {
        this.connect();
        // this.setState({messages: []});
        this.getChatByUser();
        this.getAllUsers();
    }

    getChatByUser() {
        getChats().then(response => {
            this.setState({
                chats: response,
                isLoaded: true
            });
        }).catch(error => console.log(error));
    }

    handleInputChange = (event) => {
        const msg = event.target.value.length > 50 ? event.target.value + "\n" : event.target.value

        this.setState({[event.target.name]: msg.length > 150 ? this.state[event.target.name] : msg})
    };

    handleSelectChange = (event) => {
        document.getElementById("chat_diver").style.display = "block"
        this.setState({
            chatUsers: event.map(ev => parseInt(ev.value))
        })
    };

    searchUsers = (event) => {
        if (event.value !== "")
            searchUser(event.target.value).then(response => {
                console.log(response)
                this.setState({
                    finded: response
                })
            });
    };

    async newChat(event) {
        document.getElementById("chat_diver").style.display = "block"
        const user = await getUserById(event.value).then(response => response);
        console.log(user)
        const chat = {id: null, title: user.name, image: user.image, usersId: [user.id]};
        let chats = [...this.state.chats];
        let flag = true;
        chats.forEach((item, i, chats) => {
            console.log(item);
            if (item.title === user.name) {
                flag = false;
                this.changeChat(item);
            }
        });
        if (flag) {
            chats.push(chat);
            this.setState({
                activeChat: chat,
                chats: chats,
                messages: []
            });
        }
        this.setState({
            path: ""
        })
    };

    createChat() {
        if (this.state.chatUsers.length != 0 && this.state.chatName.length != 0) {
            const chatRoomRequest = {
                recipientsId: this.state.chatUsers,
                senderId: this.state.currentUser.id,
                chatName: this.state.chatName
            };
            createChatRoom(chatRoomRequest).then(response => {
                this.setState({
                    activeChat: response
                });
                this.getChatByUser();
            });
        }
        document.getElementById("simple_chat").style.display = "block";
        document.getElementById("multi_chat").style.display = "none";
        document.getElementById("chat_diver").style.display = "block"
    }

    newGoupChat() {
        document.getElementById("simple_chat").style.display = "none";
        document.getElementById("multi_chat").style.display = "block";
        document.getElementById("chat_diver").style.display = "none"
    }


    render() {
        if (this.state.isLoaded) {
            const users = this.state.finded.map(user => new Option(user.name, user.id));

            const chats = this.state.chats.map(chat => <ChatInfo finded={users}
                                                                 key={"chat_key" + chat.id}
                                                                 chat={chat}
                                                                 changeChat={this.changeChat}/>);
            return (
                <div className={style.main_wrapper}>
                    <div className={style.chat_wrapper}>
                        <div className={style.chats}>
                            <div id="simple_chat" className={style.chats_search}>
                                <div className={style.selector}>
                                    <Select onFocus={() => document.getElementById("chat_diver").style.display = "none"}
                                            onBlur={() => document.getElementById("chat_diver").style.display = "block"}
                                            options={users}
                                            onInputChange
                                            onChange={(event) => this.newChat(event)}/>
                                </div>
                                <button  className={style.btn} onClick={this.newGoupChat}>{"Новый груповой чат"}</button>
                            </div>
                            <div id="multi_chat" className={style.chat_create}>

                                <div className={style.selector}>
                                    <Select
                                            onFocus={() => document.getElementById("chat_diver").style.display = "none"}
                                            onBlur={() => document.getElementById("chat_diver").style.display = "block"}
                                            isMulti
                                            options={users}
                                            onInputChange
                                            onChange={(event) => this.handleSelectChange(event)}/>
                                </div>
                                <button className={style.btn}
                                        onClick={this.createChat}>{"Создать  чат"}</button>

                                <div className={style.input_wrap}>
                                    <input type="text" className={style.chatName} placeholder="Название чата"
                                           name="chatName"
                                           onChange={(event) => this.handleInputChange(event)}/>
                                </div>
                            </div>
                            <div id="chat_diver">
                                {chats}
                            </div>
                        </div>
                        <Messaging_Block msg={this.state.msg} messages={this.state.messages}
                                         currentUser={this.state.currentUser}
                                         chat={this.state.activeChat}
                                         handleInputChange={this.handleInputChange} sendMessage={this.sendMessage}/>

                    </div>
                </div>
            )
        } else
            return (
                <LoadingIndicator/>
            )
    }
}

function UserSummary(props) {
    return (
        <div className={style.user_info} onClick={() => props.newChat(props.user)}>
            <div className={style.chat_ico}>
                <img className={style.ico} src={props.user.image !== null ? props.user.image.url : ""}/>
            </div>
            <div className={style.chat_username}>
                {props.user.name}
            </div>
        </div>
    )

}

function ChatInfo(props) {
    return (
        <div className={style.chat_info} key={props.chat.id + "key"} onClick={() => props.changeChat(props.chat)}>
            <div className={style.chat_ico}>
                <img className={style.ico}
                     src={props.chat.image !== null ? props.chat.image.url : "https://img.favpng.com/20/21/15/computer-icons-symbol-user-png-favpng-7gAkK6jxCgYYpxfGPuC5yBaWr.jpg"}/>
            </div>
            <div className={style.chat_username}>
                {props.chat.title}
            </div>
            <div>
                last message
            </div>
        </div>
    )
}


export default Chat;