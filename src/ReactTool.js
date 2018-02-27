import React from 'react';
import ReactDom from 'react-dom';
import RollingNumber from './components/RollingNumber';
import TimeAxis from './components/TimeAxis';
import Gauge from './components/Gauge';


function hocConnect(Component){
    return class HOC extends React.Component{
        constructor(props={}){
            super(props);
            this.state=props.option
        }

       update=(value)=>{
           this.setState({value})
       }

       setOption=(option,merge)=>{
        if(merge)
          this.setState(Object.assign({},this.state,option))
        else
          this.setState({...option})
       }

       render(){
          return <Component {...this.state}/>
       }
    }

}
const compList={
    TimeAxis:hocConnect(TimeAxis),
    RollingNumber:hocConnect(RollingNumber),
    Gauge:hocConnect(Gauge)
}

export default class RcToolkit{
    constructor(compType,el,option){
        let ToolKit=compList[compType];
        if(ToolKit)
          ReactDom.render(<ToolKit ref={(comp)=>this.instance=comp} option={option}/>,el)
        else 
          throw new Error('component not found');
       
    }

    method(method,...args){
       if(this.instance[method] && typeof this.instance[method] =='function')
           this.instance[method](...args)
    } 
}

const asyncCompList={
    Echarts:import (/* webpackChunkName: "asyncCharts" */ './components/Echarts'),
}

export class AsyncToolKit{
    constructor(compType,el,option){
        this.compType=compType;
        this.loaded=false;  
        this.asyncComp=null; 
        this.option=option;
        this.el=el;           
    }

    async loadTool(){  
        try {
            let AsyncComp=await asyncCompList[this.compType];
            ReactDom.render(<AsyncComp.default ref={(comp)=>this.instance=comp} {...this.option}/>,this.el);
            this.loaded=true;                     
        } catch (err) {
            throw new Error(`load component error:${err}`)
        }      
    }
    invoke=async (method,...args)=>{
        try{
            return await this.method('invoke',method,...args);
        } catch (err) {
            console.log(err)
        }
    }

    method=async(method,...args)=>{
        if(!this.loaded){
           await this.loadTool();
        }       
        if(this.instance[method] && typeof this.instance[method] ==='function')
            this.instance[method](...args)
    } 
}

