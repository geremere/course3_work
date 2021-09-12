import React, {Component} from "react";
import style from "./Chat.module.css"
import {getAllUsers, getUserById, searchUser} from "../ServerAPI/userAPI";
import LoadingIndicator from "../common/LoadingIndicator";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {BASE_URL} from "../ServerAPI/utils";
import {getChatById, getChats, getOrCreate} from "../ServerAPI/chatAPI";
import Messaging_Block from "./Messaging_Block";
import toast from 'react-hot-toast';
import {TextAlert} from "../ModalWindow/ModalWindow";
import {Button, FormControl, ListGroup} from "react-bootstrap";
import UserSummary from "../util/users/UserSummary";
import {ChatInfo} from "../util/chat/ChatInfo";
import {MyToast} from "../util/Toast";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUsers: null,
            isLoaded: false,
            stompClient: null,
            activeChat: null,
            chats: null,
            path: "",
            chatName: "",
            chatUsers: [],
            alert: "",
            users: [],
            showSearch: false,
            showToast: false,
            toast: {
                img: null,
                title: "",
                content: "",
                chatId: -1
            }
        };

        this.connect = this.connect.bind(this);
        this.onError = this.onError.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getChatByUser = this.getChatByUser.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.getChat = this.getChat.bind(this);
        this.getChatById = this.getChatById.bind(this);
    }

    sendMessage(message) {
        if (message.trim() !== "") {
            const msg = {
                content: message,
                chatId: this.state.activeChat.id,
                senderId: this.props.currentUser.id
            };

            this.state.stompClient.send("/app/chat", {}, JSON.stringify(msg));

            msg.sender = this.props.currentUser
            var options = {hour: 'numeric', minute: 'numeric', second: 'numeric'};
            msg.updatedAt = new Date().toLocaleString("ru-RU", options)
            const activeChat = this.state.activeChat;
            activeChat.messages.push(msg)
            this.setState({
                activeChat: activeChat
            });
            this.getChatByUser();


        }
    };

    onMessageReceived = (msg) => {
        const toast = JSON.parse(msg.body);
        this.setState({
            toast: {
                img: toast.sender.image,
                title: toast.title != null ? toast.title : toast.sender.name,
                content: `${toast.title != null ? toast.sender.name + ":" : ""} ${toast.content}`,
                chatId: toast.chatId
            },
            showToast: true
        })
        if (this.state.activeChat != null && this.state.activeChat.id === toast.chatId) {
            this.getChatById(toast.chatId)
        }
        this.getChatByUser();
    };

    onError = (err) => {
        this.setState({
            toast: {
                title: "Error",
                content: err,
            },
            showToast: true
        })
    };

    connect = () => {
        const socket = new SockJS(BASE_URL + "/ws");
        this.state.stompClient = Stomp.over(socket);
        this.state.stompClient.connect({}, this.onConnected, this.onError);
    };

    onConnected = () => {
        this.state.stompClient.subscribe(
            "/user/" + this.props.currentUser.id + "/queue/messages", this.onMessageReceived
        );
    };

    getAllUsers() {
        getAllUsers().then(response =>
            this.setState({
                users: response
            }))
    }

    componentDidMount() {
        this.connect();
        // this.setState({messages: []});
        this.getChatByUser();
        this.getAllUsers();
    }

    buildChat(chat) {
        if (chat.users.length === 2) {
            const sender = chat.users.filter(user => user.id !== this.props.currentUser.id)[0];
            chat.title = sender.name
            chat.image = sender.image
        }
        return chat;
    }

    getChatByUser() {
        getChats().then(response => {
            this.setState({
                chats: response.map(chat => this.buildChat(chat)),
                isLoaded: true
            });
        }).catch(error => console.log(error));
    }

    getChatById(chatId) {
        getChatById(chatId).then(response => this.setState({activeChat: this.buildChat(response)}))
    }

    handleInputChange = (event) => {
        const msg = event.target.value.length > 50 ? event.target.value + "\n" : event.target.value

        this.setState({[event.target.name]: msg.length > 150 ? this.state[event.target.name] : msg})
    };

    newGroupChat() {
        document.getElementById("simple_chat").style.display = "none";
        document.getElementById("multi_chat").style.display = "block";
        document.getElementById("chat_diver").style.display = "none"
    }

    searchUsers = (event) => {
        searchUser(event.target.value).then(response => {
            this.setState({
                users: response.sort()
            })
        });
    }

    getChat(userId) {
        getOrCreate(userId).then(response => {
            this.setState({
                activeChat: this.buildChat(response),
                showSearch: false
            })
            this.getChatByUser();
        })
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <>
                    <div className={style.main_wrapper}>
                        <TextAlert text={this.state.alert}/>
                        <div className={style.chat_wrapper}>
                            <div className={style.chats}>
                                <div>
                                    <FormControl name="search"
                                                 onChange={this.searchUsers}
                                                 className={style.search}
                                                 placeholder="Введите имя или фамилию"
                                                 onFocus={() => this.setState({showSearch: true})}
                                                 autocomplete="off">
                                    </FormControl>
                                    <Button className={style.new_group}
                                            onClick={() => this.setState({showSearch: true})}
                                            hidden={this.state.showSearch}>
                                        new
                                    </Button>
                                    <Button className={style.new_group}
                                            hidden={!this.state.showSearch}
                                            onClick={() => this.setState({showSearch: false})}>
                                        close
                                    </Button>
                                </div>
                                <ListGroup hidden={!this.state.showSearch}>
                                    {this.state.users.map(user => <UserSummary user={user}
                                                                               getChat={this.getChat}/>)}
                                </ListGroup>
                                <ListGroup hidden={this.state.showSearch}>
                                    {this.state.chats?.map(chat => <ChatInfo chat={chat}
                                                                             changeChat={this.getChatById}/>)}
                                </ListGroup>
                            </div>
                            <Messaging_Block currentUser={this.props.currentUser}
                                             chat={this.state.activeChat}
                                             handleInputChange={this.handleInputChange}
                                             sendMessage={this.sendMessage}/>
                        </div>
                        <MyToast show={this.state.showToast}
                                 select={this.getChatById}
                                 chatId={this.state.toast.chatId}
                                 close={() => this.setState({showToast: false})}
                                 img={this.state.toast.img}
                                 title={this.state.toast.title}
                                 content={this.state.toast.content}/>

                    </div>
                </>
            )
        } else
            return (
                <LoadingIndicator/>
            )
    }
}

export default Chat;