/**
 * Created by Administrator on 2016/7/21.
 */
/**
 * 初始化加载列表数据
 */
$(function(){
    $("#planBookList").html("");
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
    $("#planBookList").css({'min-height':doch});
}

var indexPro=0;
var currentPage=1;
var pageSize=5;
/**
 *
 * @param down 是否为下拉屏幕刷新数据
 */
function loadData(down){
    loadStatus = "loading";
    var params={
        "currentPage":currentPage,
        "pageSize":pageSize,
        "type":type
    };
    $.ajax({
        url:CP+"/service/kfPlanBook/findCreatePlanBookByKf",
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
                if(result.data!=null){
                    if(result.totalCount==0){
                        $(".body_bg").css({'background':"url('/resources/img/homepage/noData.png')",'background-size':"100%"});
                        $(".wrapper").hide();
                        return;
                    }
                    console.log("查询结果："+result.data);
                    var planBookData=result.data;
                    if(planBookData && planBookData.length>0){
                        for(var i=0;i<planBookData.length;i++){
                            planBookData[i].index=i+indexPro;
                            var statusName=planBookData[i].status;
                            planBookData[i].status=planBookStatusJson[statusName];
                            var createDate = planBookData[i].createDate;
                            planBookData[i].createDate = createDate.substring(0,10);
                            var tr = template("planBookTmp",planBookData[i]);
                            $(tr).appendTo("#planBookList");
                            setBtns(planBookData[i].id,statusName,planBookData[i].isHasCancle,planBookData[i].index);
                            deleteCss(statusName,planBookData[i].index);
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
                        juzhong();
                    }else{
                        wrapper.refresh();
                        document.getElementById("wrapper").querySelector(".pullUpIcon").style.display="none";
                        document.getElementById("wrapper").querySelector(".pullUpLabel").innerHTML="已没有数据!";
                    }
                }
            }
            loadStatus = "ok";
        },
        error:function(){
            layer.alert("网络错误！",{closeBtn: 0});
        }
    });
}

function juzhong(){
    var num = $(".launchplan").length;
    for(var i=0; i<num; i++){
        var shheight = $('.launchplan-left:eq('+ i +') div').height()+15;
        $('.launchplan-right:eq('+ i +') div').css('height', shheight);
    }
}

/**
 * 跳转到计划书发起页面
 */
function addPlanBook(type){
    //03-08添加判断是否有审批流程
    var json = {
        "type":type
    };
    var resp = $.ajax({
        type:"POST",
        url:CP+"/service/kfPlanBook/isSetProcessDef",
        data:json,
        async : false,
        cache : false,
        dataType:"json"
    }).responseText;
    if(resp=="true"){
        if("7"==type){
            window.location.href = CP + "/service/kfPlanBook/addPlanBook?type="+type+"&nameType=4&btnType=";
        }else if("8"==type){
            window.location.href=CP+"/service/kfPlanBook/healthQuesByLoginNameIndex";
        }
    }else{
        layer.alert(resp,{closeBtn: 0});
        return false;
    }
}

/**
 * 查看计划书详情
 * @param id
 */
function showPlanBook(id,status){
    var btnType=1;
    if(status=="保存"){
        btnType=0;
    }
    window.location.href = CP + "/service/kfPlanBook/editPlanBook?id="+id+"&type="+type+"&btnType="+btnType+"&nameType=3";
}
/**
 * 删除样式处理
 */
function deleteCss(statusName,i){
    if(statusName==2){
        $("#div_"+i).on("swipeleft",function(){
            $(this).find(".launchplan_cont_box").animate({width:"100%"},100);
            $(this).siblings("div").find(".launchplan_cont_box").css({width:"calc(100% + 60px)"});
        });
        $("#div_"+i).on("swiperight",function(){
            $(this).find(".launchplan_cont_box").css({width:"calc(100% + 60px)"});
        });
    }
}

/**
 * 删除计划书
 * @Author xuanYin
 * @Param id 计划书id
 * @Date 2016/7/21 16:10
 */
function deletePlanBook(id){
    $.ajax({
        async:false,
        dataType:"json",
        method:'POST',
        url: CP+"/service/kfPlanBook/deletePlanBook",
        data:{id:id},
        success:function(result){
            if (result.success){
                layer.alert(result.message,{closeBtn: 0},function(index){
                    layer.close(index);
                    window.location.reload();
                });
            }else {
                layer.alert(result.message,{closeBtn: 0});
            }
        },
        error:function(result){
            layer.alert(result.message,{closeBtn: 0});
        }
    });
}
/**
 * 设置按钮显示
 */
function setBtns(id,status,isHasCancle,i){
    var btnHtml="";
    //审核中或者已审核
    if(status==3||status==4){
        btnHtml+=template("scheduleBtn",{"id":id});
    }
    //保存中
    if(status==2){
        btnHtml+=template("editBtn",{"id":id})+"&nbsp;&nbsp;";
    }
    if(type=="8"){
        btnHtml+=template("healthQuesDetailBtn",{"id":id,"detailType":"1"})+"&nbsp;&nbsp;";
        btnHtml+=template("riskAssessmentBtn",{"id":id,"detailType":"2"});
    }
    $("#btnDivs_"+i).html(btnHtml);
}
/**
 * 提交填写审核意见
 * @Author xuanYin
 * @Param
 * @Date 2016/7/22 14:28
 */
function openCancleDiv(id){
    $("#idHidden").val(id);
    $("#cancleReasons").val("");
    //打开申请作废原因对话框
    $("#invalidreasonIframe").attr('src',CP+"/service/kfPlanBook/getView?type="+type+"&url=/planBook/invalidreason");
    $("#cancleDiv").css('display','block');
}
/**
 * 点击返回按钮
 * @Author xuanYin
 * @Param
 * @Date 2016/7/22 14:28
 */
function reback(divId){
    $("#"+divId).css('display','none');
    currentPage = 1;
    indexPro=0;
    $("#planBookList").html("");
    console.log(currentPage);
    loadData(1);
}

/**
 * 返回发起菜单页面
 * @type {number}
 */
function goBack(){
    window.location.href=CP+"/service/homepage/initSecondKefuPage?code=m-kf-9&title=计划书发起";
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
/**申请作废计划书
 * @Author xuanYin
 * @Param
 * @Date 2016/7/22 16:28
 */
function canclePlanBook(cancleReasons){
    var id=window.parent.$("#idHidden").val();
    var url=CP+"/service/kfPlanBook/abolishPlanBook";
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
    $(".cancellation").attr('disabled',true);
    var url=CP+"/service/kfPlanBook/noCanclePlanBook";
    var param = {
        "planBookId":planBookId,
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
var cancleSuggestionData;
function cancleSuggestion(planBookId){
    var param = {
        "planBookId":planBookId,
    };
    var url = CP+"/service/planBookVoidedAudit/findPlanBookVoidedAudits";
    /* $.messager.progress({
     title:"提示",
     text:"数据处理中，请稍后...."
     });*/
    $.post(url, param, function (result) {
        if(result.success) {
            cancleSuggestionData=result.data;
            console.log(cancleSuggestionData);
            $("#cancleSuggestionIframe").attr('src',CP+"/service/kfPlanBook/getView?type="+type+"&url=/planBook/cancleSuggestion_planBook");
            $("#cancleSuggestionDiv").css('display','block');
        }
    });
}

/**
 * 查看计划书审批进度
 * @Author xuanYin
 * @Param planBookId 计划书id
 * @Date 2016/7/22 15:12
 */
function schedulePlanBook(planBookId) {
    window.location.href= CP + "/service/kfPlanBook/getView?planBookId=" + planBookId + "&url=/planBook/processprogress";
}
/**
 * 编辑计划书
 */
function editPlanBook(id){
    if("7"==type){
        window.location.href = CP + "/service/kfPlanBook/editPlanBook?id="+id+"&type="+type+"&nameType=2";
    }else if("8"==type){
        //根据id查询计划书对象
        var url = CP+"/service/planBook/findPlanBookById";
        var param = {"id":id};
        $.post(url, param, function (result) {
            if(result.success) {
                console.log(result.data);
                var planBookData=result.data;
                $("#healthQuesId").val(planBookData.questionAnswerId);
                $("#memberId").val(planBookData.memberId);
                $("#content").val(planBookData.content);
                $("#content").text(planBookData.content);
                $("#memberLoginName").val(planBookData.memberLoginName);
                $("#id").val(planBookData.id);
                layer.open({
                    title:"个体生命养护建议",
                    type: 1,
                    closeBtn: 1,
                    scrollbar: true,
                    area: ['100%', '100%'],
                    content: $('#gtsmyhjyDiv')
                });
            }else {
                window.layer.alert(result.message,{closeBtn: 0});
            }
        },"json");
    }
}

function load() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    console.log("load:"+currentPage);
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
    $("#planBookList").html("");
    loadData(1);
}

/*********************************新版计划书新增逻辑******************************************************/


/**
 * 模糊查询会员
 * @param param
 * @param success
 * @param error
 */
var myloaderMember = function(param,success,error){
    var q = param.q || '';
    q=q.trim();
    $.ajax({
        url: CP+'/service/memberInfo/getMemsByUserByPlanBook',
        dataType: 'json',
        data: {
            featureClass: "P",
            style: "full",
            maxRows: 20,
            p: q
        },
        success: function(data){
            var items = $.map(data.rows, function(item){
                return {
                    id:item.id,
                    name: item.memName+"【"+item.loginname+"】",
                    loginname:item.loginname
                };
            });
            success(items);
        },
        error: function(){
            error.apply(this, arguments);
        }
    });
};

/**
 * 查看健康问卷详情
 * @param id
 */
function healthQuesDetailList(id,detailType) {
    var resp = $.ajax({
        type:"POST",
        url:CP+"/service/planBook/getHealthQues",
        data:{"planBookId":id,"detailType":detailType},
        async : false,
        cache : false,
        dataType:"json"
    }).responseText;
    window.location.href=resp;
}

/**
 * 查看风评报告详情
 * @param id
 */
function riskAssessmentList(id,detailType) {
    var resp = $.ajax({
        type:"POST",
        url:CP+"/service/planBook/getHealthQues",
        data:{"planBookId":id,"detailType":detailType},
        async : false,
        cache : false,
        dataType:"json"
    }).responseText;
    window.location.href=resp;
}

/**
 * 保存计划书内容
 */
function savePlanBookByHqList(saveOrSubmit) {
    var url=CP+"/service/planBook/savePlanBook";
    $(".button_bc").attr('disabled',true);
    if(saveOrSubmit){
        url=CP+"/service/kfPlanBook/submitPlanBook";
        $(".button_tj").attr('disabled',true);
        $(".button_bc").attr('disabled',false);
    }
    var param={
        "id":$("#id").val(),
        "content":$("#content").val().trim(),
        "questionAnswerId":$("#healthQuesId").val(),
        "type":8,
        "memberLoginname":$("#memberLoginName").val(),
        "memberId":$("#memberId").val()
    };
    $.post(url, param, function (result) {
        if(result.success) {
            noty({text:result.message,timeout:3000});
            window.location.reload();
        }else {
            layer.alert(result.message);
        }
        $(".button_bc").attr('disabled',false);
        $(".button_tj").attr('disabled',false);
    },"json");
}

function cancleEditDiv(divId) {
    layer.closeAll();
}