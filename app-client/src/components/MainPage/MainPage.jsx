import React, {Component} from "react";
import style from "./MainPage.module.css"
import {NavLink} from "react-router-dom";
import {Loading} from "../common/Loading/Loading";
import NewProject from "./NewProject";
import {getAllProjects} from "../ServerAPI/ProjectAPI";
import {PROJECT_ICO} from "../ServerAPI/utils";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            isLoaded: false,
        };
        this.loadProjects = this.loadProjects.bind(this);
        this.addProject = this.addProject.bind(this);
    }

    loadProjects = () => {
        getAllProjects().then(response => {
            debugger;
            this.setState({
                projects: response,
                isLoaded: true
            })
        })

    };

    addProject = () => {

    };

    componentDidMount() {
        this.loadProjects();
    }

    render() {
        const projects = this.state.projects.map((project) => <ProjectSummary project={project} key={project.id}/>);
        if (projects.length === 0) {
            projects.push(<div>Пока таких курсов нет</div>);
        }
        if (this.state.isLoaded) {
            return (
                <div className={style.Main}>
                    {/*<Menu handler={this.changeCourses} changeLoaded={this.changeLoaded}/>*/}
                    <button className={style.btn} onClick={() => document.getElementById("new_project").style.display = "block"}>
                        {"Add new project"}
                    </button>
                    <NewProject/>
                <br/>
                <br/>

                    {projects}
                </div>);
        } else {
            return (
                <div className={style.Main}>
                    <Loading/>
                </div>
            );
        }
    }
}

export function ProjectSummary(props) {
    debugger;
    let path = props.project.image_url === null ? PROJECT_ICO
        : props.project.image_url;
    let pathtocourse = "../project/" + props.project.id;
    return (
        <NavLink className={style.CourseBlock} to={pathtocourse}>
            <img className={style.ImgCourse} src={path} alt=""/>
            <p className={style.CourseName}>{props.project.title}</p>
            <br/>
            <p className={style.CourseDescription}>{props.project.description}</p>
        </NavLink>
    )
}


export default MainPage;