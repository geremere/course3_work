import React, {Component, useEffect, useRef, useState} from "react";
import {Button, Modal, Pagination, Table} from "react-bootstrap";
import style from "./RiskPage.module.css"
import {AddRisk} from "./AddRisk";
import useForceUpdate from "antd/es/_util/hooks/useForceUpdate";
import {updateProject} from "../../ServerAPI/ProjectAPI";


export function RiskTable(props) {
    const [show, setShow] = useState(false);
    const [selectRisk, setSelectRisk] = useState(null);
    const [header, setHeader] = useState("Create")

    const handleUpdate = (risk) => {
        setSelectRisk(risk)
        setShow(true)
        setHeader("Update Risk")
    }

    const handleDelete = (risk) => {
        debugger;
        let ind = -1;
        const project = props.project;
        project.risks.forEach((item, index) => {
            if (item.id === risk.id) {
                ind = index
                return
            }
        })
        debugger;
        project.risks.splice(ind, 1)
        updateProject(project).then(response => props.updateProject(response))
    }

    const handleSolved = (risk) => {
        let ind = -1;
        const project = props.project;
        project.risks.forEach((item, index) => {
            if (item.id === risk.id) {
                ind = index
                return
            }
        })
        project.risks[ind].is_solved = true
        updateProject(project).then(response => props.updateProject(response))
    }

    const handleReturnToWork = (risk) => {
        let ind = -1;
        const project = props.project;
        project.risks.forEach((item, index) => {
            if (item.id === risk.id) {
                ind = index
                return
            }
        })
        project.risks[ind].is_solved = false
        updateProject(project).then(response => props.updateProject(response))
    }

    const handleCreate = () => {
        setSelectRisk(null)
        setHeader("Create Risk")
        setShow(true)
    }

    return (
        <div>
            <AddRisk updateProject={props.updateProject}
                     selectedRisk={selectRisk}
                     project={props.project}
                     show={show}
                     header={header}
                     close={() => setShow(false)}/>
            <Table>
                <thead>
                <tr>
                    <th>
                        <button onClick={handleCreate} className={style.action_buttons}>
                            <img
                                src="https://avatars.mds.yandex.net/get-pdb/4893124/47849ce4-65f6-486e-8012-6e692d6570ef/s1200"
                                width="20px"/>
                        </button>
                    </th>
                    <th>Name of risk</th>
                    <th>Origin</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Impact</th>
                    <th>Probability</th>
                    <th>Action</th>

                </tr>
                </thead>
                <tbody>
                {props.project.risks.map((risk) => <tr className={risk.is_solved ? style.solvedRisk : null}
                                                       key={risk.id}>
                    <td>{risk.id}</td>
                    <td>{risk.risk.name}</td>
                    <td>{risk.is_outer ? "Outer" : "Internal"}</td>
                    <td>{risk.risk.description}</td>
                    <td>{risk.risk.type}</td>
                    <td>{risk.cost}</td>
                    <td>{risk.probability}</td>
                    <td>
                        <button onClick={() => handleDelete(risk)}
                                className={style.action_buttons}
                                hidden={risk.is_solved}>
                            <img
                                src="https://avatars.mds.yandex.net/get-pdb/3029455/e6643c71-0838-4efd-905f-9813f3f92461/s1200"
                                width="20px"/>
                        </button>
                        <button onClick={() => handleUpdate(risk)}
                                hidden={risk.is_solved}
                                className={style.action_buttons}>
                            <img

                                src="https://avatars.mds.yandex.net/get-pdb/4562142/11071cd7-22b8-4aee-b1b4-e9f1e9036ed6/s1200"
                                width="20px"/>
                        </button>
                        <button onClick={() => handleSolved(risk)}
                                className={style.action_buttons}
                                hidden={risk.is_solved}>
                            <img
                                src="https://avatars.mds.yandex.net/get-pdb/4988356/0104c833-58de-4947-b731-4be10d2ae0c9/s1200"
                                width="20px"/>
                        </button>
                        <button onClick={() => handleReturnToWork(risk)}
                                className={style.action_buttons}
                                hidden={!risk.is_solved}>
                            <img
                                src="http://cdn.onlinewebfonts.com/svg/img_107827.png"
                                width="20px"/>
                        </button>
                    </td>
                </tr>)}
                </tbody>
            </Table>
        </div>
    )
}