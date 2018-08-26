$(function(){
    $(".one header").css({"z-index":99}).show();
    $('.feedback_rr img').click(function(event) {
        $('.two').css('display', 'block');
        $('.one').css('display', 'none');
    });
    $('#fanhuiBtn').click(function(event) {
        $('.two').css('display', 'none');
        $('.one').css('display', 'block');
        $("#memberName").val("");
        $("#memberListUl").html("");
    });
    if (isCheckFlag == "1"){
        $("#registerFormTable1").html("");
        $("#registerFormTable0").html("");
    }
    /**
     * 未审核已审核按钮点击事件
     */
    $('.planreview-top-left').click(function() {
        var i = $(this).attr("id");
        $('.planreview-top-left').removeClass('current').eq(i).addClass('current');
        $('.wrapper').show().eq(i).hide();
        $("#registerFormTable1").html("");
        $("#registerFormTable0").html("");
        currentPage0 = 1;
        currentPage1 = 1;
        status = i;
        loadData(i,2);
    });

    /**
     * 已审核tab页初始化
     */
    refresher.init({
        id:"wrapper1",
        pullDownAction:Refresh,
        pullUpAction:Load1,
        childHtmlTag:"div"
    });
    /**
     * 未审核tab页初始化
     */
    refresher.init({
        id:"wrapper0",
        pullDownAction:Refresh,
        pullUpAction:Load0,
        childHtmlTag:"div"
    });
    /**
     * 页面初始化加载数据
     */
    Load0();
    minHeight();
});



/**
 * 2017/7/11
 * 最小高度计算(填充)
 *
 */

function  minHeight(){
    var doch=$(window).height() - 150;
    $("#registerFormTable0").css({'min-height':doch});
    $("#registerFormTable1").css({'min-height':doch});
}


var currentPage0 = 1;
var currentPage1 = 1;
var pageSize = 5;
var status = 0;
var memberId = "";

/**
 * 当前加载状态
 * @type {string}
 */
var loadStatus = "ok";

// 已审核(上拉加载)
function Load1(){
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    loadData('1',2);
}
// 待审核(上拉加载)
function Load0(){
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    loadData('0',2);
}

/**
 * 下拉刷新
 * @constructor
 */
function Refresh() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";

    if (status == "0"){
        currentPage0 = 1;
    }else if (status == "1"){
        currentPage1 = 1;
    }
    loadData(status,1);
}

function loadData(statusParam,isLoad){
    console.log("statusParam="+statusParam+"    isLoad="+isLoad+"  2代表是load方法");
    $("body").css({'background':"#f0f0f0"});
    if (statusParam == "0"){
        $("#registerFormTable0").show();
        $("#registerFormTable1").hide();
        $("#wrapper0").show();
        $("#wrapper1").hide();
        currentPage = currentPage0;
    }else if(statusParam == "1"){
        $("#registerFormTable1").show();
        $("#registerFormTable0").hide();
        $("#wrapper0").hide();
        $("#wrapper1").show();
        currentPage = currentPage1;
    }
    console.log("请求数据前:\ncurrentPage1:"+currentPage1+"   currentPage0:"+currentPage0+"   currentPage:"+currentPage);
    $.ajax({
        url:cp+"/service/check/registerForm/getRegisterFormCheckList",
        data:{
            "classify":classify,
            "type":type,
            "currentPage":currentPage,
            "pageSize":pageSize,
            "status":statusParam,
            "memberId":memberId
        },
        dataType:"json",
        success:function(result){
            //如果是下拉屏幕，数据加载完成后隐藏加载loading图标
            if(isLoad==1){
                if (statusParam==0){
                    document.getElementById("wrapper0").querySelector(".pullDownIcon").style.display="none";
                }else {
                    document.getElementById("wrapper1").querySelector(".pullDownIcon").style.display="none";
                }
            }

            var checkRegisterFormList = result.checkRegisterFormList;
            if (checkRegisterFormList != null && checkRegisterFormList.length > 0){
                length = checkRegisterFormList.length;
                if (isLoad == 1){//刷新
                    if(statusParam == "0"){
                        $("#registerFormTable0").empty();
                    }else{
                        $("#registerFormTable1").empty();
                    }
                }
                for (var i=0;i<checkRegisterFormList.length;i++){
                    var formStatus = checkRegisterFormList[i].status;
                    checkRegisterFormList[i].statusText = formTypeMap[formStatus];
                    checkRegisterFormList[i].index = i;
                    var submitDate = checkRegisterFormList[i].submitDate;
                    checkRegisterFormList[i].submitDate = submitDate.substring(0,10);
                    var tr = template("registerForm",checkRegisterFormList[i]);
                    if(statusParam == "0"){
                        $(tr).appendTo("#registerFormTable0");
                    }else{
                        $(tr).appendTo("#registerFormTable1");
                        $("#registerFormTable1").find(".left-bt-sh").remove();
                    }
                }
                juzhong();
                console.log("statusParam="+statusParam+"\ncheckRegisterFormList.length="+checkRegisterFormList.length);
                if (statusParam == "0"){
                    currentPage0++;
                }else if (statusParam == "1"){
                    currentPage1++;
                }
                console.log("请求完数据后:\ncurrentPage1:"+currentPage1+"   currentPage0:"+currentPage0+"   currentPage:"+currentPage);

                if(statusParam == "0"){
                    if(document.getElementById("wrapper0").querySelector(".pullDownLabel")){
                        document.getElementById("wrapper0").querySelector(".pullDownIcon").style.display="none";
                        document.getElementById("wrapper0").querySelector(".pullDownLabel").innerHTML="刷新成功";
                        setTimeout(function () {
                            document.getElementById("wrapper0").querySelector(".pullDownLabel").innerHTML=" ";
                        },1000);
                    }
                    wrapper0.refresh();
                }else {
                    if(document.getElementById("wrapper1").querySelector(".pullDownLabel")){
                        document.getElementById("wrapper1").querySelector(".pullDownIcon").style.display="none";
                        document.getElementById("wrapper1").querySelector(".pullDownLabel").innerHTML="刷新成功";
                        document.getElementById("wrapper1").querySelector(".pullDown, .pullUp").style.height="auto";
                        setTimeout(function () {
                            document.getElementById("wrapper1").querySelector(".pullDownLabel").innerHTML=" ";
                        },1000);
                    }
                    wrapper1.refresh();
                }
            }else {
                if (statusParam == "0"){
                    wrapper0.refresh();
                    document.getElementById("wrapper0").querySelector(".pullUpIcon").style.display="none";
                    document.getElementById("wrapper0").querySelector(".pullUpLabel").innerHTML="已没有数据!";
                }else if (statusParam == "1"){
                    wrapper1.refresh();
                    document.getElementById("wrapper1").querySelector(".pullUpIcon").style.display="none";
                    document.getElementById("wrapper1").querySelector(".pullUpLabel").innerHTML="已没有数据!";
                }
            }

            if (statusParam == "0"){
                if ($("#registerFormTable0").children().length==0){
                    $("body").css({'background':"url('/resources/img/homepage/noData.png') no-repeat",'background-size':"100%"});
                    $("#wrapper0").hide();
                }
            }else if (statusParam == "1"){
                if ($("#registerFormTable1").children().length==0){
                    $("body").css({'background':"url('/resources/img/homepage/noData.png') no-repeat",'background-size':"100%"});
                    $("#wrapper1").hide();
                }
            }
            loadStatus = "ok";
        }
    });
}
/**
 * 显示详情
 * @param id
 * @param doType
 */
function showDetail(id,regProStateId,processId,doType){
    if (status == "1"){
        window.location.href = cp + "/service/check/registerForm/returnNewRegisterFormDetail?regFormId="+id+"&type="+type+"&classify="+classify+
            "&processId="+processId+"&regProStateId="+regProStateId+"&doType="+doType+"&from="+from+"&actionFrom=check&code="+code;
    }
}
/**
 * 审核
 * @param id
 * @param regProStateId
 * @param processId
 */
function checkbtn(id,regProStateId,processId){
    $.ajax({
        async:false,
        url:cp+"/service/dj/registerForm/getRegisterFormById",
        data:"id="+id,
        dataType:"json",
        success:function(result){
            if (result.success){
                var registerForm = result.data;
                if (registerForm.status == 0 || registerForm.status == 4){
                    noty({text:"该报名表作废了，不能进行审核",timeout:3000});
                }else {
                    window.location.href = cp + "/service/check/registerForm/returnNewRegisterFormCheck?regFormId="+id+"&type="+type+"&classify="+classify+"&processId="+processId+"&regProStateId="+regProStateId+"&from="+from+"&actionFrom=check&code="+code;
                }
            }else {
                noty({text:result.message,timeout:3000});
            }
        }
    });
}
/**
 * 查看进度
 * @param id
 */
function showProcess(id){
    window.location.href = cp + "/service/check/registerForm/returnRegisterFormProgress?regFormId="+id+"&from="+from;
}

function search(){
    var memName = $("#memberName").val();
    $("#memberListUl").html("");
    $.ajax({
        url: cp + "/service/storeTrace/searchMemberName",
        data: {
            "memberName":memName
        },
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            if (result.data != null) {
                var html = template("memberList",{"list": result.data});
                $(html).appendTo("#memberListUl");
            }
        }
    });
}

function choiceMember(id){
    memberId = id;
    $("#memberName").val("");
    $("#memberListUl").html("");
    currentPage0 = 1;
    currentPage1 = 1;
    $("#registerFormTable0").html("");
    $("#registerFormTable1").html("");
    loadData(status);
    $('.two').css('display', 'none');
    $('.one').css('display', 'block');
}

function juzhong(){
    var num = $(".launchplan").length;
    for(var i=0; i<num; i++){
        var shheight = $('.launchplan-left:eq('+ i +') div').height()+15;
        $('.launchplan-right:eq('+ i +') div').css('height', shheight);
    }

}

function fanhui(){
    if (from=="push"||from==""){
        // todo
        if (header){//iPhone
            window.messageCenter();
        }else {//android
            window.mobile.messageCenter();
        }
    }else {
        if (code == "m-dj-7"){
            window.location.href = cp + "/service/homepage/initSecondStorePage?code="+code+"&from="+from+"&name=新预约报名管理";
        }else if (code == "m-kf-7"){
            window.location.href = cp + "/service/homepage/initSecondKefuPage?code="+code+"&from="+from+"&title=报名表审核";
        }

    }
}


/**
 * 申请作废预约单
 * 弹框填写作废原因
 * @param id
 */
function cancleDialog(id,status,planBookId,regProStateId){
    $("#cancelReason").val("");
    //判断是否有正在跟踪的跟踪计划书
    $.post(cp+"/service/dj/registerForm/gettrackRecordStatus", {"id":id,"planBookId":planBookId}, function (result) {
        if(result.success) {
            //如果有不进行任何操作提示先停止跟踪
            if (result.data > 0){
                noty({text:"该报名表对应的计划书正在进行跟踪，请先停止跟踪！",timeout:3000});
            }else{
                //如果没有跟踪则进行操作
                //判断是否入院
                isHospitalized(id,status,regProStateId);
            }
        }else {
            $.messager.alert("错误",result.message,"error");
        }
        $.messager.progress("close");
    },"json");

}

/**
 * 判断是否入院 入院后不能进行作废
 * @param id
 */
function isHospitalized(id,status,regProStateId) {
    $.ajax({
        async:false,
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: cp+"/service/dj/registerForm/isHospitalized" ,//url
        data: "regFormId="+id,
        success: function (result) {
            console.log(result);//打印服务端返回的数据(调试用)
            if (result.success) {
                if (!result.data){
                    $("#id").val(id);
                    $("#formstatus").val(status);
                    $("#cancleDialog").dialog({
                        title: '作废原因',
                        width: '80%',
                        height: 'auto',
                        closed: false,
                        cache: false,
                        border:'thin',
                        modal: true,
                        buttons: [{
                            text:'确定',
                            handler:function(){
                                cancleRegisterForm(id,regProStateId);
                            }
                        },{
                            text:'取消',
                            handler:function(){
                                $('#cancleDialog').dialog('close');
                            }
                        }]
                    });
                }else {
                    noty({text:result.message,timeout:3000});
                }
            }
        },
        error : function() {
            $.messager.alert("错误",result.message,"error");
        }
    });
}

/**
 * 提交作废原因
 */
function cancleRegisterForm(id,regProStateId){
    $.messager.progress({
        title:"提示",
        text:"数据处理中，请稍后...."
    });
    var param = {
        "id":$("#id").val(),
        "status":$("#formstatus").val(),
        "cancelReason":$("#cancelReason").val(),
        "regProStateId":regProStateId
    };
    console.log(param);
    var isValid = $("#cancelReason").validatebox("isValid");
    console.log(isValid);
    if (!isValid){
        $("#cancelReason").focus();
        $.messager.progress("close");
        return isValid;
    }
    $.post(cp+"/service/dj/registerForm/cancleRegisterForm", param, function (result) {
        $.messager.progress("close");
        if(result.success) {
            noty({text:result.message,timeout:3000});
            $("#cancleDialog").dialog('close');
            var status = result.data.status;
            result.data.statusText = formTypeMap[status];
            result.data.submitDate = result.data.submitDate.substring(0,10);
            $("#"+id).replaceWith(template("registerForm",result.data));
        }else {
            $.messager.alert("错误",result.message,"error");
        }

    },"json");
}
/**
 * 查看作废意见列表
 * @param id
 */
function cancleSuggestion(id){
    window.location.href = cp+"/service/dj/registerForm/returnCancleSuggestion?id="+id+"&from="+from;
}

/**
 * 取消作废操作
 * @param id
 * @param perCancelStatus
 */
function notcancleDialog(id,perCancelStatus,regProStateId){

    $.ajax({
        async:false,
        url:cp+"/service/dj/registerForm/getRegisterFormById",
        data:"id="+id,
        dataType:"json",
        success:function(result){
            if (result.success){
                var registerForm = result.data;
                if (registerForm.status != 4){
                    noty({text:"该报名表客服已经审核，不能进行取消作废操作",timeout:3000});
                }else {
                    $.messager.confirm('确认','您确认取消作废吗？',function(r){
                        if (r){
                            $.messager.progress({
                                title:"提示",
                                text:"数据处理中，请稍后...."
                            });
                            replaceRegisterForm(id,perCancelStatus,regProStateId);
                            $.messager.progress("close");
                        }
                    });
                }
            }else {
                noty({text:result.message,timeout:3000});
            }
        }
    });
}

function replaceRegisterForm(id,perCancelStatus,regProStateId) {
    $.ajax({
        async:false,
        url:cp+"/service/dj/registerForm/notcancleRegisterForm",
        data:{
            "id":id,
            "perCancelStatus":perCancelStatus,
            "regProStateId":regProStateId
        },
        dataType:"json",
        success:function(result){
            if (result.success){
                noty({text:result.message,timeout:2000});
                var status = result.data.status;
                result.data.statusText = formTypeMap[status];
                result.data.submitDate = result.data.submitDate.substring(0,10);
                $("#"+id).replaceWith(template("registerForm",result.data));
            }else{
                $.messager.alert('提示',result.message);
            }
        }
    });
}

