import React, {Component} from "react";
import style from "./Chat.module.css"
import {getAllUsers, searchUser} from "../ServerAPI/userAPI";
import LoadingIndicator from "../common/LoadingIndicator";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {API_SOCKET_URL} from "../ServerAPI/utils";
import {findChatMessage, findChatMessages, getChats, test} from "../ServerAPI/chatAPI";
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
            activeChat: null,
            messages: [],
            msg: "",
            notReadMsg: null,
            chats: null,
            finded: [],
            path: ""
        };

        this.loadAllUsers = this.loadAllUsers.bind(this);
        this.connect = this.connect.bind(this);
        this.onError = this.onError.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getChatByUser = this.getChatByUser.bind(this);
        this.changeChat = this.changeChat.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.newChat = this.newChat.bind(this);
    }


    sendMessage = () => {

        if (this.state.msg.trim() !== "") {
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
            debugger

            const newMessages = [...this.state.messages];
            newMessages.push(message);
            this.setState({
                messages: newMessages,
                msg: ""
            });
        }
    };

    changeChat = (chat) => {
        findChatMessages(chat.id).then(response => {
            this.setState({
                activeChat: chat,
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
        if (this.state.activeChat.usersId===null ||this.state.activeChat !== null && this.state.activeChat.usersId.indexOf(notification.senderId) != -1) {
            findChatMessage(notification.id).then((message) => {
                const newMessages = [...this.state.messages];
                debugger;
                newMessages.push(message);
                this.setState({messages: newMessages});
            }).catch(error => console.log(error));
        } else {
            toast("Received a new message from " + notification.senderName);
        }
        this.getChatByUser();
    };

    onError = (err) => {
        console.log(err);
    };

    connect = () => {
        const socket = new SockJS(API_SOCKET_URL + "/ws");
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
        this.connect();
        // this.setState({messages: []});
        this.getChatByUser();
    }

    getChatByUser() {
        getChats().then(response => {
            console.log(response)
            this.setState({
                chats: response,
                isLoaded: true
            });
        }).catch(error => console.log(error));
    }

    handleInputChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    };

    searchUsers = (event) => {
        this.handleInputChange(event)
        if (event.target.value !== "")
            searchUser(event.target.value).then(response => {
                console.log(response)
                this.setState({
                    finded: response})
            });
    };

    newChat = (user) => {
        const chat = {id: null, title: user.name, image: user.image, usersId:[user.id]};
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


    render() {
        if (this.state.isLoaded) {
            const users = this.state.finded.map(user => <UserSummary user={user} newChat={this.newChat}/>);

            const chats = this.state.chats.map(chat => <ChatInfo finded={users}
                                                                 key={"chat_key" + chat.id}
                                                                 chat={chat}
                                                                 changeChat={this.changeChat}/>);
            return (
                <div className={style.main_wrapper}>
                    <button onClick={this.sendMessage}/>
                    <div className={style.chat_wrapper}>
                        <div className={style.chats}>
                            <div className={style.chats_search}>

                                <input name="path" id="search_input" value={this.state.path} placeholder="Поиск"
                                       type="search"
                                       onChange={this.searchUsers}
                                       autoComplete="off"
                                       onFocus={() => document.getElementById("modal_list_user").style.display = "block"}
                                       onBlur={() => {

                                           setTimeout(() => document.getElementById("modal_list_user").style.display = "none", 500)
                                       }}/>
                            </div>
                            <div className={style.modal_list_user} id="modal_list_user">
                                {users}
                            </div>
                            {chats}
                        </div>
                        <div>
                            <Messaging_Block msg={this.state.msg} messages={this.state.messages}
                                             currentUser={this.state.currentUser}
                                             chat={this.state.activeChat}
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
                <img className={style.ico} src={props.chat.image !== null ? props.chat.image.url : "https://img.favpng.com/20/21/15/computer-icons-symbol-user-png-favpng-7gAkK6jxCgYYpxfGPuC5yBaWr.jpg"}/>
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