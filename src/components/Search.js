import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {List} from 'immutable';
import debounce from 'lodash/debounce';

export default class SimpleSearch extends React.PureComponent{
    constructor(props){
        super(props);
        this.inputValue="";
        this.state.data=List(props.data)       
    }
    
    componentWillReceiveProps(props){
        console.log(props)
        if(Array.isArray(props.data)){
            this.setState({data:List(props.data)})
        }
    }

    state={
        data:List(),
        value:""
    }
    

    debounceUpdate=debounce(event=>this.setState({value:this.refs['searchText'].value}),1000,{leading:false})
    
    render(){
        let arra=this.state.data.filter(el=>{
            return el.shipName.startsWith(this.state.value)
            }).map(el=><div key={el.shipName}>{el.shipName}</div>)

        return (<div>
            <div style={{display:'flex'}}>
                <div style={{height:36}}>
                   <input ref='searchText' onChange={this.debounceUpdate}/>
                </div>             
                <div onClick={_=>this.props.onSearchClick(this.state.value)} 
                   style={{height:36,width:36,background:`#ababab`}}>
                   <img src={require('../image/search.png')}  style={{cursor:'pointer',width:36}}/>
                </div>              
            </div>
            <div>
                  {arra}
            </div>    
        </div>)

    }

}

SimpleSearch.defaultProps={
    data:[],
    onSearchClick(value){
        console.log(value)
    }
}