import React, {useState, useEffect} from "react";
import style from "./style/ProjectInfo.module.css"
import {Chart} from "react-google-charts";
import {FormInput} from "semantic-ui-react";

function ProjectInfo(props) {
    const [data, setData] = useState([]);
    // const [delta, setDelta] = useState(0)

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
                if ((row[1] >= .1) && (row[1] <= .3) && (row[0] >= .1) && (row[0] <= .3) ) {
                    row.push('green');
                } else if ((row[1] > .3) && (row[1] <= .7) &&(row[0] > .3) && (row[0] <= .7) ) {
                    row.push('yellow');
                } else {
                    row.push('red');
                }
            }
        });
        setData(dt)
        // updateCanvas()
    }, [])

    // const updateCanvas = () => {
    //     var canvas = document.getElementById('graph');
    //     var ctx = canvas.getContext('2d');
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     ctx.beginPath();
    //     ctx.moveTo(126 + delta, 75);
    //     for (var x = 1; x < 450 - delta; x += 0.01) {
    //         ctx.lineTo(126 + delta + x, 39 * Math.log(x) + 75);
    //     }
    //     ctx.strokeStyle = '#ff0000';
    //     ctx.stroke();
    // }


    const options = {
        title: "Risk Map",
        curveType: "function",
        hAxis: {title: 'Probability', minValue: 0.0, maxValue: 1.0},
        vAxis: {title: 'Impact', minValue: 0.0, maxValue: 1.0},
        legend: 'none',
    };

    return (
        <div className={style.Content}>
            <div className={style.mapWrapper}>
                <Chart
                    chartType="ScatterChart"
                    width="720px"
                    height="400px"
                    data={data}
                    options={options}
                    legendToggle
                />
            </div>
            {/*<div className={style.canvasWrap}>*/}
            {/*    <canvas className={style.canvasWrap} id="graph" width="720" height="400"/>*/}
            {/*</div>*/}

        </div>

    );
}

export default ProjectInfo;

