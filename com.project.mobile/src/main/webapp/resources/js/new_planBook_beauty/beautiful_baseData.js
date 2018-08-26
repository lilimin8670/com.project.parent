$(function () {
    if (!planBookId) {
        $("#loginName").val("");
        $("#loginName").keyup(function () {
            var loginName = $("#loginName").val();
            getmemberList(loginName);
        });
        $(".khid_cent tbody").on("click", "tr", function () {
            var memberId = $(this).find("td:eq(0)").text();
            setMemberInfo(memberId);
            $(".khid").hide();
        });
    }
});


/**
 * 自定义加载会员列表数据
 * @param param
 * @param success
 * @param error
 * @returns {boolean}
 */
function getmemberList(param) {
    var searchParam = {"type": 3, "p": param};
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
    if (isPlanBook(memberId, 3) == "false") {
        layer.alert("该会员已有计划书,不能再发起", {closeBtn: 0}, function (index) {
            $("#loginName").val("");
            $("#memberId").val("");
            $("#memberLoginnameH").val("");
            $("#memName").val("");
            $("#group").val("");
            $("#sex").val("");
            $("#memAge").val("");
            $("#storeName").val();
            layer.close(index);
        });
        return false;
    }
    //查询会员绑定的客服
    var urlByMem = CP + "/service/memberInfo/getPostByMemberId";
    var urlParam = {"memberId": memberId};
    $.post(urlByMem, urlParam, function (data) {
        if (null != data.data) {
            var member = data.data;
            $("#loginName").val(member.loginname);
            $("#memberId").val(member.id);
            $("#memberLoginnameH").val(member.loginname);
            $("#memName").val(member.memName);
            $("#group").val(member.group);
            $("#memAge").val(member.age);
            $("#storeName").val(member.storeName);
            $("#sex").find("option[value='" + member.sex + "']").prop("selected", true);
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