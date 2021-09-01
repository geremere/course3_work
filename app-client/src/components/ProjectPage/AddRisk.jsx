import React, {Component, useEffect, useState} from 'react';
import {Button, Form, FormControl, FormSelect, Modal} from "react-bootstrap";
import {getRisks, updateProject} from "../ServerAPI/ProjectAPI";


export function AddRisk(props) {
    const [risk, setRisk] = useState(null);
    const [origin, setOrigin] = useState("")
    const [description, setDescription] = useState("")
    const [percentage, setPercentage] = useState(0)
    const [isNewRisk, setIsNewRisk] = useState(false)
    const [cost, setCost] = useState(0);
    const [costError, setCostError] = useState(false)
    const [percentageError, setPercentageError] = useState(false)
    const [risks, setRisks] = useState([])
    const [newRiskName, setNewRiskName] = useState("")
    const [type, setType] = useState("");
    const [close, setClose] = useState(true)

    useEffect(() => {
        getRisks().then(response => {
            setRisks(response)
        })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (props.selectedRisk != null && close) {
            setRisk(props.selectedRisk.risk)
            setDescription(props.selectedRisk.risk.description)
            setType(props.selectedRisk.risk.type)
            setCost(props.selectedRisk.cost)
            setPercentage(props.selectedRisk.probability * 100)
            setOrigin(props.selectedRisk.is_outer.toString())
        } else if (close) {
            setRisk("")
            setDescription("")
            setType("")
            setCost(0)
            setPercentage(0)
            setOrigin("")
        }
        if (props.show) {
            setClose(false)
        }
    })

    const createOrUpdateRisk = () => {
        if (props.selectedRisk == null) {
            props.project.risks.push({
                is_outer: origin,
                cost: cost,
                probability: percentage / 100,
                risk: {
                    id: isNewRisk ? null : risk.id,
                    name: isNewRisk ? newRiskName : risk.name,
                    description: description,
                    type: type
                }
            })
        } else {
            let ind = -1;
            props.project.risks.forEach((item, index) => {
                if (item.id === props.selectedRisk.id) {
                    ind = index
                }
            })
            props.project.risks[ind] = {
                is_outer: origin,
                cost: cost,
                probability: percentage / 100,
                risk: {
                    id: isNewRisk ? null : risk.id,
                    name: isNewRisk ? newRiskName : risk.name,
                    description: description,
                    type: type
                }
            }
        }
        updateProject(props.project).then(response => props.updateProject(response))
        props.close()
        setClose(true)
    }
    return (
        <>
            <Modal show={props.show} onHide={() => {
                props.close()
                setClose(true)
            }}>
                <Modal.Header closeButton onClick={() => setClose(true)}>
                    <Modal.Title>{props.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Select origin of risk</Form.Label>
                            <Form.Select value={origin}
                                         onChange={(event) => setOrigin(event.target.value)}>
                                <option value="">Select origin of risk</option>
                                <option value="true">Outer</option>
                                <option value="false">Internal</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group hidden={origin === null}>
                            <Form.Check>
                                <Form.Switch>
                                    <input className="form-check-input" type="checkbox"
                                           value={isNewRisk}
                                           onChange={() => {
                                               setIsNewRisk(!isNewRisk)
                                               setType("")
                                               setDescription("")
                                           }}/>
                                    <label className="form-check-label">
                                        Создать новый риск
                                    </label>
                                </Form.Switch>
                            </Form.Check>
                        </Form.Group>
                        <Form.Group hidden={origin === null} className="mb-3">
                            <Form.Label hidden={isNewRisk}>Select risk</Form.Label>
                            <Form.Select hidden={isNewRisk}
                                         value={risk != null ? risk.id : ""}
                                         onChange={(event) => {
                                             risks.forEach((risk) => {
                                                 if (risk.id === parseInt(event.target.value)) {
                                                     setRisk(risk)
                                                     setDescription(risk.description)
                                                     console.log(risk.type.type)
                                                     setType(risk.type.type)
                                                 }
                                             })
                                         }}>
                                <option value="">Select risk</option>
                                {risks.map((risk => <option value={risk.id}>
                                    {risk.name}
                                </option>))}
                            </Form.Select>

                            <Form.Label hidden={!isNewRisk}>Input Risk Name</Form.Label>
                            <Form.Control
                                hidden={!isNewRisk}
                                placeholder="Input here name of new risk"
                                value={newRiskName}
                                onChange={(event) => setNewRiskName(event.target.value)}
                            />

                        </Form.Group>
                        <Form.Group hidden={origin === null}>
                            <Form.Label>Select Risk Type</Form.Label>
                            <Form.Select
                                value={type}
                                onChange={(event) => setType(event.target.value)}>
                                <option value={""}>Select type of risk</option>
                                <option value="Analysis">Analysis</option>
                                <option value="Requirements">Requirements</option>
                                <option value="Software">Software</option>
                                <option value="Support">Support</option>
                                <option value="ProjectTeam">ProjectTeam</option>
                                <option value="Technical">Technical</option>
                                <option value="Customer">Customer</option>
                                <option value="Internal">Internal</option>
                                <option value="Functional">Functional</option>
                                <option value="Managerial">Managerial</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group hidden={origin === null}>
                            <Form.Label>Risk Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="You can change description for your situation"
                                style={{height: '75px'}}
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group hidden={origin === null}>
                            <Form.Label>Risk Cost</Form.Label>
                            <Form.Control
                                placeholder="Input here risk cost"
                                value={cost}
                                onChange={(event) => {
                                    if (isNaN(parseFloat(event.target.value))) {
                                        setCostError(true)
                                        setCost(event.target.value)
                                    } else {
                                        setCostError(false)
                                        setCost(parseFloat(event.target.value))
                                    }
                                }}
                            />
                            <Form.Text hidden={!costError} className="text-danger">
                                the entered value is not a number
                            </Form.Text>
                        </Form.Group>
                        <Form.Group hidden={origin === null}>
                            <Form.Label>Risk Probability</Form.Label>
                            <Form.Control
                                placeholder="Input here risk probability from (0 to 100)"
                                value={percentage}
                                onChange={(event) => {
                                    if (isNaN(parseFloat(event.target.value))) {
                                        setPercentageError(true)
                                        setPercentage(event.target.value)
                                    } else {
                                        setPercentageError(false)
                                        setPercentage(parseFloat(event.target.value))
                                    }
                                }}
                            />
                            <Form.Text hidden={!percentageError} className="text-danger">
                                the entered value is not a number
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        props.close()
                        setClose(true)
                        console.log(props.selectedRisk)
                    }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createOrUpdateRisk}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}