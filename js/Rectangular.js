
function runRectangular(data){
    const svgHeight = $('#svg3').height()
    const svgWidth = $('#svg3').width()
    const innerWidth = svgWidth - margin.left - margin.right;
    const innerHeight = svgHeight - margin.top - margin.bottom;
    const svgRect=d3.select('#svg3').append('svg').attr('width',svgWidth).attr('height',svgHeight);
    const tip1 = d3.tip()
        .attr('class', 'd3-tip').html(function (d) { return `震级：${d.MagType}<br/>次数: ${d.Count}`; });
    svgRect.call(tip1);
    // console.log(data)
    const yScale = d3.scaleLog()
        .domain([1, d3.max(data, d=>d.Count)])
        .range([innerHeight,0])
         .nice()

    const xScale = d3.scaleBand()
        .domain(data.map(d=>d.MagType))
        .range([0, innerWidth])
        .padding(0.1)

    const xAxis=d3.axisBottom(xScale)


    const yAxis=d3.axisLeft(yScale)

    const chartGroup = svgRect.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)




    chartGroup.append('g')
        .attr('transform',`translate(20,10)`)
        .append('text')
        .text("次")
        .style("fill", "black")
        .style("font-size", "2em")
        .style('text-anchor', 'middle')

    chartGroup.append('g').append('text')
        .attr('transform', `translate(${innerWidth/2}, 0)`)
        .text("1900-2014年震级统计")
        .style("fill", "red")
        .style("font-size", "3em")
        .style('text-anchor', 'middle');

    chartGroup.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('font-size','2em')
        .style('text-anchor', 'middle');

    chartGroup.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .style('font-size','1.2em')

    chartGroup.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => xScale(d.MagType))
        .attr('y', d => yScale(d.Count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => innerHeight - yScale(d.Count))
        .attr('fill', d => color[magTypeOrder[d.MagType]])
        .on('mouseover', function (event, d){
            // console.log(d)
            tip1.show(d, this);
            d3.select(this).attr('fill', "black")
        })
        .on('mouseout', function (event, d){
            tip1.hide(d, this);
           d3.select(this).attr('fill', d => color[magTypeOrder[d.MagType]])
        })

}
