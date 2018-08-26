$(function () {
    $(".body_bg").css({'background':"url('/resources/img/homepage/noData.png')",'background-size':"100%"});
    if(memberLoginName){
        $("#memberLoginName").combobox('setValue',memberLoginName);
        loadData();
    }
    //下拉刷新，上划加载
    /*refresher.init({
        id: "wrapper",
        pullDownAction: refresh,
        pullUpAction: load,
        childHtmlTag: "div"
    });
    load();*/
});
var indexPro=0;
var currentPage=1;
var pageSize=30;
/**
 * 加载数据
 * @param down
 */
function loadData(down) {
    $("#healthQuesList").html("");
    memberLoginName=$("#memberLoginName").combobox('getValue');
    var params={
        "memberLoginName":$("#memberLoginName").combobox('getValue'),
        "currentPage":currentPage,
        "pageSize":pageSize
    };
    $.ajax({
        url:CP+"/service/kfPlanBook/findQuesAnswerListByLoginname",
        data:params,
        type:"post",
        async:false,
        dataType:"json",
        success:function(result){
            //如果是下拉屏幕，数据库加载完成后隐藏加载loading图标
            /*if(down==1){
                document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
            }*/
            if(result.success){
                if(result.data!=null){
                    if(result.totalCount==0){
                        $(".body_bg").css({'background':"url('/resources/img/homepage/noData.png')",'background-size':"100%"});
                        $("#healthQuesList").html("");
                        // $(".wrapper").hide();
                        return;
                    }
                    $(".body_bg").css({'background':""});
                    console.log("查询结果："+result.data);
                    var healthQuesData=result.data;
                    if(healthQuesData && healthQuesData.length>0){
                        for(var i=0;i<healthQuesData.length;i++){
                            healthQuesData[i].index=i+indexPro;
                            healthQuesData[i].created = healthQuesData[i].created.substring(0,10);
                            var tr = template("healthQuesTmp",healthQuesData[i]);
                            $(tr).appendTo("#healthQuesList");
                            // $("#healthQuesList").html("");
                            // $("#healthQuesList").html(tr);
                            setBtns(healthQuesData[i].id,healthQuesData[i].sex,healthQuesData[i].index,healthQuesData[i].memberId,healthQuesData[i].loginname);
                        }
                        // currentPage++;
                        indexPro+=healthQuesData.length;
                        /*if(document.getElementById("wrapper").querySelector(".pullDownLabel")){
                            document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
                            document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML="刷新成功";
                            setTimeout(function () {
                                document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML=" ";
                            },1000);
                        }
                        wrapper.refresh();*/
                        juzhong();
                    }else{
                        /*wrapper.refresh();
                        document.getElementById("wrapper").querySelector(".pullUpIcon").style.display="none";
                        document.getElementById("wrapper").querySelector(".pullUpLabel").innerHTML="已没有数据!";*/
                    }
                }
            }
            // loadStatus = "ok";
        },
        error:function(){
            layer.alert("网络错误！",{closeBtn: 0});
        }
    });
}

/**
 * 上拉加载
 */
/*function load() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    loadData(0);
}*/

/**
 * 当前加载状态
 * @type {string}
 */
/*var loadStatus = "ok";
function refresh() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    currentPage=1;
    $("#healthQuesList").html("");
    loadData(1);
}*/

/**
 *
 */
function juzhong(){
    var num = $(".launchplan").length;
    for(var i=0; i<num; i++){
        var shheight = $('.launchplan-left:eq('+ i +') div').height()+15;
        $('.launchplan-right:eq('+ i +') div').css('height', shheight);
    }
}
/**
 * 设置按钮显示
 */
function setBtns(id,sex,i,memberId,loginname){
    var btnHtml="";
    btnHtml+=template("healthQuesDetailBtn",{"id":id,"sex":sex,"loginname":loginname})+"&nbsp;&nbsp;";
    btnHtml+=template("riskAssessmentBtn",{"id":id,"sex":sex,"loginname":loginname})+"&nbsp;&nbsp;";
    btnHtml+=template("createPlanBookBtn",{"id":id,"sex":sex,"memberId":memberId});
    $("#btnDivs_"+i).html(btnHtml);
}

/**
 * 查看健康问卷详情
 */
function healthQuesDetail(questionAnswerId,sex,memberLoginName) {
    window.location.href=questionnaireUrl+"/questionnaire/goQuestionnaire?questionAnswerId="+questionAnswerId+"&sex="+sex+"&memberLoginName="+memberLoginName;
}

/**
 * 查看评估报告详情
 */
function riskAssessment(questionAnswerId,sex,memberLoginName) {
    window.location.href=questionnaireUrl+"/questionnaire/goToRiskAssessment?riskAssessId="+questionAnswerId+"&sex="+sex+"&memberLoginName="+memberLoginName;

}

/**
 * 发起计划书
 * @param questionAnswerId
 * @param memberId
 * @param sex
 */
function createPlanBook(id,memberId,sex) {
    //判断能不能发起计划书
    var json = {
        "type":8,
        "memberId":memberId
    };
    var resp = $.ajax({
        type: "POST",
        url: CP + "/service/planBook/isPlanBook",
        data: json,
        async: false,
        cache: false,
        dataType: "json"
    }).responseText;
    if(resp=="true"){
        $("#healthQuesId").val(id);
        $("#memberId").val(memberId);
        layer.open({
            title:"个体生命养护建议",
            type: 1,
            closeBtn: 1,
            scrollbar: true,
            area: ['100%', '100%'],
            content: $('#gtsmyhjyDiv')
        });
    }else{
        layer.alert("该会员已有有效计划书或存在未结束的规划书，不能发起",{offset: '45%'});
    }
}

/**
 * 保存计划书
 * @param saveOrSubmit
 */
function savePlanBookByHq(saveOrSubmit) {
    var url=CP+"/service/kfPlanBook/savePlanBook";
    $(".button_bc").attr('disabled',true);
    if(saveOrSubmit){
        url=CP+"/service/kfPlanBook/submitPlanBook";
        $(".button_tj").attr('disabled',true);
        $(".button_bc").attr('disabled',false);
    }
    var param={
        "content":$("#content").val(),
        "questionAnswerId":$("#healthQuesId").val(),
        "type":8,
        "memberLoginname":memberLoginName,
        "memberId":$("#memberId").val()
    };
    console.log(param);
    $.post(url, param, function (result) {
        if(result.success) {
            noty({text:result.message,timeout:3000});
            window.location.href=CP + "/service/kfPlanBook/index?type="+8;
        }else {
            layer.alert(result.message);
        }
        $(".button_bc").attr('disabled',false);
        $(".button_tj").attr('disabled',false);
    },"json");
}

/**
 * 关闭弹出框
 * @param divId
 */
function canclePlanBookDialog(divId) {
    layer.closeAll();
}


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
 * 设置会员账号
 *
 * @param record
 */
function setLoginNameValue(record) {
    memberLoginName=record.loginname;
    console.log("会员账号是："+memberLoginName);
    $("#memberId").val(record.id);
}

/**
 * 返回发起列表
 */
function goAddList() {
    window.location.href=CP + "/service/kfPlanBook/index?type=8";
}