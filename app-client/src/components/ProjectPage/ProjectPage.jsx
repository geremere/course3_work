import React, {Component} from 'react';
import {Loading} from "../common/Loading/Loading";
import {getProjectById} from "../ServerAPI/ProjectAPI";
import ProjectInfo from "./ProjectInfo";
import style from "./style/ProjectPage.module.css";
import {Nav, Overlay, OverlayTrigger, Spinner, Tooltip} from "react-bootstrap";
import {RiskTable} from "./RiskPage/RisksPage";
import {getCurrentUser} from "../ServerAPI/userAPI";
import ProjectSettings from "./ProjectSettings";
import {SensitivityAnalysis} from "./SensitivityAnalysis";
import ReportPage from "./ReportPage";

class ProjectPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            project: null,
            isLoaded: false,
            message: "",
            eventKey: "/map",
            teammate: true
        };
        this.loadProject = this.loadProject.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
        this.updateProject = this.updateProject.bind(this);
        this.setIsTeammate = this.setIsTeammate.bind(this);
    }

    loadProject() {
        getProjectById(this.props.match.params.prId).then(response => {
            this.setState({
                project: response
            });

            this.setIsTeammate();
        }).catch(response => {
            this.setState({
                message: response.message
            });
        });
    }

    updateProject(project) {
        this.setState({
            project: project
        })
    }

    setIsTeammate() {
        getCurrentUser().then(response => {
            let isTeammate = this.state.project.users.map(user => user.id).indexOf(response.id) !== -1
            this.setState({
                isTeammate: isTeammate || response.id === this.state.project.owner_id,
                currentUser: response,
                isLoaded: true
            })
        })
    }

    componentDidMount() {
        this.loadProject();
    }

    handleSelected = () => {
        switch (this.state.eventKey) {
            case "/statistics":
                return (
                    <div>
                        Здесь будет много графиков
                    </div>
                )
            case "/risks":
                return (
                    <RiskTable project={this.state.project}
                               updateProject={this.updateProject}/>
                )
            case "/map":
                return (
                    <ProjectInfo project={this.state.project}/>
                )
            case "/settings":
                return (
                    <ProjectSettings project={this.state.project}/>
                )
            case "/report":
                return (
                    <ReportPage project={this.state.project}/>
                )
            case "/sensitivity":
                return (
                    <SensitivityAnalysis project={this.state.project}/>
                )

        }
    }

    renderTooltipSettings = (props) => (
        <Tooltip hidden={this.state.currentUser.id === this.state.project.owner_id} id="button-tooltip" {...props}>
            You must be owner of project
        </Tooltip>
    );

    renderTooltipRisks = (props) => (
        <Tooltip hidden={this.state.isTeammate} id="button-tooltip" {...props}>
            You must be in the project
        </Tooltip>
    );

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
                            <Nav.Link eventKey="/map">Risk Map</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={"/sensitivity"}>Sensitivity Analysis</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={"/report"}>Report</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <OverlayTrigger placement="top"
                                            overlay={this.renderTooltipRisks}>
                                <Nav.Link eventKey={"/risks"}
                                          disabled={!this.state.isTeammate}>Risks</Nav.Link>
                            </OverlayTrigger>
                        </Nav.Item>
                        <Nav.Item>
                            <OverlayTrigger placement="top"
                                            overlay={this.renderTooltipSettings}>
                                <Nav.Link eventKey={"/settings"}
                                          disabled={this.state.currentUser.id !== this.state.project.owner_id}>
                                    Settings
                                </Nav.Link>
                            </OverlayTrigger>
                        </Nav.Item>
                    </Nav>
                    <br/>
                    <br/>
                    {this.handleSelected()}
                    <br/>
                </div>
            );
        } else {
            return <Spinner animation="border" variant="success"/>
        }
    }
}


export default ProjectPage;