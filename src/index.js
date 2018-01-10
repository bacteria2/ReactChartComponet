
import './publicPath';
import RollingNumberWrapper from './Tools/RollingNumber';
import TimeAxis from './Tools/TimeAxis';
import Gauge from './Tools/Gauge';
import Pie from './components/Pie/index';
import Chart from './components/Echarts';




const Echarts =require( './components/Echarts');

export default class Toolkit {
    static RollingNumber(el,config){
        return new RollingNumberWrapper(el,config);
    } 
    static TimeAxis(el,config){
        return new TimeAxis(el,config);
    } 
    static Gauge(el,config){
        return new Gauge(el,config);
    }
    static Pie(el,config){
        return new Pie(el,config);
    }
    static Charts(el,config){
        return new Chart(el,config);
    }
}


window.Toolkit=Toolkit;
