import React, {Component} from 'react'
import {FormControl, InputGroup} from "react-bootstrap";
import UserSummaryWithSelected from "./UserSummaryWithSelected";
import style from "./SelectListUsers.module.css";

class SelectListUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        }
    }


    componentDidMount() {

    }

    render() {
        const usersSum = this.props.users.map(user =>
            <UserSummaryWithSelected user={user} selectUser={this.props.selectUser}/>
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
    }
}

export default SelectListUsers;