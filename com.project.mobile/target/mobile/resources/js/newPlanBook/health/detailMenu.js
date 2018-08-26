function openInfoDialog(divId) {
    var title="";
    if(divId=="gtsmyhjyDiv"){
        title="个体生命养护建议"
    }else if(divId=="basicInfoDiv"){
        title="会员基本档案";
    }
    layer.open({
        title:title,
        type: 1,
        closeBtn: 1,
        scrollbar: true,
        area: ['100%', '100%'],
        content: $('#'+divId),
        onClose:function () {
            $(".aside-menu").hide();
        }
    });
}

/**
 * 查看问卷详情
 * @param detailType
 */
function goHealthQuesDetail(detailType) {
    //如果类型为1则访问健康问卷详情
    if(detailType==1){
        window.location.href=healthQuestionnaireUrl+"/questionnaire/goQuestionnaire?questionAnswerId="+questionAnswerId+"&sex="+sex+"&nameType="+nameType+"&id="+id+"&btnType="+btnType;
    }
    //如果类型为2则访问风险评估报告详情
    else if(detailType==2){
        window.location.href=healthQuestionnaireUrl+"/questionnaire/goToRiskAssessment?riskAssessId="+questionAnswerId+"&sex="+sex+"&nameType="+nameType+"&id="+id+"&btnType="+btnType;
    }
}

/**
 * 根据nameType返回上一页面
 * @param nameType
 */
function goBackByNameType(nameType) {
    if(nameType=="edit"){
        window.location.href=CP + "/service/kfPlanBook/index?type="+type;
    }else if (nameType=="1"){
        window.location.href=CP+"/service/kfPlanBook/indexCheck?type="+type;
    }else if(nameType=="2"){
        window.location.href=CP+"/service/kfPlanBook/indexManage?type="+type;
    }else if(nameType=="3"){
        window.location.href=CP+"/service/planBookVoidedAudit/index";
    }else if(nameType=="4"){
        window.location.href=CP+"/service/memPlanBook/index";
    }else if(nameType=="5"){
        window.location.href=CP+"/service/planBook/indexCheck?type="+type;
    }
}


/**
 * 保存计划书内容
 */
function editPlanBookContent() {
    var url=CP+"/service/planBook/savePlanBook";
    $(".button_bc").attr('disabled',true);
    var param={
        "id":$("#id").val(),
        "content":$("#content").val(),
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
    },"json");
}

/**
 * 关闭弹出对话框
 * @param divId
 */
function cancleEditDiv(divId) {
    layer.closeAll();
}