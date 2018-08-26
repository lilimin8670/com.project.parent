var currentPage0 = 1;
var currentPage1 = 1;
var pageSize = 5;
var indexPro=0;
var approveStat="0";
$(function(){
    //加载数据
    $("#planBookTable0").html("");
    $("#planBookTable1").html("");
    //根据会员查询计划书列表
    selectByMem();
    switchCheckBtn();
    //下拉刷新，上划加载----待审核
    refresher.init({
        id: "wrapper0",
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
//KK7LoHNzgDV9zFyAPxQ
function minHeight() {
    var doch = $(window).height() - 150;
    $("#planBookTable0").css({'min-height':doch});
    $("#planBookTable1").css({'min-height':doch});
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
 * 查询会员
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
        async:false,
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
};

/**
 *
 * @type {string}
 */
var oldMemName = "";
function setIntervalTime() {
    setInterval(function () {
        var input_val = $("#memberName").val();
        if (null != input_val && "" != input_val) {
            if (input_val != oldMemName) {
                currentPage1 = 1;
                //保存修改后的值
                oldMemName = input_val;
                //执行查询
                search();
            }
        } else {
            oldMemName = input_val;
            return true;
        }
    }, 400);
}


/**
 * 选择会员
 */
function choiceMember(memberId){
    $("#id").val(memberId);
    currentPage0 = 1;
    currentPage1 = 1;
    $("#planBookTable0").html("");
    $("#planBookTable1").html("");
    loadData(1);
    $('.two').css('display', 'none');
    $('.one').css('display', 'block');
}
/**
 * 加载列表数据
 */
function loadData(down){
    loadStatus = "loading";
    $(".body_bg").css('background','#f0f0f0');
    if (approveStat == "0"){
        $("#planBookTable0").show();
        $("#planBookTable1").hide();
        $("#wrapper0").show();
        $("#wrapper1").hide();
        currentPage = currentPage0;
    }else if (approveStat=="1"){
        $("#planBookTable1").show();
        $("#planBookTable0").hide();
        $("#wrapper1").show();
        $("#wrapper0").hide();
        currentPage = currentPage1;
    }
    $.ajax({
        url:CP+"/service/planBook/findCheckPlanBookByPage",
        data:{
            "type":type,
            "currentPage":currentPage,
            "pageSize":pageSize,
            "approveStat":approveStat,
            "memberId":$("#id").val()
        },
        dataType:"json",
        success:function(result){
            if (down == 1) {
                if (approveStat == "0") {
                    document.getElementById("wrapper0").querySelector(".pullDownIcon").style.display = "none";
                } else if (approveStat == "1") {
                    document.getElementById("wrapper1").querySelector(".pullDownIcon").style.display = "none";
                }
            }
            var checkPlanBookList = result.data;
            if (checkPlanBookList != null && checkPlanBookList.length > 0){
                for (var i=0;i<checkPlanBookList.length;i++){
                    var planProStatus = checkPlanBookList[i].approveStat;
                    checkPlanBookList[i].approveStat = planProStateJson[planProStatus];
                    checkPlanBookList[i].index = i+indexPro;
                    checkPlanBookList[i].submitDate=checkPlanBookList[i].submitDate.substring(0,10);
                    var tr = template("planBook",checkPlanBookList[i]);
                    if(approveStat == "0"){
                        $(tr).appendTo("#planBookTable0");
                    }else{
                        $(tr).appendTo("#planBookTable1");
                        $("#planBookTable1").find(".left-bt-sh").remove();
                    }
                    //设置按钮
                    setBtns(checkPlanBookList[i].id,checkPlanBookList[i].status,checkPlanBookList[i].isHasCancle,checkPlanBookList[i].index,planProStatus,checkPlanBookList[i].planProStateId);
                    var hei = $('.launchplan-left div:eq('+i+')').height();
                    $('.launchplan-right div:eq('+i+')').css('height',hei);
                    $('.launchplan-right div:eq('+i+')').css('height',hei);
                }
                if (approveStat == "0") {
                    currentPage0++;
                    indexPro+=checkPlanBookList.length;
                    if (document.getElementById("wrapper0").querySelector(".pullDownLabel")) {
                        document.getElementById("wrapper0").querySelector(".pullDownIcon").style.display="none";
                        document.getElementById("wrapper0").querySelector(".pullDownLabel").innerHTML = "刷新成功";
                        setTimeout(function () {
                            document.getElementById("wrapper0").querySelector(".pullDownLabel").innerHTML = " ";
                        }, 1000);
                    }
                    wrapper0.refresh();
                } else if (approveStat == "1") {
                    currentPage1++;
                    indexPro+=checkPlanBookList.length;
                    if (document.getElementById("wrapper1").querySelector(".pullDownLabel")) {
                        document.getElementById("wrapper1").querySelector(".pullDownIcon").style.display="none";
                        document.getElementById("wrapper1").querySelector(".pullDownLabel").innerHTML = "刷新成功";
                        setTimeout(function () {
                            document.getElementById("wrapper1").querySelector(".pullDownLabel").innerHTML = " ";
                        }, 1000);
                    }
                    wrapper1.refresh();
                }
            }else{
                if (approveStat == "0") {
                    wrapper0.refresh();
                    document.getElementById("wrapper0").querySelector(".pullUpIcon").style.display = "none";
                    document.getElementById("wrapper0").querySelector(".pullUpLabel").innerHTML = "已没有数据!";
                } else if (approveStat == "1") {
                    wrapper1.refresh();
                    document.getElementById("wrapper1").querySelector(".pullUpIcon").style.display = "none";
                    document.getElementById("wrapper1").querySelector(".pullUpLabel").innerHTML = "已没有数据!";
                }
            }
            if(result.totalCount==0){
                $(".body_bg").css({'background':"url('/resources/img/homepage/noData.png')",'background-size':"100%"});
                $(".wrapper").hide();
            }
            loadStatus = "ok";
        }
    });
}

/**
 * 时间处理
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
    $("#planreviewCheck").show();
    if(approveStat==0){
        $("#wrapper0").show();
    }else if(approveStat==1){
        $("#wrapper1").hide();
    }
    currentPage0 = 1;
    currentPage1 = 1;
    indexPro=0;
    $("#planBookTable0").html("");
    $("#planBookTable1").html("");
    console.log(currentPage);
    loadData(1);
}
/**
 * 返回上一页面
 */
function goBack(){
    if(from){
        if(from=="native"){
            window.location.href='/back';
        }else if(from=="pushMessage"){
            if(headers){
                window.messageCenter();
            }else{
                window.mobile.messageCenter();
            }
        }
    }else{
        window.location.href=CP+"/service/homepage/initSecondStorePage?code=m-dj-1&name=计划书管理";
    }
}
/**计划书审核
 * @Author xuanYin
 * @Param
 * @Date 2016/7/23 9:43
 */
function checkPlanBook(planBookId,planProStateId,status){
    if("8"!=type){
        if (!validatePlanBook(planBookId)){
            return;
        }
    }
    if (status == 1) {
        layer.alert("该计划书正在执行作废审批，请等待", {closeBtn: 0});
        return;
    } else {
        window.location.href=CP + "/service/planBook/getAuditdetails?id=" + planBookId + "&planProStateId=" + planProStateId;
    }
}
/**
 * 显示计划书详情
 * @param id
 * @param doType
 */
function showPlanBook(id,approveStat){
    $("#wrapper0").hide();
    $("#wrapper1").hide();
    $("#planreviewCheck").hide();
    $('.two').css('display', 'none');
    var nameType = 5;
    if(approveStat=="待审批"){

        window.location.href=CP+"/service/planBook/getCheckView?id="+id+"&nameType="+nameType+"&btnType=0";
    }else if(approveStat=="审核通过" || approveStat=="驳回"){
        window.location.href=CP+"/service/planBook/getCheckView?id="+id+"&nameType="+nameType+"&btnType=1";
    }
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
        currentPage0 = 1;
        currentPage1 = 1;
        indexPro=0;
        $("#planBookTable0").html("");
        $("#planBookTable1").html("");
        loadData(1);
    });
}

/**
 * 审核/待审核 tab切换
 */
function switchCheckBtn(){
    var twoTre;
    $(".planreview-top div").eq(2).click(function(){
        if (!twoTre) {
            refresher.init({
                id: "wrapper1",
                pullDownAction: refresh,
                pullUpAction: load,
                childHtmlTag: "div"
            });
            twoTre = true;
        }
    });
    $('.planreview-top-left').click(function(event) {
        $(this).addClass('current').siblings().removeClass('current');
        approveStat=$(this).find("input").val();
        $("#planBookTable0").html("");
        $("#planBookTable1").html("");
        currentPage0 = 1;
        currentPage1 = 1;
        indexPro=0;
        load();
    });
}

//==================================================添加作废相关改动====================================================

/**
 * 设置按钮显示
 */
function setBtns(id,status,isHasCancle,i,planProStatus,planProStateId){
    var paramData={
        id:id,
        planProStateId:planProStateId
    };
    var btnHtml="";
    //已作废
    if(status==0){
        if(planProStatus==0) {
            btnHtml += template("checkBtn", paramData) + "&nbsp;&nbsp;";
        }
        btnHtml+=template("cancleSugBtn",paramData)+"&nbsp;&nbsp;";
    }
    //作废中
    if(status==1){
        if(planProStatus==0){
            btnHtml+=template("checkBtn",paramData)+"&nbsp;&nbsp;";
        }
        btnHtml+=template("noCancleBtn",paramData)+"&nbsp;&nbsp;";
        btnHtml+=template("cancleSugBtn",paramData)+"&nbsp;&nbsp;";
    }
    //审核中或者已审核
    if(status==3||status==4){
        if(isHasCancle==1){
            btnHtml+=template("cancleSugBtn",paramData)+"&nbsp;&nbsp;";
        }
        btnHtml+=template("cancleBtn",paramData)+"&nbsp;&nbsp;";
        if(planProStatus==0){
            btnHtml+=template("checkBtn",paramData)+"&nbsp;&nbsp;";
        }
    }
    btnHtml+=template("scheduleBtn",paramData);
    $("#btnDivs_"+i).html(btnHtml);
}

/**
 * 打开作废意见框
 * @Author xuanYin
 * @Param
 * @Date 2016/7/22 14:28
 */
function openCancleDiv(id){
    window.location.href=CP+"/service/planBook/getView?planBookId="+id+"&url=/planBook/invalidreason";
}

/**申请作废计划书
 * @Author xuanYin
 * @Param
 * @Date 2016/7/22 16:28
 */
function canclePlanBook(cancleReasons){
    var id=window.parent.$("#idHidden").val();
    var url=CP+"/service/planBook/abolishPlanBook";
    var param = {
        "planBookId":id,
        "reson":cancleReasons
    };
    $.post(url, param, function (result) {
        if(result.success) {
            reback();//关闭打开的新增窗口
            //显示成功提示信息
            layer.alert(result.message,{closeBtn: 0},function (index){
                window.location.reload();
                window.scrollTo( 0, 0 );
                layer.close(index);
            });
        }else {
            layer.alert(result.message,{closeBtn: 0});
        }
    },"json");
}


/**取消计划书作废申请
 * @Author xuanYin
 * @Param planBookId计划书id
 * @Date 2016/7/22 18:14
 */
function noCanclePlanBook(planBookId){
    $("#noCanclePlanBookBtn").attr('disabled',true);
    var url=CP+"/service/planBook/noCanclePlanBook";
    var param = {
        "planBookId":planBookId
    };
    $.post(url, param, function (result) {
        if(result.success) {
            //显示成功提示信息
            //noty({text:result.message,timeout:3000});
            layer.alert(result.message,{closeBtn: 0},function(index){
                window.location.reload();
                window.scrollTo( 0, 0 );
                layer.close(index);
            });
        }else {
            $("#noCanclePlanBookBtn").attr('disabled',false);
            layer.alert(result.message,{closeBtn: 0});
        }
    },"json");
}

/**
 * 根据计划书id查询作废意见
 * @Author xuanYin
 * @Param planBookId  计划书id
 * @Date 2016/7/22 14:52
 */
function cancleSuggestion(planBookId){
    window.location.href=CP+"/service/planBook/getView?planBookId="+planBookId+"&url=/planBook/cancleSuggestion_planBook";

}

/**
 * 上划加载
 */
function load() {
    if (loadStatus !== "ok") {
        return;
    }
    loadStatus = "loading";
    var down = 0;
    loadData(down);
}

/**
 * 下拉刷新
 */
var loadStatus = "ok";
function refresh() {
    if (loadStatus != "ok") {
        return;
    }
    loadStatus = "loading";
    if (approveStat == "0") {
        currentPage0=1;
        $("#planBookTable0").empty();
    } else if (approveStat == "1") {
        currentPage1=1;
        $("#planBookTable1").empty();
    }
    loadData(1);
}

/**
 * 验证计划书必填项
 * @param planBookId
 */
function validatePlanBook(planBookId){
    var url = CP+"/service/planBook/findPlanBookById";
    var param = {"id":planBookId};
    var flag=true;
    $.ajax({
        url: url, //请求的url地址，这是相对于现在的位置的地址
        dataType: 'json',    //返回格式为json
        async: false,
        type: 'POST',       //请求方式
        data: param,
        success: function (result) {
            if(result.success) {
                if(result.data.content){
                    var planBook_content=JSON.parse(result.data.content);
                    if(type=="1"){
                        if(!planBook_content.memAge||!planBook_content.belief||
                            !planBook_content.height||!planBook_content.weight||
                            !planBook_content.shoulder||!planBook_content.breast||
                            !planBook_content.waist||!planBook_content.hipline||
                            !planBook_content.expertH){
                            layer.alert("计划书基本信息填写不完全，不能提交审核",{closeBtn: 0});
                            flag=false;
                        }
                        if(!planBook_content.previewImage0H||!planBook_content.previewImage1H||
                            !planBook_content.previewImage2H||!planBook_content.previewImage3H){
                            layer.alert("造型前图片上传不完全，不能提交审核",{closeBtn: 0});
                            flag=false;
                        }
                    }else if(type=="2"){
                        if(!planBook_content.antiagingappeal||!planBook_content.memAge||
                            !planBook_content.cardlevel||!planBook_content.nation||!planBook_content.profession){
                            if(!planBook_content.antiagingappeal){
                                layer.alert("既往病史模块中最想解决的主诉求，不能为空",{closeBtn: 0});
                                flag=false;
                            }else{
                                layer.alert("基本信息填写不完全不能提交审核",{closeBtn: 0});
                                flag=false;
                            }
                        }
                    }
                }else{
                    flag=false;
                }
            }else {
                layer.alert(result.message,{closeBtn: 0});
                flag= false;
            }
        },
        error: function (data) {          //请求出错处理
            layer.alert(data,{closeBtn: 0});
        }
    });
    return flag;
}