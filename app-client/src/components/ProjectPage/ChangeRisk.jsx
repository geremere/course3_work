import React, {Component} from 'react';
import style from "./AddRisk.module.css"
import style_new from "../MainPage/NewProject.module.css"
import Select from 'react-select'
import {getAllTypes, getAvileableUsers, getRisksByType} from "../ServerAPI/riskAPI";
import {Loading} from "../common/Loading/Loading";

class ChangeRisk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            risk: this.props.risk,
            users: [],
            selected_priority: this.props.risk.state.priority,
            priority: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            state: ["Begin", "End", "In Work", "Closed", "Frozen", "Failed"],
            selected_state: "Begin",
            title: this.props.risk.state.title,
            description: this.props.risk.state.description
        };
        this.selectPriority = this.selectPriority.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.selectState = this.selectState.bind(this);
    }


    selectPriority(event) {
        this.setState({
            selected_priority: parseInt(event.value)
        })
    }

    selectState(event) {
        this.setState({
            selected_state: event.value
        })
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    resizeInput = (event) => {
        const input = event.target;
        input.style.height = 0;
        input.style.height = input.scrollHeight + "px";
    };

    addRisk = () => {
        const riskRequest = {
            id: this.props.risk.id,
            owners: this.props.risk.owners.map(user => user.id),
            project_id: this.props.projectId,
            risk_id: this.props.risk.risk.id,
            state: this.state.selected_state,
            priority: this.state.selected_priority,
            description: this.state.description,
            title: this.state.title,
            state_id: this.props.risk.state.id,
            changerId: this.props.userId
        };
        this.props.addRisk(riskRequest)

    };

    componentDidMount() {
        document.getElementById("change_risk").style.display = "block"
        console.log(this.props.risk)

    }

    render() {
        const options_state = this.state.state.map(item => new Option(item, item));
        const options_priority = this.state.priority.map(item => new Option(item, item));
        console.log(this.state.selected_priority);
        console.log(this.state.selected_state);

        return (
                <div id="change_risk" className={style.add_risk_alert}>
                    <div id="window_ change_risk" className={style.window_risk_alert}>
                        <span className={style_new.close}
                              onClick={this.props.close}>x</span>
                        <label>Работа над риском</label>
                        <br/>
                        <label>{this.state.risk.title}</label>
                        <br/>
                        <label>Описание риска: </label>
                        <label>{this.state.risk.risk.description}</label>
                        <div className={style.info_wrapper}>
                                <textarea onKeyUp={(event) => this.resizeInput(event)} name='title'
                                          className={style.input}
                                          value={this.state.risk.state.title}
                                          placeholder='Название риска для проект'
                                          onChange={(event) => this.handleInputChange(event)}/>
                            <textarea name='description' onKeyUp={(event) => this.resizeInput(event)}
                                      className={style.input}
                                      value={this.state.risk.state.description}
                                      placeholder='Описание риска' onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                        <label>Приоритет</label>
                        <br/>
                        <Select options={options_priority} defaultValue={new Option(this.state.selected_priority)}
                                onChange={(event) => this.selectPriority(event)}/>
                        <br/>
                        <label>Состояние</label>
                        <br/>
                        <Select options={options_state} defaultValue={new Option(this.state.selected_state)}
                                onChange={(event) => this.selectState(event)}/>
                        <br/>
                        <button onClick={this.addRisk}>
                            Изменить риск {this.state.title}
                        </button>

                    </div>
                </div>
            )
    }
}

export default ChangeRisk;