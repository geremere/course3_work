import React, {useState, useEffect} from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import style from "./ProjectInfo.module.css"
import {RiskMapScatterChart} from "../util/charts/RiskMapScatterChart";
import {Chart} from "react-google-charts";

function ProjectInfo() {
    const [isOuter, setIsOuter] = useState(false);
    const [data, setData] = useState(null);
    const [title, setTitle] = useState("Internal Risks");

    const handleSelect = (e) => {
        setIsOuter(e)
        console.log(isOuter)
        if (isOuter)
            setTitle("Outer Risks")
        else
            setTitle("Internal Risks")
    };

    useEffect(() => {
        console.log(isOuter)
        const dt = [
            ['X', 'Y', {role: "tooltip", type: "string"}],
            [0.785882, 0.355928, !isOuter ? "outer" : "internal"],
            [0.785882, 0.346507, !isOuter ? "outer" : "internal"],
            [0.785882, 0.355928, !isOuter ? "outer" : "internal"],
            [0.785882, 0.703251, !isOuter ? "outer" : "internal"],
            [0.785028, 0.599739, !isOuter ? "outer" : "internal"],
            [0.785028, 0.512527, !isOuter ? "outer" : "internal"],
            [0.785882, 0.346507, !isOuter ? "outer" : "internal"],
            [0.785882, 0.346507, !isOuter ? "outer" : "internal"],
            [0.785882, 0.355928, !isOuter ? "outer" : "internal"],
            [0.785882, 0.355928, !isOuter ? "outer" : "internal"],
            [0.785882, 0.355928, !isOuter ? "outer" : "internal"],
            [0.785882, 0.355928, !isOuter ? "outer" : "internal"],
            [0.890500, 0.556761, !isOuter ? "outer" : "internal"],
            [0.785882, 0.613288, !isOuter ? "outer" : "internal"],
            [0.785028, 0.599739, !isOuter ? "outer" : "internal"],
            [0.890500, 0.598812, !isOuter ? "outer" : "internal"],
            [0.785028, 0.643674, !isOuter ? "outer" : "internal"],
        ]
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

        if (!isOuter) {
            setData(dt)
        } else {
            setData(dt)
        }
        console.log(data)
    }, [isOuter])

    const options = {
        title: "Risk Map",
        curveType: "function",
        colors: ['#f44253'],
        hAxis: {title: 'Probability'},
        vAxis: {title: 'Cost'},
        legend: 'none',
    };

    return (
        <div className={style.Content}>
            <div className={style.selectMap}>
                <DropdownButton id="dropdown-basic-button" title={title} onSelect={handleSelect}>
                    <Dropdown.Item eventKey={false}>Internal</Dropdown.Item>
                    <Dropdown.Item eventKey={true}>Outer</Dropdown.Item>
                </DropdownButton>
            </div>
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

