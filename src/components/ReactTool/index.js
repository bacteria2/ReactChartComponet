import React from 'react';
import ReactDOM from 'react-dom';

let rCompMap={}

function importAll(r){
  r.keys().forEach(key=>{
        rCompMap[key]=r[key]
  })
}
importAll(require.context('./',true,/^((?!\/)[\s\S])+\.R\.js$/))

console.log(rCompMap);

function RToolkit(){

}

class Root extends React.PureComponent{

    constructor(props){
        super(props)
    }

    render(){
        return <div>root</div>
    }

    update(){}

    setOption(option,merge=false){

    }

    resize(){
        console.log('resize')
    }

}

export default class ReactToolkit{
    constructor(el,config={}){
        if(!el)
            throw new Error("el is null,please specified an element container")
        if(typeof el==='string')
            ReactDOM.render(<Root config={config}/>, document.getElementById(el));
        else
            ReactDOM.render(<Root config={config}/>, el);
    }


    setData(data){
        this.setState({data});
    }

    update(){

    }

}