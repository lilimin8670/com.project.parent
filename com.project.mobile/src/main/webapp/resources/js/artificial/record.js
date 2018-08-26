/**
 * Created by xuanYin on 2016/12/19.
 */
var currentPage= 1;
var pageSize = 5;
var indexPro=0;
$(function(){
    $("#recordTable").hide();
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
 * 加载"回访记录"列表数据
 */
function loadData(){
    $(".body_bg").css('background','#f0f0f0');
    $.ajax({
        url:CP+"/service/artificial/findAllFeedBackRecord",
        data:{
            "currentPage":currentPage,
            "pageSize":pageSize,
            "id":$("#id").val()
        },
        async:false,
        dataType:"json",
        success:function(result){
            var recordList = result.data;
            if (recordList != null){
                for (var i=0;i<recordList.length;i++){
                    var tr = template("record",recordList[i]);
                    $(tr).appendTo("#recordTable");
                }
                $("#recordTable").show();
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
 * 返回原生页面
 */
function goBack(){
    var url=CP+"/service/artificial/index";
    location.href=url;
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
            $("#hainanMjbkTable").empty();
            loadData();
        }, 1000);//模拟下拉刷新显示成功效果
    }, 1000);
}

function checkVisit(id,btnStatus) {

    if(btnStatus==1){
        var url=CP+"/service/artificial/editVisit?id="+id;
    }else{
        var url=CP+"/service/artificial/viewVisit?id="+id;
    }
    location.href=url;
}
function view(id,btnStatus) {
    location.href=CP+"/service/artificial/viewVisit?id="+id;
}
function visit(id,btnStatus) {
    location.href=CP+"/service/artificial/editVisit?id="+id;
}