/**
 * Created by Administrator on 2016/7/20.
 */
var currentPage = 1;
var pageSize =10;


/**
 * 行程单信息列表
 */
function loadData(isLoad){
    if (isLoad == 1) {
        currentPage = 1;
    }
    $(".body_bg").css('background', '#f0f0f0');
    var url = basePath + "/service/strokeOrder/getStrokeOrderList";
    $.post(url, {type: 1 ,currentPage: currentPage, pageSize: pageSize}, function (res) {
        if (res.success) {
            if (isLoad == 1) {
                $("#kfLoopDiv").empty();
            }
            var strokeOrder = res.data.regGroups;
            for (var i = 0; i< strokeOrder.length;i++){
                var  status = strokeOrder[i].auditStatus;
                strokeOrder[i].adviser = StatusJson[status];
                if(0 == status){
                    strokeOrder[i].adviser = "待审核";
                    strokeOrder[i].adviserS = "审核";
                }
                if (1 == status) {
                    strokeOrder[i].adviser = "审核通过";
                }
                if (2 == status) {
                    strokeOrder[i].adviser = "驳回";
                }
                if (null == strokeOrder[i].auditStatus || "" == strokeOrder[i].auditStatus) {
                    strokeOrder[i].adviser = "";
                }
                var tr = template("strokeList", strokeOrder[i]);
                $(tr).appendTo("#kfLoopDiv");
                if (0 == status) {
                    $("." + strokeOrder[i].id).css('display', 'display');
                }
                if (1 == status) {
                    $("." + strokeOrder[i].id).css('display','none');
                }
                if (2 == status) {
                    $("." + strokeOrder[i].id).css('display', 'none');
                }
                if (null == strokeOrder[i].auditStatus || "" == strokeOrder[i].auditStatus) {
                    $("." + strokeOrder[i].id).css('display', 'none');

                }
            }
            if (res.data.total == 0) {
                $(".pullDown").hide();
                $(".pullUp").hide();
                $(".body_bg").css({
                    'background': "url('/resources/img/homepage/noData.png')",
                    'background-size': "100%"
                });
            }
            currentPage++;
        }
    }, "json");
}
/**
 * 查看报名表详细信息
 */
function details(id, regFormId,auditStatus){
    if(null == auditStatus || "" == auditStatus){
        noty({text: "该信息暂时不能审核!", timeout: 2000});
        return;//initStrokeOrderPageDetails
    }else{// 其余表示 审核通过和驳回 只需查看
        window.location.href = basePath + "/service/strokeOrder/returnOrderDetails?type=stroke&regFormId=" + regFormId + "&auditStatus="+auditStatus;
        return;
    }
}
function checkInfo(id, regFormId, auditStatus){
    if (0 == auditStatus) {// 0表示待审核 需要客服审核
        window.location.href = basePath + "/service/strokeOrder/initStrokeOrderCheckPage?id=" + id + "&regFormId=" + regFormId + "&auditStatus=" + auditStatus;
        return;
    }
}
/*var currentPage1 = 1;
function setIntervalTime() {
    currentPage1 = 1;
    $("._remove").remove();
    //执行查询
    searchMemName();
}

function searchMemName(){
    $(".body_bg").css('background', '#f0f0f0');
    var memName = $("#memName").val();
        var url = basePath + "/service/strokeOrder/getSearchMemNameList";
        $.post(url, { memName: memName, currentPage: currentPage1, pageSize: pageSize}, function (res) {
            if (res.success) {
            //    oldMemName = memName;
                var strokeOrder = res.data.data;
                for (var i = 0; i < strokeOrder.length; i++) {
                    if (0 == strokeOrder[i].auditStatus) {
                        strokeOrder[i].adviser = "待审核";
                        strokeOrder[i].remark = "待审核";
                    }
                    if (1 == strokeOrder[i].auditStatus) {
                        strokeOrder[i].adviser = "审核通过";
                    }
                    if (2 == strokeOrder[i].auditStatus) {
                        strokeOrder[i].adviser = "驳回";
                    }
                    if (null == strokeOrder[i].auditStatus || "" == strokeOrder[i].auditStatus) {
                        strokeOrder[i].adviser = "";
                    }
                    var tr = template("searchLi", strokeOrder[i]);
                    $(tr).appendTo("#cljkjhs");
                    var hei = $(".cljkjhs li").height();
                    $(".cljkjhs li a").css("height",hei);
                }
                if (0 == res.data.total) {
                    $("#loadMore").hide();
                    $("#loadNoMore").hide();
                    $(".body_bg").css({
                        'background': "url('/resources/img/homepage/noData.png')",
                        'background-size': "100%"
                    });
                }else  if (res.data.totalPage == currentPage1 ) {
                    $("#loadMore").hide();
                    $("#loadNoMore").show();
                }  else {
                    $("#loadNoMore").hide();
                    $("#loadMore").show();
                }
                currentPage1++;
            }
        }, "json");
}*/

/*
function goBack(){
    window.location.href = basePath + "/service/strokeOrder/initKfApplyPage";

}*/
