var regFormId;
var memberId;
var storeName;
var isOperation;
$(function(){
    //单选和多选的处理
    $("input[type='radio']").css("display","none");
    $("input[type='checkbox']").css("display","none");

    $(".radioGroup").find(":radio").click(function(){
        $(this).parents(".radioGroup").find(".hiddenText").val(1);
        var $span=$(this).next("span").addClass("active");
        $(this).parents(".radioGroup").find(".radio").not($span).removeClass("active");
    });

    $(".radioGroup").find(":checkbox").click(function(){
        if ($(this)[0].checked){
            $(this).parents(".radioGroup").find(".hiddenText").val(1);
            $(this).next("span").addClass("active");
        }else {
            $(this).next("span").removeClass("active")

            var num = 0;
            $(".radioGroup").find(":checkbox").each(function () {
                if ($(this)[0].checked){
                    num += 1;
                }
            });
            if (num > 0){
                $(this).parents(".radioGroup").find(".hiddenText").val(1);
            }else {
                $(this).parents(".radioGroup").find(".hiddenText").val("");
            }
        }
    });

    $(".imgMax").hide();
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        $("input").focus(function(){
            $("header").css({"position":"absolute","top":"0"});
        });
        $("input").blur(function(){
            $("header").css({"position":"fixed"});
        });
    }


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
        idCardOrMaxLen: {
            validator: function(value,param){
                var cardType = $("#cardType").val();
                var flag;
                //cardType为1是身份证
                if (cardType == 1) {
                    flag = isCardID(value);
                    if(flag != true){
                        $.fn.validatebox.defaults.rules.idCardOrMaxLen.message = flag;
                        return flag = false;
                    }
                } else {
                    var reg = /^[0-9a-zA-Z]+$/g;
                    if (reg.test(value)) {
                        flag = true;
                    }else{
                        $.fn.validatebox.defaults.rules.idCardOrMaxLen.message = "请输入数字、字母！";
                        return flag = false;
                    }
                    if(value.length >20){
                        $.fn.validatebox.defaults.rules.idCardOrMaxLen.message= "长度不得大于20！";
                        return flag =  false;
                    }else{
                        flag = true;
                    }
                }
                return flag == true ? true : false;
            },
            message: '不是有效的证件号码！'
        },
        intOrFloat: {// 验证整数或小数
            validator: function (value) {
                return /^\d+(\.\d+)?$/i.test(value);
            },
            message: '请输入数字，并确保格式正确'
        },
        contactInfo:{
            validator: function (value, param) {
                var regx = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$|^(((0\d2|0\d{2,3})[- ]?)?\d{3,8})?$/;
                // var regx = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$|^(((0\d2|0\d{2})[- ]?)?\d{8}|((0\d3|0\d{3})[- ]?)?\d{7})(-\d{3})?$/;
                if(regx.test($.trim(value))){
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
                if(regx.test($.trim(value))){
                    return true;
                }else{
                    return false;
                }
            },
            message: '身份证不正确!'
        },mobileTelephone: {
            validator: function (value, param) {
                var regx = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$/;
                if (regx.test(value)) {
                    return true;
                } else {
                    return false;
                }
            },
            message: '移动电话填写格式不正确!'
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

    if (doType == "1"){
        $(".text").hide();
        $(".auditdetails-foot").hide();
        $("#idForm input").prop("readonly","readonly");
        $("#applyForm input,textarea").attr("readonly","readonly");
        $("#applyForm select,input[type='radio'],input[type='checkbox']").attr("readonly","readonly");
        $("#applyForm .easyui-datebox").datebox({ disabled: true });
        if ($(".moren_img")!=undefined){
            $(".moren_img .form").remove();
            $(".moren_img img").click(function () {
                var url = $(this).attr("src");
                var Hei = $(this).height();
                var padTop = ($(window).height() - Hei)/2;
                $("#imgMax").find("img").attr("src",url);
                $("#imgMax").find("img").css("padding-top",padTop);
                $("#imgMax").show();
            });
            $("#imgMax").click(function(){
                $(this).hide();
            });
        }
    }else {
        isOperateStrokeOder();
    }


    $(".auditdetails-foot button").click(function(){
        var tabhei = $(window).height();
        $(".panel").css("top",tabhei - "150");
        $(".window-shadow").css("top", tabhei - "150");
        $(".window-mask").css("height",tabhei);
    });

    //点击label选择radio
    $("label").click(function(){
        $(this).find(":radio").attr("checked");
    });

    $.ajax({
        async:false,
        url : cp + "/service/dj/registerForm/getRegisterFormById",
        data:"id="+regFormId,
        dataType:"json",
        success:function(result){
            if (result.success){
                var registerForm = result.data;
                regFormId = registerForm.id;
                memberId = registerForm.memberId;
                storeName = registerForm.storeName;
                var user = JSON.parse(registerForm.content);
                console.log(user);
                $("#regGroupName").val(registerForm.groupName);
                $("#storeName").val(registerForm.storeName);
                $("#memberName").val(registerForm.memName);
                $("#applyer").val(registerForm.applyer);
                delete user.file;
                $("#applyForm").form("load",user);
                if ($(".moren_img")!=undefined){
                    var length = $(".moren_img").length;
                    for (var i=1;i<=length;i++){
                        if ($("#previewImage"+i+"H").val()!="")
                            $("#previewImage"+i).attr("src",$("#previewImage"+i+"H").val());
                    }
                }

                $("#applyForm").find(":radio").each(function(index,item){
                    var $this=$(item);
                    var value=user[$this.attr("name")];
                    if(value && $this.val()==value){
                        $this.attr("checked","checked");
                        $this.next("span").addClass("active");
                        $this.parents(".radioGroup").find(".hiddenText").val(1);
                    }
                });

                $("#applyForm").find(":checkbox").each(function (index,item) {
                    var $this=$(item);
                    var value=user[$this.attr("name")];
                    if (value && value.length>1){
                        $this.parents(".radioGroup").find(".hiddenText").val(1);
                        if(value.indexOf($this.val())>-1){
                            $this.attr("checked","checked");
                            $this.next("span").addClass("active");
                        }
                    }else if (value && $this.val() == value){
                        $this.parents(".radioGroup").find(".hiddenText").val(1);
                        $this.attr("checked","checked");
                        $this.next("span").addClass("active");
                    }
                });

                //附件显示的处理
                var attachmentArray = "";
                if (user.attachmentArray){
                    attachmentArray = JSON.parse(user.attachmentArray);
                }
                if (attachmentArray && attachmentArray.length>0){
                    for(var item in attachmentArray) {
                        var html = template("attachDetail",{"attachmentImage":attachmentArray[item].attachmentImage,"attachmentExplain":attachmentArray[item].attachmentExplain});
                        $("#lookPicture").append(html);
                    }
                    //给控件的id赋值
                    assignment();
                    //判断附件是否上传图片 如果上传图片把file控件隐藏
                    hiddenFileInput();
                    //放大图片初始化
                    loading();
                }else {
                    if (userType != '1' && doType!='1'){
                        attachment_add();
                    }
                }
            }else {
                noty({text:result.message,timeout:3000});
            }
        }
    });

    //判断是否是财务岗位 如果是,表单不能编辑
    if (postType == '11'){
        $("#idForm input").prop("readonly","readonly");
        $("#applyForm input,#applyForm textarea").attr("readonly","readonly");
        $("#applyForm select,#applyForm input[type='radio'],#applyForm input[type='checkbox']").attr("disabled","disabled");
        $("#applyForm .easyui-datebox").datebox({ disabled: true });

        $(".moren_img .form").remove();
        $(".moren_img img").click(function () {
            var url = $(this).attr("src");
            var Hei = $(this).height();
            var padTop = ($(window).height() - Hei)/2;
            $("#imgMax").find("img").attr("src",url);
            $("#imgMax").find("img").css("padding-top",padTop);
            $("#imgMax").show();
        });
        $("#imgMax").click(function(){
            $(this).hide();
        });
    }
    getSugessByRegProStateId();
});

function getSugessByRegProStateId() {
    $.post(cp+"/service/check/registerForm/getSugessByRegProStateId",{"regProStateId":regProStateId},function (result) {
        if (result.success){
            $("#suggestion").val(result.data);
        }
    },"json");
}

/**
 * 判断是否可以编辑行程单
 */
function isOperateStrokeOder() {
    var param = {"regFormId":regFormId,"regProStateId":regProStateId};
    $.post(cp+"/service/check/registerForm/isOperateStrokeOder",param,function (result) {
        if (result.success){
            console.log(result.data);
            if (result.data==true){
                isOperation = 1;//可以编辑
            }else {
                isOperation = 0;//不可以编辑
            }
        }
        console.log("isOperation="+isOperation);
    },"json");
}

/**
 * 校验身份证
 * @param sId
 */
function isCardID(idCard){
    var iSum=0 ;
    var info="" ;
    var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    if(!/^\d{17}(\d|x)$/i.test(idCard)){
        return "你输入的身份证长度或格式错误";
    }
    idCard=idCard.replace(/x$/i,"a");
    if(aCity[parseInt(idCard.substr(0,2))]==null){
        return "你的身份证地区非法";
    }
    sBirthday=idCard.substr(6,4)+"-"+Number(idCard.substr(10,2))+"-"+Number(idCard.substr(12,2));
    var d=new Date(sBirthday.replace(/-/g,"/")) ;
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
        return "身份证上的出生日期非法";
    }
    for(var i = 17;i>=0;i --){
        iSum += (Math.pow(2,i) % 11) * parseInt(idCard.charAt(17 - i),11);
    }
    if(iSum%11!=1){
        return "你输入的身份证号非法";
    }
    return true;
}


/**
 * 打开行程单界面
 */
function openOrderDialog(){
    isOperation=1;
        if (doType == "1"){
            var param = {
                "regFormId":regFormId
            };
            $.post(cp+"/service/strokeOrder/isHaveStrokeOrder",param,function(result){
                var strokeOrder = result.data.strokeOrder;
                console.log(strokeOrder);
                if(strokeOrder) {
                    window.location.href = cp + "/service/strokeOrder/returnOrderDetails?regFormId="+regFormId+"&type="+type+"&memberId="+memberId+"&storeName="+storeName+"&from="+from+"&doType="+doType;
                }else {
                    noty({text:"没有行程单信息",timeout:3000});
                    return false;
                }
            },"json");
            return false;
        }else{
            if (isOperation == 0) {//0 不可以编辑,点击查看详情页面
                reserveForm("0","noEdit");
            }else{//1 可以编辑
                reserveForm("0","edit");
            }
        }
}

/**
 * 提交或者驳回
 * @param status
 */
function saveForm(status){

    $(".auditdetails-foot button").prop("disabled",true);
    //判断该报名表是否作废 如果作废不能进行审核
    $.ajax({
        async:false,
        url:cp+"/service/dj/registerForm/getRegisterFormById",
        data:"id="+regFormId,
        dataType:"json",
        success:function(result){
            if (result.success){
                var registerForm = result.data;
                if (registerForm.status == 0 || registerForm.status == 4){
                    noty({text:"该报名表作废了，不能进行审核",timeout:3000});
                }else {
                    //保存编辑的内容
                    checkRegisterForm(status);
                }
            }else {
                noty({text:result.message,timeout:3000});
            }
        }
    });
}

function checkRegisterForm(status){
    //判断是否已经被审核了  0是待审核
    $.post(cp+"/service/check/registerForm/getRegistProStateById",{"id":regProStateId},function (result) {
        if (result.success) {
            if (result.data!=0) {
                noty({text: "该报名表已经被审核了,不能再次审核", timeout: 2000});
                return false;
            }else {
                //校验表单
                $.messager.progress({
                    title:"提示",
                    text:"数据处理中，请稍后...."
                });

                if ($(".moren_img")!=undefined){
                    $(".form input[type=file]").val("");
                }

                if (status != "0"){
                    //验证审核意见必填
                    var isValid = $("#suggestion").validatebox("isValid");
                    if (!isValid){
                        $.messager.progress("close");
                        $(".auditdetails-foot button").prop("disabled",false);
                        if (isOnePerson != "0"){
                            $(".auditdetails-foot button").eq(1).prop("disabled",true);
                        }
                        noty({text:"请填写审核意见",timeout:2000});
                        $("#suggestion").focus();
                        return isValid;
                    }
                    //验证表单中的内容必填
                    if (postType != 11){
                        var flag = $("#applyForm").form("validate");
                        if (!flag){
                            $.messager.progress("close");
                            $(".auditdetails-foot button").prop("disabled",false);
                            if (isOnePerson != "0"){
                                $(".auditdetails-foot button").eq(1).prop("disabled",true);
                            }
                            return flag;
                        }
                    }
                    //验证格调人生报名表中的图片必填
                    if ($(".moren_img")!=undefined){
                        if ($(".moren_img").length == 3){
                            var face = $("#previewImage1H").val();
                            if (face == ""){
                                $.messager.progress("close");
                                noty({text:"请上传正脸照片",timeout:1000});
                                $(".auditdetails-foot button").prop("disabled",false);
                                if (isOnePerson != "0"){
                                    $(".auditdetails-foot button").eq(1).prop("disabled",true);
                                }
                                return false;
                            }
                            var body = $("#previewImage2H").val();
                            if (body == ""){
                                $.messager.progress("close");
                                noty({text:"请上传全身正面照片",timeout:1000});
                                $(".auditdetails-foot button").prop("disabled",false);
                                if (isOnePerson != "0"){
                                    $(".auditdetails-foot button").eq(1).prop("disabled",true);
                                }
                                return false;
                            }
                            var bodyf = $("#previewImage3H").val();
                            if (bodyf == ""){
                                $.messager.progress("close");
                                noty({text:"请上传全身侧面照片",timeout:1000});
                                $(".auditdetails-foot button").prop("disabled",false);
                                if (isOnePerson != "0"){
                                    $(".auditdetails-foot button").eq(1).prop("disabled",true);
                                }
                                return false;
                            }
                        }
                    }
                }else {
                    if ($("#suggestion").val().length >300){
                        $.messager.progress("close");
                        $(".auditdetails-foot button").prop("disabled",false);
                        if (isOnePerson != "0"){
                            $(".auditdetails-foot button").eq(1).prop("disabled",true);
                        }
                        $("#suggestion").focus();
                        return false;
                    }
                }

                //把附件组装成数组 放到表单中的隐藏域保存
                getAttachmentArray();

                var  param = {
                    "regFormId":regFormId,
                    "content":JSON.stringify($("#applyForm").form2json()),
                    "regProStateId":regProStateId,
                    "suggestion":$("#suggestion").val(),
                    "status":status,
                    "memberId":memberId
                };
                $.post(cp+"/service/check/registerForm/checkRegisterForm",param,function(result){
                    $.messager.progress("close");
                    if(result.success) {
                        noty({text:"操作成功！",timeout:3000});
                        window.location.href = cp+"/service/check/registerForm/returnNewRegisterFormList?type="+type+"&classify="+classify+"&code="+code+"&from="+from+"&isCheckFlag=1&processId="+ processId;
                    }else {
                        $.messager.alert("错误",result.message,"error");
                        $(".auditdetails-foot button").prop("disabled",false);
                        if (isOnePerson != "0"){
                            $(".auditdetails-foot button").eq(1).prop("disabled",true);
                        }
                    }
                },"json");
            }
        }
    },"json");
}


/**
 * 把附件组装成数组 放到表单中的隐藏域保存
 */
function getAttachmentArray() {
    var attachmentArray = [];
    $("#lookPicture .attachment").each(function(){
        var attachmentImage = $(this).find("input:hidden").val();
        var attachmentExplain = $(this).find("textarea").val();
        var attachment = {
            "attachmentImage":attachmentImage,
            "attachmentExplain":attachmentExplain
        };
        attachmentArray.push(attachment);
    });
    var attachmentStr = JSON.stringify(attachmentArray);
    $("#attachmentArray").val(attachmentStr);
}

function hiddenFileInput() {
    $("#lookPicture .attachment").each(function(){
        var attachmentImage = $(this).find("input:hidden").val();
        if (attachmentImage){
            $(this).find(".beforePic").hide();
        }
    });
}

function fanhui(){
    if (actionFrom == "check"){//报名表审核
        window.location.href = cp+"/service/check/registerForm/returnNewRegisterFormList?type="+type+"&classify="+classify+"&code="+code+"&from="+from;
    }else if (actionFrom == "manger"){//客服版的报名表管理
        window.location.href = cp+"/service/dj/registerForm/returnRegisterFormManager?classify="+classify+"&type="+type;
    }else if (actionFrom == "cancel"){//报名表作废列表
        window.location.href = cp+"/service/registerFormVoidedAudit/index";
    }
}
/*###########################################*/

/**
 * 报名表在打开行程单的时候暂存报名表信息
 * @param status
 * @returns {jQuery}
 */
function reserveForm(status, isEdit) {
    //校验表单
    $.messager.progress({
        title: "提示",
        text: "数据处理中，请稍后...."
    });

    if ($(".moren_img") != undefined) {
        $(".form input[type=file]").val("");
    }
    var param = {
        "regFormId": regFormId,
        "content": JSON.stringify($("#applyForm").form2json()),
        "regProStateId": regProStateId,
        "suggestion": $("#suggestion").val(),
        "status": status,
        "memberId": memberId
    };
    $.post(cp + "/service/check/registerForm/checkRegisterForm", param, function (result) {
        $.messager.progress("close");
        if (result.success) {
            if(isEdit == "noEdit"){
                window.location.href = cp + "/service/strokeOrder/strokeOrderViewDetatis?regFormId=" + regFormId + "&type=" + type + "&memberId=" + memberId + "&storeName=" + storeName + "&from=" + from + "&regProStateId=" + regProStateId + "&classify=" + classify + "&processId=" + processId + "&doType=" + doType;
            }else{
                window.location.href = cp + "/service/strokeOrder/returnOrderAddOrEdit?regFormId=" + regFormId + "&type=" + type + "&memberId=" + memberId + "&storeName=" + storeName + "&from=" + from + "&regProStateId=" + regProStateId + "&classify=" + classify + "&processId=" + processId + "&doType=" + doType+"&code="+code;
            }

        } else {
            $.messager.alert("错误", result.message, "error");
        }
    }, "json");
}