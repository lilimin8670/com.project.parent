/**
 * 功能：会员注册
 * @Author: Yang Yanli
 */
var userAgent = getQueryString("userAgent");
var memId=getQueryString("fromUserId");
var tradeId=getQueryString("tradeId");
var qrStoreId=getQueryString("storeId");
var mallFlag=getQueryString("mallFlag");
var mallPhone=getQueryString("mallPhone");
$(function(){
    combox();
    $("#fromMemId").val(memId);
    $("#tradeId").val(tradeId);
    $("#storeId").val(qrStoreId);
    if(mallFlag){
        $("#mallFlag").val(mallFlag);
        $("#loginname").val(mallPhone);
    }
    getAllNationality();//初始化国籍
});
//时时校验账号是否有效
function validLoginName(){
    var loginname = $("#loginname").val();
    if (!/^[0-9a-zA-Z]+$/.test(loginname)) {
        click_scroll("loginname", "账号只允许输入英文字母、数字!");
        return false;
    }
    $.ajax({
        type:"post",
        url:  "/service/member/validLoginName",
        async : false,
        dataType:"json",
        data: { loginname : loginname},
        success:function(data){
            if (data) {
                click_scroll("loginname", "账号已存在，请重新输入!");
            }else{

            }
        },
        error:function(data){
            if(!data){
                layer.msg("系统错误!");
            }
        }
    });
}
//时时校验密码是否有效
function validPassword(){
    var password = $("#password").val();
    if (!(/^(?![^0-9]+$)(?![^a-zA-Z]+$).+$/.test(password)) || !(/^[A-Za-z0-9]+$/.test(password)) || (/^(.{0,7})$/.test(password))){
        click_scroll("password", "密码由数字和字母组成，至少8位!");
        return false;
    }
}
//时时校验确认密码是否有效
function validNewPassword(){
    var password = $("#comfirmPwd").val();
    if (!(/^(?![^0-9]+$)(?![^a-zA-Z]+$).+$/.test(password)) || !(/^[A-Za-z0-9]+$/.test(password)) || (/^(.{0,7})$/.test(password))){
        click_scroll("comfirmPwd", "密码由数字和字母组成，至少8位!");
        return false;
    }else{
        if (password != $("#password").val()){
            click_scroll("password", "两次输入密码不一致，请重新输入!");
            return false;
        }
    }
}
/**
 * 时时校验证件号是否有效
 */
function validCardNo(){
    var cardType = $("#cardType").val();
    var idCardNo = $("#idCard").val();
    $("#birthdayDate").val("");
    var flag;
    if(cardType == 2){//护照
        if (!/^[0-9a-zA-Z]+$/.test(idCardNo)) {
            click_scroll("idCard", "证件号不正确！");
            return false;
        }
    }else if(cardType == 1){//身份证
        if(!idCardNo){
            click_scroll("idCard", "证件号不能为空！");
            return false;
        }else{
            flag = isCardID(idCardNo);
            if(flag != true){
                $("#birthdayDate").val("");
                $("#sex").prop("selected",false);
                click_scroll("idCard", "身份证号不正确！");
                return false;
            }else{
                //获取页面上的出生日期
                var oldBirthday = $("#birthdayDate").val();
                //通过身份证获取出生日期
                var birthDate = getBirthdayByCardID(idCardNo);
                if(oldBirthday == "" || oldBirthday == birthDate){
                    $("#birthdayDate").val(birthDate);
                }

                //获取页面上的性别
                var sexText = $("#sex option:selected").val();
                console.log("获取页面上的性别"+sexText);
                //通过身份证获取性别
                var sex = getSexByCardID(idCardNo);
                console.log("身份证获取性别"+sex);
                if(sexText == "" || sexText == sex){
                    if(sex == "男"){
                        $("#sex").find("option[value='男']").prop("selected",true);
                    }else{
                        $("#sex").find("option[value='女']").prop("selected",true);
                    }
                }else if(sexText != "" || sexText != sex){
                    if(sex == "男"){
                        $("#sex").find("option[value='男']").prop("selected",true);
                    }else{
                        $("#sex").find("option[value='女']").prop("selected",true);
                    }
                }
            }
            return true;
            }
    }
}
/**
 * 更换证件类型触发事件
 */
function changeCardType(){
    $("#idCard").val("");
}
/**
 * 会员提交注册
 */
//防止重复提交
var submitFlag = false;
function MemberRegister(){
    if(submitFlag){
        return;
    }
    //验证文本输入框必填项是否填写
    var flag = verify();
    if (flag == false) {
        return;
    }
    //提交时再次校验身份证
    var cardType = $("#cardType").val();
    if(cardType == 1){//身份证
        var idCardNo = $("#idCard").val();
        var cardNo = isCardID(idCardNo);
        if(cardNo != true){
            return;
        }
    }
    submitFlag = true;
    var paramData = $("#paramForm").serializeJson();
    console.log("提交的参数"+$("#paramForm").serialize());
    $.ajax({
        type:"post",
        url: "/user-register",
        async : false,
        dataType:"json",
        data: JSON.stringify(paramData),
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            request.setRequestHeader("X-User-Agent", userAgent);
        },
        success:function(data){
            if(data.status == 101){
                layer.msg(data.message);
                submitFlag = false;
            }
            if(data.status == 0){
                window.location.href = "/h5/success.html";
            }
        },
        error:function(data){
            if(data.status == 101){
                layer.msg(data.message);
            }
        }
    });
}

/**
 * 初始化省市区下拉框
 */
function combox(data){
    region.initMemberProvince();
}
/**
 * 按钮倒计时
 * @type {number}
 */
var wait=60;
function requireValidCode(o){
   var flag = verifyPhone();
    if(flag == false){
        return false;
    }
    sendNumber();
    countDown(o);
}
/**
 * 倒计时
 * @param o
 */
function countDown(o){
    if (wait == 0) {
        $(".verif").attr("onclick","requireValidCode(this)");
        $(".verif").html("获取验证码");
        wait = 60;
    } else {
        $(".verif").removeAttr("onclick");
        $(".verif").html("重新发送(" + wait + ")");
        wait--;
        setTimeout(function() {
                countDown(o)
            },
            1000)
    }
}
/**
 * 发送验证码
 */
var code = "";
function sendNumber(){
    var phoneNum = $("#phone").val();
    $.ajax({
        type:"post",
        url:  "/service/member/sendCode",
        async : false,
        dataType:"json",
        data: { "phoneNum" : phoneNum},
        //beforeSend: function (request) {
        //    request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        //    request.setRequestHeader("X-User-Agent", userAgent);
        //},
        success:function(data){
            if(data.status == 101){

            }
            if(data.status == 0){
                layer.msg("验证码已成功发送!",{time:1000});
            }
        },
        error:function(data){
            if(data.status == 101){
                layer.msg(data.message);
            }
        }
    });
}

/**
 * 校验身份证
 * @param sId
 */
function isCardID(idCard){
    var iSum=0 ;
    var info="" ;
    var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
    if(!/^\d{17}(\d|x)$/i.test(idCard)){
        return click_scroll("idCard","你输入的身份证长度或格式错误!");
    }
    idCard=idCard.replace(/x$/i,"a");
    if(aCity[parseInt(idCard.substr(0,2))]==null){
        return click_scroll("idCard","你的身份证地区非法!");
    }
    sBirthday=idCard.substr(6,4)+"-"+Number(idCard.substr(10,2))+"-"+Number(idCard.substr(12,2));
    var d=new Date(sBirthday.replace(/-/g,"/")) ;
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
        return click_scroll("idCard","身份证上的出生日期非法!");
    }
    for(var i = 17;i>=0;i --){
        iSum += (Math.pow(2,i) % 11) * parseInt(idCard.charAt(17 - i),11);
    }
    if(iSum%11!=1){
        return click_scroll("idCard","你输入的身份证号非法!");
    }
    return true;
    //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女")
}

/**
 * 表单序列化
 */
(function ($) {
        $.fn.serializeJson = function () {
            var serializeObj = {};
            var array = this.serializeArray();
            var str = this.serialize();
            $(array).each(function () {
                if (serializeObj[this.name]) {
                    if ($.isArray(serializeObj[this.name])) {
                        serializeObj[this.name].push(this.value);
                    } else {
                        serializeObj[this.name] = [serializeObj[this.name], this.value];
                    }
                } else {
                    serializeObj[this.name] = this.value;
                }
            });
            return serializeObj;
        };
    })(jQuery);
/**
 * 弹出提示语并定位到该文本框位置
 * @param id
 * @param type
 */
function click_scroll(id,type){
    layer.tips(type, "#"+ id, {
        tips: [3, '#3595CC'],
        time: 3000
    });
    $("#anchor_scroll").attr("href", "#"+ id);
    $("#" + id).focus();
    document.getElementById("anchor_scroll").click();
}
/**
 * 校验必填项以及用户的验证信息
 * @returns {boolean}
 */
function verify(){
        if ($("#loginname").val() == "") {
            click_scroll("loginname","该选项为必填项!");
            return false;
        }else{
            var name = $("#loginname").val();
            var reg = /^[\s]|[\s*]+$/;
            if (reg.test(name)) {
                click_scroll("loginname", "前后不允许有空格!");
                return false;
            }
            if (/((?=[\x21-\x7e]+)[^A-Za-z0-9])/.test(name)) {
                click_scroll("loginname", "不能含有特殊字符!");
                return false;
            }
        }

        if ($("#memName").val() == "") {
            click_scroll("memName","该选项为必填项!");
            return false;
        }else{
            var memName = $("#memName").val();
            var reg = /^[\s]|[\s*]+$/;
            if (reg.test(memName)) {
                click_scroll("memName", "前后不允许有空格!");
                return false;
            }
        }
        if ($("#nickname").val() == "") {
            click_scroll("nickname","该选项为必填项!");
            return false;
        }
        if ($("#comfirmPwd").val() == "") {
            click_scroll("comfirmPwd","该选项为必填项!");
            return false;
        }
        if ($("#idCard").val() == "") {
            click_scroll("idCard","该选项为必填项!");
            return false;
        }
        if ($("#birthdayDate").val() == "") {
            click_scroll("birthdayDate","该选项为必填项!");
            return false;
        }
       var flag = verifyPhone();
        if(flag == false){
            return false;
        }

        if ($("#smsCode").val() == "") {
            click_scroll("smsCode","该选项为必填项!");
            return false;
        }
        if($("#smsCode").val() != ""){
            var smsCode = $("#smsCode").val();
           var b = val(smsCode);
            if(b == false){
                click_scroll("smsCode", "验证码错误!");
                return false;
            }
        }
        if ($("#password").val() == "") {
            click_scroll("password","该选项为必填项!");
            return false;
        }
        if ($("#province").val() == "") {
            click_scroll("province","该选项为必填项!");
            return false;
        }

        if ($("#city").val() == "") {
            click_scroll("city","该选项为必填项!");
            return false;
        }

}
/**
 * 验证手机号码
 * @returns {boolean}
 */
function verifyPhone() {
    if ($("#phone").val() === "") {
        click_scroll("phone", "该选项为必填项!");
        return false;
    } else {
        var phone = $("#phone").val();
        var regx = /^\d{11}$/;
        // var regx = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
        if (!regx.test(phone)) {
            click_scroll("phone", "手机号码不正确!");
            return false;
        }
    }
}

/**
 * 短信验证码校验是否正常
 *  正确返回 true
 *  错误返回 false
 * @param smsCode
 * @returns {boolean}
 */
function val(smsCode){
    var flag = false;
    $.ajax({
        type: "post",
        url: "/service/member/validateSmsCode",
        async: false,
        dataType: "json",
        data: {
            smsCode: smsCode,
            phone: $("#phone").val()
        },
        cache: false,
        success: function (data) {
            if (data) {
                flag = true;
            }else{
                flag = false;
            }
        },
        error: function (data) {
            if (data.status == 101) {
                layer.msg(data.message);
            }
        }
    });
    return flag;
}

/**
 * 身份证得到生日
 */
function getBirthdayByCardID(cardNo) {
	var len = cardNo.length;
	if (len == 0) {
		return "";
	} else if (len == 15) {
		return "19" + cardNo.substr(6, 2) + "-" + cardNo.substr(8, 2) + "-"
				+ cardNo.substr(10, 2);
	} else if (len == 18) {
		return cardNo.substr(6, 4) + "-" + cardNo.substr(10, 2) + "-"
				+ cardNo.substr(12, 2);
	}
}
/**
 * 身份证得到性别
 */
function getSexByCardID(cardNo) {
	var len = cardNo.length;
	if (len == 0) {
		return "";
	} else if (len == 15) {
        if(parseInt(cardNo.substr(14, 1)) % 2 == 1){
            return "男";
        }else{
            return "女"
        }
	} else if (len == 18) {
        if(parseInt(cardNo.substr(16, 1)) % 2 == 1){
            return "男";
        }else{
            return "女"
        }
	}
}
/**
 * 获取所有国籍
 */
function getAllNationality() {
    $.ajax({
        type:"post",
        url:"/service/member/getAllNationality",
        data:"",
        async : false,
        dataType:"json",
        success:function(data){
            if (data) {
                $("#nationality option").remove();
            for(var i = 0;i<data.length;i++){
                $("#nationality").append("<option value='"+data[i].code+"'>"+data[i].name+"</option>");
             }
            }else{

            }
        },
        error:function(data){
            if(!data){
                layer.msg("系统错误!");
            }
        }
    });
}