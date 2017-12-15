import React from 'react';
import ReactDOM from 'react-dom';
import RollingNumberWrapper from './Tools/RollingNumber';
import TimeAxis from './Tools/TimeAxis';
import DragWin from './Tools/DragWin';
import Search from './Tools/Search';
import Gauge from './Tools/Gauge';
import Pie from './components/Pie/index';

export default class Toolkit {
    static newRollingNumber(el,config){
        return new RollingNumberWrapper(el,config);
    } 
    static newTimeAxis(el,config){
        return new TimeAxis(el,config);
    }
    static newDraggableWin(el,config){
        return new DragWin(el,config);
    }
    static newSearch(el,config){
        return new Search(el,config);
    }

    static newGauge(el,config){
        return new Gauge(el,config);
    }
    static newPie(el,config){
        return new Pie(el,config);
    }
}


window.Toolkit=Toolkit;
