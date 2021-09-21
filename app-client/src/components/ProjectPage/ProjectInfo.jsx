import React, {useState, useEffect} from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import style from "./style/ProjectInfo.module.css"
import {RiskMapScatterChart} from "../util/charts/RiskMapScatterChart";
import {Chart} from "react-google-charts";

function ProjectInfo(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const dt = [['X', 'Y', {role: "tooltip", type: "string"}]]
        props.project.risks.forEach(risk => {
            const message = `${risk.is_outer ? "Outer Risk: " : "Internal Risk: "}${risk.risk.name}`
            dt.push([risk.probability, risk.cost, message])
        })
        dt.forEach(function (row, index) {
            if (index === 0) {
                // add column heading
                row.push({
                    role: 'style',
                    type: 'string'
                });
            } else {
                // add color for row
                if ((row[1] >= .1) && (row[1] <= .5)) {
                    row.push('green');
                } else if ((row[1] > .5) && (row[1] <= .6)) {
                    row.push('yellow');
                } else {
                    row.push('red');
                }
            }
        });
        setData(dt)
    }, [])


    const options = {
        title: "Risk Map",
        curveType: "function",
        hAxis: {title: 'Probability',minValue: 0.0, maxValue: 1.0},
        vAxis: {title: 'Impact', minValue: 0.0, maxValue: 1.0},
        legend: 'none',
    };

    return (
        <div className={style.Content}>
            <div className="donut">
                <Chart className={style.mapWrapper}
                       chartType="ScatterChart"
                       width="720px"
                       height="400px"
                       data={data}
                       options={options}
                       legendToggle
                />
            </div>
        </div>

    );
}

export default ProjectInfo;

