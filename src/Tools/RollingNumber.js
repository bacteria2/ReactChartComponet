import React from 'react';
import ReactDOM from 'react-dom';
import Bridge from './Bridge';
import RollingNumber from '../components/RollingNumber'


export default class RollingNumberWrapper{
    constructor(el,config={}){
        if(!el)
          throw new Error("el is null,please specified an element container")
        if(typeof el=='string')
          ReactDOM.render(<Bridge wrapper={this} config={config} Tool={RollingNumber} />, document.getElementById(el));
        else
          ReactDOM.render(<Bridge wrapper={this} config={config} Tool={RollingNumber} />, el);
    }

    registry(bridge){
       this.bridge=bridge;
    }

    update(value){
        if(this.bridge)
            this.bridge.setState({value})
    }

}