import React from 'react';
import ReactDOM from 'react-dom';
import Bridge from './Bridge';
import DraggableWin from '../components/DraggableWin'
import {Map} from 'immutable';

export default class DraggableWinWrapper{
    constructor(el,config={}){
        config.onClose=_=>this.bridge.setState({showWin:false});
        if(!el)
          throw new Error("el is null,please specified an element container")
        if(typeof el=='string')
          ReactDOM.render(<Bridge wrapper={this} config={config} Tool={DraggableWin} />, document.getElementById(el));
        else
          ReactDOM.render(<Bridge wrapper={this} config={config} Tool={DraggableWin} />, el);
    }

    registry(bridge){
       this.bridge=bridge;
    }

    update(shipData){
      this.bridge.setState({shipData:Map(shipData)});
    }

    open(){
      this.bridge.setState({showWin:true})
    }
  

}