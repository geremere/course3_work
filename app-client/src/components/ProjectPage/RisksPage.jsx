import React, {Component} from "react";
import AddRisk from "./AddRisk";
import {Loading} from "../common/Loading/Loading";
import toast from "react-hot-toast";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import {BASE_URL, PROJECT_ICO} from "../ServerAPI/utils";
import {getCurrentUser} from "../ServerAPI/userAPI";
import {getRisksByProject} from "../ServerAPI/ProjectAPI";
import style from "./RiskPage.module.css";
import ChangeRisk from "./ChangeRisk";
import {Select} from "antd";
import {getRisk} from "../ServerAPI/riskAPI";

class RisksPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            isLoaded: false,
            risks: [],
            currentUser: null,
            stompClient: null,
            selected_risk: null
        };
        this.changeRisk = this.changeRisk.bind(this);
        this.getUser = this.getUser.bind(this);
        this.loadRisks = this.loadRisks.bind(this);
        this.riskClick = this.riskClick.bind(this);
        this.loadRiskById = this.loadRiskById.bind(this);
    }

    async getUser() {
        await getCurrentUser().then(response => {
            this.setState({
                currentUser: response,
                isLoaded: true
            })
        })
    }

    loadRiskById() {
        return getRisk(this.state.selected_risk.id).then(response => response)
    }


    loadRisks() {
        getRisksByProject(this.props.project.id).then(response => {
            this.setState({
                risks: response
            });
        })

    }

    onMessageReceived = (msg) => {
        const notification = JSON.parse(msg.body);
        if (notification.changerName !== null)
            toast("Risk " + notification.riskName + "changed by " + notification.changerName);
        else
            toast("Changes was saved " + notification.riskName);
        this.loadRisks();
    };

    onError = (err) => console.log(err);

    connect = () => {
        const socket = new SockJS(BASE_URL + "/ws");
        this.state.stompClient = Stomp.over(socket);
        this.state.stompClient.connect({}, this.onConnected, this.onError);
    };

    onConnected = () => this.state.stompClient.subscribe("/user/" + this.state.currentUser.id + "/queue/risks", this.onMessageReceived);


    changeRisk = (riskRequest) => {
        this.state.stompClient.send("/app/risk", {}, JSON.stringify(riskRequest));
        const newRisks = [...this.state.risks];
        newRisks.push(riskRequest);
        this.setState({
            messages: newRisks,
            selected_risk: null
        });
    };

    riskClick(risk) {
        this.setState({
            selected_risk: risk
        });
    };

    close = () => {
        this.setState({
            selected_risk: null
        });
    };


    componentDidMount() {
        this.getUser();
        this.connect();
        this.loadRisks();
    }

    render() {
        if (this.state.isLoaded) {
            const risk_list = this.state.risks.map(risk => <RiskSummary risk={risk} onClick={this.riskClick}/>)
            if (this.state.selected_risk === null) {
                return (
                    <div>
                        <AddRisk projectId={this.props.project.id} addRisk={this.changeRisk}
                                 userId={this.state.currentUser.id}/>
                        <button onClick={() => {
                            document.getElementById("add_risk").style.display = "block"
                        }}>
                            {"Add risk"}
                        </button>
                        <div>
                            {risk_list}
                        </div>
                    </div>
                )
            }
            return (
                <div>
                    <AddRisk projectId={this.props.project.id} addRisk={this.changeRisk}
                             userId={this.state.currentUser.id}/>
                    <ChangeRisk projectId={this.props.project.id} addRisk={this.changeRisk}
                                userId={this.state.currentUser.id} risk={this.state.selected_risk} close={this.close}/>
                    <button onClick={() => {
                        document.getElementById("add_risk").style.display = "block"
                    }}>
                        {"Add risk"}
                    </button>
                    <div>
                        {risk_list}
                    </div>
                </div>
            )
        } else
            return (
                <Loading/>
            )
    }

}

function RiskSummary(props) {

    return (
        <div className={props.risk.state.priority > 5 ? style.RiskBlock_10 : style.RiskBlock_5}
             onClick={() => props.onClick(props.risk)}>
            <label>{"Название риска: " + props.risk.state.title}</label>
            <br/>
            <p>Описание риска:</p>
            <label>{props.risk.state.description}</label>
            <br/>
            <label>{"Состояние: " + props.risk.state.state}</label>
        </div>
    )
}

export default RisksPage