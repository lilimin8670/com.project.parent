$(function(){

    //单选和多选的处理
    $("input[type='radio']").css("display","none");
    $("input[type='checkbox']").css("display","none");
    $(".radioGroup").find(":radio").click(function(){
        var $span=$(this).next("span").addClass("active");
        $(this).parents(".radioGroup").find(".radio").not($span).removeClass("active");
    });

    $(".radioGroup").find(":checkbox").click(function(){
        if ($(this)[0].checked){
            $(this).next("span").addClass("active");
        }else {
            $(this).next("span").removeClass("active")
        }
    });

    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        $("input").focus(function(){
            $("header").css({"position":"absolute","top":"0"});
        });
        $("input").blur(function(){
            $("header").css({"position":"fixed"});
        });
    }


    $("#btn button").click(function(){
        var tabhei = $(window).height();
        $(".panel").css("top",tabhei - "150");
        $(".window-shadow").css("top", tabhei - "150");
        $(".window-mask").css("height",tabhei);
    });

    $.extend($.fn.validatebox.defaults.rules, {
        radio: {
            validator: function (value, param) {
                var input = param[0], ok = false;
                $('input[name="' + input + '"]').each(function () {
                    if (this.checked) {
                        ok = true;
                        return false;
                    }
                });
                return ok
            },
            message: '请选择一项'
        },
        checkbox: {
            validator: function (value, param) {
                var groupName = param[0], checkNum = 0;
                $('input[name="' + groupName + '"]').each(function () { //查找表单中所有此名称的checkbox
                    if (this.checked) checkNum++;
                });

                return checkNum > 0;
            },
            message: '请至少选择一项'
        },
        contactInfo:{
            validator: function (value, param) {
                var regx = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$|^(((0\d2|0\d{2,3})[- ]?)?\d{3,8})?$/;
                // var regx = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$|^(((0\d2|0\d{2})[- ]?)?\d{8}|((0\d3|0\d{3})[- ]?)?\d{7})(-\d{3})?$/;
                if(regx.test(value)){
                    return true;
                }else{
                    return false;
                }
            },
            message: '联系方式不正确!'
        },
        idCard:{
            validator: function (value, param) {
                var regx = /^[A-Za-z0-9\-\/()]*$/;
                if(regx.test(value)){
                    return true;
                }else{
                    return false;
                }
            },
            message: '身份证不正确!'
        },
        intOrFloatOne:{
            validator: function (value, param) {
                var regx = /^[0-9]+([.][0-9]{1}){0,1}$/;
                if (regx.test($.trim(value))) {
                    return true;
                } else {
                    return false;
                }
            },
            message: '请输入数字，可以带一位小数!'
        }
    });

    $("#memberList").datagrid({
        columns : [[
            {
                title : '会员账号',
                field : 'loginname',
                width : "47%",
                align : "center"
            },
            {
                title : '会员姓名',
                field : 'memName',
                width : "47%",
                align : "center"
            }]]
    });
});


var memberId = '';
/**
 * 点击选择会员按钮弹出查询会员窗口
 */
function selectByMem(){
    $("#memberDialog").dialog({
        title:"查询会员",
        width: $(window).width()*0.96,
        height: window.screen.height*0.6,
        closable: true,
        cache: false,
        modal: true
    });
    $(".panel-tool").css({"background-color":"skyblue","display":"block"});
}
/**
 * 点击查询执行的方法
 */
function selectMember(){
    $("#memberList").datagrid({
        url : cp+"/service/dj/registerForm/getSelectMemberList",
        method : 'post',
        fit : true,
        idField : 'id',
        singleSelect:true,
        queryParams:{
            p:$("#memParam").val()
        },
        onSelect: isHavePlanBook
    });
}


/**
 * 当选择了会员
 * 查询该会员近三个月是否有计划书
 */
function isHavePlanBook(rowIndex, rowData){
    var newClassify=parseInt(classify)+6;
    $.ajax({
        async : false,
        url : cp+"/service/planBook/getPlanBookByMemberId",
        data : "memberId="+rowData.id+"&classify="+newClassify,
        dataType : "json",
        success : function(result){
            if (result.success){
                memberId = rowData.id;
                console.log(memberId);
                if ($("#memName").length>0){
                    $("#memName").val(rowData.memName);
                }
                if ($("#logName").length>0){
                    $("#logName").val(rowData.loginname);
                }
                if ($("#kahaoCode").length>0){
                    $("#kahaoCode").val(rowData.id);
                }
                if ($("#level").length>0){
                    $("#level").val(levelMapJson[rowData.level]);
                }
                if (rowData.sex=="女"){
                    $("#female").attr("checked","checked");
                    $("#female").next("span").addClass("active");
                }else {
                    $("#male").attr("checked","checked");
                    $("#male").next("span").addClass("active");
                }
                if ($("#memberPhone").length>0){
                    $("#memberPhone").val(rowData.phone);
                }
                if ($("#nationName").length>0){
                    if (rowData.nation){
                        $("#nationName").val(nationMap[rowData.nation]);
                    }
                }
                if ($("#beliefName").length>0){
                    if (rowData.religiousBelief){
                        $("#beliefName").val(beliefMap[rowData.religiousBelief]);
                    }
                }
                if ($("#prefessionName").length>0){
                    if (rowData.profession){
                        $("#prefessionName").val(professionMap[rowData.profession]);
                    }
                }
                if ($("#cardType").length>0){
                    $("#cardType").val(rowData.cardType);
                }
                if ($("#idCard").length>0){
                    $("#idCard").val(rowData.idCard);
                }
                var memAddress = "";
                if(rowData.area == null || rowData.area == ''){
                    memAddress = region.getAllNameByCityId(rowData.city);
                }else{
                    memAddress = region.getAllNameByAreaId(rowData.area);
                }
                if ($("#address").length>0){
                    $("#address").val(memAddress+rowData.address);
                }
                if ($("#birthday").length>0){
                    var now=new Date(rowData.birthday);
                    var day = ("0" + now.getDate()).slice(-2);
                    var month = ("0" + (now.getMonth() + 1)).slice(-2);
                    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
                    if($("#birthday").attr("class").indexOf("easyui-datebox")>-1){
                        $("#birthday").datebox("setValue",today);
                    }else {
                        $("#birthday").val(today);
                    }

                }
                if ($("#storePhone").length>0){
                    $("#storePhone").val(rowData.storePhone);
                }
                var address = "";
                if(rowData.storeArea == null || rowData.storeArea == ''){
                    address = region.getAllNameByCityId(rowData.storeCity);
                }else{
                    address = region.getAllNameByAreaId(rowData.storeArea);
                }
                if ($("#storeAddress").length>0){
                    $("#storeAddress").val(rowData.storeAddress);
                }
                if ($("#idCard").length>0){
                    $("#idCard").val(rowData.idCard);
                }
                $("#storeId").val(rowData.storeId);
                $("#storeName").val(rowData.storeName);
                $("#storeName1").val(rowData.storeName);

                $("#planBookId").val(result.data);
                $("#memberDialog").dialog("close");
                $("#memberId").val(rowData.memName);
                // isHaveRegisterFormByClassify();
                getOrganName();
                //获取责任专家
                if ($("#expert").length>0){
                    getExpert();
                }
            }else {
                noty({text:"该会员近三个月没有计划书，请先填写计划书！",timeout:2000});
            }
        }
    });
}

function isHaveRegisterFormByPlanBookId(){
    var param = {
        "memberId":memberId,
        "planBookId":planBookId
    }
    $.post(cp+"/service/dj/registerForm/isHaveRegisterFormByPlanBookId",param,function(result){
        if (result.success){
            if (result.data  == true){
                getOrganName();
            }else {
                var classifyName = "";
                if (classify==1){
                    classifyName = "美丽";
                }else {
                    classifyName = "健康";
                }
                $.messager.alert("提示","该会员近三个月已经填写过"+classifyName+"的报名表了，不能再次发起报名表","info");
            }
        }else {
            $.messager.alert("错误",result.message,"error");
        }

    },'json');
}


function getOrganName(){
    var param = {
        "memberId": memberId,
        "post":'06'
    };
    if ($("#groupName").length > 0){
        $.post(cp+"/service/dj/registerForm/getOrganNameByMemberIdAndPost",param,function(result){
            if (result.success){
                $("#groupName").val(result.data);
            }else {
                $.message.alert("提示","没有找到该会员的品牌组","info");
            }

        },'json');
    }
}

/**
 * 获取责任专家
 */
function getExpert() {
    var param = {
        "memberId": memberId,
        "classify":classify
    };
    $.post(cp+"/service/dj/registerForm/getExpertByMemberIdAndClassify",param,function(result){
        if (result.success){
            $("#expert").val(result.data);
        }else {
            $.message.alert("提示","没有找到该会员的责任专家","info");
        }

    },'json');
}


/**
 * 保存或者提交数据
 */
function saveForm(status){
    //判断该会员是否报过此报名团 如果报过则不允许再报
    $.ajax({
        url:cp+"/service/dj/registerForm/validateRegGroupAndMember",
        data:{
            "memberId" : memberId,
            "regGroupId" : regGroupId
        },
        dataType:"json",
        success:function(result){
            if (result.success){
                saveRegisterForm(status);
            }else if (!result.success){
                noty({text:"该会员已经报过该预约团了，不能重复报名",timeout:3000});
                $("#memberId").focus();
            }
        }
    });
}

function saveRegisterForm(status){

    //noty({text:"aaaa",layout:"center",timeout:2000,callback:{
    //    onClose:function() {
    //        alert(22);
    //    }
    //}});
    //return;
    if ($(".moren_img")!=undefined){
        $(".form input[type=file]").val("");
    }

    $("#btn button").prop("disabled",true);
    //校验表单
    if (memberId == "") {//校验不通过关提示信息
        noty({text:"请选择会员",timeout:2000});
        $("#memberId").focus();
        $("#btn button").prop("disabled",false);
        return false;
    }
    var planBookId = $("#planBookId").val();
    if (planBookId == "") {//校验不通过关提示信息
        noty({text:"该会员近三个月没有计划书，请先填写计划书",timeout:3000});
        $("#memberId").focus();
        $("#btn button").prop("disabled",false);
        return false;
    }
    /*var flag = $("#applyForm").form("validate");
    if (!flag){
        $("#btn button").prop("disabled",false);
        return flag;
    }*/
    var content = JSON.stringify($("#applyForm").form2json());
    var param = {
        "classify" : classify,
        "type" : type,
        "regGroupId" : regGroupId,
        "deadline" : regDeadline,
        "storeId" : $("input[name='storeId']").val(),
        "memberId" : memberId,
        "content" : content,
        "targetPro" : $("input[name='targetPro']").val(),
        "applyer" : $("#applyer").val(),
        "processId" : $("#processId").val(),
        "planBookId" : $("#planBookId").val(),
        "status" : status
    };
    $.ajax({
        async : false,
        type : "post",
        url : cp+"/service/dj/registerForm/save",
        data : param,
        dataType : "json",
        success : function(result){
            if (result.success){
                if (result.data == 1){
                    noty({text:result.message,layout:"top",timeout:3000,callback:{
                        onClose:function() {
                            window.scrollTo(0,0);
                            window.location.reload(true);
                        }
                    }});
                }else if (result.data == 0){//没有审批流程
                    noty({text:"该报名表没有设置审批流程，无法提交审批，请联系客服！",timeout:2000});
                    $("#btn button").prop("disabled",false);
                }else if (result.data == 2){
                    noty({text:"该报名表第一审批岗位没有对应的人，请设置相应岗位的人！",timeout:3000});
                }
            }else {
                $.messager.alert("错误",result.message,"error");
                $("#btn button").prop("disabled",false);
            }
        }
    });
}


function lookPlanBook(){

    var planBookId = $("#planBookId").val();
    if (memberId == null ||  memberId == ""){
        noty({text:"请先选择会员！",timeout:3000});
        return false;
    }
    if (planBookId == "" || planBookId == null){
        noty({text:"选择的会员还没有计划书，需要先填写计划书",timeout:2000});
        return false;
    }
    window.location.href = cp+"/service/planBook/getCheckView?id="+planBookId+"&nameType=6&btnType=1"+"&code="+code+"&title="+title+"&from="+from;

}

function fanhui(){
    window.location.href = cp+"/service/dj/registerForm/returnNewRegisterFormList?type="+type+"&classify="+classify+"&code="+code+"&title="+title+"&from="+from;
}


