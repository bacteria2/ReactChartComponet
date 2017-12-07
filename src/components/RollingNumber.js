/**
 * Created by lenovo on 2017/11/16.
 */
import React from "react";
import styled, {keyframes} from "styled-components";
import PropTypes from "prop-types";
import {is, List} from "immutable";

const flipTop = keyframes`
        0% {
        	transform: perspective(400px) rotateX(0deg);	    
	    }
        100% {
     		transform: perspective(400px) rotateX(-90deg);	     	
     	}`,
    flipBottom = keyframes`
        0% {
        	transform: perspective(400px) rotateX(90deg);	        	
        }
        100% {
        	transform: perspective(400px) rotateX(0deg);        	
        }`;
const NumberList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const size = {
    small: {
        height: 23,
        width: '16px',
        fontSize: '21px',
        wrapMargin:'0 2px',
        dotHeight:'12px',
        dotFontSize:'36px'
    },
    'default': {
        height: 38,
        width: '24px',
        fontSize: '34px',
        wrapMargin:'0 5px',
        dotHeight:'28px',
        dotFontSize:'50px'
    },
    big: {
        height: 52,
        width: '36px',
        fontSize: '45px',
        wrapMargin:'0 7px',
        dotHeight:'41px',
        dotFontSize:'67px'
    }
}


let previousBottomAndShadow = 'z-index: 1;',
    previousTopAndShadow = `transform-origin: 50% 100%;animation: ${flipTop} 0.3s ease-in both;`,
    activeBottom = `z-index: 2;transform-origin: 50% 0%;animation: ${flipBottom} 0.3s 0.3s ease-out both;`,
    activeTop = 'z-index:1;',
    DigitWrap = styled.div` 
        height:${({height})=>height+'px'};
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        border: 1px solid #111111;
       ${props => !props.pre ? 'background-color: #4d9ebb;' : 'background-color: #6a909e;'}       
        width: ${({width})=>width};
        display: inline-block;        
        margin:${({wrapMargin})=>wrapMargin};
        position:relative;`,
    DigitBase = styled.div`  
        position:absolute;
        left: 0;
        height:50%;
        z-index: 0;
        box-sizing: border-box;
        width:${({width})=>width};
        overflow:hidden;
        ${props => !props.pre ? 'background-color: #4d9ebb;' : 'background-color: #6a909e;'}  
        border-bottom:1px solid #195072;`,
    DigitBox = DigitBase.extend`
       &.top{
          top:0;       
          border-radius:4px 4px 0 0;    
       } 
       &.bottom{
          bottom:0;      
          border-radius:0 0 4px 4px;
          span{
             margin-top:${({height})=>'-'+height/2+'px'};
           }    
        }       
       .active &.top{
          ${activeTop}
       } 
       .active &.bottom{
          ${activeBottom} 
       }
       .previous &.top{
          ${previousTopAndShadow}
          z-index:3;
       } 
       .previous &.bottom{
          ${previousBottomAndShadow}
       } 
        
       & span{
          line-height: ${({height})=>height+'px'};
          font-size: ${({fontSize})=>fontSize};
          width:${({width})=>width};
          overflow: hidden;   
          color: #fff; 
          font-family: "Helvetica Neue", Helvetica, sans-serif;
          font-weight: bold;
          text-align:center;
          display: block;}`,
    DigitShadow = DigitBase.extend` 
        transition: opacity 2s ease-in;      
        &.top{
           top:0;
           border-radius:4px 4px 0 0; 
        }     
        &.bottom{
           bottom:0;
           width:0;
           border-radius:0 0 4px 4px;  
        }  
        .previous &.top{
           ${previousTopAndShadow}
           z-index:2;
        } 
        .previous &.bottom{
           ${previousBottomAndShadow}  
        }`,
    AnimeContainer = styled.div`
        position:absolute;
        height:100%;`;


class Digit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: parseInt(props.number),
            previousIndex: NaN,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (parseInt(nextProps.number) !== parseInt(this.props.number)) {
            this.setState({
                activeIndex: parseInt(nextProps.number),
                previousIndex: parseInt(this.props.number),
            })
        }
    }

    render() {
        let sizeAttr=size[this.props.size==='small'?'small':this.props.size==='big'?'big':"default"];
        let attrs={
            pre:Number.isNaN(this.state.activeIndex),
            ...sizeAttr
        }
        return (
            <DigitWrap {...attrs}>
                { NumberList.map(number =>
                    <AnimeContainer
                        className={this.state.activeIndex === number ? "active" : this.state.previousIndex === number ? "previous" : ""}
                        key={'number' + number}>
                        <DigitBox {...attrs} top className="top">
                            <span>{attrs.pre ? 0 : number}</span>
                        </DigitBox>
                        {!attrs.pre && <DigitShadow top className="top"/>}
                        <DigitBox {...attrs} bottom className="bottom">
                            <span>{attrs.pre ? 0 : number}</span>
                        </DigitBox>
                        <DigitShadow {...attrs} bottom className="bottom"/>
                    </AnimeContainer>
                )
                }
            </DigitWrap>
        )
    }
}


let Dot = DigitWrap.extend`
    &:before{
      content: '.';
      position: absolute;
      font-size:${({dotFontSize})=>dotFontSize};
      color: white;
      text-align: center;
      line-height: ${({dotHeight})=>dotHeight};
    }`,
    RollingWrapper = styled.div`
       
    `

/**
 * 数字滚动变化模块
 * 输入数值或者字符串,根据当前设定的长度,补足不足的位数，超过的位数从左开始截取
 * @param  length 面板数字长度(整数部分),value: 输入值, type:面板类型, fix:小数点保留位数,
 * */

class RollingNumber extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            intValue: this.intValueSubStr(props.value),
            decimalValue: this.decimalValueSubStr(props.value)
        }
    }

    componentWillReceiveProps({value}) {
        let intValue = this.intValueSubStr(value),
            decimalValue = this.decimalValueSubStr(value),
            updateLoad = {};

        if (!is(intValue, this.state.intValue))
            updateLoad.intValue = intValue;
        if (!is(decimalValue, this.state.decimalValue))
            updateLoad.decimalValue = decimalValue;
        if (updateLoad.intValue || updateLoad.decimalValue)
            this.setState(updateLoad)
    }


    /**
     * 将输入的整数部分转换成字符串
     * */
    intValueSubStr(input) {
        let value = List(),
            numberString = parseInt(input).toFixed(0),
            lenDiff = this.props.length - numberString.length;
        //如果length比较长,则填补多余的0,
        if (lenDiff > 0) {
            for (let len = 0; len < lenDiff; len++) {
                value = value.push("x")
            }
            for (let len = 0; len < numberString.length; len++) {
                value = value.push(numberString[len])
            }
        }
        //如果字符串比较长，则以length为准截取
        if (lenDiff <= 0) {
            for (let len = 0; len < this.props.length; len++) {
                value = value.push(numberString[len])
            }
        }
        return value;
    }

    /**
     * 将输入的小数部分转换成字符串
     * */
    decimalValueSubStr(input) {
        let value = List();
        if (this.props.fixed <= 0) {
            return value;
        }
        let decimalString = parseFloat(input).toFixed(this.props.fixed);
        decimalString = decimalString.substring(decimalString.indexOf('.') + 1, decimalString.length);

        for (let len = 0; len < this.props.fixed; len++) {
            value = value.push(decimalString[len]);
        }
        return value;
    }


    /**
     * 根据length和fix生成面板
     * */
    digitGenerator(length, fix) {
        let list = [];
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                list.push(<Digit size={this.props.size} number={this.state.intValue.get(i, 0)} key={'intValue' + i}/>)
            }
        }
        if (fix > 0) {
            let sizeAttr=size[this.props.size==='small'?'small':this.props.size==='big'?'big':"default"]
            list.push(<Dot {...sizeAttr} key="dot" />)
            for (let i = 0; i < this.props.fixed; i++) {
                list.push(<Digit size={this.props.size} number={this.state.decimalValue.get(i, 0)} key={'decimal' + i}/>)
            }
        }
        return list
    }

    render() {
        return (
            <RollingWrapper>
                {this.digitGenerator(this.props.length, this.props.fixed)}
            </RollingWrapper>)
    }
}

RollingNumber.defaultProps = {
    length: 4,
    value: '0000',
    fixed: 0,
    unit: ""
}

RollingNumber.propTypes = {
    length: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fixed: PropTypes.number,
    unit: PropTypes.string
}

export default RollingNumber