/**
 * Created by xuanYin on 2016/12/20.
 */
var currentPage= 1;
var pageSize = 5;
$(function(){
    $("#hainanMjbkTable").hide();
    //加载数据
    loadData();
    //下拉刷新，上划加载
    refresher.init({
        id: "wrapper",
        pullDownAction: refresh,
        pullUpAction: load,
        childHtmlTag: "div"
    });
});

/**
 * 加载"计划书管理"列表数据
 */
function loadData(){
    $(".body_bg").css('background','#f0f0f0');
    $.ajax({
        url:CP+"/service/hainanMjbk/getHainanMjbkList",
        data:{
            "currentPage":currentPage,
            "pageSize":pageSize
        },
        async:false,
        dataType:"json",
        success:function(result){
            var hainanMjbkList = result.data;
            if (hainanMjbkList != null){
                for (var i=0;i<hainanMjbkList.length;i++){
                    var tr = template("hainanMjbk",hainanMjbkList[i]);
                    $(tr).appendTo("#hainanMjbkTable");
                }
                $("#hainanMjbkTable").show();
            }if(result.totalCount==0){
                $(".body_bg").css({'background':"url('/resources/img/homepage/noData.png')",'background-size':"100%"});
            }
            currentPage++;
        }
    });
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
 * 显示计划书详情
 * @param id
 * @param nameType  healder名称显示类型2：计划书管理
 * @param btnType  计划书详情内是否有保存按钮0：有，1：没有
 */
function showhainanMjbk(id){
    window.location.href=CP+"/service/hainanMjbk/detailById?id="+id;
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

/**
 * @author lixinquan
 *
 * @requires jQuery
 *
 * 格式化日期时间
 */
template.helper('dateTimeFormatter',function (value) {
    if (value == null || value == '') {
        return '';
    }else{
        return value.substr(0,10);
    }

});