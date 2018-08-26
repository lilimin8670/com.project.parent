$(function () {

    /**
     * 初始化客服管辖的会员列表
     */
    selectMemberList();


});

/**
 * 如果是 发起  会员帐号 则加载对应的会员数据
 */
function loaddata(registerFormId) {
    $.ajax({
        async: false,
        url: basePath + "/registerFormAdd/getRegisterFormById",
        data: "id=" + registerFormId,
        dataType: "json",
        success: function (result) {
            if (result.success) {
                var registerForm = result.data;
                var user = JSON.parse(registerForm.content);
                console.log("第一次填充表单")
                console.log(user);
                //根据name将json数据填充到页面对应的标签
                loadJsonDataToForm(user, "0");
                regGroupId = registerForm.regGroupId;
                regDeadline = registerForm.regDeadline;
                storeId = registerForm.storeId;
                memid = registerForm.memberId;
                planbookId = registerForm.planBookId;
                resetMemInfo(memid);

            } else {
                layer.msg(result.message, {icon: 5});
            }
        }
    });
}

/**
 * 会员选择列表数据初始化
 */
function selectMemberList() {
    var likeparam = $("#memName").val();
    console.log(basePath);
    $.post(basePath + "/service/dj/registerForm/getSelectMemberList", {p: likeparam}, function (result) {
        if (result.success) {
            memberIdList = result.rows;
           console.log(memberIdList);
            $("#memberIdList").append(template("memberIdListArtTem", {"list": memberIdList}));
        }
    }, "json");
}
/**
 *选择会员后自动对填充已有数据
 * @param index
 */
function selectMember(index) {
    var applyerTemp=$("#applyer").val();
    $("input[type='reset']").trigger("click");//触发reset按钮
    $("#applyer").val(applyerTemp);
    var orginuser = memberIdList[index];
    memid = orginuser.id;
    storeId=orginuser.storeId;
    ishavePlanBook(memid);
    var user = handleUser(orginuser);
    loadJsonDataToForm(user, "1");
    $("#memName").removeAttr('disabled', 'disabled');
    $(".khid").hide();
}
/*
 *当选择了会员
 * 查询该会员近三个月是否有计划书
 */
function ishavePlanBook(memberId) {
    var tempclassify=(Number(classify)+2).toString();
    $.ajax({
        async: false,
        url: basePath + "/planBook/getPlanBookByMemberId",
        data: "memberId=" + memberId + "&classify=" + tempclassify,
        dataType: "json",
        success: function (result) {
            if (result.success) {
                //计划书id
                planbookId = result.data;
                console.log("planbookId第一次赋值：" + planbookId);
                havePlanBook = true;
            } else {
                $("#memName").focus();
                layer.msg("选择的会员还没有计划书，需要先填写计划书", {icon: 5});
                havePlanBook = false;
            }
            return havePlanBook;
        }
    });
}
/**
 * 保存、提交、驳回 数据
 * 判断暂存、保存方法应该掉审核中的还是发起页面中的
 */
function saveForm(param) {
    //判断该会员是否报过此报名团 如果报过则不允许再报
    if (judgeAorB === 1) {
        switch (param.status) {
            case "1":
                console.log("--------发起暂存--------");
                saveRegisterForm(param);
                break;
            case "2":
                console.log("--------发起保存--------");
                saveRegisterForm(param);
                break;
            default:
                console.log("error startUP");
        }
    } else if (judgeAorB === 2) {
        switch (param.status) {
            case "1":
                console.log("--------审核暂存--------");
                param.status = "0";
                auditSaveRegisterForm(param);
                break;
            case "2":
                console.log("--------审核保存--------");
                param.status = "1";
                auditSaveRegisterForm(param);
                break;
            case "3":
                console.log("--------审核驳回--------");
                param.status = "2";
                auditSaveRegisterForm(param);
            default:
                console.log("error backUP");
        }
    }

}
/**
 *报名表发起时的保存方法
 * @param param
 */
function saveRegisterForm(param) {

    if (judgeEditOrAdd === 1) {
        editSaveRegisterForm(param);
    } else {
        if(havePlanBook){
            $.ajax({
                url: basePath + "/registerFormAdd/validateRegGroupAndMember",
                data: {
                    "memberId": memid,
                    "regGroupId": regGroupId
                },
                dataType: "json",
                success: function (result) {
                    if (result.success) {
                        console.log("通过预约团");
                        validateAndSave(param);
                    } else {
                        $("#memName").focus();
                        layer.msg("该会员已经报过该预约团了，不能重复报", {icon: 5});
                    }
                }
            });
        }else{
            layer.msg("该会员没有计划书，请重新选择", {icon: 5});
        }
    }

}
/**
 * 报名表发起中新增报名表的保存方法
 * @param param
 */
function validateAndSave(param) {
    $.post(basePath + "/registerFormAdd/save", param, function (result) {
        if (result.success) {
            if (result.data == 1) {
                window.parent.parentload();
                window.parent.$("#addDialog").dialog('close');
            } else if (result.data == 0) {//没有审批流程
                layer.msg("该报名表没有设置审批流程，无法提交审批，请联系客服！", {icon: 5});
            }
        } else {
            layer.alert(JSON.stringify(result.message), {
                title: '错误'
            });
        }
    }, "json");
}
/**
 * 报名表发起 编辑报名表的保存方法
 * @param param
 */
function editSaveRegisterForm(param) {
    var param = {
        "id": registerFormId,
        "content": param.content,
        "status": param.status
    };
    $.post(basePath + "/registerFormAdd/update", param, function (result) {
        var index = layer.load(2, {time: 10 * 1000});
        if (result.success) {
            if (result.data == 1) {

                layer.close(index);

                $(".layui-btn").find("button").prop("disabled", false);
                window.parent.parentload();
                window.parent.$("#editDialog").dialog('close');
            } else if (result.data == 0) {//没有审批流程
                layer.msg("该报名表没有设置审批流程，无法提交审批，请联系客服！", {icon: 5});
            }
        } else {
            layer.close(index);
            layer.alert(JSON.stringify(result.message), {title: '错误'});
            $(".layui-btn").find("button").prop("disabled", false);
        }
    }, "json");

}
/**
 * 报名表审核——暂存 保存 驳回
 * 报名表审核编辑页面作废验证
 * @param param
 */
function auditSaveRegisterForm(param) {
    $.ajax({
        async: false,
        url: basePath + "/registerForm/getRegisterFormById",
        data: "id=" + $("#hiddenRegistFormId", window.parent.document).val(),
        dataType: "json",
        success: function (result) {
            if (result.success) {
                var registerForm = result.data;
                if (registerForm.status == 0 || registerForm.status == 4) {
                    layer.msg("该报名表作废了，不能进行审核", {icon: 5});
                } else {
                    //保存编辑的内容
                    checkRegisterForm(param);
                }
            } else {
                layer.msg(result.message, {icon: 5});
            }
        }
    });

}
/**
 * 报名表审核——保存
 * @param param
 */
function checkRegisterForm(param) {
    console.log(param);
    var regProStateId = $("#hiddenRegProStateId", window.parent.document).val();
    param.regFormId = $("#hiddenRegistFormId", window.parent.document).val();
    param.regProStateId = regProStateId;
    param.suggestion = $("#suggestion").val();
    param.memberId = $("#hiddenMemberId", window.parent.document).val();
    //判断是否已经被审核了  0是待审核
    $.post(basePath + "/registerForm/getRegistProStateById", {"id": regProStateId}, function (result) {
        if (result.success) {
            if (result.data != 0) {
                layer.msg("该报名表已经被审核了,不能再次审核", {icon: 5});
                return false;
            }
            var index = layer.load(2, {time: 10 * 1000}); //又换了种风格，并且设定最长等待10秒

            $.post(basePath + "/registerForm/checkRegisterForm", param, function (result) {
                if (result.success) {
                    layer.close(index);
                    var fromPage = $("#hiddenFromPage", window.parent.document).val();
                    if (fromPage == "native") {
                        window.top.refreshHomePage();
                    } else {
                        window.parent.parentload();
                    }
                } else {
                    layer.close(index);
                    layer.msg(result.message, {icon: 5});
                }
            }, "json");
        }
    }, "json");
}
/**
 * 报名表发起时查看计划书
 * @returns {boolean}
 */
function lookPlanBook() {
    var planBookId = planbookId;
    var tempclassify=(Number(classify)+2).toString();
    console.log("planBookId选择完会员后或发起中查看该页面：" + planBookId);
    console.log(classify);
    if (memid == null || memid == "") {
        layer.msg("请先选择会员！", {icon: 5});
        return false;
    }
    if (planBookId == "" || planBookId == null) {
        layer.msg("选择的会员还没有计划书，需要先填写计划书", {icon: 5});
        return false;
    }
    var url = basePath + "/createPlanBook/editPlanBook?type=" + tempclassify + "&id=" + planBookId + "&noBtns=noBtns";
    layer.open({
        type: 2,
        title: "查看计划书",
        closeBtn: 2,
        area: ['96%', '96%'],
        scrollbar: false,
        shadeClose: true,
        shade: false,
        content: [url, 'yes'],
    });
}
/**
 * 加载审批意见
 */
function getSugess(parentid) {
    console.log("加载审批意见" + parentid);
    $.post(basePath + "/registerForm/getSugess.do", {"id": parentid}, function (data) {
        var html = "";
        if (data.rows != null && data.rows != undefined) {
            for (var x = 0; x < data.rows.length; x++) {
                html += "<tr>" + "<td>" + data.rows[x].approverName + "</td>";
                if (data.rows[x].approveStat == 0) {
                    html += "<td>待审批</td>";
                } else if (data.rows[x].approveStat == 1) {
                    html += "<td>通过</td>";
                } else if (data.rows[x].approveStat == 2) {
                    html += "<td>驳回</td>";
                }
                if (data.rows[x].suggestion != null) {
                    html += "<td style='white-space: normal; word-break: break-all;'>" + data.rows[x].suggestion + "</td>";
                } else {
                    html += "<td></td>";
                }
                html += "<td>" + data.rows[x].approveDate + "</td>" + "</tr>";
            }
        }
        $("#shenpiyijian").after(html);
    }, "json")

}
/**
 * 加载json的数据到页面的表单中，以name为唯一标示符加载
 * @param {String} jsonStr json表单数据
 */
function loadJsonDataToForm(jsonStr, cf) {
    try {
        var obj = jsonStr;
        var key, value, tagName, type, arr;
        for (x in obj) {
            key = x;
            value = obj[x];
            $("[name='" + key + "'],[name='" + key + "[]']").each(function () {
                tagName = $(this)[0].tagName;
                type = $(this).attr('type');
                if (tagName == 'INPUT') {
                    if (type == 'radio') {
                        $(this).attr('checked', $(this).val() == value);
                        if ($(this).val() == value) {
                            $("input[name='" + key + "']").next().removeClass("layui-form-radioed").children("i").removeClass("layui-anim-scaleSpring");
                            $(this).next().addClass("layui-form-radioed").children("i").addClass("layui-anim-scaleSpring");
                            $(this).siblings("input[name='" + key + "']").next().removeClass("layui-form-radioed").children("i").removeClass("layui-anim-scaleSpring");
                        }
                    } else if (type == 'checkbox') {
                        arr = value.split(',');
                        for (var i = 0; i < arr.length; i++) {
                            if ($(this).val() == arr[i]) {
                                $(this).attr('checked', true);
                                break;
                            }
                        }
                    } else if (type == 'file') {

                    } else {
                        $(this).val(value);
                    }
                } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                    $(this).val(value);
                } else if (tagName == 'IMG') {
                    if((value.indexOf("http://")>= 0)){
                        $(this).attr('src', value);
                    }
                }
                if ((value) && cf == "1") {
                    $(this).attr('disabled', 'disabled');
                } else if (!(value) && cf == "1") {
                    $(this).removeAttr('disabled');
                }

            });
        }
    } catch (e) {
        alert("加载表单：" + e.message + ",数据内容" + JSON.stringify(jsonStr));
    }
}

/**
 * 在进行审核编辑时，判断是否是第一审批人，是的话显示驳回按钮，否则不显示
 * @param regProStateId
 * @param processId
 */
function firstCheckPerson(regProStateId, processId) {
    console.log("regProStateId:" + regProStateId);
    console.log("processId:" + processId);
    $.post(basePath + "/registerForm/isFirstCheckPerson", {
        regProStateId: regProStateId,
        processId: processId
    }, function (result) {
        if (result.success && result.data == 0) {
            $("#backbutton").show();
        }
    }, "json")
}
/**
 * 客服版 展示行程单 或编辑行程单 flg 1:编辑 2：显示
 */
function showxingchengdan() {
    //列表中的隐藏域
    var flg = $("#hiddenFlg", window.parent.document).val();
    var registerFormId = $("#hiddenRegistFormId", window.parent.document).val();
    if (flg == 1) {
        layer.open({
            type: 2,
            title: "行程单编辑",
            closeBtn: 2,
            area: ['96%', '96%'],
            scrollbar: false,
            shadeClose: true,
            shade: false,
            content: [basePath + "/strokeManage/getStrokeDetailsPage?regFormId=" + registerFormId, 'yes'],
        });
    } else {
        layer.open({
            type: 2,
            title: "行程单详情",
            closeBtn: 2,
            area: ['96%', '96%'],
            scrollbar: false,
            shadeClose: true,
            shade: false,
            content: [basePath + "/strokeManage/forwardStrokeInfo?regFormId=" + registerFormId, 'yes'],
        });
    }
}
/**
 * 报名表发起选择会员后处理会员信息
 * @param orginuser
 * @returns {{}}
 */
function handleUser(orginuser) {
    var jsonUser = {};
    delete orginuser["address"];
    delete orginuser["area"];
    delete orginuser["city"];
    delete orginuser["province"];
    for (var key in  orginuser) {
        var value = orginuser[key];
        if(value){
            if (key === "level") {
                jsonUser["cardLevel"] = levelData[Number(value)].name;
            } else if (key === "nation") {
                jsonUser[key] = nation[Number(value)].name
            } else if(key === "profession"){
                jsonUser[key] = profession[Number(value)].name
            }else if(key === "birthday"){
                jsonUser[key] = formatDate(value);
            }else{
                jsonUser[key] = value;
            }
        }
    }
    console.log(jsonUser);
    return jsonUser;
}
/**
 * 加载页面包括审核编辑 查看刷新个人信息的数据
 * @param memid
 */
function resetMemInfo(memid) {
    var jsonUser = {};
    console.log("重新加载会员信息");
    $.post(basePath + "/registerForm/getMemberInfoById", {memberId: memid}, function (result) {
        if (result.success) {
            var user = result.data;
            delete user["address"];
            delete user["area"];
            delete user["city"];
            delete user["province"];
            user["cardLevel"]=user["level"];
            user["nation"]=user["nationName"];
            user["birthday"]=formatDate(user["birthday"]);
            for (var key in  user) {
                var value = user[key];
                if(value){
                    jsonUser[key] = value;
                }
            }
            console.log(jsonUser);
            loadJsonDataToForm(jsonUser, "1");
        }
    }, "json");
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}