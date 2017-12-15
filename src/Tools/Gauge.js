import React from 'react';
import ReactDOM from 'react-dom';
import Bridge from './Bridge';
import Gauge from '../components/Gauge'


export default class RollingNumberWrapper{
    constructor(el,config={}){
        if(!el)
          throw new Error("el is null,please specified an element container")
        if(typeof el=='string')
          ReactDOM.render(<Bridge wrapper={this} config={config} Tool={Gauge} />, document.getElementById(el));
        else
          ReactDOM.render(<Bridge wrapper={this} config={config} Tool={Gauge} />, el);
    }

    registry(bridge){
       this.bridge=bridge;
    }

    update(value){
        if(this.bridge)
            this.bridge.setState({value})
    }

}