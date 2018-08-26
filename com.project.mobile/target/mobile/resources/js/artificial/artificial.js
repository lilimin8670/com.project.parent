/**
 * Created by xuanYin on 2016/12/19.
 */
var currentPage= 1;
var pageSize = 10;
var indexPro=0;
$(function(){
    $("#artificialTable").hide();
    //加载数据
    loadData("");
    //下拉刷新，上划加载
    refresher.init({
        id: "wrapper",
        pullDownAction: refresh,
        pullUpAction: load,
        childHtmlTag: "div"
    });
});

/**
 * 加载"售后跟踪计划"列表数据
 */
function loadData(obj){
    $(".body_bg").css('background','#f0f0f0');
    $.ajax({
        url:CP+"/service/artificial/findAllArtificialByPage",
        data:{
            "currentPage":currentPage,
            "pageSize":pageSize,
            "content":obj
        },
        async:false,
        type:"post",
        dataType:"json",
        success:function(result){
            var artificialkList = result.data;
            if (artificialkList != null){
                for (var i=0;i<artificialkList.length;i++){
                    var tr = template("artificial",artificialkList[i]);
                    $(tr).appendTo("#artificialTable");
                }
                $("#artificialTable").show();
            }if(result.totalCount==0){
                $(".body_bg").css({'background':"url('/resources/img/homepage/noData.png')",'background-size':"100%"});
            }
            currentPage++;
        }
    });
}
/**
 * 日期处理
 * @param now
 * @returns {string}
 */
function formatDate(now) {
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    return year + "-" + month + "-" + date;
}
/**
 * 点击返回按钮
 * @Author xuanYin
 * @Param
 * @Date 2016/7/22 14:28
 */
function reback(divId){
    $("#sonHeader").css('display','none');
    $("#"+divId).css('display','none');
    $('#parentHeader').css('display','block');
    $("#divList").css('display','block');
    currentPage= 1;
    indexPro=0;
    $("#artificialTable").html("");
    console.log(currentPage);
    loadData();
}


/**
 * 嵌套了Iframe的页面返回上一页面
 * @type {number}
 */
/*var orgIndex = window.history.length;
function goBack(){
    var goIndex = orgIndex - window.history.length-1;
    window.history.go(goIndex); //如果iframe的url变了1次，那么goIndex就是-2，类推
}*/

/**
 * 返回原生页面
 */
function goBack(){
    window.location.href='/back';
}


/**
 * 根据客服查询会员
 */
function searchData(){
    $("#artificialTable").html("");
    var content = $("#content").val();
    loadData(content)
}

/**
 * 上拉加载
 */
function load() {
    setTimeout(function () {
        loadData();
        wrapper.refresh();
    }, 10);
}

/**
 * 下拉刷新
 */
function refresh() {
    setTimeout(function () {
        $("#wrapper").find(".pullDownIcon").hide();
        $("#wrapper").find(".pullDownLabel").append('<span>刷新成功</span>');
        setTimeout(function () {
            wrapper.refresh();
            currentPage=1;
            $("#artificialTable").empty();
            loadData();
        }, 1000);//模拟下拉刷新显示成功效果
    }, 1000);
}

function showRecord(id) {
    var url=CP+"/service/artificial/showRecord?id="+id;
    location.href=url;
}