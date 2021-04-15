import React, {Component} from "react";
import AddRisk from "./AddRisk";
import {getAllTypes} from "../ServerAPI/riskAPI";
import {Loading} from "../common/Loading/Loading";

class RisksPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: [],
            isLoaded: true
        }
    }



    componentDidMount() {
    }

    render() {
        if (this.state.isLoaded)
            return (
                <div>
                    <AddRisk projectId={this.props.project.id}/>
                    <button onClick={() => {
                        document.getElementById("add_risk").style.display = "block"
                    }}>
                        {"Add risk"}
                    </button>
                </div>
            )
        else
            return (
                <Loading/>
            )
    }

}

export default RisksPage