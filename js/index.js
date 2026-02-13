let margin = {top:60, right:10, bottom:40, left:50};
let mapData={}
let LineData={}
let RectangularData={}
let MotionLine;
const magTypeOrder = {
    "MJ": 1,     // 可能是日本震级（通常是较小的震级）
    "UK": 2,     // 可能是英国或其他地区的震级（一般是较小的震级）
    "MB": 3,     // 体波震级
    "MS": 4,     // 表面波震级
    "MT": 5,     // 震中震级
    "MW": 6,     // 矩震级
    "MWP": 7,    // 特定矩震级调整
    "MWB": 8,    // 特定矩震级调整
    "MWC": 9,    // 气象学应用震级
    "MWR": 10,   // 特定矩震级调整
    "MWW": 11,   // 强烈矩震级
    "":5        //地震威力缺失取中间值
}
const color = {
    "1":"#ff1c12",
    "2": "#de5991",
    "3": "#759AA0",
    "4": "#E69D87",
    "5": "#be3259",
    "6": "#EA7E53",
    "7": "#EEDD78",
    "8": "#9359b1",
    "9": "#47c0d4",
    "10": "#F49F42",
    "11": "#AA312C",
    // "12": "#B35E45",
    // "13": "#4B8E6F",
    // "14": "#ff8603",
    // "15": "#ffde1d",
    // "16": "#1e9d95",
    // "17": "#7289AB"
}
let worldmeta;
d3.json('Data/countries-110m.json').then(worldData=> {
    worldmeta = topojson.feature(worldData, worldData.objects.countries);
})
// let svgHeight = $('#svg1').height()
// let svgWidth = $('#svg1').width()
// console.log(svgWidth+" "+svgHeight);
// const innerWidth = svgWidth - margin.left - margin.right;
// const innerHeight = svgHeight - margin.top - margin.bottom;
// console.log(innerWidth+" "+innerHeight);

d3.csv("Data/Mag6PlusEarthquakes_1900-2013.csv").then(data=>{
        data.forEach((item,index)=>{
            mapData[index]={
                "Latitude":+ item.latitude,
                "Longitude":+ item.longitude,
                "Place":item.Place,
                "magType":magTypeOrder[item.magType.toUpperCase()],
                "mag":item.magType.toUpperCase()
            }

            if (!LineData[item.Year]) LineData[item.Year] = 1;
            else LineData[item.Year] += 1;

            if (!RectangularData[item.magType.toUpperCase()]) RectangularData[item.magType.toUpperCase()] = 1;
            else RectangularData[item.magType.toUpperCase()] += 1;

        })



    let alldates = Array.from(new Set(data.map(d => d['Year'])));
    alldates = alldates.sort((a, b) => a - b);
     MotionLine = [];
// 初始化每年的字典，确保包含12个月份
    alldates.forEach(year => {
        let months = new Map();
        for (let i = 1; i <= 12; i++) {
            months.set(i, 0); // 初始化每月值为 0
        }
        MotionLine.push({year: year,months: months
        });
    });
// 统计每年的月份数据
    data.forEach(d => {
        let yearData = MotionLine.find(item => item.year === d['Year']);
        if (yearData) {
            let month = parseInt(d['Month']);
            if (yearData.months.has(month)) yearData.months.set(month, yearData.months.get(month) + 1);
        }
    });
//将每年12个月份转为对象存入对应年份
//     Object.fromEntries() 静态方法将键值对列表转换为一个对象。
    MotionLine = MotionLine.map(item => ({
        year: item.year,
        months: Object.fromEntries(item.months)
    }));
    // console.log(MotionLine);
     MotionLine = MotionLine.map(d => ({
        year: d.year,
        values: Object.entries(d.months).map(([month, value]) => ({
            month: +month,
            value: value
        }))
    }));

     // console.log(MotionLine);
    mapData = Object.values(mapData);
    LineData = Object.entries(LineData).map(([year, count]) => ({
            Year: year,
            Count: count
        }));
    RectangularData = Object.entries(RectangularData)
        .filter(([magType, count]) => magType && magType !== "")
        .map(([magType, count]) => ({
            MagType: magType,
            Count: +count
        }));

    // console.log(MotionLine);
    // console.log(data);
        // console.log(mapData);
        // console.log(LineData);
        //  console.log(RectangularData);

    runMotionLine(MotionLine);
    })






//界面功能区

function updateSvgSize(){

}
let $myPut=$('.myPut')
let $aboutMe=$('.aboutMe')

    let $btn=$('.feature button')
    let nowBtn=4;


    function clickFeature(){
        $btn.each(function (index){

            if(index===nowBtn){
                $(this).removeClass("noUse");
                $(this).addClass("isUse");
                $myPut.text("<")
                $aboutMe.hide()
                $('.welcome').hide()
            }else{
                $(this).removeClass("isUse");
                $(this).addClass("noUse");
            }
            if(nowBtn===4) {
                $aboutMe.hide()
                $('.welcome').show()
            }
            else if(nowBtn===5) {
                $('.welcome').hide()
                $aboutMe.show()
            }
        })
    }


    $btn.each(function (index){
        $(this).on('click', function() {
            nowBtn = index;
            clickFeature()
            divUpdate()
        });
    })


let $divs = $('.right_container > div');
// console.log($divs);

function divUpdate(){
    $divs.each(function (index){
        if(index===nowBtn){
            $(this).removeClass("secondary");
            $(this).addClass("primary");
        }else{
            $(this).removeClass("primary");
            $(this).addClass("secondary");
        }
        $(this).find('svg').remove(); //删除之前d3绘制旧图
        // if(nowBtn===1){  }
        if(index===0&&nowBtn===0){//console.log(nowBtn);
            runMap(mapData,worldmeta);}
        if(index===1&&nowBtn===1){//console.log(nowBtn);
            runLineChart(LineData);}
        if(index===2&&nowBtn===2){//console.log(nowBtn);
            runRectangular(RectangularData);}
        if(index===3&&nowBtn===3){//console.log(nowBtn);
            runMotionLine(MotionLine);}
        // console.log(index)
    })
}


let isUseNo
$aboutMe.hide()
let close=false;// <错 >对
$myPut.on('click', function(event){
    if(close){
        close=false;
        nowBtn=isUseNo;
        clickFeature()
        divUpdate()
        $aboutMe.hide()
        $myPut.text("<")
    }else{
        isUseNo=nowBtn;
        close=true;
        nowBtn=5;
        clickFeature()
        divUpdate()
        $myPut.text(">")
    }

})


$('.logo_pic').on('click',()=>{
    nowBtn=4
    clickFeature()
    divUpdate()
})

let isPlay=false;
let $runBtn=$('.svgFeature > button')

function  updataBtn(){
    if(nowData===0) {
        $runBtn.eq(0).removeClass('isOn');
        $runBtn.eq(0).addClass('isDisOn')
    }
    else if(nowData===dataLen-1) {
        $runBtn.eq(2).removeClass('isOn');
        $runBtn.eq(2).addClass('isDisOn')
    }
    else {
        $runBtn.each(function() {
            $(this).removeClass('isDisOn');
            if (!$(this).hasClass('isOn')) {
                $(this).addClass('isOn');
            }
        });
    }
}


$runBtn.each(function(index){
    $(this).on('click', function() {

        if (index === 0) {
            toPre()
        } else if (index === 1) {
            autoPlay()
        } else if (index === 2) {
            toNext()
        }
        updataBtn()
        if(isPlay){
            // console.log("12")
            $(this).addClass('isRun')
            $(this).text("关闭播放")
            $runBtn.eq(0).addClass('isDisOn')
            $runBtn.eq(2).addClass('isDisOn')
            $runBtn.eq(0).removeClass('isOn');
            $runBtn.eq(2).removeClass('isOn');
        }else if(index === 1){
            // console.log("23")
            $(this).removeClass('isRun')
            $(this).text("开启播放")
            $runBtn.eq(0).removeClass('isDisOn');
            $runBtn.eq(2).removeClass('isDisOn');
            $runBtn.eq(0).addClass('isOn')
            $runBtn.eq(2).addClass('isOn')
        }
        updateNext(index)
        // console.log(nowData)
        // console.log($runBtn.eq(0))


    });
})

function updateNext(index){
    if(nowData===dataLen-1) {
        $runBtn.eq(2).removeClass('isOn');
        $runBtn.eq(2).addClass('isDisOn')
    }
}


// 音乐播放
let audio_play = document.getElementById("music-resource");
let music = document.getElementById("music-block");
let playPauseButton = document.getElementById("play-pause-button");
let nowMusic=1;
music.addEventListener("click",function () {
        if (audio_play.paused) {
            audio_play.play();
            playPauseButton.innerHTML = "&#xe87a;"; // 更改图标为暂停图标

        } else {
            audio_play.pause();
            playPauseButton.innerHTML = "&#xea6d;"; // 更改图标为播放图标
        }
    }
);

$('.nextMusic').on('click',()=>{
    nowMusic=(nowMusic+1)%2
    audio_play.src="audio"+nowMusic+".mp4"
    audio_play.pause();
    playPauseButton.innerHTML = "&#xea6d;"; // 更改图标为播放图标

})