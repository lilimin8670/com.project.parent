(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 750) {
                docEl.style.fontSize = '20px';
            } else {
                docEl.style.fontSize = 20 * (clientWidth / 750) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

$(function () {
    $("#member_info").show();
    $("#family_info").hide();
    $("#hospital_info").hide();
    dateTime();
    var arry = new Array();
    $(".family_add>img").click(function () {
        $(".ul_index").each(function (i) {
            arry.push($(this).attr("row"));
        });

        if (arry != "") {
            var maxNum = Math.max.apply(null, arry);
            taskIndex = maxNum;
        }
        var html = template("task", {index: ++taskIndex});
        $(html).appendTo(".tot");
        arry = new Array();
        dateTime();
    });

})


function removeRow(element, type) {
    var id = $("#kinsfolkList_" + type).val();
    if (id != "") {
        var t = $("#kinsfolkIdList").val();
        $("#kinsfolkIdList").val(t + id + ",");
    }
    $(element).parents("ul").remove();
}

function delul(opp, type) {
    var id = $("#kinsfolkList_" + type).val();
    var t = $("#kinsfolkIdList").val();
    $("#kinsfolkIdList").val(t + id + ",");
    $(opp).parent().parent().remove(); //移除当前行


}

/**
 * 提示信息
 * @param id
 * @param type
 */
function popTips(id, type) {
    layer.msg(type, {time: 3000});
    $("#anchor_scroll").attr("href", "#" + id);
    $("#" + id).focus();
    document.getElementById("anchor_scroll").click();
}

//验证下一步
function vilidate() {
    var form1 = $("#member_info").css("display");
    var form2 = $("#family_info").css("display");
    var form4 = $("#hospital_info").css("display");
    var hy_name = $("#hy_name").val();
    var hy_number = $("#hy_number").val();
    var hy_level = $("#hy_level").val();
    var hy_club = $("#hy_club").val();
    var hy_brand = $("#hy_brand").val();
    var hy_sex = $("#hy_sex").val();
    var hy_IdNumber = $("#hy_IdNumber").val();
    var hy_age = $("#hy_age").val();
    var hy_xctype = $("#hy_xctype").val();
    var hy_hbcs = $("#hy_hbcs").val();
    var hy_qctime = $("#hy_qctime").val();
    var hy_ddtime = $("#hy_ddtime").val();
    var hy_yygroup = $("#hy_yygroup").val();
    // 	入院信息
    var ry_heart = $("#ry_heart").val();
    var beHospitalized_date = $("#beHospitalized_date").val();
    var hospitalDischarge_date = $("#hospitalDischarge_date").val();
    var arriveFlag = false;
    if (form1 == "block") {
        //会员基本信息
        if (hy_name.trim() == "") {
            popTips("hy_name", "会员姓名为必填项");
            return false;
        } else if (hy_number.trim() == "") {
            popTips("hy_number", "会员卡号为必填项");
            return false;
        } else if (hy_level.trim() == "") {
            popTips("hy_level", "会员卡级为必填项");
            return false;
        } else if (hy_club.trim() == "") {
            popTips("hy_club", "所属会所为必填项");
            return false;
        } else if (hy_brand.trim() == "") {
            popTips("hy_brand", "品牌组名为必填项");
            return false;
        } else if (hy_sex.trim() == "") {
            popTips("hy_sex", "会员性别为必填项");
            return false;
        } else if (hy_IdNumber.trim() == "") {
            popTips("hy_IdNumber", "身份证/护照为必填项");
            return false;
        } else if (hy_age.trim() == "") {
            popTips("hy_age", "会员年龄为必填项");
            return false;
        } else if (hy_xctype.trim() == "") {
            popTips("hy_xctype", "行程类型为必填项");
            return false;
        } else if (hy_hbcs.trim() == "") {
            popTips("hy_hbcs", "航班号/班次为必填项");
            return false;
        } else if (hy_hbcs != "") {
            var f = verifyFlightNum("hy_hbcs");
            if (!f) {
                return false;
            } else {
                if (hy_qctime.trim() == "") {
                    popTips("hy_qctime", "启程时间为必填项");
                    return false;
                } else {
                    var flag = validTime(hy_qctime, "hy_qctime");
                    if (!flag) {
                        return false;
                    } else {
                        if (hy_ddtime.trim() == "") {
                            popTips("hy_ddtime", "抵达时间为必填项");
                            return false;
                        } else {
                            arriveFlag = validTime(hy_ddtime, "hy_ddtime");
                            if (!arriveFlag) {
                                return false;
                            } else {
                                if (hy_yygroup.trim() == "") {
                                    popTips("hy_yygroup", "预约团名称为必填项");
                                    return false;
                                } else {
                                    var cardFlag = false;
                                    if (hy_IdNumber != "") {
                                        cardFlag = valIdCard("hy_IdNumber");
                                    }
                                    if (cardFlag) {
                                        $("#member_info").hide();
                                        $("#family_info").show();
                                        $("#hospital_info").hide();
                                    } else {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } else if (form2 == "block") {
        var validFlagArray = new Array();
        //家属及陪同信息
        $("#family_info li").each(function () {
            var title = $(this).find("label").text().replace("：","").replace("*","");
            var name = "";
            var value = "";
            var selecterId = "";
            var className = $(this).find("label").attr("class");
            if (className != undefined && className.indexOf("male_lablename")>-1){
                selecterId = $(this).find("input").attr("id");
                if ($(this).find("input")){
                    name = $(this).find("input").attr("name");
                    value = $(this).find("input").val();
                }
            }else if (className != undefined && className.indexOf("lable_name")>-1){
                selecterId = $(this).find("select").attr("id");
                name = $(this).find("select").attr("name");
                value = $(this).find("select option:selected").val();
            }
            //判断控件的名称是否存在
            if (name){
                if (value.trim() == ""){
                    popTips(selecterId,title+"为必填项");
                    validFlagArray.push("0");
                    return false;
                }
                if (name.indexOf("phone")>0){
                    var regex = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$/;
                    if (!value.match(regex)) {
                        popTips(selecterId, "手机号不正确");
                        validFlagArray.push("0");
                        return false;
                    }
                }else if (name.indexOf("idcard")>0){
                    var regx = /^[A-Za-z0-9\-\/()]*$/;
                    if (!regx.test(value)) {
                        popTips(selecterId, "身份证/护照格式错误");
                        validFlagArray.push("0");
                        return false;
                    }
                }else if (name.indexOf("startTimeStr")>0){
                    var startTime = new Date(value.replace(/-/g, "\/")).getTime();
                    var index = selecterId.split("_")[1];
                    var arrivalTimeStr = $("#arrivalTimeStr_"+index).val();
                    var arrivalTime = new Date(arrivalTimeStr.replace(/-/g, "\/")).getTime();
                    if (arrivalTimeStr){
                        if (startTime>arrivalTime || startTime == arrivalTime){
                            popTips(selecterId,"抵达时间必须晚于启程时间!");
                            validFlagArray.push("0");
                            return false;
                        }
                    }
                }else if (name.indexOf("arrivalTimeStr")>0){
                    var arrivalTime = new Date(value.replace(/-/g, "\/")).getTime();
                    var index = selecterId.split("_")[1];
                    var startTimeStr = $("#startTimeStr_"+index).val();
                    var startTime = new Date(startTimeStr.replace(/-/g, "\/")).getTime();
                    if (arrivalTimeStr){
                        if (startTime>arrivalTime || startTime == arrivalTime){
                            popTips(selecterId,"抵达时间必须晚于启程时间!");
                            validFlagArray.push("0");
                            return false;
                        }
                    }
                }
            }
        });
        if (validFlagArray.length==0){
            $("#member_info").hide();
            $("#family_info").hide();
            $("#hospital_info").show();
            $(".step").html("提交");
        }
    }  else if (form4 == "block") {
        //入院信息
        if (beHospitalized_date.trim()==""){
            popTips("beHospitalized_date", "入院时间为必填项");
            return false;
        }
        if (hospitalDischarge_date.trim()==""){
            popTips("hospitalDischarge_date", "预计出院时间为必填项");
            return false;
        }
        if (beHospitalized_date != "" && hospitalDischarge_date != "") {
            var flag = validTime(beHospitalized_date, "beHospitalized_date");
            if (!flag) {
                return false;
            } else {
                validSubmit(ry_heart);
            }
        } else {
            validSubmit(ry_heart);
        }
    }
}

function validSubmit(ry_heart) {
    if (ry_heart.trim() == "") {
        popTips("ry_heart", "入院中心为必填项");
        return false;
    } else {
        editStrokeData();
    }
}

// 返回
function goBack() {
    var form1 = $("#member_info").css("display");
    var form2 = $("#family_info").css("display");
    var form4 = $("#hospital_info").css("display");
    if (form1 == "block") {
        if (code != undefined && code != null && code != "") {
            window.location.href = basePath + "/service/check/registerForm/returnNewRegisterFormCheck?" +
                "regFormId=" + regFormId + "&type=" + type + "&classify=" + classify + "&processId=" + processId + "&regProStateId=" + regProStateId + "&from=&actionFrom=check&code=" + code;
        } else {
            window.location.href = basePath + "/service/check/registerForm/returnRegisterFormCheck?regFormId=" + regFormId + "&type=" + type + "&classify=" + classify + "&processId=" + processId + "&regProStateId=" + regProStateId + "&doType=" + doType + "&from=" + "&actionFrom=check";
        }

        //	window.history.go(-1);
    } else if (form2 == "block") {
        $("#member_info").show();
        $("#family_info").hide();
        $("#hospital_info").hide();
    }  else if (form4 == "block") {
        $(".step").html("下一步 ");
        $("#member_info").hide();
        $("#family_info").show();
        $("#hospital_info").hide();
    }
}

function changeValue(id) {
    var flag = $("#" + id).is(':checked');
    if (!flag) {
        $("#ck_tepi_0").val(0);
        $("#" + id).val(0);
    } else {
        $("#ck_tepi_0").val(1);
        $("#" + id).val(1);
    }
}

/**
 * 验证陪同手机号码
 * @returns {boolean}
 */
function verifyCompanyPhone(phone, id) {
    var regex = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$/;
    if (phone.match(regex)) {
        return true;
    } else {
        popTips(id, "手机号不正确");
        return false;
    }
}

/**
 * 校验家属联系方式
 * @param phone
 * @param id
 * @returns {boolean}
 */
function verifyPhone(phone, id) {
    var regex = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$|^(((0\d2|0\d{2,3})[- ]?)?\d{3,8})?$/;
    if (phone.match(regex)) {
        return true;
    } else {
        popTips(id, "联系方式不正确");
        return false;
    }
}

/**
 * 身份证/护照校验 只允许输入字母和数字
 * @param value
 * @param id
 * @returns {boolean}
 */
function valIdCard(id) {
    var regx = /^[A-Za-z0-9\-\/()]*$/;
    var con = $("#" + id).val();
    if (!regx.test(con)) {
        popTips(id, "身份证/护照格式错误");
        return false;
    } else {
        return true;
    }
}

/**
 * 验证航班号只能输入字母和数字
 * @param id
 * @returns {boolean}
 */
function verifyFlightNum(id) {
    var regx = /\s/;
    var flightNum = $("#" + id).val();
    if (!regx.test(flightNum)) {
        return true;
    } else {
        popTips(id, "不允许输入空格!");
        return false;
    }
}