import React, {Component} from "react";
import {Dropdown, DropdownButton, FormControl, InputGroup, ListGroup, ListGroupItem, Spinner} from "react-bootstrap";
import UserSummary from "../util/UserSummary";
import {getAllUsers} from "../ServerAPI/userAPI";
import style from "./Test.module.css";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isLoaded: false,
            selected: []
        }
        this.selectUser = this.selectUser.bind(this)
    }

    selectUser = (userId) => {
        let users = this.state.users.map(user=>{
            if (user.id === userId)
                user.isSelected = !user.isSelected
            return user
        })
        this.setState({
            users:users
        })
    };

    componentDidMount() {
        getAllUsers().then(response => {
                this.setState({
                    users: response.map(user => ({...user, isSelected: false})),
                    isLoaded: true
                });
            })
    }

    render() {
        debugger;
        if (this.props.isAuthenticated && this.state.users !== null) {
            const usersSum = this.state.users.map(user =>
                <UserSummary user={user} selectUser={this.selectUser}/>
            )
            return (
                <div className={style.wrapper}>
                    <div className={style.search_wrapper}>
                        <InputGroup className={style.search}>
                            <FormControl name="search"
                                         onChange={this.props.searchUsers}
                                         className={style.search}
                                         placeholder="Введите имя или фамилию"
                            />
                        </InputGroup>
                    </div>
                    {usersSum}
                </div>
            )

        } else
            return (
                <div>
                    <Spinner animation="border" variant="success" />
                </div>
            )

    }
}

export default Test;