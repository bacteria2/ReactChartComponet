import { arc, pie, line} from 'd3-shape';
import { interpolate} from "d3-interpolate";
import { select} from "d3-selection";
import { transition} from 'd3-transition';
import './pie.css';



function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

function D3Pie({
    legend,
    title,
    height=400,
    width=400,
    colorList=['#ffaa26', '#ffbbaa', '#aa3fff', "#addc11", "#fff"],
    series=["测试","测试1","测试1c","测试1d","测试1e"],
    id='t'+new Date().getTime(),
    data=[10, 20, 30, 40, 50],
    position:{
        xDiff=0,
        yDiff=0,
    }={},
    el
}) {
    let size=Math.min(height,width)/2;

    let total = data.reduce((a, b) => a + b);    
    let innerRadius=size*0.5,    
       arcOut=size*0.7,
       arcHoverOut=size*0.73,
       textOut=size*0.7;

    let arcT = arc()
        .innerRadius(innerRadius);

    let arcInstance = arc()
        .innerRadius(innerRadius)
        .outerRadius(arcOut);

    let outArc = arc()
        .innerRadius(textOut)
        .outerRadius(textOut);

    let pieFunc = pie()
        .padAngle(0.04);

    //clear
    select(el).select('svg').remove();
    let svg = select(el)
        //.remove('svg')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        //.attr('viewBox', `0 0 ${height} ${width}`);


    let pieGroup = svg.append('g').attr('transform', `translate(${size+xDiff},${size+yDiff})`);
    let arcGroup=pieGroup.append('g');
    //draw arc
    drawArc(arcGroup)
    function drawArc(svg) {
        svg.append('defs').selectAll('radialGradient')
            .data(colorList).enter()
            .append('radialGradient')
            .attr('gradientUnits', "userSpaceOnUse")
            .attr("cx", "0")
            .attr("cy", "0")
            .attr("r", size*0.8)
            .attr('id', function (d, i) {
                return id+"pieGradient" + i
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

            svg.select('defs').selectAll('linearGradient')
            .data(colorList).enter()
            .append('linearGradient')
            .attr('id', function (d, i) {
                return id+'pieLinearGradient' + i;
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
            .attr('offset', function (d) {
                return d.offset
            })
            .attr('stop-color', function (d) {
                return d.stopColor
            })
            .attr('stop-opacity', function (d) {
                return d.stopOpacity
            })

            svg.selectAll('path')
            .data(pieFunc(data))
            .enter()
            .append('path')
            .attr('d', arcInstance)
            .each(function (d) {
                d.outerRadius = arcHoverOut
            })
            .on("mouseover", arcTween(arcHoverOut, 0, true))
            .on("mouseout", arcTween(arcOut,arcHoverOut))
            .attr('stroke', function (d, i) {
                return colorList[i]
            })
            .attr('stroke-width', 2)
            .style('fill', function (d, i) {
                return `url(#${id}pieGradient${i})`
            })

    }

    //draw outline
    outLine(arcGroup);

    function outLine(svg, lineOption) {
        let lineGroup = svg.append('g');
        lineGroup.selectAll('g')
            .data(pieFunc(data)).enter().append('g')
            .attr('id', function (d, i) {
                return id+'SimplePieLine' + i
            })
            .style('display', 'none')
            .append('polyline')
            .attr('points', function (d) {           
                var pos = outArc.centroid(d);
                pos[0] = size * 0.9 * (midAngle(d) < Math.PI ? 1 : -1);
                return [arcInstance.centroid(d), outArc.centroid(d), pos]
            }).attr('stroke', function (d, i) {
                return colorList[i];
            })
            .attr('fill','transparent')
            .select(function () {
                return this.parentNode
            })
            // lineGroup.selectAll('text').data(pieFunc(data)).enter()
            .append('text')
            .text(function (d) {                
                let number = d.value / total;
                let text = number < 0.01 ? "<1%" : (number * 100).toFixed(1) + "%";
                return text
            }).attr('x', function (d) {
                if (midAngle(d) < Math.PI) {
                    return size*0.7 * 0.95;
                }
                return size*0.95 * -1;
            })
            .attr('y', function (d) {
                return outArc.centroid(d)[1]
            })
            .attr('dy', -10)
            .attr('fill', function (d, i) {
                return colorList[i]
            })
    }

    //draw text
    centerText(arcGroup, title);

    function centerText(svg, {
        text = '税收占比',
        fontSize = 32,
    } = {}) {
        svg.append('text')
            .attr('font-family', '微软雅黑')
            .attr('y',fontSize/2)
            .attr('fill', '#fff')
            .attr('font-size', fontSize)
            .style('text-anchor', 'middle')
            .text(text);
    }

    //draw legend
    drawLegend(pieGroup, legend);

    function drawLegend(svg, {
        position = 'bottom',
        vertical = false,
        fontSize=16,
        xDiff=0,
        yDiff=0,
        show=true,
        rectHeight = 12,
        rectWidth=20,
        spacing = 8,
        gapBetween = 2
    } = {}) {
        if(!show){
           return 
        }        
      
        let startPoint={
            top:[0+xDiff,-size+yDiff],
            bottom:[0+xDiff,size*0.55+yDiff],
            left:[-size+xDiff,-size*0.75+yDiff],
            right:[size*0.55+xDiff,-size*0.75+yDiff]};

        let start=startPoint[position];
        let legend = svg.selectAll('.legend')
            .data(series)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {                
                let height = rectWidth + spacing;               
                let horz;
                let vert;               
                if(vertical){
                    horz = start[0] + 40 - rectWidth;
                    vert = start[1] + i * (height + gapBetween);
                }else{
                    let diff=(series.length)*rectWidth;
                    horz = start[0] -diff + i *2 * (rectWidth + gapBetween);
                    vert = start[1] + 40 - rectHeight;
                }
              
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', rectWidth)
            .attr('height', rectHeight)
            .style('fill', function (d, i) {
                return `url("#${id}pieLinearGradient${i}")`;
            })
            .style('stroke', function (d, i) {
                return colorList[i];
            });

        legend.append('text')
            .attr('class', 'legend')
            .attr('fill', "#4fbbfd")
            .attr('x', rectWidth + spacing)
            .attr('y', rectHeight)
            .style('font-size',fontSize)
            .text(function (d) {
                return d;
            });
        //arcGroup的偏移
        //arcGroup.attr('transform', `translate(${start[2]},${start[3]})`)
    }

    function arcTween(outerRadius, delay, text) {
        return function (x, i) {
            //显示文字
            if (text) {
                select(`#${id}SimplePieLine${i}`).style('display', 'block');
            } else {
                select(`#${id}SimplePieLine${i}`).style('display', 'none');
            }
            select(this).transition().delay(delay).attrTween("d", function (d) {
                let i = interpolate(d.outerRadius, outerRadius);
                return function (t) {
                    d.outerRadius = i(t);
                    return arcT(d);
                };
            });
        };
    }

}

export default class SimplePieWrapper {
    constructor(el, config = {}) {
       if (!el)
           throw new Error("el is null,please specified an element container")
       this.el=el;
       D3Pie({...config,el});
      
    }   
        
    setOption=(option)=>{
        let el=this.el;
        D3Pie({...option,el});
    }
}