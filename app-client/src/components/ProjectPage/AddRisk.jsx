import React, {Component} from 'react';
import style from "./AddRisk.module.css"
import style_new from "../MainPage/NewProject.module.css"
import Select from 'react-select'
import {getAllTypes, getAvileableUsers, getRisksByType} from "../ServerAPI/riskAPI";
import {Loading} from "../common/Loading/Loading";

class AddRisk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            risks: {
                value: [],
                disable: true
            },
            users: [],
            isLoaded: false
        };
        this.loadTypes = this.loadTypes.bind(this);
        this.selectRisk = this.selectRisk.bind(this);
        this.selectType = this.selectType.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    loadTypes() {
        getAllTypes().then(response => {
            this.setState({
                types: response,
                isLoaded: true
            });
            debugger
        }).catch(error => console.log(error))
    };

    selectType(event) {
        getRisksByType(event.value).then(response => {
            const risks = this.state.risks;
            risks.value = response
            risks.disable = !risks.disable
            this.setState({
                risks: risks,
                isLoaded: true
            })
        });
        console.log(this.state.risks)
    }

    selectRisk(event) {
        getAvileableUsers(this.props.projectId, event.value).then(response =>
            this.setState({users: response}))
    }
    handleInputChange(event) {
        this.setState({
            [event.target.name]: {
                value: event.target.value,
                correct: event.target.value.length !== 0
            }
        });
    }

    resizeInput = (event) => {
        const input = event.target;
        input.style.height = 0;
        input.style.height = input.scrollHeight + "px";
    };


    componentDidMount() {
        this.loadTypes();
    }

    render() {
        if (this.state.isLoaded) {
            const options = this.state.types.map(item => new Option(item.type, item.id));
            const options_risks = this.state.risks.value.map(item => new Option(item.name, item.id));
            const options_users = this.state.users.map(item => new Option(item.name, item.id));
            return (
                <div id="add_risk" className={style.add_risk_alert}>
                    <div id="window_add_risk" className={style.window_risk_alert}>
                        <span className={style_new.close}
                              onClick={() => document.getElementById('new_project').style.display = 'none'}>x</span>
                        <label>Добавление нового риска</label>
                        <label>Добавление нового риска</label>
                        <Select options={options} onChange={(event) => this.selectType(event)}/>
                        <label>Добавление нового риска</label>
                        <Select options={options_risks}  onChange={(event) => this.selectRisk(event)}/>
                        <label>Добавление нового риска</label>

                        <Select isMulti options={options_users}/>

                        <div className={style.info_wrapper}>
                                <textarea onKeyUp={(event) => this.resizeInput(event)} name='title'
                                          className={style.input}
                                          placeholder='Название риска для проект'
                                          onChange={(event) => this.handleInputChange(event)}/>
                            <textarea name='description' onKeyUp={(event) => this.resizeInput(event)}
                                      className={style.input}
                                      placeholder='Описание риска' onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                    </div>
                </div>
            )
        } else return (
            <div id="add_risk" className={style.add_risk_alert}>
                <div id="window_add_risk" className={style.window_risk_alert}>
                        <span className={style_new.close}
                              onClick={() => document.getElementById('new_project').style.display = 'none'}>x</span>
                    <Loading/>
                </div>
            </div>
        )


    }

}

function TypeBlock(props) {
    return (
        <div>
            {props.type.type}
        </div>
    )

}

export default AddRisk;