import React, {Component, useState} from "react";
import {Button, Modal, Pagination, Table} from "react-bootstrap";
import style from "./RiskPage.module.css"
import {AddRisk} from "./AddRisk";


export function RiskTable(props) {
    const [show, setShow] = useState(false);
    const [selectRisk, setSelectRisk] = useState(-1);
    const [header, setHeader] = useState("Create")

    const handleClose = (show) => {
        setShow(false)
    }

    const handleUpdate = (risk) => {
        setSelectRisk(risk)
        setHeader("Update Risk")
        setShow(true)
    }

    const handleDelete = (id) => {
        //ToDo: implement request delete
    }

    const handleSolved = (id) => {
    }

    const handleCreate = () => {
        setSelectRisk(null)
        setHeader("Create Risk")
        setShow(true)
    }


    return (
        <>
            <AddRisk updateProject={props.updateProject}
                     selectedRisk={null}
                     project={props.project}
                     show={show}
                     header={header}
                     close={() => setShow(false)}/>
            <Table cellPadding={true}>
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
                    <th>Cost</th>
                    <th>Probability</th>
                    <th>Date Create</th>
                    <th>Action</th>

                </tr>
                </thead>
                <tbody>
                {props.project.risks.map((risk) => <tr key={risk.id}>
                    <td>{risk.id}</td>
                    <td>{risk.risk.name}</td>
                    <td>{risk.is_outer?"Outer":"Internal"}</td>
                    <td>{risk.risk.description}</td>
                    <td>{risk.cost}</td>
                    <td>{risk.probability}</td>
                    <td>{risk.create}</td>
                    <td>
                        <button onClick={() => handleDelete(risk)} className={style.action_buttons}>
                            <img
                                src="https://avatars.mds.yandex.net/get-pdb/3029455/e6643c71-0838-4efd-905f-9813f3f92461/s1200"
                                width="20px"/>
                        </button>
                        <button onClick={() => handleUpdate(risk)} className={style.action_buttons}>
                            <img

                                src="https://avatars.mds.yandex.net/get-pdb/4562142/11071cd7-22b8-4aee-b1b4-e9f1e9036ed6/s1200"
                                width="20px"/>
                        </button>
                        <button onClick={() => handleSolved()} className={style.action_buttons}>
                            <img
                                src="https://avatars.mds.yandex.net/get-pdb/4988356/0104c833-58de-4947-b731-4be10d2ae0c9/s1200"
                                width="20px"/>
                        </button>
                    </td>
                </tr>)}
                </tbody>
            </Table>
        </>
    )
}