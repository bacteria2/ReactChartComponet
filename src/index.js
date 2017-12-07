import React from 'react';
import ReactDOM from 'react-dom';
import Axis from './Axis';
import './index.css';

export default class TimeAxis {
    render(){
        ReactDOM.render(<Axis />, document.getElementById('timeAxis'));
    }

}

window.TimeAxis=TimeAxis;

let axis=new TimeAxis({
    controlls:true,
    arrow:true,
    tickWidth:6,
    series:[],
})

axis.render();