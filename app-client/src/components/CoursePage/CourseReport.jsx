import React, {Component} from 'react';
import style from "./CourseReport.module.css"
import {getReportList, postReport} from "../ServerAPI/courseAPI";
import {Loading} from "../common/Loading/Loading";

class CourseReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportlst: null,
            isLoaded: false,
            ableToSend: false
        };
        this.loadReportList = this.loadReportList.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleSendFeedback = this.handleSendFeedback.bind(this);
    }

    loadReportList = () => {
        getReportList(this.props.course.courseId).then(response => {
            this.setState({
                reportlst: response,
                isLoaded: true
            })
        }).catch(err => {
            alert(err.message)
        }).catch(response => {
            this.setState({
                message: response.message
            });
            document.getElementById('alert').style.display = 'block'
        });
    };

    componentDidMount() {
        this.loadReportList()
    }

    changeHandler = event => {
        const rate = document.getElementsByName("rating");
        const mes = document.getElementById("input_field");
        if (mes.value.trim() !== "") {
            for (let i = rate.length - 1; i > -1; i--) {
                if (rate[i].checked) {
                    this.setState({
                        ableToSend: true
                    });
                    break;
                }
            }
        } else {
            this.setState({
                ableToSend: false
            });
        }
    };

    handleSendFeedback = event => {
        event.preventDefault();
        const rate = document.getElementsByName("rating");
        const mes = document.getElementById("input_field");
        let mark = "";
        for (let i = rate.length - 1; i > -1; i--) {
            if (rate[i].checked) {
                mark = rate[i].value;
            }
        }

        postReport(this.props.course.courseId, {
            text: mes.value,
            mark: mark
        }).then(response => {
            this.setState({
                isLoaded: false,
                ableToSend: false
            });
            this.loadReportList();
            this.props.course.marksNumber += 1
        }).catch(response => {
            this.setState({
                message: response.message
            });
            document.getElementById('alert').style.display = 'block'
        });

    };

    render() {
        if (this.state.isLoaded) {
            const reports = this.state.reportlst.map((report) => <ReportBlock report={report} key="1"/>).reverse();
            return (
                <div className={style.Content}>
                    <div className={style.ReportWrapper}>
                        <button disabled={!this.state.ableToSend} onClick={this.handleSendFeedback}
                                className={style.SendFeedback}>Оставить отзыв
                        </button>
                        <textarea onChange={this.changeHandler} id="input_field" className={style.inputField}/>
                        <RatingBlockReal handler={this.changeHandler}/>
                    </div>
                    <DescriptionBlock course={this.props.course}/>
                    <br/>
                    <div className={style.reports_wrapper}>
                        {reports}
                    </div>
                </div>
            );
        } else {
            return (
                <div className={style.Content}>
                    <DescriptionBlock course={this.props.course}/>
                    <Loading/>
                </div>
            );
        }
    }
}

function ReportBlock(props) {
    return (
        <div className={style.report_block}>
            <img className={style.img_user} src={props.report.userImageUrl === "url" ?
                "https://www.stickpng.com/assets/images/585e4bcdcb11b227491c3396.png" : props.report.userImageUrl}
                 alt=""/>
            <p className={style.user_name}>{props.report.userName}</p>
            <br/>
            <div className={style.report_date_wrapper}>
                <label className={style.report_date}>{props.report.date}</label>
            </div>
            <br/>
            <div className={style.report_text_wrapper}>
                <label className={style.report_text}>{props.report.text}</label>
            </div>
            <RatingBlockMini mark={props.report.mark}/>
        </div>
    )
}

function RatingBlockReal(props) {
    return (
        <div className={style.rating_block_1}>
            <input onChange={props.handler} name="rating" value="5" id="rating_5" type="radio"/>
            <label htmlFor="rating_5" className={style.label_rating_1}/>

            <input onChange={props.handler} name="rating" value="4" id="rating_4" type="radio"/>
            <label htmlFor="rating_4" className={style.label_rating_1}/>

            <input onChange={props.handler} name="rating" value="3" id="rating_3" type="radio"/>
            <label htmlFor="rating_3" className={style.label_rating_1}/>

            <input onChange={props.handler} name="rating" value="2" id="rating_2" type="radio"/>
            <label htmlFor="rating_2" className={style.label_rating_1}/>

            <input onChange={props.handler} name="rating" value="1" id="rating_1" type="radio"/>
            <label htmlFor="rating_1" className={style.label_rating_1}/>
        </div>
    );
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

function RatingBlockMini(props) {
    return (
        <div className={style.rating_block_mini}>
            <label className={props.mark > 4 ? style.label_rating1_mini : style.label_rating2_mini}/>

            <label className={props.mark > 3 ? style.label_rating1_mini : style.label_rating2_mini}/>

            <label className={props.mark > 2 ? style.label_rating1_mini : style.label_rating2_mini}/>

            <label className={props.mark > 1 ? style.label_rating1_mini : style.label_rating2_mini}/>

            <label className={props.mark > 0 ? style.label_rating1_mini : style.label_rating2_mini}/>
        </div>
    );
}

function DescriptionBlock(props) {
    return (
        <div className={style.Description}>
            <div className={style.DescriptionItemHeaderText}>
                Средняя оценка:
            </div>
            <div className={style.MarkWrapper}>
                <label className={style.MarkOfTheCourse}>
                    {props.course.mark.toPrecision(2)}
                </label>
                <RatingBlock mark={props.course.mark.toPrecision(1)}/>
            </div>
            <hr className={style.Separator}/>
            <DescriptionItem head={"Всего отзывов"} text={props.course.marksNumber}/>
            <DescriptionItem head={"Записалось на курс"} text={props.course.subsNumber}/>
        </div>
    );
}

function DescriptionItem(props) {
    return (
        <div className={style.DescriptionItem}>
            <label className={style.DescriptionItemHeaderText}>
                {props.head + ":   "}
            </label>
            <label className={style.TextWrapper}>
                {props.text}
            </label>
        </div>
    );
}

export default CourseReport;