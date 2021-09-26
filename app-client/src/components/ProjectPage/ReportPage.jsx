import React, {useEffect, useState} from "react";
import style from "./style/ReportPage.module.css"
import {Chart} from "react-google-charts";
import {RiskTable} from "./RiskPage/RisksPage";
import {getExcelData} from "../ServerAPI/ProjectAPI";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {Button} from "react-bootstrap";

function ReportPage(props) {
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
        hAxis: {title: 'Probability', minValue: 0.0, maxValue: 1.0},
        vAxis: {title: 'Impact', minValue: 0.0, maxValue: 1.0},
        legend: 'none',
    };

    const printDocument = () => {
        html2canvas(document.querySelector("#divToPrint")).then(canvas => {
            document.body.appendChild(canvas);  // if you want see your screenshot in body.
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save("download.pdf");
        });
    }

    return (
        <div className={style.Content}>
            <div id="divToPrint">
                <h1>
                    Report for {props.project.title}
                </h1>
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
                <div className={style.risk_wrap}>
                    <h2> Project risks</h2>
                    <RiskTable project={props.project}/>
                </div>
            </div>
            <Button onClick={printDocument}>
                Export to PDF
            </Button>
        </div>

    );
}

export default ReportPage;

