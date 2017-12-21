import React from 'react';


export default class Bridge extends React.PureComponent{
    constructor(props){
        super(props);
        this.state=props.config||{};
    }

    componentDidMount(){
        if(this.props.wrapper){
            this.props.wrapper.registry(this)
        }       
    }

    render(){
        let Tool=this.props.Tool
        return <Tool {...this.state}/>;
    }

}