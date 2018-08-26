/**
 * 初始化加载列表数据
 */
$(function(){
    $("#planBookList").html("");
    //下拉刷新，上划加载
    refresher.init({
        id: "wrapper",
        pullDownAction: refresh1,
        pullUpAction: load,
        childHtmlTag: "div",
    });
    load();
    minHeight();
});


/**
 * 2017/7/11
 * 根据屏幕的高度设置内容最小的高度
 * **/

function minHeight() {
    var doch = $(window).height() - 110;
    $("#planBookList").css({'min-height':doch});
}
var indexPro=0;
var currentPage=1;
var pageSize=5;
/**
 *
 * @param down  是否为下拉屏幕刷新数据(1是，0否)
 */
function loadData(down){
    loadStatus = "loading";
    $(".body_bg").css('background','#f0f0f0');
    var params={
        "currentPage":currentPage,
        "pageSize":pageSize,
        "type":type
    };
    $.ajax({
        url:CP+"/service/memPlanBook/findMemPlanBookByPage",
        data:params,
        type:"post",
        async:false,
        dataType:"json",
        success:function(result){
            //如果是下拉屏幕，数据库加载完成后隐藏加载loading图标
            if(down==1){
                document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
            }
            if(result.success){
                if(result.totalCount==0){
                    $(".body_bg").css({'background':"url('/resources/img/homepage/noData.png')",'background-size':"100%"});
                    $(".wrapper").hide();
                    return;
                }
                var planBookData=result.data;
                if(planBookData!=null && planBookData.length>0){
                    for(var i=0;i<planBookData.length;i++){
                        planBookData[i].index=i+indexPro;
                        var statusName=planBookData[i].status;
                        planBookData[i].status=planBookStatusJson[statusName];
                        planBookData[i].createDate= planBookData[i].createDate.substring(0,10);
                        var tr = template("planBookTmp",planBookData[i]);
                        $(tr).appendTo("#planBookList");
                    }
                    currentPage++;
                    indexPro+=planBookData.length;
                    if(document.getElementById("wrapper").querySelector(".pullDownLabel")){
                        document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
                        document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML="刷新成功";
                        setTimeout(function () {
                            document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML=" ";
                        },1000);
                    }
                    wrapper.refresh();
                }else{
                    wrapper.refresh();
                    document.getElementById("wrapper").querySelector(".pullUpIcon").style.display="none";
                    document.getElementById("wrapper").querySelector(".pullUpLabel").innerHTML="已没有数据!";
                }
            }
            loadStatus = "ok";
        },
        error:function(){
            layer.alert("网络错误！",{closeBtn: 0});
        }
    });
}
/**
 * 嵌套了Iframe的页面返回上一页面
 * @type {number}
 */
function goBack(){
    window.location.href='/back';
}

/**
 * 安卓返回按钮回调函数
 */
function onKeyBackPressed(){
    goBack();
}
/**
 * 显示计划书详情
 * @param id
 * @param doType
 */
function showPlanBook(id){
    window.location.href=CP+"/service/planBook/getCheckView?id="+id+"&nameType=4&btnType=1";
}



function load() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    loadData(0);
}

/**
 * 当前加载状态
 * @type {string}
 */
var loadStatus = "ok";
function refresh1() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    currentPage=1;
    $("#planBookList").html("");
    loadData(1);
}
