import style from "./SearchPage.module.css"
import React, {Component} from "react";
import {filterCourses} from "../ServerAPI/courseAPI"
import {NavLink} from "react-router-dom";
import {Loading} from "../common/Loading/Loading";
import DDMenuCategory from "./DDMenuCategory";
import DDMenuFilter from "./DDMenuFilter";

class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            isLoaded: false,
            subString: null,
            categoryId: null
        };
        this.filterById = this.filterById.bind(this);
        this.filterByParam = this.filterByParam.bind(this);
        this.changeIsLoaded = this.changeIsLoaded.bind(this);
    }

    findCourses() {
        filterCourses(!!this.props.match.params.category ? this.props.match.params.category : "",
            this.props.match.params.subString,
            !!this.props.match.params.sort ? this.props.match.params.sort : "1").then(response => {
            this.setState({
                courses: response,
                isLoaded: true,
                subString: this.props.match.params.subString,
                categoryId: null
            });
        });
    };

    changeIsLoaded() {
        this.setState({
            isLoaded: false,
        });
    };

    filterById(courses, categoryId) {
        if (categoryId === 9)
            categoryId = "";
        this.setState({
            courses: courses,
            isLoaded: true,
            categoryId: categoryId
        });
    };

    filterByParam(courses) {
        this.setState({
            courses: courses,
            isLoaded: true,
        });
    };

    componentDidMount() {
        if (this.props.match.params.subString !== this.state.subString)
            this.findCourses();
    }

    componentDidUpdate() {
        if (this.props.match.params.subString !== this.state.subString &&
            !!this.props.match.params.subString) {
            this.findCourses();
        }
    }

    closeDDHandler = event => {
        let ddm1 = document.getElementById("DDMenuCategory");
        let ddm2 = document.getElementById("DDMenuFilter");

        if (ddm1 != null && event.target.id !== "dropbtn1" && event.target.id !== "ddtext1")
            document.getElementById("DDMenuCategory").style.display = "none";

        if (ddm2 != null && event.target.id !== "dropbtn2" && event.target.id !== "ddtext2")
            document.getElementById("DDMenuFilter").style.display = "none";
    };

    render() {
        if (this.state.isLoaded) {
            // const dict = ["музыка", "литература", "архитектура", "искусство", "дизайн", "каллиграфия", "кино", "пение", "все категории"];
            let coursesList = [];
            this.state.courses.forEach((course) => {
                coursesList.push(<CourseBlock course={course} key={course.courseId}/>);
                coursesList.push(<hr className={style.Separator} key={course.courseId + 1000}/>);
            });
            let head_text = "Вы искали \"" + this.state.subString + "\" и нашлось результатов: ";
            // head_text = "Вы искали курсы по категории \"" + dict[this.state.categoryId - 1] + "\" и нашлось результатов: ";
            return (
                <div id="search_page" className={style.SearchPage} onClick={this.closeDDHandler}>
                    <div className={style.FilterField}>
                        <div className={style.HeadText}>{head_text}{coursesList.length / 2}</div>
                        <label className={style.FilterLabel}>Фильтр</label>
                        <DDMenuCategory handler={this.filterById} changeIsLoaded={this.changeIsLoaded}
                                        substr={this.state.subString}/>
                        <DDMenuFilter handler={this.filterByParam} changeIsLoaded={this.changeIsLoaded}
                                      corseid={this.state.categoryId} substr={this.state.subString}/>
                    </div>
                    <div className={style.CoursesListWrapper}>
                        {coursesList}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className={style.FilterField}>
                        <div className={style.HeadText}>Загрузка</div>
                        <label className={style.FilterLabel}>Фильтр</label>
                        <DDMenuCategory handler={this.filterById} changeIsLoaded={this.changeIsLoaded}/>
                        <DDMenuFilter handler={this.filterByParam} changeIsLoaded={this.changeIsLoaded}
                                      corseid={this.state.categoryId} substr={this.state.subString}/>
                    </div>
                    <Loading/>
                </div>
            )
        }
    }
}

function CourseBlock(props) {
    let path = "";
    if (props.course.imageUrl === null) {
        path = "https://yt3.ggpht.com/a/AGF-l7_tM_jmkKQ_T1sNRNBf-s7GZuhzFWbdEkSfHA=s900-c-k-c0xffffffff-no-rj-mo";
    } else {
        path = props.course.imageUrl;
    }

    let pathtocourse = "../course/" + props.course.courseId;
    return (
        <NavLink className={style.CourseBlock} to={pathtocourse}>
            <img className={style.ImgCourse} src={path} alt=""/>
            <p className={style.CourseName}>{props.course.title}</p>
            <p className={style.CourseDescription}>{props.course.description}</p>
            <RatingBlock mark={props.course.mark.toPrecision(1)}/>
            <label className={style.MarkNumber}>
                {props.course.mark.toPrecision(2)} (оценили: {props.course.marksNumber})
            </label>
            <table className={style.table}/>
            <label className={style.MarkNumber}>
                Изучают {props.course.subsNumber}
            </label>
        </NavLink>
    )
}

function RatingBlock(props) {
    return (
        <div className={style.rating_block}>
            <label className={props.mark > 4 ? style.label_rating1 : style.label_rating2}/>

            <label className={props.mark > 3 ? style.label_rating1 : style.label_rating2}/>

            <label className={props.mark > 2 ? style.label_rating1 : style.label_rating2}/>

            <label className={props.mark > 1 ? style.label_rating1 : style.label_rating2}/>

            <label className={props.mark > 0 ? style.label_rating1 : style.label_rating2}/>
        </div>
    );
}

export default SearchPage;