var currentPage= 1;
var pageSize = 5;
var indexPro=0;
$(function(){
    //根据会员查询，查询按钮控制
    selectByMem();
    $("#planBookTable").hide();
    //下拉刷新，上划加载
    refresher.init({
        id: "wrapper",
        pullDownAction: refresh,
        pullUpAction: load,
        childHtmlTag: "div"
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
    $("#planBookTable").css({'min-height':doch});
}
/**
 * 安卓返回按钮回调函数
 */
function onKeyBackPressed(){
    goBack();
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid){
        window.location.reload();
    }
}
/**
 * 加载"计划书管理"列表数据
 * @param down 是否为下拉屏幕刷新数据
 */
function loadData(down){
    loadStatus = "loading";
    $(".body_bg").css('background','#f0f0f0');
    $.ajax({
        url:CP+"/service/kfPlanBook/findManagePlanBookByPage",
        data:{
            "type":type,
            "currentPage":currentPage,
            "pageSize":pageSize,
            "memberId":$("#id").val()
        },
        async:false,
        dataType:"json",
        success:function(result){
            //如果是下拉屏幕，数据库加载完成后隐藏加载loading图标
            if(down==1){
                document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
            }
            var checkPlanBookList = result.data;
            if (checkPlanBookList != null  && checkPlanBookList.length>0){
                for (var i=0;i<checkPlanBookList.length;i++){
                    var planProStatus = checkPlanBookList[i].status;
                    checkPlanBookList[i].status = planBookStatusJson[planProStatus];
                    checkPlanBookList[i].submitDate= checkPlanBookList[i].submitDate.substring(0,10);
                    checkPlanBookList[i].index = i+indexPro;
                    var tr = template("planBook",checkPlanBookList[i]);
                    $(tr).appendTo("#planBookTable");
                }
                $("#planBookTable").show();
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
            if(result.totalCount==0){
                $(".body_bg").css({'background':"url('/resources/img/homepage/noData.png')",'background-size':"100%"});
                $(".wrapper").hide();
            }
                currentPage++;
                loadStatus = "ok";
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
 * 返回菜单列表
 * @type {number}
 */
function goBack(){
    if(from){
        if(from=="native"){
            window.location.href='/back';
        }
    }else{
        window.location.href=CP+"/service/homepage/initSecondKefuPage?code=m-kf-1&title=计划书管理";
    }
}
/**
 * 显示计划书详情
 * @param id
 * @param nameType  healder名称显示类型2：计划书管理
 * @param btnType  计划书详情内是否有保存按钮0：有，1：没有
 */
function showPlanBook(id){
    $("#wrapper").css('display','none');
    $('.two').css('display', 'none');
    window.location.href=CP+"/service/planBook/getCheckView?id="+id+"&nameType=2&btnType=1";
}

/**
 * 根据会员查询
 */
function selectByMem(){
    $('.feedback_rr img').click(function(event) {
        $('.two').css('display', 'block');
        $('.one').css('display', 'none');
    });
    $('.two').find('.feedback_l').click(function(event) {
        $('.two').css('display', 'none');
        $('.one').css('display', 'block');
        $("#memberName").val("");
        $("#id").val("");
        currentPage= 1;
        indexPro=0;
        $("#planBookTable").html("");
        loadData(1);
    });
}

/**
 * 根据客服查询会员
 */
function search(){
    $("#memberListUl").html("");
    $.ajax({
        url: CP + "/service/sysTrace/searchMemberName",
        data: {
            "memberName":$("#memberName").val()
        },
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            if (result.data != null && result.data.length>0) {
                var html = template("memberList",{"list": result.data});
                console.log(html);
                var $tr = $(html).appendTo("#memberListUl");
                $.parser.parse($tr);
            }else{
                $(".body_bg").css({
                    'background': "url('/resources/img/homepage/noData.png')",
                    'background-size': "100%"
                });
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
    $("#planBookTable").html("");
    loadData(1);
    $('.two').css('display', 'none');
    $('.one').css('display', 'block');
}


/**
 * 查看计划书审批进度
 * @Author xuanYin
 * @Param planBookId 计划书id
 * @Date 2016/7/22 15:12
 */
function schedulePlanBook(planBookId) {
    window.location.href= CP + "/service/planBook/getView?planBookId=" + planBookId + "&url=/planBook/processprogress";
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
function refresh() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    currentPage=1;
    $("#planBookTable").empty();
    loadData(1);
}