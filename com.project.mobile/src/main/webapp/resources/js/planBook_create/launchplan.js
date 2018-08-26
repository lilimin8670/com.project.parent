/**
 * Created by Administrator on 2016/7/21.
 */
/**
 * 初始化加载列表数据
 */
$(function(){
    $("#planBookList").html("");
    loadData();
});
var indexPro=0;
var currentPage=1;
var pageSize=5;
function loadData(){
    //alert("刚进入方法当前页："+currentPage);
    $("#loadNoMore").hide();
    $("#loading").hide();
    $("#loadMore").hide();
    var params={
        "type":type,
        "currentPage":currentPage,
        "pageSize":pageSize,
    };
    $.ajax({
        url:CP+"/service/planBook/findAllPlanBookByPage",
        data:params,
        type:"post",
        dataType:"json",
        success:function(result){
            if(result.success){
                if(result.data!=null){
                    console.log("查询结果："+result.data);
                    var planBookData=result.data;
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
                    juzhong();
                }if(result.data.length==0){
                    //$("#loadNoMore").show();
                    $(".body_bg").css({'background':"url('/resources/img/homepage/noData.png')",'background-size':"100%"});
                    loadNoMore="Y";
                }else if(result.totalPage==currentPage){
                    $("#loadMore").hide();
                    $("#loadNoMore").show();
                    loadNoMore="Y";
                }else{
                    if(result.totalPage>currentPage){
                        $("#loadMore").show();
                        loadNoMore="N";
                    }
                }
                currentPage++;
                indexPro+=planBookData.length;
            }
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
        window.location.href = CP + "/service/planBook/addPlanBook?type="+type;
    }else{
        layer.alert("计划书没有设置审批流程，不能发起，请联系管理员！",{closeBtn: 0});
    }
}

/**
 * 查看计划书详情
 * @param id
 */
function showPlanBook(id){
    window.location.href = CP + "/service/planBook/editPlanBook?id="+id+"&type="+type+"&btnType=1";
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
                url: CP+"/service/planBook/deletePlanBook",
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
        if(isHasCancle==1){
            btnHtml+=template("cancleSugBtn",{"id":id})+"&nbsp;&nbsp;";
        }
        btnHtml+=template("cancleBtn",{"id":id})+"&nbsp;&nbsp;";
        btnHtml+=template("scheduleBtn",{"id":id});
    }
    //保存中
    if(status==2){
        //是否提交过申请作废
        if(isHasCancle==1){
            btnHtml+=template("cancleSugBtn",{"id":id})+"&nbsp;&nbsp;";
        }
        btnHtml+=template("editBtn",{"id":id})+"&nbsp;&nbsp;";
    }
    //作废中
    if(status==1){
        btnHtml+=template("noCancleBtn",{"id":id})+"&nbsp;&nbsp;";
        btnHtml+=template("cancleSugBtn",{"id":id});
    }
    //已作废
    if(status==0){
        btnHtml+=template("cancleSugBtn",{"id":id});
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
        $("#invalidreasonIframe").attr('src',CP+"/service/planBook/getView?type="+type+"&url=/planBook/invalidreason");
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
    loadData();
}

/**
 * 嵌套了Iframe的页面返回上一页面
 * @type {number}
 */
var orgIndex = window.history.length;
function goBack(){
    var goIndex = orgIndex - window.history.length-1;
    window.history.go(goIndex); //如果iframe的url变了1次，那么goIndex就是-2，类推
    window.location.reload();
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
    $(".cancellation").attr('disabled',true);
    var url=CP+"/service/planBook/noCanclePlanBook";
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
    var url = CP+"/service/planBook/findPlanBookVoidedAudits";
    /* $.messager.progress({
     title:"提示",
     text:"数据处理中，请稍后...."
     });*/
    $.post(url, param, function (result) {
        if(result.success) {
            cancleSuggestionData=result.data;
            console.log(cancleSuggestionData);
            $("#cancleSuggestionIframe").attr('src',CP+"/service/planBook/getView?type="+type+"&url=/planBook/cancleSuggestion_planBook");
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
var planProStateData;
function schedulePlanBook(planBookId){
    var url = CP+"/service/planProState/findPlanProStateByPlanId";
    var param = {"planBookId":planBookId};
    $.post(url, param, function (result) {
        if(result.success) {
             planProStateData=result.data;
            console.log(planProStateData);
            $("#processIframe").attr('src',CP+"/service/planBook/getView?type="+type+"&url=/planBook/processprogress");
            $("#processDiv").css('display','block');
        }else {
            layer.alert(result.message,{closeBtn: 0});
        }
    },"json");
}
/**
 * 编辑计划书
 */
function editPlanBook(id){
    window.location.href = CP + "/service/planBook/editPlanBook?id="+id+"&type="+type;
}