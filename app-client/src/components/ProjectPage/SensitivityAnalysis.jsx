import React, {useState, useEffect} from "react";
import {Button, Form, Modal, Table} from "react-bootstrap";
import style from "./style/ProjectInfo.module.css"
import {Chart} from "react-google-charts";
import {FormInput} from "semantic-ui-react";
import {saveImage} from "../ServerAPI/simpleRequests";
import {saveExcel} from "../ServerAPI/ProjectAPI";
import {forEach} from "react-bootstrap/ElementChildren";

export function SensitivityAnalysis(props) {
    const [selectedRisk, setSelectedRisk] = useState(null);
    const [data, setData] = useState(null)

    const uploadExcel = (event) => {
        let formData = new FormData();
        formData.append('file', event.target.files[0]);
        saveExcel(selectedRisk.id, formData)
            .then(response => {
                    const dt = [[]]
                    for (let [key, value] of Object.entries(response)) {
                        dt[0].push(key)
                    }
                    for (let i = 1; i <= response["impact"].length; i++) {
                        dt.push([])
                        for (let [key, value] of Object.entries(response)) {
                            dt[i].push(value[i - 1])
                        }
                    }
                    console.log(dt)

                    setData(dt)
                }
            ).catch(console.log)
    };


    const options = {
        title: "Sensitivity Analysis",
        curveType: "function",
        hAxis: {title: 'Impact'},
        vAxis: {title: 'Factor'},
    };

    return (
        <div className={style.Content}>
            <FormInput
                className={style.uploadExcel}
                id="make_sensitivity"
                type="file"
                onChange={uploadExcel}/>
            <Table>
                <thead>
                <tr>
                    <th>Name of risk</th>
                    <th>Origin</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Impact</th>
                    <th>Probability</th>
                    <th>Selected</th>

                </tr>
                </thead>
                <tbody>
                {props.project.risks.map((risk) => <tr key={risk.id}>
                    <td>{risk.risk.name}</td>
                    <td>{risk.is_outer ? "Outer" : "Internal"}</td>
                    <td>{risk.risk.description}</td>
                    <td>{risk.risk.type}</td>
                    <td>{risk.cost}</td>
                    <td>{risk.probability}</td>
                    <td>
                        <Button hidden={!risk.hasSensitivity}
                                onClick={() => {
                                    setSelectedRisk(risk)
                                    document.getElementById("make_sensitivity").click()
                                }}>
                            make analyse
                        </Button>
                    </td>
                </tr>)}
                </tbody>
            </Table>
            <Form hidden={data == null}>
                <Chart
                    className={style.sensitivityWrapper}
                    width={'720px'}
                    height={'400px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={data}
                    options={options}
                    rootProps={{'data-testid': '1'}}
                />
            </Form>
        </div>

    );
}