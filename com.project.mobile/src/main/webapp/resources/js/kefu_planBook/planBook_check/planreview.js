var currentPage0 = 1;
var currentPage1 = 1;
var pageSize = 5;
var indexPro = 0;
var approveStat = "0";
$(function () {
    //根据会员查询计划书列表
    selectByMem();
    //审核/待审核TAB切换
    switchCheckBtn();
    $("#planBookTable0").html("");
    $("#planBookTable1").html("");
    //下拉刷新，上划加载----待审核
    refresher.init({
        id: "wrapper0",
        pullDownAction: refresh,
        pullUpAction: load,
        childHtmlTag: "div"
    });
    load();
    minHeight();
    $('.planreview-top-left').click(function (event) {
        $(this).addClass('current').siblings().removeClass('current');
    });
});
/**
 * 2017/7/11
 * 根据屏幕的高度设置内容最小的高度
 * **/
//KK7LoHNzgDV9zFyAPxQ
function minHeight() {
    var doch = $(window).height() - 150;
    $("#planBookTable0").css({'min-height':doch});
    $("#planBookTable1").css({'min-height':doch});
}


/**
 * 加载列表数据
 * @param dowm 是否为下拉屏幕刷新数据(0,加载数据;1,刷新数据)
 */
function loadData(down) {
    loadStatus = "loading";
    $(".body_bg").css('background', '#f0f0f0');
    if (approveStat == "0") {
        $("#planBookTable0").show();
        $("#planBookTable1").hide();
        $("#wrapper0").show();
        $("#wrapper1").hide();
        currentPage = currentPage0;
    } else if (approveStat == "1") {
        $("#planBookTable1").show();
        $("#planBookTable0").hide();
        $("#wrapper1").show();
        $("#wrapper0").hide();
        currentPage = currentPage1;
    }
    $.ajax({
        url: CP + "/service/kfPlanBook/findKfCheckPlanBookByPage",
        data: {
            "type": type,
            "currentPage": currentPage,
            "pageSize": pageSize,
            "approveStat": approveStat,
            "memberId": $("#id").val()
        },
        dataType: "json",
        async: false,
        success: function (result) {
            //如果是下拉屏幕，数据库加载完成后隐藏加载loading图标
            if (down == 1) {
                if (approveStat == "0") {
                    document.getElementById("wrapper0").querySelector(".pullDownIcon").style.display = "none";
                } else if (approveStat == "1") {
                    document.getElementById("wrapper1").querySelector(".pullDownIcon").style.display = "none";
                }
            }
            var checkPlanBookList = result.data;
            if (checkPlanBookList != null && checkPlanBookList.length > 0) {
                for (var i = 0; i < checkPlanBookList.length; i++) {
                    var planProStatus = checkPlanBookList[i].approveStat;
                    checkPlanBookList[i].approveStat = planProStateJson[planProStatus];
                    checkPlanBookList[i].submitDate = checkPlanBookList[i].submitDate.substring(0, 10);
                    checkPlanBookList[i].index = i + indexPro;
                    var tr = template("planBook", checkPlanBookList[i]);
                    if (approveStat == "0") {
                        $(tr).appendTo("#planBookTable0");
                    } else {
                        $(tr).appendTo("#planBookTable1");
                        $("#planBookTable1").find(".left-bt-sh").remove();
                    }
                }
                if (approveStat == "0") {
                    currentPage0++;
                    indexPro+=checkPlanBookList.length;
                    if (document.getElementById("wrapper0").querySelector(".pullDownLabel")) {
                        document.getElementById("wrapper0").querySelector(".pullDownIcon").style.display="none";
                        document.getElementById("wrapper0").querySelector(".pullDownLabel").innerHTML = "刷新成功";
                        setTimeout(function () {
                            document.getElementById("wrapper0").querySelector(".pullDownLabel").innerHTML = " ";
                        }, 1000);
                    }
                    wrapper0.refresh();
                } else if (approveStat == "1") {
                    currentPage1++;
                    indexPro+=checkPlanBookList.length;
                    if (document.getElementById("wrapper1").querySelector(".pullDownLabel")) {
                        document.getElementById("wrapper1").querySelector(".pullDownIcon").style.display="none";
                        document.getElementById("wrapper1").querySelector(".pullDownLabel").innerHTML = "刷新成功";
                        setTimeout(function () {
                            document.getElementById("wrapper1").querySelector(".pullDownLabel").innerHTML = " ";
                        }, 1000);
                    }
                    wrapper1.refresh();
                }
            } else {
                if (approveStat == "0") {
                    wrapper0.refresh();
                    document.getElementById("wrapper0").querySelector(".pullUpIcon").style.display = "none";
                    document.getElementById("wrapper0").querySelector(".pullUpLabel").innerHTML = "已没有数据!";
                } else if (approveStat == "1") {
                    wrapper1.refresh();
                    document.getElementById("wrapper1").querySelector(".pullUpIcon").style.display = "none";
                    document.getElementById("wrapper1").querySelector(".pullUpLabel").innerHTML = "已没有数据!";
                }
            }
            if (result.totalCount == 0) {
                $(".body_bg").css({
                    'background': "url('/resources/img/homepage/noData.png')",
                    'background-size': "100%"
                });
                $(".wrapper").hide();
            }
            loadStatus = "ok";
        }
    });
}
/**
 * 日期处理
 * @param now
 * @returns {string}
 */
function formatDate(now) {
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    return year + "-" + month + "-" + date;
}
/**
 * 点击返回按钮
 * @Author xuanYin
 * @Param
 * @Date 2016/7/22 14:28
 */
function reback(divId) {
    $("#sonHeader").css('display', 'none');
    $("#" + divId).css('display', 'none');
    $('#parentHeader').css('display', 'block');
    if (approveStat == 0) {
        $("#wrapper0").show();
    } else if (approveStat == 1) {
        $("#wrapper1").show();
    }
    $("#planreviewCheck").show();
    currentPage0 = 1;
    currentPage1 = 1;
    indexPro = 0;
    $("#planBookTable0").html("");
    $("#planBookTable1").html("");
    console.log(currentPage);
    loadData(1);
}

/**
 * 嵌套了Iframe的页面返回上一页面
 * @type {number}
 */
var orgIndex = window.history.length;
function goBack() {
    if (from) {
        if (from == "native") {
            window.location.href = '/back';
        }else if(from=="pushMessage"){
            if(headers){
                window.messageCenter();
            }else{
                window.mobile.messageCenter();
            }
        }
    } else {
        var goIndex = orgIndex - window.history.length - 1;
        window.history.go(goIndex); //如果iframe的url变了1次，那么goIndex就是-2，类推
    }
}

/**
 * 安卓返回按钮回调函数
 */
function onKeyBackPressed() {
    goBack();
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        window.location.reload();
    }
}

/**计划书审核
 * @Author xuanYin
 * @Param
 * @Date 2016/7/23 9:43
 */
function checkPlanBook(planBookId, planProStateId, status) {
    if (validatePlanBook(planBookId)) {
        if (status == 1) {
            layer.alert("该计划书正在执行作废审批，请等待", {closeBtn: 0});
            return;
        } else {
            $("#checkIframe").attr('src', CP + "/service/kfPlanBook/getCheckView?id=" + planBookId + "&planProStateId=" + planProStateId + "&type=" + type);
            $("#checkDiv").css('display', 'block');
        }
    }
}
/**
 * 显示计划书详情
 * @param id
 * @param nameType  healder名称显示类型1：计划书审核
 * @param btnType  计划书详情内是否有保存按钮0：有，1：没有
 */
function showPlanBook(id, approveStat) {
    $("#wrapper0").hide();
    $("#wrapper1").hide();
    $("#planreviewCheck").hide();
    $('.two').css('display', 'none');
    if (approveStat == "待审批") {
        window.location.href = CP + "/service/planBook/getCheckView?id=" + id + "&nameType=1&btnType=0";
    } else if (approveStat == "审核通过" || approveStat == "驳回") {
        window.location.href = CP + "/service/planBook/getCheckView?id=" + id + "&nameType=1&btnType=1";
    }


    /*if(approveStat=="待审批"){
     $("#planBookIframe").attr('src',CP+"/service/kfPlanBook/getCheckView?id="+id+"&nameType=1&btnType=0");
     }else if(approveStat=="审核通过" || approveStat=="驳回"){
     $("#planBookIframe").attr('src',CP+"/service/kfPlanBook/getCheckView?id="+id+"&nameType=1&btnType=1");
     }
     $("#wrapper0").hide();
     $("#wrapper1").hide();
     $("#planreviewCheck").hide();
     $('#parentHeader').css('display', 'none');
     $('.two').css('display', 'none');
     $("#sonHeader").css('display','block');
     $("#planBookIframe").load(function(){
     var iframeHeight=$("#planBookIframe").contents().find("body").height();
     $("#planBookIframe").css('height',iframeHeight);
     });
     $("#planBookDiv").css('display','block');*/
}
/**
 * 点击确定提交
 * @Author xuanYin
 * @Param
 * @Date 2016/7/23 15:44
 */
function checkPlanBookSumbit(url, planBookId, memberId, processId, planProStateId, suggestion) {
    var planBookContent = $("#planBookContent").val();
    console.log("planBookContent:" + planBookContent);
    var param = {
        "id": planBookId,
        "type": type,
        "content": planBookContent,
        "memberId": memberId,
        "processId": processId,
        "planProStateId": planProStateId,
        "suggestion": suggestion
    };
    console.log(param);
    $.post(url, param, function (result) {
        if (result.success) {
            layer.alert(result.message, {closeBtn: 0}, function (index) {
                window.location.reload();
                window.scrollTo(0, 0);
                layer.close(index);
            });
        } else {
            layer.alert(result.message, {closeBtn: 0});
        }
    }, "json");
}
/**
 * 查看计划书审批进度
 * @Author xuanYin
 * @Param planBookId 计划书id
 * @Date 2016/7/22 15:12
 */
var planProStateData;
function schedulePlanBook(planBookId) {
    var url = CP + "/service/planProState/findPlanProStateByPlanId";
    var param = {"planBookId": planBookId};
    $.post(url, param, function (result) {
        if (result.success) {
            window.location.href= CP + "/service/planBook/getView?planBookId=" + planBookId + "&url=/planBook/processprogress";
        } else {
            layer.alert(result.message, {closeBtn: 0});
        }
    }, "json");
}


/**
 *
 * @type {string}
 */
var oldMemName = "";
function setIntervalTime() {
    setInterval(function () {
        var input_val = $("#memberName").val();
        if (null != input_val && "" != input_val) {
            if (input_val != oldMemName) {
                currentPage1 = 1;
                //保存修改后的值
                oldMemName = input_val;
                //执行查询
                search();
            }
        } else {
            oldMemName = input_val;
            return true;
        }
    }, 400);
}


/**
 * 根据会员查询
 */
function selectByMem() {
    $('.feedback_rr img').click(function (event) {
        $('.two').css('display', 'block');
        $('.one').css('display', 'none');
    });
    $('.two').find('.feedback_l').click(function (event) {
        $('.two').css('display', 'none');
        $('.one').css('display', 'block');
        $("#memberName").val("");
        $("#id").val("");
        currentPage0 = 1;
        currentPage1 = 1;
        indexPro = 0;
        $("#planBookTable0").html("");
        $("#planBookTable1").html("");
        loadData(1);
    });
}

/**
 * 审核/待审核  tab切换
 */
function switchCheckBtn() {
    var twoTre;
    $('.planreview-top div').eq(2).click(function () {
        if (!twoTre) {
            refresher.init({
                id: "wrapper1",
                pullDownAction: refresh,
                pullUpAction: load,
                childHtmlTag: "div"
            });
            twoTre = true;
        }
    });
    $('.planreview-top-left').click(function (event) {
        minHeight();
        $(this).addClass('current').siblings().removeClass('current');
        approveStat = $(this).find("input").val();
        $("#planBookTable0").html("");
        $("#planBookTable1").html("");
        currentPage0 = 1;
        currentPage1 = 1;
        indexPro = 0;
        load();
    });
}


/**
 * 根据客服查询会员
 */
function search() {
    $("#memberListUl").html("");
    $.ajax({
        url: CP + "/service/sysTrace/searchMemberName",
        data: {
            "memberName": $("#memberName").val()
        },
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            if (result.data != null) {
                var html = template("memberList", {"list": result.data});
                var $tr = $(html).appendTo("#memberListUl");
                $.parser.parse($tr);
            }
        }
    });
};


/**
 * 选择会员
 */
function choiceMember(memberId) {
    $("#id").val(memberId);
    currentPage0 = 1;
    currentPage1 = 1;
    $("#planBookTable0").html("");
    $("#planBookTable1").html("");
    loadData(1);
    $('.two').css('display', 'none');
    $('.one').css('display', 'block');
}


/**
 * 上划加载
 */
function load() {
    if (loadStatus !== "ok") {
        return;
    }
    loadStatus = "loading";
    var down = 0;
    loadData(down);
}

/**
 * 下拉刷新
 */
var loadStatus = "ok";
function refresh() {
    if (loadStatus !== "ok") {
        return;
    }
    loadStatus = "loading";
    if (approveStat == "0") {
        currentPage0 = 1;
        $("#planBookTable0").empty();
    } else if (approveStat == "1") {
        currentPage1 = 1;
        $("#planBookTable1").empty();
    }
    loadData(1);
}

/**
 * 验证计划书必填项
 * @param planBookId
 */
function validatePlanBook(planBookId) {
    var url = CP + "/service/planBook/findPlanBookById";
    var param = {"id": planBookId};
    var flag = true;
    $.ajax({
        url: url, //请求的url地址，这是相对于现在的位置的地址
        dataType: 'json',    //返回格式为json
        async: false,
        type: 'POST',       //请求方式
        data: param,
        success: function (result) {
            if (result.success) {
                if (result.data.content) {
                    var planBook_content = JSON.parse(result.data.content);
                    if (type == "1") {
                        if (!planBook_content.memAge || !planBook_content.belief || !planBook_content.height || !planBook_content.weight || !planBook_content.shoulder || !planBook_content.breast || !planBook_content.waist || !planBook_content.hipline || !planBook_content.expertH) {
                            layer.alert("计划书基本信息填写不完全，不能提交审核", {closeBtn: 0});
                            flag = false;
                        }
                        if (!planBook_content.previewImage0H || !planBook_content.previewImage1H || !planBook_content.previewImage2H || !planBook_content.previewImage3H) {
                            layer.alert("造型前图片上传不完全，不能提交审核", {closeBtn: 0});
                            flag = false;
                        }
                    } else if (type == "2") {
                        if (!planBook_content.antiagingappeal || !planBook_content.memAge || !planBook_content.cardlevel || !planBook_content.nation || !planBook_content.profession) {
                            if (!planBook_content.antiagingappeal) {
                                layer.alert("既往病史模块中最想解决的主诉求，不能为空", {closeBtn: 0});
                                flag = false;
                            } else {
                                layer.alert("基本信息填写不完全不能提交审核", {closeBtn: 0});
                                flag = false;
                            }
                        }
                    }
                } else {
                    flag = false;
                }
            } else {
                layer.alert(result.message, {closeBtn: 0});
                flag = false;
            }
        },
        error: function (data) {          //请求出错处理
            layer.alert(data, {closeBtn: 0});
        }
    });
    return flag;
}