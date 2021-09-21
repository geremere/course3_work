import React, {useState, useEffect} from "react";
import {Dropdown, DropdownButton, Table} from "react-bootstrap";
import style from "./style/ProjectInfo.module.css"
import {Chart} from "react-google-charts";

function SensitivityAnalysis(props) {
    const [data, setData] = useState([]);
    const [risks, setRisks] = useState(props.project.risks.map(risk => {
        return {
            ...risk,
            selected: true
        }
    }));

    useEffect(() => {
        const data = [];
        const valueAtRisk = [['VaR']]
        for (let i = 1; i < 100; i++) {
            valueAtRisk.push([i])
        }
        risks.forEach(risk => {
            console.log(risk)
            if (risk.selected) {
                const elastic = risk.cost * risk.probability - risk.cost * (risk.probability - 0.01)
                valueAtRisk[0].push(risk.risk.name)
                for (let i = 1; i < 100; i++) {
                    valueAtRisk[i].push(risk.cost * risk.probability + elastic * (i / 100 - risk.probability))
                }
            }
        })
        setData(valueAtRisk)

    }, [risks])

    const select = (riskId) => {
        let newRisks = risks.map(risk => {
            if (risk.id === riskId)
                risk.selected = !risk.selected
            return risk
        })
        setRisks(newRisks)
    }


    const options = {
        title: "Sensitivity Analysis",
        curveType: "function",
        hAxis: {title: 'Probability'},
        vAxis: {title: 'VaR'},
    };

    return (
        <div className={style.Content}>
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
                {risks.map((risk) => <tr key={risk.id}>
                    <td>{risk.risk.name}</td>
                    <td>{risk.is_outer ? "Outer" : "Internal"}</td>
                    <td>{risk.risk.description}</td>
                    <td>{risk.risk.type}</td>
                    <td>{risk.cost}</td>
                    <td>{risk.probability}</td>
                    <td>
                        <input type="checkbox"
                               onClick={() => select(risk.id)}
                               checked={risk.selected}
                               class="form-check-input"
                        />
                    </td>
                </tr>)}
                </tbody>
            </Table>
            <div className="donut">
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
            </div>
        </div>

    );
}

export default SensitivityAnalysis;

