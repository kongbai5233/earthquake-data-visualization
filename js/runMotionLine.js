let dataLen
let nowData
let xScaleL
let yScaleL
let runData
let runTip
let   chartGroupRun
function nextYear(chartGroup){
    const data=runData[nowData]
    chartGroupRun.selectAll('.dot').remove()
    chartGroupRun.selectAll('.line').remove()
    chartGroupRun.selectAll('.textYear').remove()
    // console.log(data)
    chartGroupRun.append('g').attr('class', 'textYear')
        .attr('transform',`translate(${margin.left+100},${margin.top})`)
        .append('text')
        .text(`${data.year}年`)
        .style("fill", "red")
        .style("font-size", "3em")
        .style('font-weight', 'bolder')
        .style('text-anchor', 'middle')
        .style('opacity', '70%');

    chartGroupRun.append('g')
        .attr('transform',`translate(20,10)`)
        .append('text')
        .text("次")
        .style("fill", "black")
        .style("font-size", "2em")
        .style('text-anchor', 'middle')

    chartGroupRun.append('g')
        .attr('transform',`translate(${innerWidth-20},${innerHeight-20})`)
        .append('text')
        .text("年")
        .style("fill", "black")
        .style("font-size", "2em")
        .style('text-anchor', 'middle')

    const line = d3.line()
        .x(d => xScaleL(d.month))  // 使用月份作为 X 轴
        .y(d => yScaleL(d.value)); // 使用统计值作为 Y 轴

    // 绘制折线
    chartGroupRun.append('path')
        .data([data.values])  // yearData.values 包含 12 个月份的数据
        .attr('class', 'line')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#FF5733')  // 折线的颜色
        .attr('stroke-width', 2);

    // 绘制数据点
    chartGroupRun.selectAll('.dot')
        .data(data.values)  // yearData.values 包含每个月的数据
        .join('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScaleL(d.month))
        .attr('cy', d => yScaleL(d.value))
        .attr('r', 5)
        .attr('fill', '#FF5733')
        .on('mouseover', function (event, d){
            // console.log(d)
            runTip.show(d, this);
            d3.select(this).attr('fill', "black")
        })
        .on('mouseout', function (event, d){
            runTip.hide(d, this);  // 确保传入数据 d 和当前元素 this
            d3.select(this).attr('fill', '#FF5733')
        })

}

function runMotionLine(data) {
    const svgHeight = $('#svg4').height()
    const svgWidth = $('#svg4').width()
    const btnWidth = $('.svgFeature').height()+10;
    const innerWidth = svgWidth - margin.left - margin.right-50;
    const innerHeight = svgHeight - margin.top - margin.bottom-btnWidth;
    const svgLine=d3.select('#svg4').append('svg').attr('width',svgWidth).attr('height',svgHeight);
    // console.log(data)
     runTip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function( d) {
            // console.log(event,d)
            return `月份: ${d.month}<br/>次数: ${d.value}`;
        });


        svgLine.call(runTip);


     xScaleL = d3.scaleLinear().domain([1, 12]).range([0, innerWidth]).nice() // 月份从1到12
     yScaleL = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d3.max(d.values, v => v.value))])
        .range([innerHeight, 0]).nice()


    // // 定义 X 和 Y 轴
    const xAxis = d3.axisBottom(xScaleL).tickFormat(d => `${d}月`)
    const yAxis = d3.axisLeft(yScaleL)


    chartGroupRun = svgLine.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)



    chartGroupRun.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis)
        .selectAll('text')
        .style('font-size', '2em')
        .style('text-anchor', 'middle');

    chartGroupRun.append('g')
        .call(yAxis)
        .selectAll('text')
        .style('font-size', '2em');
     dataLen=data.length
     nowData=0
    runData=data
    // console.log(data[0].values[0].value)
    // console.log(xScale(data[0].values[0].month))
    nextYear();
}

function toNext(){
        nowData+=1;
        nextYear()
}

function toPre(){
        nowData-=1;
    nextYear()
}
let  intervalId;

function autoPlay(){

    if(isPlay){
        clearInterval(intervalId);	//清除定时器
        isPlay=false;

    }else{
        clearInterval(intervalId);	//清除定时器
        if(nowData===dataLen-1)return;

        intervalId = setInterval(function () {
            toNext()
            if(nowData===dataLen-1) clearInterval(intervalId);

        }, 100);
        isPlay=true;
    }
}

function toYear(year) {
    nowData=year-1900;
    // console.log(nowData)
    nextYear();
    updataBtn()
}