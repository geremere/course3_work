import React, {Component} from "react";
import style from "./Chat.module.css"
import {getAllUsers, getUserById, searchUser} from "../ServerAPI/userAPI";
import LoadingIndicator from "../common/LoadingIndicator";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {BASE_URL} from "../ServerAPI/utils";
import {getChats, getOrCreate} from "../ServerAPI/chatAPI";
import Messaging_Block from "./Messaging_Block";
import toast from 'react-hot-toast';
import {TextAlert} from "../ModalWindow/ModalWindow";
import {Button, FormControl, ListGroup} from "react-bootstrap";
import UserSummary from "../util/users/UserSummary";
import {ChatInfo} from "../util/chat/ChatInfo";

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
            chatUsers: [],
            alert: "",
            users: [],
            showSearch: false,
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
        this.getChat = this.getChat.bind(this);
    }

    sendMessage() {
        if (this.state.msg.trim() !== "") {
            debugger;
            const message = {
                content: this.state.msg,
                chatId: this.state.activeChat.id,
                senderId:this.state.currentUser.id
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

    changeChat(chat) {
        this.setState({
            activeChat: chat
        })
    };

    onMessageReceived = (msg) => {
        const notification = JSON.parse(msg.body);
        console.log(notification);
        // if (notification.chatId === null)
        //     findChatMessage(notification.id).then((message) => {
        //         const newMessages = [...this.state.messages];
        //         if (this.state.currentUser.id !== message.senderId) {
        //             newMessages.push(message);
        //             this.setState({messages: newMessages});
        //         }
        //     }).catch(error => console.log(error));
        // else {
        //     if (this.state.activeChat.id == null) {
        //         const chat = this.state.activeChat;
        //         chat.id = notification.chatId;
        //         this.setState({activeChat: chat})
        //     }
        // }
        if (notification.senderName !== null)
            toast("Received a new message from " + notification.senderName);
        this.getChatByUser();

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
        debugger;
        if (chat.users.length === 2) {
            const sender = chat.users.filter(user => user.id !== this.state.currentUser.id)[0];
            chat.title = sender.name
            chat.image = sender.image
        }
        console.log(chat)
        return chat;
    }

    getChatByUser() {
        getChats().then(response => {
            console.log(response)
            this.setState({
                chats: response.map(chat => this.buildChat(chat)),
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

    async newChat(event) {
        document.getElementById("chat_diver").style.display = "block"
        const user = await getUserById(event.value).then(response => response);
        const chat = {id: null, title: user.name, image: user.image, usersId: [user.id]};
        let chats = [...this.state.chats];
        let flag = true;
        chats.forEach((item, i, chats) => {
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
                                                                         changeChat={this.changeChat}/>)}
                            </ListGroup>
                        </div>
                        <Messaging_Block currentUser={this.state.currentUser}
                                         chat={this.state.activeChat}
                                         handleInputChange={this.handleInputChange}
                                         sendMessage={this.sendMessage}/>
                    </div>
                </div>
            )
        } else
            return (
                <LoadingIndicator/>
            )
    }
}

export default Chat;