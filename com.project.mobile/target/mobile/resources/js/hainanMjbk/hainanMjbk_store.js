/**
 * Created by xuanYin on 2016/12/19.
 */
var currentPage= 1;
var pageSize = 5;
var indexPro=0;
$(function(){
    //根据会员查询，查询按钮控制
    selectByMem();
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
        url:CP+"/service/hainanMjbk/getHainanMjbkListStore",
        data:{
            "currentPage":currentPage,
            "pageSize":pageSize,
            "memberId":$("#id").val()
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
    $("#hainanMjbkTable").html("");
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
 * 显示计划书详情
 * @param id
 * @param nameType  healder名称显示类型2：计划书管理
 * @param btnType  计划书详情内是否有保存按钮0：有，1：没有
 */
function showhainanMjbk(id){
    window.location.href=CP+"/service/hainanMjbk/detailById?id="+id;
}


/**
 * 根据会员查询
 */
function selectByMem(){
    $('.feedback_rr img').click(function(event) {
        $('.two').css('display', 'block');
        $('.one').css('display', 'none');
    });
    $('.cancel').click(function(event) {
        $('.two').css('display', 'none');
        $('.one').css('display', 'block');
        $("#memberName").val("");
        $("#id").val("");
        currentPage= 1;
        indexPro=0;
        $("#hainanMjbkTable").html("");
        loadData();
    });
}

/**
 * 根据区域中心查询会员
 */
function search(){
    $("#memberListUl").html("");
    $.ajax({
        url: CP + "/service/storeTrace/searchMemberName",
        data: {
            "memberName":$("#memberName").val()
        },
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            if (result.data != null) {
                var html = template("memberList",{"list": result.data});
                console.log(html);
                var $tr = $(html).appendTo("#memberListUl");
                $.parser.parse($tr);
            }
        }
    });
}


/**
 * 选择会员
 */
function choiceMember(memberId){
    $("#id").val(memberId);
    currentPage= 1;
    $("#hainanMjbkTable").html("");
    loadData();
    $('.two').css('display', 'none');
    $('.one').css('display', 'block');
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