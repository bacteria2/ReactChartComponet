import React from "react";
import styled from "styled-components";
import Draggable from 'react-draggable';
import PropTypes from "prop-types";

let Content=styled.div`
    position: absolute;
    color:#fff;
    font-size:16px;
    font-family:Microsoft YaHei;
    height:32px;line-height:32px;
    left:105px;
    top:${props=>props.top}px;
    width:330px;
`
let CloseBtn=styled.div`
   cursor:pointer;
   width:30px;
   height:30px;
   position: absolute;
   right:22px;
   top:17px;
`

let FishImg=styled.div`
  position:relative;
  width: 460px; 
  height: 417px;
  background: url(${require('../image/fisherinfo.png')}) no-repeat;
  z-index:99;
`
let PlayBtn=styled.div`
  cursor:pointer;
  width:32px;
  height:32px;
  position: absolute;
  left:25px;
  top:310px;
`
let BoatInfo=styled.div`
  cursor:pointer;
  width:70px;
  height:22px;
  position: absolute;
  left:216px;
  top:375px;
`

const contentDefine=[
    {
        name:'船名',
        key:'shipName',
        text(){},
    },
    {
        name:'所有人',
        key:'owner',
        text(){}, 
    },
    {
        name:'联系电话',
        key:'phone',
        text(){}, 
    },
    {
        name:'区域分类',
        key:'AreaType',
        text(){},
    },
    {
        name:'管理分类',
        key:'AdminType',
        text(){}, 
    }, {
        name:'船舶类型',
        key:'shipType',
        text(){},
    },{
        name:'归属地',
        key:'belongTo',
        text(){},    
       
    },{
        name:'渔船编码',
        key:'shipNum',
        text(){}, 
    }
]


export default class FishBoatWindow extends React.PureComponent{
    constructor(props){
        super(props);
    }

    state={
        shipData:new Map(),
        show:false,
    }

    componentWillReceiveProps(props){
        if(props.shipData){
            this.setState({shipData:props.shipData})
        }
        if(props.showWin){
            this.setState({show:true})
        }
    }
   

   
   render(){
      return this.state.show&&<Draggable
               defaultPosition={{x: 120, y: 120}}
       > 
       <FishImg>
          <CloseBtn onClick={e=>{this.props.onClose();this.setState({show:false});}}/>
          <PlayBtn onClick={this.props.play}/>
          <BoatInfo onClick={this.props.boatInfo}/>
          {contentDefine.map((el,index)=><Content 
             top={48+30*index} 
             key={'content'+index}>
              {this.state.shipData.get(el.key)}
          </Content>)}          
       </FishImg>
     </Draggable>
   }
}

FishBoatWindow.defaultProps={
   x:0,
   y:0,
   boatInfo(){},
   play(){}
}

FishBoatWindow.propTypes={
   x:PropTypes.number,
   y:PropTypes.number
}