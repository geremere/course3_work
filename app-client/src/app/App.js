import React, {Component} from 'react';
import './App.css';
import AbstractHeader from "../components/Header/AbstractHeader";
import Login from "../components/Authorization/login/Authorization";
import {Switch, Route, withRouter} from "react-router-dom";
import Registration from "../components/Authorization/Registration/Registration";
import RefactorAccount from "../components/user/Refactor/RefactorAccount";
import MainPage from "../components/MainPage/MainPage";
import {getCurrentUser} from "../components/ServerAPI/userAPI.js";
import UserAccount from "../components/user/UserAccount/UserAccount";
import {ACCESS_TOKEN} from "../components/ServerAPI/utils.js";
import Settings from "../components/user/Settings/Settings";
import CoursePage from "../components/CoursePage/CoursePage";
import SearchPage from "../components/SearchPage/SearchPage";
import VKAuth from "../components/Authorization/login/VKAuth.jsx";
import {Loading} from "../components/common/Loading/Loading";
import Chat from "../components/Chat/Chat";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: {
                name: null,
                username: null,
                email: null,
                password: null
            },
            isAuthenticated: false,
            isLoaded: false
        };
        this.loadUser = this.loadUser.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    loadUser() {
        getCurrentUser().then(response => {
            debugger;
            this.setState({
                currentUser: response,
                isAuthenticated: true,
                isLoaded: true
            });
        }).catch(response => {
            this.setState({
                isLoaded: true
            });
        });
        const z =this.state;
        debugger;
    }

    logOut(redirectTo="/") {
        localStorage.removeItem(ACCESS_TOKEN);
        this.props.history.push(redirectTo);
        this.setState({
            currentUser: null,
            isAuthenticated: false
        });
    }

    componentDidMount() {
        this.loadUser();
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <div className="AbstractWrapper">
                    <AbstractHeader LogOut={this.logOut} user={this.state.currentUser}
                                    isAuthenticated={this.state.isAuthenticated}/>
                    <Switch>
                        <Route path="/forgotpassword" component={RefactorAccount}/>
                        <Route path="/login"
                               render={(props) => <Login onLogin={this.loadUser}/>}/>
                        <Route path='/registration'
                               render={(props) => <Registration/>}/>
                        <Route path='/mainpage'
                               render={(props) => <MainPage isAuthenticated={this.state.isAuthenticated}/>}/>
                        <Route exact path='/'
                               render={(props) => <MainPage isAuthenticated={this.state.isAuthenticated}/>}/>
                        <Route path='/settings'
                               render={(props) => <Settings user={this.state.currentUser}/>}/>
                        <Route path='/user/:username'
                               render={(props) => <UserAccount user={this.state.currentUser} loadUser={this.loadUser}/>}/>
                        <Route path='/course/:courseId' component={CoursePage}/>
                        <Route path='/vkauth' render={(props) => <VKAuth/>}/>
                        <Route path='/searchresults/:subString?/:category?/:sort?' component={SearchPage}/>
                        <Route path='/chat' render={() => <Chat currentUser={this.state.currentUser}/>}/>
                    </Switch>
                </div>
            );
        } else {
            return (
                <Loading/>
            )
        }
    }
}

export default withRouter(App);
