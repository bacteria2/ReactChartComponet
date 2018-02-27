import React,{PureComponent} from 'react';
import propTypes from 'prop-types';
import Echarts from 'echarts';  
import debounce from 'lodash/debounce';

export default class  EchartsWrapper extends PureComponent{  
    constructor(props){
        super(props);      
        this.id = this.props.id;
        this.instance = null;
        window.Echarts=Echarts;
    }

    componentDidMount(){      
        this.props.beforeInit(Echarts);        
        this.instance=Echarts.init(document.getElementById(this.id));
        window.addEventListener('resize',this.resize);
    } 

    invoke(method,...args){
        if(this.instance&&this.instance[method])
          return  this.instance[method](...args)
    }


    resize=debounce(_=>{      
       if(this.instance){
        this.instance.resize()
       }   
    },1000)
    

    componentWillUnmount(){
        window.removeEventListener('resize',this.resize);
    }

    render(){
        let {style}=this.props;  
        return <div id={this.id} style={style}></div>
    }
}
EchartsWrapper.defaultProps={
    beforeInit(echarts){
      // console.log(echarts);
    },
    id:'charts',
    style:{
        height:'100%',
        width:'100%'
    }
}


EchartsWrapper.propTypes={
    beforeInit:propTypes.func,
    id:propTypes.string,
    style:propTypes.object,

}