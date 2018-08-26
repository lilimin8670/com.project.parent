var planBookId;
var regGroupId;
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


    $("#btn button").click(function(){
        var tabhei = $(window).height();
        $(".panel").css("top",tabhei - "150");
        $(".window-shadow").css("top", tabhei - "150");
        $(".window-mask").css("height",tabhei);
    });

    if(doType == "1"){
        $("#btn").hide();
        $("#applyForm input,textarea").prop("disabled",true);
        $("#applyForm select,input[type='radio'],input[type='checkbox']").prop("disabled",true);
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

        $("#applyForm").form({
            novalidate : true
        });
    }
    $.ajax({
        async:false,
        url:cp+"/service/dj/registerForm/getRegisterFormById",
        data:"id="+id,
        dataType:"json",
        success:function(result){
            if (result.success){
                var registerForm = result.data;
                planBookId = registerForm.planBookId;
                var user = JSON.parse(registerForm.content);
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
                    }
                });

                $("#applyForm").find(":checkbox").each(function (index,item) {
                    var $this=$(item);
                    var value=user[$this.attr("name")];
                    if (value && value.length>1){
                        if(value.indexOf($this.val())>-1){
                            $this.attr("checked","checked");
                            $this.next("span").addClass("active");
                        }
                    }else if (value && $this.val() == value){
                        $this.attr("checked","checked");
                        $this.next("span").addClass("active");
                    }
                });
            }else {
                noty({text:result.message,timeout:3000});
            }
        }
    });
    //点击label选择radio
    $("label").click(function(){
       $(this).find(":radio").attr("checked");
    });
});

/**
 * 保存或者提交数据
 */
function updateForm(status){

    if ($(".moren_img")!=undefined){
        $(".form input[type=file]").val("");
    }

    $("#btn button").prop("disabled",true);

    var content = JSON.stringify($("#applyForm").form2json());
    /*var flag = $("#applyForm").form("validate");
    if (!flag){
        $.messager.progress("close");
        return flag;
    }*/
    var param = {
        "id" : id,
        "content" : content,
        "targetPro" : $("input[name='targetPro']").val(),
        "status" : status
    };
    $.post(cp+"/service/dj/registerForm/update", param, function (result) {
        if(result.success) {
            //返回列表页面 并刷新数据
            if (result.data == 1){
                $("#btn button").prop("disabled",false);
                noty({text:result.message,timeout:2000});
                window.location.href = cp + "/service/dj/registerForm/returnNewRegisterFormList?type="+type+"&classify="+classify+"&code="+code+"&title="+title+"&from="+from;
                window.scrollTo( 0, 0 );
            }else if (result.data == 0){//没有审批流程
                noty({text:"该报名表没有设置审批流程，无法提交审批，请联系客服！",timeout:2000});
            }else if (result.data == 2){
                noty({text:"该报名表第一审批岗位没有对应的人，请设置相应岗位的人！",timeout:3000});
            }
        }else {
            $("#btn button").prop("disabled",false);
            $.messager.alert("错误",result.message,"error");
        }
        $.messager.progress("close");
    },"json");
}


function lookPlanBook(){
    window.location.href = cp+"/service/planBook/getCheckView?id="+planBookId+"&nameType=6&btnType=1"+"&code="+code+"&title="+title+"&from="+from;
}

function fanhui(){
    history.go(-1);
}