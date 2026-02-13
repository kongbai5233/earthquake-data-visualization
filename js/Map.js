
function runMap(data,worldmeta){
    const svgHeight = $('#svg1').height()
    const svgWidth = $('#svg1').width()
    const innerWidth = svgWidth - margin.left - margin.right;
    const innerHeight = svgHeight - margin.top - margin.bottom;
    // Latitude:-20.003
    // Longitude:-70.8741
    // Place:"Chile"
    const projection = d3.geoEquirectangular();
    const pathGenerator = d3.geoPath().projection(projection);

    const svgMap=d3.select('#svg1').append('svg')
        .attr('width',svgWidth).attr('height',svgHeight)
        .style('background-color','#9bcffa');

    const tip1 = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(event, d) {
            return `纬度: ${d.Latitude}<br/>经度: ${d.Longitude}<br/>地区: ${d.Place}<br/>震级：${d.mag}`;
        });
    svgMap.call(tip1);
    // console.log(data)

    const chartGroup = svgMap.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
        projection.fitSize([innerWidth, innerHeight], worldmeta);

        const tip2 = d3.tip()
            .attr('class', 'd3-tip')
            .html((event, d)=> {
                return `地区: ${d.properties.name}`;
            });
        svgMap.call(tip2);

    chartGroup.append('g')
        .attr('transform',`translate(${innerWidth/2},0)`)
        .append('text')
        .text("地震地图可视化统计")
        .style("fill", "red")
        .style("font-size", "2.5em")
        .style('text-anchor', 'middle')

        const paths = chartGroup.selectAll('path')
            .data(worldmeta.features, d => d.properties.name)
            .join('path')
            .attr('d', pathGenerator)
            .attr('fill','#f0f3fa')
            .attr('stroke', '#cebf8a')
            .attr('stroke-width', 1)
            .on('mouseover',function (event, d){
                // console.log(event)
                // console.log(d)
                tip2.show(event, d)
                d3.select(this)
                    .attr("fill", "black")
                    .attr("opacity", 0.4)
                    .attr("stroke", "white")
                    .attr("stroke-width", 2);

            })
            .on('mouseout', function (event, d){
                tip2.hide(event, d)
                d3.select(this)
                    .attr('fill', '#f0f3fa')
                    .attr('opacity', 1)
                    .attr('stroke', '#cebf8a')
                    .attr('stroke-width', 1);
            })

    // console.log(data)
        const circle = chartGroup.selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
            .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
            .attr('r', d => Math.max(d.magType*0.2, 0.6))
            .attr('fill', d=> color[magTypeOrder[d.mag]])
            .attr('stroke', 'black')
            .attr('stroke-width', 0.2)
            .attr('opacity', 0.5)
            .on('click', function (event, d) {
                // console.log(event);
                // console.log(d);
                tip1.show(event, d);
                d3.select(this)
                    .attr('fill', 'black')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 0.2)
                    .attr('opacity', 0.5)

            })
            .on('mouseout', function (event, d){
                tip1.hide(event, d);
                d3.select(this)
                    .attr('fill',  d=> color[magTypeOrder[d.mag]])
                    .attr('stroke', 'black')
                    .attr('stroke-width', 0.2)
                    .attr('opacity', 0.5)
            });





    const selectedCountries = ["Algeria","China", "United States", "Russia", "Mexico","Brazil","Canada","Greenland","Australia","Antarctica",'India'];

    const textLabels = chartGroup.selectAll('text')
        .data(worldmeta.features)
        .join('text')
        .attr('transform', function(d) {
            const centroid = pathGenerator.centroid(d);
            return `translate(${centroid[0]}, ${centroid[1]})`;
        })
        .attr('class', 'map-label')
        .attr('text-anchor', 'middle')
        .attr('font-size', "5px")
        .attr('fill', 'black')
        .text(d => {
            if(d.properties.name==="United States of America")d.properties.name="United States"
            if (selectedCountries.includes(d.properties.name)) {
                return d.properties.name; // 只有在选定的国家中显示名字
            }
        })

// 创建缩放行为
    const zoom = d3.zoom()
        .scaleExtent([1, 6]) // 设置缩放范围，最小1倍，最大6倍
        .on('zoom', (event) => {
            chartGroup.attr('transform', event.transform); // 更新缩放和平移
        });

// 将缩放行为绑定到 SVG
    svgMap.call(zoom);

}