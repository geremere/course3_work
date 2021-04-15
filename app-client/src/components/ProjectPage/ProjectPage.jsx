import React, {Component} from 'react';
import {Switch, Route, NavLink} from "react-router-dom";
import {TextAlert} from "../ModalWindow/ModalWindow";
import {Loading} from "../common/Loading/Loading";
import {getProjectById} from "../ServerAPI/ProjectAPI";
import ProjectInfo from "./ProjectInfo";
import RisksPage from "./RisksPage";
import style from "./ProjectPage.module.css";

class ProjectPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: null,
            isLoaded: false,
            message: ""
        };
        this.loadProject = this.loadProject.bind(this);
    }

    loadProject() {
        getProjectById(this.props.match.params.prId).then(response => {
            this.setState({
                project: response,
                isLoaded: true,
            });
        }).catch(response => {
            this.setState({
                message: response.message
            });
            // document.getElementById('alert').style.display = 'block';
        });
    }

    componentDidMount() {
        this.loadProject();
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <div className={style.CoursePage}>
                    <TextAlert text={this.state.message}/>
                    <div className={style.secondHead}>
                        <ul className={style.NavBar}>
                            <li className={style.SettingsItem}>
                                <NavLink to={"/project/" + this.state.project.id} className={style.SettingsLink}
                                         exact activeClassName={style.selected_link}>О проекте</NavLink>
                            </li>
                            <li className={style.SettingsItem}>
                                <NavLink to={"/project/" + this.state.project.id + "/risks"}
                                         className={style.SettingsLink}
                                         activeClassName={style.selected_link}>Риски</NavLink>
                            </li>
                            {/*<li className={style.SettingsItem}>*/}
                            {/*    <NavLink to={"/project/" + this.state.project.id + "/feed"}*/}
                            {/*             className={style.SettingsLink}*/}
                            {/*             activeClassName={style.selected_link}>Обсуждения</NavLink>*/}
                            {/*</li>*/}
                        </ul>
                    </div>
                    <br/>
                    <br/>
                    <Switch>
                        <Route exact path={"/project/" + this.state.project.id}
                               render={(props) => <ProjectInfo project={this.state.project}/>}/>
                        <Route exact path={"/project/" + this.state.project.id + "/risks"}
                               render={(props) => <RisksPage project={this.state.project}/>}/>
                        {/*<Route exact path={"/project/" + this.state.project.id + "/risks"}*/}
                        {/*       render={(props) => <CourseReport project={this.state.project}/>}/>*/}
                    </Switch>
                    <br/>
                </div>
            );
        } else {
            return (
                <div>
                    <TextAlert text={this.state.message}/>
                    <div className={style.loading_wrapper}>
                        <Loading/>
                    </div>
                </div>
            );
        }
    }
}


export default ProjectPage;