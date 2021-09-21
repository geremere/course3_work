import {Chart} from "react-google-charts";
import React from "react";
import style from "../../ProjectPage/style/ProjectInfo.module.css"

export function RiskMapScatterChart(props) {

    const options = {
        title: "Company Performance",
        curveType: "function",
        colors: ['#f44253'],
        hAxis: {title: 'Age'},
        vAxis: {title: 'Weight'},
        legend: 'none',
    };

    return (
        <div className="donut">
            <Chart
                className={style.mapWrapper}
                chartType="ScatterChart"
                width="720px"
                height="400px"
                data={props.data}
                options={options}
                legendToggle
            />
        </div>
    )
}