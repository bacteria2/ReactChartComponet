import React from 'react';

import propTypes from 'prop-types';


export default class Axis extends React.PureComponent{

    constructor(props){
      super(props);
    }

    axis={
       tickWidth:36,
    }
    state={
      playing:false,
      selectTick:0,
    }

    play(){}

    pause(){}    
    
    render(){
        let ticks=[
          {key:"1",click(){console.log(1)}},
          {key:"1",click(){console.log(1)}},
          {key:"1",click(){console.log(1)}},
          {key:"1",click(){console.log(1)}},
          {key:"1",click(){console.log(1)}}
        ]  
        
        let selectStyle={
          left:-7+this.state.selectTick*46
        } 
        return (
        <section className="axis-wrapper">
          <div className="axis axis-container">
           {this.props.controlls&& <div className="axis-controll" 
                 onClick={_=>this.setState({playing:!this.state.playing})} >
                 <span className={this.state.playing?"axis-pause icon-pause":"axis-play icon-play"}>
                 </span> 
              </div> } 
            <div className={"axis-bar horizen"}>
              <span className={"axis-selected icon-selected"} style={selectStyle}></span>
              <div className="axis-tick-group icon-line">
                {ticks.map((el,index)=>(<div key={"ticks"+index} className={`axis-tick ${index==ticks.length-1?"last":""}`}>
                  <span onClick={event=>{el.click(event);this.setState({selectTick:index})}} className={'icon-dot'}/>
                </div>))}
              </div>                        
            </div>
          </div>          
        </section>)
    }
}
// Axis.propTypes={
//     series:propTypes.Array,
//     velocity:propTypes.boolean
// }



