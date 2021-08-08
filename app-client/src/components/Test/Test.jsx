import React, {Component} from 'react';
import {Chart} from "react-google-charts";

class Test extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        const data = [
            ['X', 'Y',{ role: "tooltip", type: "string"}],
            [0.785882, 0.355928,"sfasd"],
            [0.785882, 0.346507,"sfasd"],
            [0.785882, 0.355928,"sfasd"],
            [0.785882, 0.703251,"sfasd"],
            [0.785028, 0.599739,"sfasd"],
            [0.785028, 0.512527,"sfasd"],
            [0.785882, 0.346507,"sfasd"],
            [0.785882, 0.346507,"sfasd"],
            [0.785882, 0.355928,"sfasd"],
            [0.785882, 0.355928,"sfasd"],
            [0.785882, 0.355928,"sfasd"],
            [0.785882, 0.355928,"sfasd"],
            [0.890500, 0.556761,"sfasd"],
            [0.785882, 0.613288,"sfasd"],
            [0.785028, 0.599739,"sfasd"],
            [0.890500, 0.598812,"sfasd"],
            [0.785028, 0.643674,"sfasd"],
        ];

        data.forEach(function (row, index) {
            if (index === 0) {
                // add column heading
                row.push({
                    role: 'style',
                    type: 'string'
                });
            } else {
                // add color for row
                if ((row[1] >= .1) && (row[1] <= .5)) {
                    row.push('green');
                } else if ((row[1] > .5) && (row[1] <= .6)) {
                    row.push('yellow');
                } else {
                    row.push('red');
                }
            }
        });

        const options = {
            title: "Company Performance",
            curveType: "function",
            colors: ['#f44253'],
            hAxis: { title: 'Age'  },
            vAxis: { title: 'Weight'},
            legend:'none',
        };

        return (
            <div className="donut">
                <Chart
                    chartType="ScatterChart"
                    width="80%"
                    height="400px"
                    data={data}
                    options={options}
                    legendToggle
                />
            </div>
        );
    }
}

export default Test;
// const domContainer = document.querySelector('#app');
// ReactDOM.render(React.createElement(Test), domContainer);