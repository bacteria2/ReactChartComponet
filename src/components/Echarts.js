

export default class EchartWrapper {
    constructor(dom){
        return this.load();     
    }

    load(){
        return import(/* webpackChunkName: "echarts" */ 'echarts');    
    }
}