import React from 'react';
import ReactDOM from 'react-dom';
import Bridge from './Bridge';
import Search from '../components/Search'


export default class TimeAxisWrapper{
    constructor(el,config={}){
        if(!el)
          throw new Error("el is null,please specified an element container")
        if(typeof el=='string')
          ReactDOM.render(<Bridge wrapper={this} config={config} Tool={Search} />, document.getElementById(el));
        else
          ReactDOM.render(<Bridge wrapper={this} config={config} Tool={Search} />, el);
    }

    registry(bridge){
       this.bridge=bridge;
    }

    setData(data){
        this.bridge.setState({data});
    }



    // update(value){
    //     if(this.bridge)
    //         this.bridge.setState({value})
    // }

}