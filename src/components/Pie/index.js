import React from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
    arc,
    pie,
    line
} from 'd3-shape';
import {
    interpolate
} from "d3-interpolate";
import {
    select
} from "d3-selection";
import {
    transition
} from 'd3-transition';
import './pie.css';

let height = 400,
    width = 500,
    data = [10, 20, 30, 40, 50],
    colorList = ['#ffaa26', '#ffbbaa', '#aa3fff', "#addc11", "#fff"],
    series=["a","b","c","d","e"];
let total = data.reduce((a, b) => a + b);
var arcT = arc()
    .innerRadius(90);


function arcTween(outerRadius, delay, text) {
    return function (x, i) {
        //显示文字
        if (text) {
            select("#SimplePieLine" + i).style('display', 'block');
        } else {
            select("#SimplePieLine" + i).style('display', 'none');
        }
        select(this).transition().delay(delay).attrTween("d", function (d) {
            var i = interpolate(d.outerRadius, outerRadius);
            return function (t) {
                d.outerRadius = i(t);
                return arcT(d);
            };
        });
    };
}

function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

function D3Pie() {
    let arcInstance = arc()
        .innerRadius(90)
        .outerRadius(140);
    let outArc = arc()
        .innerRadius(170)
        .outerRadius(170);

    let pieFunc = pie()
        .padAngle(0.04);


    let svg = select("#simplePie")
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', '0 0 400 400');


    let pieGroup = svg.append('g').attr('transform', `translate(200,200)`);

    pieGroup.append('defs').selectAll('radialGradient')
        .data(colorList).enter()
        .append('radialGradient')
        .attr('gradientUnits', "userSpaceOnUse")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", "160")
        .attr('id', function (d, i) {
            return "pieGradient" + i
        })
        .selectAll('stop').data(function (d, i) {
            return [{
                    style: {
                        "stopOpacity": "0.3",
                        'stopColor': d
                    },
                    offset: '30%'
                },
                {
                    style: {
                        "stopOpacity": "0.95",
                        'stopColor': d
                    },
                    offset: '100%'
                }
            ]

        }).enter().append('stop')
        .attr('offset', function (d) {
            return d.offset
        })
        .style('stop-opacity', function (d) {
            return d.style.stopOpacity
        })
        .style('stop-color', function (d) {
            return d.style.stopColor
        })

    pieGroup.select('defs').selectAll('linearGradient')
    .data(colorList).enter()
    .append('linearGradient')
    .attr('id',function(d,i){
        return 'pieLinearGradient'+i;
    })
    .attr('id',function(d,i){
        return 'pieLinearGradient'+i;
    })
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%")
    .selectAll('stop').data(function (d, i) {
        return [{
               "stopOpacity": "0.3",
               'stopColor': d,
                offset: '30%'
            },
            {
                "stopOpacity": "0.95",
                'stopColor': d,
                offset: '100%'
            }
        ]
    }).enter()
    .append('stop')
    .attr('offset',function(d){return d.offset})
    .attr('stop-color',function(d){return d.stopColor})
    .attr('stop-opacity',function(d){return d.stopOpacity})

    pieGroup.selectAll('path')
        .data(pieFunc(data))
        .enter()
        .append('path')
        .attr('d', arcInstance)
        .each(function (d) {
            d.outerRadius = 180
        })
        .on("mouseover", arcTween(150, 0, true))
        .on("mouseout", arcTween(140, 150))
        .attr('stroke', function (d, i) {
            return colorList[i]
        })
        .attr('stroke-width', 2)
        .style('fill', function (d, i) {
            return `url(#pieGradient${i})`
        })


    let textArea = pieGroup.append('text')
        .attr('font-family', '微软雅黑')
        .attr('y', 16)
        .attr('fill', '#fff')
        .attr('font-size', '32px')
        .style('text-anchor', 'middle')
        .text('税收占比');


    let lineGroup = pieGroup.append('g');
    lineGroup.selectAll('g')
        .data(pieFunc(data)).enter().append('g')
        .attr('id', function (d, i) {
            return 'SimplePieLine' + i
        })
        .style('display', 'none')
        .append('polyline')
        .attr('points', function (d) {
            console.log(d);
            var pos = outArc.centroid(d);
            pos[0] = 180 * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            return [arcInstance.centroid(d), outArc.centroid(d), pos]
        }).attr('stroke', function (d, i) {
            return colorList[i];
        }).select(function () {
            return this.parentNode
        })
        // lineGroup.selectAll('text').data(pieFunc(data)).enter()
        .append('text')
        .text(function (d) {
            console.log(d, total);
            let number = d.value / total;
            let text = number < 0.01 ? "<1%" : (number * 100).toFixed(1) + "%";
            return text
        }).attr('x', function (d) {
            if (midAngle(d) < Math.PI) {
                return 140 * 0.95;
            }
            return 180 * 0.95 * -1;
        })
        .attr('y', function (d) {
            return outArc.centroid(d)[1]
        })
        .attr('dy', -10)
        .attr('fill', function (d, i) {
            return colorList[i]
        })

    // Draw legend
    let legendRectSize = 18,
        legendSpacing =8 ,
        gapBetweenGroups = 20,
        spaceForLabels   = 150;

    let legend = pieGroup.selectAll('.legend')
        .data(series)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = -gapBetweenGroups / 2;
            var horz = spaceForLabels  + 40 - legendRectSize;
            var vert = -150+i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize/2)
        .style('fill', function (d, i) {
            return `url("#pieLinearGradient${i}")`;
        })
        .style('stroke', function (d, i) {
            return colorList[i];
        });

    legend.append('text')
        .attr('class', 'legend')
        .attr('fill',"#4fbbfd")
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) {
            return d;
        });


}

function legend() {

}
class SimplePie extends React.PureComponent {
    constructor(props) {
        super(props)
        if (props.bindWrapper) {
            props.bindWrapper(this);
        }
    }

    componentDidMount() {
        D3Pie()
    }

    render() {
        return <div id = 'simplePie' / >


    }

}

export default class SimplePieWrapper {
    constructor(el, config = {}) {
            if (!el)
                throw new Error("el is null,please specified an element container")
            if (typeof el == 'string')
                ReactDOM.render( < SimplePie bindWrapper = {
                        this.registry
                    } { ...config
                    }
                    />, document.getElementById(el));
                    else
                        ReactDOM.render( < SimplePie bindWrapper = {
                                this.registry
                            } { ...config
                            }
                            />, el);
                        }

                    registry = ins => {
                        this.instance = ins;
                    }

                    update(value) {
                        if (this.instance)
                            this.instance.setState({
                                value
                            })
                    }
                }