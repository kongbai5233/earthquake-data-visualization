
function runLineChart(data ){
    const svgHeight = $('#svg2').height()
    const svgWidth = $('#svg2').width()
    const innerWidth = svgWidth - margin.left - margin.right;
    const innerHeight = svgHeight - margin.top - margin.bottom;
    const svgLine=d3.select('#svg2').append('svg').attr('width',svgWidth).attr('height',svgHeight);
    const tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) {
            return `年份: ${d.Year}<br/>次数: ${d.Count}`;
        });
    svgLine.call(tip);
    // console.log(data)

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
        .range([0, innerWidth])


    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .range([innerHeight, 0])
        .nice();

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));
        // .ticks(d3.max(data, d => d.Count) / 10)  // 设置刻度间隔为10年;
    const yAxis = d3.axisLeft(yScale);

    const chartGroup = svgLine.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    chartGroup.append('g')
        .attr('transform',`translate(${innerWidth/2},0)`)
        .append('text')
        .text("1900-2014年地震次数统计")
        .style("fill", "red")
        .style("font-size", "2.5em")
        .style('text-anchor', 'middle')

    chartGroup.append('g')
        .attr('transform',`translate(20,10)`)
        .append('text')
        .text("次")
        .style("fill", "black")
        .style("font-size", "2em")
        .style('text-anchor', 'middle')

    chartGroup.append('g')
        .attr('transform',`translate(${innerWidth-20},${innerHeight-20})`)
        .append('text')
        .text("年")
        .style("fill", "black")
        .style("font-size", "2em")
        .style('text-anchor', 'middle')

    chartGroup.append('g')
        .attr('transform',`translate(${innerWidth/2},0)`)
        .append('text')
        .text("1900-2014年地震次数统计")
        .style("fill", "red")
        .style("font-size", "2.5em")
        .style('text-anchor', 'middle')


    chartGroup.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis)
        .selectAll('text')
        .style('font-size', '2em')
        .style('text-anchor', 'middle');


    chartGroup.append('g')
        .call(yAxis)
        .selectAll('text')
        .style('font-size', '2em');


    const line = d3.line()
        .x(d => xScale(d.Year))
        .y(d => yScale(d.Count));


    chartGroup.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#FF5733') // 折线的颜色
        .attr('stroke-width', 2);

    chartGroup.selectAll('.dot')
        .data(data)
        .join('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.Year))
        .attr('cy', d => yScale(d.Count))
        .attr('r', 5)
        .attr('fill', '#FF5733')
        .on('mouseover', function (event, d){
            // console.log(d)
            tip.show(d, this);
            d3.select(this).attr('fill', "black")
        })
        .on('mouseout', function (event, d){
            tip.hide(d, this);  // 确保传入数据 d 和当前元素 this
            d3.select(this).attr('fill', '#FF5733')
        })
        .on('contextmenu',function (e, data) {

        e.preventDefault();

        nowBtn = 3;
        clickFeature();
        divUpdate();

        toYear(data.Year);
    })
}

