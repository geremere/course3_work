import React, {Component} from "react";
import style from "./MainPage.module.css"
import {NavLink} from "react-router-dom";
import {Loading} from "../common/Loading/Loading";
import NewProject from "./NewProject";
import {getAllProjects} from "../ServerAPI/ProjectAPI";
import {PROJECT_ICO} from "../ServerAPI/utils";
import {Card, Image, Spinner} from "react-bootstrap";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            isLoaded: false,
        };
        this.loadProjects = this.loadProjects.bind(this);
    }

    loadProjects = () => {
        getAllProjects().then(response => {
            this.setState({
                projects: response,
                isLoaded: true
            })
        })

    };

    componentDidMount() {
        this.loadProjects();
    }

    render() {
        const projects = this.state.projects.map((project) => <ProjectSummary currentUser={this.props.currentUser}
                                                                              project={project}
                                                                              key={project.id}/>);
        if (projects.length === 0) {
            projects.push(<div>Пока таких курсов нет</div>);
        }
        if (this.state.isLoaded && this.props.isAuthenticated) {
            return (
                <div className={style.Main}>
                    {/*<Menu handler={this.changeCourses} changeLoaded={this.changeLoaded}/>*/}
                    <button className={style.btn}
                            onClick={() => document.getElementById("new_project").style.display = "block"}>
                        {"Add new project"}
                    </button>
                    <NewProject currentUser={this.props.currentUser}/>
                    <br/>
                    <br/>
                    {projects}
                </div>);
        } else {
            return (
                <div className={style.Main}>
                    <Image
                        fluid
                        src={"https://2.downloader.disk.yandex.ru/preview/02f7c7af27bff3c1eef4f3f1c5892e94606794e0494745ca9eafdbf14618c207/inf/ZJd-Qct48t03mhRtw1ueRl0SLgrf6RY8hDFYCiKoONeqoYHZOwq3aa_XOJXr6IgJDaEWx_zQY6he-sQbd8BArg%3D%3D?uid=166319997&filename=image%20%281%29.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=166319997&tknv=v2&size=1898x937"}/>

                </div>
            )
        }
    }
}

export function ProjectSummary(props) {
    let path = props.project.image_url === null ? PROJECT_ICO
        : props.project.image_url;
    let pathtocourse = "../project/" + props.project.id;
    return (
        <NavLink to={pathtocourse} className={style.CourseBlock} >
            <Card >
                <Card.Img variant="top" src={path}/>
                <Card.Body>
                    <Card.Title>{props.project.title}</Card.Title>
                    <Card.Text>
                        {props.project.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </NavLink>
    )
}


export default MainPage;