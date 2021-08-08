import React, {Component} from 'react';
import {Switch, Route, NavLink} from "react-router-dom";
import {TextAlert} from "../ModalWindow/ModalWindow";
import {Loading} from "../common/Loading/Loading";
import {getProjectById} from "../ServerAPI/ProjectAPI";
import ProjectInfo from "./ProjectInfo";
import RisksPage from "./RisksPage";
import style from "./ProjectPage.module.css";
import {Nav} from "react-bootstrap";

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
                    <p className={style.title}>{this.state.project.title}</p>
                    <Nav variant="tabs" defaultActiveKey={"/project/" + this.state.project.id}>
                        <Nav.Item>
                            <Nav.Link href={"/project/" + this.state.project.id}>Analytics</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href={"/project/" + this.state.project.id + "/statistics"}>Statistic</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href={"/project/" + this.state.project.id + "/risks"}>Risks</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <br/>
                    <br/>
                    <Switch>
                        <Route exact path={"/project/" + this.state.project.id}
                               render={(props) => <ProjectInfo project={this.state.project}/>}/>
                        {/*<Route exact path={"/project/" + this.state.project.id + "/statistics"}*/}
                        {/*       render={(props) => <RisksPage project={this.state.project}/>}/>*/}
                        {/*<Route exact path={"/project/" + this.state.project.id + "/risks"}*/}
                        {/*       render={(props) => <CourseReport project={this.state.project}/>}/>*/}
                    </Switch>
                    <br/>
                </div>
            );
        } else {
            return (
                <Loading/>
            );
        }
    }
}


export default ProjectPage;