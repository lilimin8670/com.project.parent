/**
 * Created by Administrator on 2016/7/14.
 */
var wh=$(window).height;
$(function(){
    $(":radio").addClass("test");
    $(":radio").click(function() {
        /*console.log($(this).attr("class"));*/
        var class_ = $(this).attr("class");

        if (class_ == "test1") {
            $(this).attr("checked", false);
            $(this).attr("class", "test");
        } else {
            $(this).attr("class", "test1");
        }
    });
    findPlanBookById();
});



/**回到首页面
 * @Author yangxiao
 * @Param
 * @Date 2016/7/19 13:52
 */
function closeDiv(divId){
    $("header").css('display','block');
    $(".aside-menu").css('display','block');
    $("#"+divId).css('display','none');
}

/**
 * 打开iframe
 * @param divId
 */
function openIframe(singleId,url){
    //给iframe页面赋值url，打开iframe嵌套div
    $("#"+singleId+"Iframe").attr('src', url);
    $("#"+singleId+"Div").css('display','block');
    $("body").css('height',wh);
    $("#"+singleId+"Iframe").load(function(){
        //iframe加载完全后设置iframe高度为窗口高度
        $(this).height(wh);
        //隐藏父页面的header以及主div
        $("header").css('display','none');
        $(".aside-menu").css('display','none');
        //根据btnType的值(0：是1：否)
        //如果是允许操作的状态则显示保存按钮否则不显示保存按钮
        if(btnType){
            if(btnType==1){
                $("#"+singleId+"Iframe").contents().find(".feedback_rr").children("a").css('display','none');
            }else{
                if(kefuPost=="11"){
                    $("#"+singleId+"Iframe").contents().find(".feedback_rr").children("a").css('display','none');
                }else {
                    $("#"+singleId+"Iframe").contents().find(".feedback_rr").children("a").css('display','block');
                }
            }
        }
    });
}

/**
 * 根据id查询计划书对象
 * @Author yangxiao
 * @Param
 * @Date 2016/7/22 15:17
 */
function findPlanBookById(){
    var id=$("#planBookId").val();
    if(id){
        var url = CP+"/service/planBook/findPlanBookById";
        var param = {"id":id};
        $.post(url, param, function (result) {
            if(result.success) {
                $("#memberIdHidParent").val(result.data.memberId);
                $("#planBookParent").val(result.data.content);
                $("#memloginname").val(result.data.memberLoginname);
                $("#memberLoginnameHParent").val(result.data.memberLoginname);
                $("#processIdHid").val(result.data.processId);
                var planBookData=$("#planBookParent").val();
                var planBookDataJson=JSON.parse(planBookData);
                //$("#memberLoginnameHParent").val(planBookDataJson.memLogNameH);
                $("#healthSystemParent").val(planBookDataJson.healthProjH);
                var systemName = planBookDataJson.healthProjH;
                $("#systemName").text(systemName);
                //给子页面赋值
                setSonValue('basicdata',planBookData);
                setSonValue('livinghabits',planBookData);
                setSonValue('symptomdetails',planBookData);
                setSonValue('familyheredity',planBookData);
                setSonValue('generisk',planBookData);
                setSonValue('functionalrisk',planBookData);
                setSonValue('prerisk',planBookData);
                setSonValue('healthcare',planBookData);
                setSonValue('interventionsymptom',planBookData);
                setSonValue('maintenanceplan',planBookData);
                setSonValue('medicament',planBookData);
                setSonValue('selfmonitoring',planBookData);
                setSonValue('commissionerdetail',planBookData);
                //设置提交按钮显示
                console.log();
                if(result.data.status==2){
                    $("#submitBtn").show();
                }else{
                    $("#submitBtn").hide();
                }
            }else {
                layer.alert(result.message,{closeBtn: 0});
            }
        },"json");
    }
}


/**
 * 保存计划书
 */
function savePlanBook_health(url,formId,optType){
    //显示父页面隐藏的控件
    $("header").css('display','block');
    $(".aside-menu").css('display','block');
    var memberIdHidParent=$("#memberIdHidParent").val();
    var memberLoginnameHParent=$("#memberLoginnameHParent").val();
    //校验表单
    //$.messager.progress({
    //    title:"提示",
    //    text:"数据处理中，请稍后...."
    //});
    if(!memberIdHidParent){
        layer.alert("用户不能为空！",{closeBtn: 0});
    }else{
        var basicdataFormParent=JSON.parse($("#basicdataFormParent").val()||"{}");
        var livinghabitsFormParent=JSON.parse($("#livinghabitsFormParent").val()||"{}");
        var symptomdetailsFormParent=JSON.parse($("#symptomdetailsFormParent").val()||"{}");
        var familyheredityFormParent=JSON.parse($("#familyheredityFormParent").val()||"{}");
        var generiskFormParent=JSON.parse($("#generiskFormParent").val()||"{}");
        var functionalriskFormParent=JSON.parse($("#functionalriskFormParent").val()||"{}");
        var preriskFormParent=JSON.parse($("#preriskFormParent").val()||"{}");
        var healthcareFormParent=JSON.parse($("#healthcareFormParent").val()||"{}");
        var interventionsymptomFormParent=JSON.parse($("#interventionsymptomFormParent").val()||"{}");
        var maintenanceplanFormParent=JSON.parse($("#maintenanceplanFormParent").val()||"{}");
        var medicamentFormParent=JSON.parse($("#medicamentFormParent").val()||"{}");
        var selfmonitoringFormParent=JSON.parse($("#selfmonitoringFormParent").val()||"{}");
        var commissionerdetailFormParent=JSON.parse($("#commissionerdetailFormParent").val()||"{}");
        //父页面隐藏域
        var contentJson;
        var planBookParent=JSON.parse($("#planBookParent").val()||"{}");
        var id=$("#planBookId").val();
        if(id){
            var formJson=JSON.parse($("#"+formId+"FormParent").val()||"{}");
            contentJson= $.extend(planBookParent,formJson);
        }else {
            contentJson = $.extend(basicdataFormParent, livinghabitsFormParent, symptomdetailsFormParent, familyheredityFormParent, generiskFormParent,
                functionalriskFormParent, preriskFormParent, healthcareFormParent, interventionsymptomFormParent, maintenanceplanFormParent,
                medicamentFormParent, selfmonitoringFormParent, commissionerdetailFormParent);
        }
        /*if(optType==1){
            if(!contentJson.antiagingappeal){
                layer.alert("请填写症状的详细表述问卷中最想解决的主诉求",{closeBtn: 0});
                return false;
            }
            var isValid = $("#"+formId).form("validate");
            if (!isValid) {//校验不通过关提示信息
                $.messager.progress("close");
                return isValid;
            }
        }*/
        var dataContent=JSON.stringify(contentJson);
        var param = {
            "id":$("#planBookId").val(),
            "type":$("#planBookType").val(),
            "content":dataContent,
            "memberId":$("#memberIdHidParent").val(),
            "processId":$("#processIdHid").val(),
            "memberLoginname":$("#memberLoginnameHParent").val()
        };

        var url = CP+url;
        $.post(url, param, function (result) {
            if(result.success) {
                layer.alert(result.message,{closeBtn: 0}, function(index){
                    //赋值id
                    $("#planBookId").val(result.data.id);
                    findPlanBookById();
                    //给审核页面赋值
                    $("#planBookContent").val(dataContent);
                    $("#"+formId+"Div").css('display','none');
                    if(url.indexOf("submitPlanBook")>=0){
                        window.location.href=CP+"/service/kfPlanBook/index?type=2";
                    }
                    layer.close(index);
                });
            }else {
                layer.alert(result.message,{closeBtn: 0});
            }
        },"json");
    }

}

/**
 * 给子页面赋值
 * @param frameId
 */
function setSonValue(sonId,planBookData){
    $("#"+sonId+"FormParent").val(planBookData);
}

/**
 * 新增售后计划
 * @author abner
 */
function addTrackRecord(id,registerId){
    $.ajax({
        url: CP + "/service/sysTrace/addTrackRecord",
        data: {
            "id": id,
            "registerId": registerId
        },
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            if (result.success) {
                window.reback();
            }
        }
    });
}


/**
 * 验证输入框值
 */
$.extend($.fn.validatebox.defaults.rules,{
    minOrMax: {
        validator: function(value, param){
            return (value >= param[0] && value <= param[1]);
        },
        message: '只能输入{0}-{1}之间的数字'
    }
});


/**
 * 点击返回按钮
 * @Author xuanYin
 * @Param
 * @Date 2016/7/22 14:28
 */
var orgIndex = window.history.length;
function reback(){
    //遍历并隐藏页面所有iframe外侧的div
    var goIndex = orgIndex - window.history.length-1;
    window.history.go(goIndex); //如果iframe的url变了1次，那么goIndex就是-2，类推
}


/**
 * 安卓返回按钮回调函数
 */
function onKeyBackPressed(){
    reback();
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid){
        window.location.reload();
    }
}