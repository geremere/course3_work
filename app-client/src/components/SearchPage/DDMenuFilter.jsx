import React, {Component} from "react";
import style from "./DDMenuFilter.module.css";
import {filterCourses} from "../ServerAPI/courseAPI"
import {NavLink} from "react-router-dom";

class DDMenuFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "По популярности"
        };
        this.showDDMenu = this.showDDMenu.bind(this);
        this.filterByParam = this.filterByParam.bind(this);
    }

    showDDMenu = event => {
        const dd = document.getElementById("DDMenuFilter");
        dd.style.display = "block";
    };


    filterByParam(param, text) {
        this.props.changeIsLoaded();
        this.setState({
            text: text
        });
        let cid = !!this.props.corseid ? this.props.corseid : "";
        let str = !!this.props.substr ? this.props.substr : "";
        filterCourses(cid, str, param).then(response => {
            this.props.handler(response);
        });
    };

    render() {
        let cid = !!this.props.corseid ? this.props.corseid : "";
        let str = !!this.props.substr ? this.props.substr : "";
        return (
            <div className={style.dropdown}>
                <button onClick={this.showDDMenu} className={style.dropbtn} id="dropbtn2">
                    <div className={style.u_name} id="ddtext2">
                        {this.state.text}
                    </div>
                </button>
                <div id="DDMenuFilter" className={style.dropdownContent}>
                    <NavLink className={style.item} onClick={() => this.filterByParam("3", "По количеству подписок")}
                             to={"/searchresults/" + cid + "/" + str + "/3"} style={{borderRadius: `7px 7px 0 0`}}>
                    По количеству подписок
                </NavLink>
                <NavLink className={style.item} onClick={() => this.filterByParam("2", "По рейтингу")}
                         to={"/searchresults/" + cid + "/" + str + "/2"} style={{borderRadius: `0 0 7px 7px`}}>
                    По рейтингу
                </NavLink>
            </div>
    </div>
    )
    }
}

export default DDMenuFilter;