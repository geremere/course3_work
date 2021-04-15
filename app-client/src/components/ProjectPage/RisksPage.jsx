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

class RisksPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            isLoaded: false,
            risks: [],
            currentUser: null,
            stompClient: null,
            selected_risk:{
                owners:[],
                state:{
                    priority:1,
                    description:"",
                    title:""
                },
                risk:{
                    id:null,
                    name:"",
                    description:"",
                    types:[1]
                },
            }
        };
        this.changeRisk = this.changeRisk.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    async getUser() {
        await getCurrentUser().then(response => {
            this.setState({
                currentUser: response
            })
        })
    }

    loadRisks() {
        getRisksByProject(this.props.project.id).then(response => {
            this.setState({
                risks: response,
                isLoaded: true
            })
            console.log(response)
        })

    }

    onMessageReceived = (msg) => {
        console.log("GEt==========================")
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
            messages: newRisks
        });
    };

    riskClick=(risk)=>{
        this.setState({
            selected_risk:risk
        });
        document.getElementById("add_risk").style.display = "block"
    };


    componentDidMount() {
        this.getUser();
        this.connect();
        this.loadRisks();
    }

    render() {
        if (this.state.isLoaded) {
            console.log(this.state.risks)
            const risk_list = this.state.risks.map(risk => <RiskSummary risk={risk} onClick={this.riskClick}/>)
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
        } else
            return (
                <Loading/>
            )
    }

}

function RiskSummary(props) {
    return (
        <div className={style.RiskBlock} onClick={() => props.onClick(props.risk)}>
            <p className={style.RiskName}>{props.risk.state.title}</p>
            <br/>
            <p className={style.RiskDescription}>{props.risk.state.description}</p>
        </div>
    )
}

export default RisksPage