import React, {Component} from 'react';
import {Loading} from "../common/Loading/Loading";
import {getProjectById} from "../ServerAPI/ProjectAPI";
import ProjectInfo from "./ProjectInfo";
import style from "./ProjectPage.module.css";
import {Nav} from "react-bootstrap";
import {RiskTable} from "./RisksPage";

class ProjectPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: null,
            isLoaded: false,
            message: "",
            eventKey: "/map"
        };
        this.loadProject = this.loadProject.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.updateProject =  this.updateProject.bind(this);
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
        });
    }
    updateProject(project){
        this.setState({
            project:project
        })
    }

    componentDidMount() {
        this.loadProject();
    }

    handleSelected = () => {
        switch (this.state.eventKey) {
            case "/statistics":
                return (
                    <RiskTable project={this.state.project}
                               />
                )
            case "/risks":
                return (
                    <RiskTable project={this.state.project}
                               updateProject ={this.updateProject}/>
                )
            case "/map":
                return (
                    <ProjectInfo project={this.state.project}/>
                )

        }

    }

    render() {
        if (this.state.isLoaded) {
            return (
                <div className={style.CoursePage}>
                    <p className={style.title}>{this.state.project.title}</p>
                    <Nav variant="tabs" defaultActiveKey={"/map"}
                         onSelect={(eventKey => {
                             this.setState({
                                 eventKey: eventKey
                             })
                         })}>
                        <Nav.Item>
                            <Nav.Link eventKey="/map">Analytics</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={"/statistics"}>Statistic</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={"/risks"}>Risks</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <br/>
                    <br/>
                    {this.handleSelected()}
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