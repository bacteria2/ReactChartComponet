/**
 * Created by lenovo on 2017/11/21.
 */
import React from "react";
import {arc, pie,line} from "d3-shape";
import {interpolateNumber } from "d3-interpolate";
import {select} from "d3-selection";
import {transition} from 'd3-transition'

/**
 * 油量表
 * @size:表盘区域大小
 * @min:最小值
 * @max:最大值
 * @majorTicks:大分格数量
 * @minaorTicks:小分格数量
 * @transitionDuration:
 * @color:表盘颜色
 * @background:表盘背景色
 * */
class OilGauge extends React.PureComponent {

    constructor({value,color,size,min,max,textColor,
        strokeWidth,strokeColor,index,text,
                    majorTicks,minorTicks,transitionDuration,background}) {

        super()
        this.config={
            strokeWidth,strokeColor,size,color,index,text,textColor,
            min,max,majorTicks,minorTicks,transitionDuration,background,
            range:max-min,
            radius:size * 0.97 / 2,
            cx:size/2,
            cy:size/2
        }
        this.state.value=value;
    }
    config={}

    state={
        value:0,
        prevValue:0,
    }

    componentWillReceiveProps(nextProps){
        let state={prevValue:this.state.value}
        state.value=nextProps.value>this.config.max?this.config.max:nextProps.value<this.config.min?this.config.min:nextProps.value;
        this.setState(state)
    }


    componentDidMount() {
        this.renderChart();
    }

    render() {
        if(this.svg){
            this.update()
        }
        return <div id='oilContainer'/>
    }

    renderChart() {

        let arcInstance = arc()
            .innerRadius(this.config.radius - 0.15*this.config.size)
            .outerRadius(this.config.radius)
            .startAngle(this.valueToRadians(-0.33*this.config.max))
            .endAngle(this.valueToRadians(0.67*this.config.max));

        let divideBox = arc()
            .innerRadius(0)
            .outerRadius(this.config.radius - 0.23*this.config.size)

        let pieFunc = pie()
            .startAngle(this.valueToRadians(-0.33*this.config.max))
            .endAngle(this.valueToRadians(0.79*this.config.max))
            .sort(null);


        this.svg = select('#oilContainer')
            .append('svg')
            .attr('width', this.config.size)
            .attr('height', this.config.size)

        if(this.config.background)
            this.svg .append("circle")
                .attr("cx", this.config.cx)
                .attr("cy", this.config.cy)
                .attr("r",  this.config.radius)
                .style("fill", this.config.background)
                .style("stroke", "#e0e0e0")
                .style("stroke-width", "2px");


        let panelGroup = this.svg .append('g').attr('transform', `translate(${this.config.cx},${this.config.cy})`),
            pointerContainer = this.svg .append('g').attr("id", "pointerContainer").attr('transform', `translate(${this.config.cx},${this.config.cy})`);

        //panelGroup
        //添加渐变
        panelGroup.append('defs').append('radialGradient')
            .attr('id', "oilGauge"+this.config.index)
            .attr("cx", "50%")
            .attr("cy", "80%")
            .attr("r", "55%")
            .attr("fx", "50%")
            .attr("fy", "80%")
            .selectAll('stop').data([{
            style: {
                "stopOpacity": "0.3",
                'stopColor': this.config.color
            },
            offset: '65%'
        }, {
            offset: '100%',
            style: {
                "stopOpacity": "1",
                "stopColor": this.config.color
            }
        }]).enter().append('stop')
            .attr('offset', function (d, i) {
                return d.offset
            })
            .style('stop-opacity', function (d, i) {
                return d.style.stopOpacity
            })
            .style('stop-color', function (d, i) {
                return d.style.stopColor
            });
        //添加环形表盘
        panelGroup.append('path')
            .style('fill', `url(#oilGauge${this.config.index})`)
            .attr('d', arcInstance)
            .attr('stroke', this.config.strokeColor)
            .attr('stroke-width', this.config.strokeWidth);
        //表盘分隔
        panelGroup.selectAll('#notExist').data(pieFunc([0.9, 1.1, 1.1, 1.1, 1,1])).enter()
            .append('path')
            .attr('d', divideBox)
            .attr("id", function (d, i) {
                return "arc-" + i;
            })
            //  .attr('stroke', "#7282ff")
            //.attr('stroke-width', '2')
            .attr('fill-opacity', '0');

        panelGroup.selectAll('#notExist').data(pieFunc([0, 20, 40, 60, 80,100]))
            .enter()
            .append('text')
            .attr('font-size', Math.round(this.config.size / 16)+'px')
            .attr('font-family', '微软雅黑')
            .attr('fill', '#fff')
            .append("textPath")
            .attr('text-anchor','start')
            .attr("xlink:href", function (d, i) {
                return "#arc-" + i;
            })
            .text(function (d, i) {
                return d.data
            });

        //指针组
        //表盘指针
        pointerContainer.selectAll("path")
            .data([this.buildPointPath(0)])
            .enter()
            .append("path")
            .attr("d", line().x(function (d) {
                return d.x
            }).y(function (d) {
                return d.y
            }))
            .style("fill", "#dc3912")
            .style("stroke", "#c63310")
            .style("fill-opacity", 0.7)

        //指针下部文字
        let text = pointerContainer.append('text')
            .attr('font-family', '微软雅黑')
            .attr('fill', this.config.color)
            .style('text-anchor', 'middle');
        text.append('tspan')
            .attr('font-size',Math.round(this.config.size/12)+'px')
            .attr('y', this.config.cy*0.42)
            .attr('x', '0')
            .attr('fill', this.config.textColor)
            .text(this.config.text);
        text.append('tspan')
            .attr('font-size',Math.round(this.config.size/10)+'px')
            .attr('y', this.config.cy*0.78)
            .attr('class','data-label')
            .attr('x', '0')
            .style('text-anchor', 'middle')
            .text(`0%`);

        //AXIS label
        var majorDelta = this.config.range / (this.config.majorTicks - 1);
        var fontSize = Math.round(this.config.size / 16);
        for (let major = this.config.min; major <= this.config.max; major += majorDelta) {
            var minorDelta = majorDelta / this.config.minorTicks;
            for (let minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor +=
                minorDelta) {
                let mPoint1 = this.valueToPoint(minor, 0.85);
                let mPoint2 = this.valueToPoint(minor, 1);

                this.svg.append("line")
                    .attr("x1", mPoint1.x)
                    .attr("y1", mPoint1.y)
                    .attr("x2", mPoint2.x)
                    .attr("y2", mPoint2.y)
                    .style("stroke", "#fff")
                    .style("stroke-width", "1px");
            }

            let point1 = this.valueToPoint(major, 0.85);
            let point2 = this.valueToPoint(major, 1);

            if(major!=this.config.min&&major!=this.config.max){

                this.svg .append("line")
                    .attr("x1", point1.x)
                    .attr("y1", point1.y)
                    .attr("x2", point2.x)
                    .attr("y2", point2.y)
                    .style("stroke", "#fff")
                    .style("stroke-width", "2px");
            }

        }

       this.update()
    }

    update() {
        let pointerContainer = this.svg.select("#pointerContainer");
        let value=this.state.value;
        let prevValue=this.state.prevValue;
        let max=this.config.max;


        pointerContainer.selectAll(".data-label")
            .transition()
            .duration(this.config.transitionDuration)
            .tween('text',function(){
                var ele=select(this);
                var numbers=interpolateNumber(prevValue,value)
                return function(step){
                    let text=(numbers(step)<1&&numbers(step)>0?'<1':Math.round(numbers(step)*100/max))+"%"
                    ele.text(text)
                }
            })

        var pointer = pointerContainer.selectAll("path");
        pointer.transition()
            .duration(this.config.transitionDuration)
            .attrTween("transform",  _=>{
                let targetRotation = this.valueToDegrees(value)+45;
                let currentRotation = this.valueToDegrees(prevValue)+45;
                return function (step) {
                    var rotation = currentRotation + (targetRotation - currentRotation) * step;
                    return "rotate(" + rotation + ")";
                }
            });
    }

    buildPointPath(value){
        let delta = this.config.range / this.config.majorTicks-1,
        valueToPoint=(value, factor)=> {
            let point = this.valueToPoint(value, factor);
            point.x -= this.config.cx;
            point.y -= this.config.cy;
            return point;
        };

        let head = valueToPoint(value- 0.5, 0.5),
            head1 = valueToPoint(value + 0.5, 0.5),
            tailValue = value - (this.config.range * (1 / (270 / 360)) / 2),
            tail =valueToPoint(value-4-(this.config.range * (1 / (270 / 360)) / 2),0.1),
            tail1 = valueToPoint(value+4 - (this.config.range * (1 / (270 / 360)) / 2),0.1);

        return [head,  tail1, tail,head1, head]
    }

    valueToDegrees(value) {
        return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
    }

    valueToRadians(value) {
        return this.valueToDegrees(value) * Math.PI / 180;
    }

    valueToPoint(value, factor) {
        return {
            x: this.config.cx - this.config.radius * factor * Math.cos(this.valueToRadians(value)),
            y: this.config.cy - this.config.radius * factor * Math.sin(this.valueToRadians(value))
        };
    }
}
OilGauge.defaultProps = {
    color: "rgb(255, 237, 0)",
    strokeColor:"#ffd900",
    strokeWidth:4,
    size: 400,
    min: 0,
    max: 100,
    majorTicks: 6,
    minorTicks: 0,
    transitionDuration: 500,
    index:0,
    text:'出行率',
    textColor:"#3f9fff"
}

OilGauge.propTypes = {}

export default OilGauge