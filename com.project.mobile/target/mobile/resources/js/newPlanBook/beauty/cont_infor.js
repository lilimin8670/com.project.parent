$(function () {

    if (btnType=="1"){//查看详情
        $("#basic").find("input").attr("readonly","readonly");
        $("#basic").find("textarea").attr("readonly","readonly");
        $("#basic").find("select").attr("disabled","disabled");
        $("#submit").hide();
    }
    /*
        判断是新增还是编辑
        planBookId为空是新增,不为空是编辑
     */
    if (!planBookId) {
        $("#memLogName").val("");
        $("#memLogName").keyup(function () {
            var loginName = $("#memLogName").val();
            getmemberList(loginName);
        });
        $(".khid_cent tbody").on("click", "tr", function () {
            var memberId = $(this).find("td:eq(0)").text();
            setMemberInfo(memberId);
            $(".khid").hide();
        });
    }else {
        $("#memLogName").attr("readonly","readonly");
        $.post(CP+"/service/planBook/findPlanBookById",{"id":planBookId},function (result) {
            var content = result.data.content;
            console.log(content);
            var healthData = JSON.parse(content);
            $("#basic").fill(healthData.planBookData, {debug: true});
        },"json");
    }

    //验证
    $("#basic").validate({
        onfocusout: false, //失去焦点时不执行验证
        errorPlacement: function (error, element) { //错误提示，错误对象
            layer.tips(error[0].innerText, element, { //1.错误信息，2提示位置，3同时提示多个错误
                tips: [1, '#3595CC'],
                time: [1000],
                tipsMore: true //错误信息可以同时提示多个，...
            });
        },
        submitHandler: function(){
            var url = CP + "/service/planBook/saveNewPlanBook";
            savePlanBook(url);
            return false;
        }
    });
});

function savePlanBook(url) {
    var dataJson = $('#basic').form2json({checkOneUseArray: 1});
    delete dataJson.file;
    delete dataJson.submit;
    var dataContent = JSON.stringify(dataJson);
    console.log("memberId: "+$("#memberId").val());
    console.log("conent: "+dataContent);
    var param = {
        "type": $("#planBookType").val(),
        "content": dataContent,
        "memberId": $("#memberId").val(),
        "memberLoginname": $("#memLogName").val(),
        "id": $("#planBookId").val(),
        "processId": $("#processIdHid").val()
    };
    $.post(url, param, function (result) {
        if (result.success) {
            layer.alert("保存成功！");
            planBookId = result.data.id;
            if (nameType == 1){
                //客服
                window.location.href = CP + "/service/kfPlanBook/getCheckView?id=" + planBookId + "&nameType=1&btnType="+btnType;
            }else if (nameType == 5){
                //区域中心
                window.location.href=CP+"/service/planBook/getCheckView?id="+planBookId+"&nameType="+nameType+"&btnType="+btnType;
            }else {
                var indexUrl = CP + "/service/kfPlanBook/editPlanBook";
                window.location.href = indexUrl + "?type=7&id=" + planBookId + "&nameType=" + nameType + "&btnType=" + btnType;
            }
        } else {
            layer.alert("保存失败！");
        }
    }, "json");
}

/**
 * 自定义加载会员列表数据
 * @param param
 * @param success
 * @param error
 * @returns {boolean}页面不一样啊
 */
function getmemberList(param) {
    var searchParam = {"type": 7, "p": param};
    var url = CP + "/service/memberInfo/getMemsByUserByPlanBook";
    $.ajax({
        url: url,
        type: "post",
        data: searchParam,
        dataType: "json",
        success: function (result) {
            if (result.success) {
                var memberData = result.rows;
                $("#showMemberList").empty();
                var html = template("memberList", {"list": memberData});
                $("#showMemberList").append(html);
                $(".khid").css("visibility","visible");
                $(".khid").show();
                if (result.length <= 0) {
                    $("#showMemberList").append("会员信息暂无数据 ！！！");
                }
            }
        },
        error: function () {
            layer.msg('会员信息加载失败！');
        }
    })
};

/**
 * 根据选中会员给各个控件赋值
 * @param obj
 */
function setMemberInfo(memberId) {
    $("#memberId").val(memberId);
    console.log(memberId);
    //判断会员能否发起计划书
    if (isPlanBook(memberId, 7) == "false") {
        layer.alert("该会员已有计划书,不能再发起", {closeBtn: 0}, function (index) {
            $("#basic").form("reset");
            layer.close(index);
        });
        return false;
    }
    //查询会员信息
    var urlByMem = CP + "/service/memberInfo/getMemberInfoById";
    var urlParam = {"memberId": memberId};
    $.post(urlByMem, urlParam, function (data) {
        if (null != data.data) {
            var member = data.data;
            $("#memLogName").val(member.loginname);
            $("#memberId").val(member.id);
            $("#memberLoginnameH").val(member.loginname);
            $("#memName").val(member.memName);
            $("#group").val(data.group);
            var birthday = member.birthday;
            console.log(birthday);
            $("#memAge").val(jsGetAge(birthday));
            $("#storeName").val(member.storeName);
            $("#expertH").val(data.expertH);
            var sex;
            if (member.sex!=null) {
                if (member.sex == "男") {
                    sex = "1";
                }else if (member.sex == "女") {
                    sex = "2";
                }
            }
            $("#belief").val(beliefMap[member.religiousBelief]);
            $("#sex").find("option[value='" + sex + "']").prop("selected", true);
        }
    }, "json");
}


/**
 * 判断是否能新增或者提交计划书
 */
function isPlanBook(memberId, type) {
    var json = {
        "memberId": memberId,
        "type": type
    };
    var resp = $.ajax({
        type: "POST",
        url: CP + "/service/planBook/isPlanBook",
        data: json,
        async: false,
        cache: false,
        dataType: "json"
    }).responseText;
    return resp;
}

function jsGetAge(strBirthday) {
    var returnAge;
    if (!strBirthday){
        return "";
    }
    var strBirthdayArr = strBirthday.substring(0,10).split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];

    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if (nowYear == birthYear) {
        returnAge = 0;//同年 则为0岁
    }else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                }else {
                    returnAge = ageDiff;
                }
            }else {
                var monthDiff = nowMonth - birthMonth;//月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                }else {
                    returnAge = ageDiff;
                }
            }
        }else {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge;//返回周岁年龄

}