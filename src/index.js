import React from 'react';
import ReactDOM from 'react-dom';
import RollingNumberWrapper from './Tools/RollingNumber';
import TimeAxis from './Tools/TimeAxis';
import './index.css';

export default class Toolkit {
    static newRollingNumber(el,config){
        return new RollingNumberWrapper(el,config);
    } 
    static newTimeAxis(el,config){
        return new TimeAxis(el,config);
    }
}


window.Toolkit=Toolkit;
