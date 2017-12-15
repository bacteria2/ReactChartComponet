import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import { interval } from 'd3-timer';


let TickDot=styled.div`
  width:${props=>props.last?14:props.tickWidth?props.tickWidth:46}px;
  span{
    background:url(${require("../image/dot.png")}) no-repeat;
    display: block;
    width: 30px;
    height:30px;
    background-position-y: 50%;   
    &:hover{
      cursor:pointer;
    }
  }
  p {
    margin: 0;
    color: ${({dotStyle})=>dotStyle.fontColor};
    margin-left:${({dotStyle})=>dotStyle.marginLeft};
    user-select:none;
    white-space: nowrap;
  }
`
let Selected=styled.span`
  height:100%;
  width:${props=>props.tickWidth}px;
  display: inline-block;
  position: absolute;
  left:${props=>props.left}px;
  background:url(${require("../image/selected.png")}) no-repeat; 
`

let AxisLine=styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
  background-size: 100% 2px;
  background: url(${require('../image/line.png')}) no-repeat 100% 50%;
`
let AxisContainer=styled.div`
  display: flex;
  flex-wrap: nowrap;
  height:30px;
  line-height: 30px;
  padding:4px; 
  .axis-bar{
    position:relative;
  }
`
let Controll=styled.div`
  width:36px;
  margin:1px 4px;
  
  span{
    width:28px;
    height: 28px;
    margin-top:1px;
    display: inline-block;
    cursor:pointer;
  }
  .play{ 
    background: url(${require('../image/play.png')}) no-repeat;
  }
  .pause{
    background: url(${require('../image/pause.png')}) no-repeat;
  }
`

const defaultStyle={
  fontColor:"#fff",
  
}



export default class TimeAxis extends React.PureComponent{

    constructor(props){
      super(props);
      this.state={
        playing:false,
        selectTick:props.selected,
      }
      this.interValBind;
      this.state.selectTick=props.selected
    }

    playHandler=()=>{      
       //播放状态清除定时器
      if(this.state.playing){
        clearInterval(this.interValBind);
      }
      //停止状态则开启定时器
      else{
         //立即前进一次
        this.play();
         //定时前进
        this.interValBind=setInterval(this.play,this.props.playingDuration)
      }   
      this.setState({playing:!this.state.playing})
    }

    play=()=>{
      let ifNext=this.state.selectTick+1;
      let nextIndex=ifNext<this.props.ticks.length?ifNext:0;
      this.setState({selectTick:nextIndex})      
    }

   
    componentDidMount(){
      this.props.ticks.forEach(
        (element,index)=>this.refs[`ticks${index}`].addEventListener('click',this.tickClick(element,index))
      )
    }

    tickClick(element,index){
      return _=>{
        this.props.onSelectedUpdate(element);     
        this.setState({selectTick:index}); 
      } 
    }

    componentWillUnmount(){
      this.props.ticks.forEach((element,index)=>this.refs[`ticks${index}`].removeEventListener('click',this.tickClick(element,index))) 
    }
    
    render(){   
        let dotStyle=Object.assign({},defaultStyle,this.props.axisStyle)
        //excute click;
        let {click}=this.props.ticks[this.state.selectTick];
        if(click){
          click(this.props.ticks[this.state.selectTick])
        }
        
        return (
        <section style={this.props.style}>    
          <AxisContainer >
           {this.props.controlls&& <Controll
                 onClick={this.playHandler} >
                 <span className={this.state.playing?"pause":"play"}>
                 </span> 
              </Controll> } 
              
            <div className={"axis-bar horizen"}>
              <Selected tickWidth={this.props.tickWidth} left={-7+this.state.selectTick*this.props.tickWidth}></Selected>
              <AxisLine>
                {this.props.ticks.map((el,index)=>(
                <TickDot 
                   tickWidth={this.props.tickWidth} 
                   key={"ticks"+index} 
                   last={index==this.props.ticks.length-1}
                   dotStyle={dotStyle}>
                  <span ref={`ticks${index}`} />
                  <p>{el.text}</p>
                </TickDot>))}
              </AxisLine>                        
            </div>
          </AxisContainer>          
        </section>)
    }
}

TimeAxis.defaultProps={
    ticks:[
        {text:"6时",click(){console.log(1)}},
        {text:"8时",click(){console.log(2)}},
        {text:"10时",click(){console.log(3)}},
        {text:"12时",click(){console.log(4)}},
        {text:"14时",click(){console.log(5)}},
        {text:"16时",click(){console.log(6)}}
      ],
    tickWidth:46, 
    selected:0,
    controlls:true,
    onSelectedUpdate(i){},
    axisStyle:{
      fontColor:"#fff"
    },
    playingDuration:5000,   
}

TimeAxis.propTypes={
    ticks:PropTypes.array,
    tickWidth:PropTypes.number,
    selected:PropTypes.number,
    onSelectedUpdate:PropTypes.func,
    axisStyle:PropTypes.object,
    playingDuration:PropTypes.number
}