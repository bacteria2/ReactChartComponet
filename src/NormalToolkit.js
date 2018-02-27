import RcToolkit,{AsyncToolKit} from './ReactTool';
import Pie from './components/Pie/index';

export default  class Toolkit {
    static RollingNumber(el,config){
        return new RcToolkit('RollingNumber',el,config);
    } 
    
    static TimeAxis(el,config){
        return new RcToolkit('TimeAxis',el,config);
    } 

    static Gauge(el,config){
        return new RcToolkit('Gauge',el,config);
    }

    static Pie(el,config){
        return new Pie(el,config);
    }

    static asyncCharts(el,config){
        return new AsyncToolKit('Echarts',el,config);
    }
}