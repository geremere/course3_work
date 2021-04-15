import React, {Component} from 'react';
import {getAllTypes} from "../ServerAPI/riskAPI";
import {Loading} from "../common/Loading/Loading";
import style from "./AddRisk.module.css"
import style_new from "../MainPage/NewProject.module.css"

class CourseReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            isLoaded: false
        };
        this.loadTypes = this.loadTypes.bind(this);
    }

    loadTypes = () => {
        getAllTypes().then(response => {
            this.setState({
                types: response,
                isLoaded: true
            })
        }).catch(error => console.log(error))
    };

    componentDidMount() {
        this.loadTypes();
    }

    render() {
        if (this.state.isLoaded) {
            const types = this.state.types.map(type => <TypeBlock type={type}/>);
            return (
                <div id="add_risk" className={style.add_risk_alert}>
                    <div id="window_add_risk" className={style.window_risk_alert}>
                        <span className={style_new.close}
                              onClick={() => document.getElementById('new_project').style.display = 'none'}>x</span>
                        <DropDownList items={this.state.types}/>
                        <div className={style_new.info_wrapper}>
                            <textarea onKeyUp={(event) => this.resizeInput(event)} name='title' className={style_new.input}
                                      placeholder='Название проекта'
                                      onChange={(event) => this.handleInputChange(event)}/>
                            <textarea name='description' onKeyUp={(event) => this.resizeInput(event)}
                                      className={style_new.input}
                                      placeholder='Описание' onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <Loading/>
                </div>
            )
        }

    }

}

function TypeBlock(props) {
    return (
        <div>
            {props.type.type}
        </div>
    )

}

function DropDownList(props) {
    const options = props.items.map(item=><option value={item.id}>{item.type}</option>)
    return (
        <select>
            {options}
        </select>
    )

}

export default CourseReport;