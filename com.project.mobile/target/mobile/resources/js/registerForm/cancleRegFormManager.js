/**
 * @author zhaihonghong
 */
$(function(){
    //定位头部不动
    // $("body").children("div").eq("0").css("padding-top","60px");

    refresher.init({
        id:"wrapper",
        pullDownAction:Refresh,
        pullUpAction:Load,
        childHtmlTag:"div"
    });

    Load();
});

var currentPage = 1;
var pageSize = 5;
/**
 * 当前加载状态
 * @type {string}
 */
var loadStatus = "ok";


function Load() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    console.log("load:"+currentPage);
    loadData(0);
}


function Refresh(){
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    currentPage = 1;
    console.log("refresh:"+currentPage);
    loadData(1);
}

/**
 *
 * @param isLoad 0,加载数据;1,刷新数据
 */
function loadData(isLoad) {

    $.ajax({
        url: cp + "/service/registerFormVoidedAudit/getRegisterFormVoidedAuditByParam",
        data: {
            "currentPage": currentPage,
            "pageSize": pageSize
        },
        dataType: "json",
        success: function (result) {
            //如果是下拉屏幕，数据加载完成后隐藏加载loading图标
            if(isLoad==1){
                document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
            }
            var registerFormVoidedAuditList = result.registerFormVoidedAuditList;
            if (registerFormVoidedAuditList != null && registerFormVoidedAuditList.length>0) {
                if (isLoad == 1){
                    $("#registerFormTable").empty();
                }
                for (var i = 0; i < registerFormVoidedAuditList.length; i++) {
                    var status = registerFormVoidedAuditList[i].auditStatus;
                    registerFormVoidedAuditList[i].auditStatus = voidedAuditStatusJson[status];
                    var type = registerFormVoidedAuditList[i].type;
                    registerFormVoidedAuditList[i].typeText = typesJson[type];
                    var classify = registerFormVoidedAuditList[i].classify;
                    registerFormVoidedAuditList[i].classifyText = classifiesJson[classify];
                    var voidedDate = registerFormVoidedAuditList[i].voidedDate;
                    registerFormVoidedAuditList[i].voidedDate = voidedDate.substring(0,10);
                    var tr = template("registerForm", registerFormVoidedAuditList[i]);
                    $(tr).appendTo("#registerFormTable");
                    if (status != "0") {
                        $("#" + registerFormVoidedAuditList[i].id).find(".left-bt").hide();
                    }
                }
                currentPage++;
                if(document.getElementById("wrapper").querySelector(".pullDownLabel")){
                    document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
                    document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML="刷新成功";
                    setTimeout(function () {
                        document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML=" ";
                    },1000);
                }
                wrapper.refresh();
            }else {
                wrapper.refresh();
                document.getElementById("wrapper").querySelector(".pullUpIcon").style.display="none";
                document.getElementById("wrapper").querySelector(".pullUpLabel").innerHTML="已没有数据!";
            }

            if ($("#registerFormTable").children().length == 0) {
                $("#wrapper").hide();
                $("body").css({
                    'background': "url('/resources/img/homepage/noData.png') no-repeat",
                    'background-size': "100%"
                });
            }
            loadStatus = "ok";
        }
    });
}

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


function cancleSuggestion(id){
    window.location.href = cp+"/service/dj/registerForm/returnCancleSuggestion?id="+id;
}

function checkCancleDialog(id,registerFormId,reson){
    $("#id").val(id);
    $("#registerFormId").val(registerFormId);
    $("#reson").text(reson);
    $("#auditOpinion").val("");
    $("#cancleDialog").dialog({
        title: '作废审核',
        width: "70%",
        height: 300,
        closed: false,
        cache: false,
        border:'thin',
        modal: true,
        buttons: [{
            text:'通过',
            handler:function(){
                checkCancleRegForm('1',id);
            }
        },{
            text:'驳回',
            handler:function(){
                checkCancleRegForm('2',id);
            }
        }]
    });
}

function checkCancleRegForm(auditStatus,id){
    $.post(cp+"/service/registerFormVoidedAudit/getById", {"id":id}, function (result) {
        if (result != 0) {
            noty({text: "该待办任务已被处理", timeout: 5000});
            return false;
        }

        var url;
        var statusText;
        if (auditStatus == '1'){
            statusText = '审核通过';
            url = cp+"/service/registerFormVoidedAudit/checkInvalidApply";
        }else {
            statusText = '驳回';
            url = cp+"/service/registerFormVoidedAudit/rejectInvalidApply";
        }

        $.messager.progress({
            title:"提示",
            text:"数据处理中，请稍后...."
        });
        var param = {
            "id" : $("#id").val(),
            "registerFormId" : $("#registerFormId").val(),
            "auditOpinion" : $("#auditOpinion").val()
        };
        /*var isValid = $("#auditOpinion").validatebox("isValid");
         if (!isValid){
         $("#cancelReason").focus();
         $.messager.progress("close");
         return isValid;
         }*/
        $.post(url, param, function (result) {
            if(result.success) {
                noty({text:result.message,timeout:3000});
                $("#cancleDialog").dialog('close');
                $("#"+id).find(".shwc").text(statusText);
                $("#"+id).find(".left-bt").hide();
            }else {
                $.messager.alert("错误",result.message,"error");
            }
            $.messager.progress("close");
        },"json");
    });

}


/**
 * 显示详情
 * @param id
 * @param doType
 */
function showDetail(registerFormId,type,classify,processId,doType){

    window.location.href = cp + "/service/check/registerForm/returnRegisterFormCheckDetail?regFormId="+registerFormId+"&type="+type+"&classify="+classify+
        "&processId="+processId+"&doType="+doType+"&from="+from+"&actionFrom=cancel";
}

function fanhui() {
    console.log(header);
    if (from=="push"){
        // todo
        if (header){//iPhone
            window.messageCenter();
        }else {//android
            window.mobile.messageCenter();
        }
    }else {
        window.location.href = cp + "/service/homepage/initSecondKefuPage?code=m-kf-5&title=作废管理";
    }

}