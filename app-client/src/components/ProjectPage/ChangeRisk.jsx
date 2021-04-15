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
            selected_users: [],
            selected_risk: null,
            title: "",
            description: "",
            state: "BEGIN",
            isLoaded: false,
            priority: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        };
        this.loadTypes = this.loadTypes.bind(this);
        this.selectRisk = this.selectRisk.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectPriority = this.selectPriority.bind(this);
        this.selectUsers = this.selectUsers.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    loadTypes() {
        getAllTypes().then(response => {
            this.setState({
                types: response,
                isLoaded: true
            });
        }).catch(error => console.log(error))
    };

    selectType(event) {
        getRisksByType(event.value).then(response => {
            const risks = this.state.risks;
            risks.value = response
            risks.disable = !risks.disable
            this.setState({
                risks: risks,
                isLoaded: true,
            })
        });
    }

    selectRisk(event) {
        getAvileableUsers(this.props.projectId, event.value).then(response =>
            this.setState({
                users: response,
                selected_risk: parseInt(event.value)
            }))
    }

    selectUsers(event) {
        const users = event.map(ev => parseInt(ev.value));
        this.setState({
            selected_users: users
        })

    }

    selectPriority(event) {
        this.setState({
            selected_priority: parseInt(event.value)
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
            id: null,
            owners: this.state.selected_users,
            project_id: this.props.projectId,
            risk_id: this.state.selected_risk,
            state: this.state.state,
            priority: this.state.selected_priority,
            description: this.state.description,
            title: this.state.title,
            state_id: null,
            changerId: this.props.userId
        };
        this.props.addRisk(riskRequest)
    };

    componentDidMount() {
        this.loadTypes();
    }

    render() {
        if (this.state.isLoaded) {
            const options = this.state.types.map(item => new Option(item.type, item.id));
            const options_risks = this.state.risks.value.map(item => new Option(item.name, item.id));
            const options_users = this.state.users.map(item => new Option(item.name, item.id));
            const options_priority = this.state.priority.map(item => new Option(item, item));

            return (
                <div id="add_risk" className={style.add_risk_alert}>
                    <div id="window_add_risk" className={style.window_risk_alert}>
                        <span className={style_new.close}
                              onClick={() => document.getElementById('add_risk').style.display = 'none'}>x</span>
                        <label>Добавление нового риска</label>
                        <br/>
                        <label>Выберите тип риска</label>
                        <Select options={options} onChange={(event) => this.selectType(event)} defaultValue={this.state.type}/>
                        <label>Добавление нового риска</label>
                        <Select options={options_risks} onChange={(event) => this.selectRisk(event)}/>
                        <label>Выбероете ответсвенного за риск</label>
                        <Select isMulti options={options_users} onChange={(event) => this.selectUsers(event)}/>
                        <div className={style.info_wrapper}>
                                <textarea onKeyUp={(event) => this.resizeInput(event)} name='title'
                                          className={style.input}
                                          value={this.state.title}
                                          placeholder='Название риска для проект'
                                          onChange={(event) => this.handleInputChange(event)}/>
                            <textarea name='description' onKeyUp={(event) => this.resizeInput(event)}
                                      className={style.input}
                                      value={this.state.description}
                                      placeholder='Описание риска' onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                        <label>Приоритет</label>
                        <Select options={options_priority} defaultValue={options_priority[0]}
                                onChange={(event) => this.selectPriority(event)}/>
                        <button onClick={this.addRisk}>
                            Create Risk
                        </button>

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

export default AddRisk;