var currentPage1 = 1;
var pageSize = 10;
$(function () {
    $(".body_bg").css({
        'background': "url('/resources/img/homepage/noData.png')",
        'background-size': "100%"
    });
        $('.load_a').css('display', 'none');
        $('.load_b').css('display', 'none');
        $('.load_c').css('display', 'none');
        $("#memName").val("");
})
function setIntervalTime() {
    currentPage1 = 1;
    $("._remove").remove();
    //执行查询
    searchMemName();
}

function searchMemName() {
    $(".body_bg").css('background', '#f0f0f0');
    var memName = $("#memName").val();
    if(memName == "" || memName == null){
        $(".load_c").hide();
        $(".body_bg").css({
            'background': "url('/resources/img/homepage/noData.png')",
            'background-size': "100%"
        });
        return;
    }
    var url = basePath + "/service/strokeOrder/getSearchMemNameList";
    $.post(url, {memName: memName, currentPage: currentPage1, pageSize: pageSize}, function (res) {
        if (res.success) {
            //    oldMemName = memName;
            var strokeOrder = res.data.data;
            for (var i = 0; i < strokeOrder.length; i++) {
                if (0 == strokeOrder[i].auditStatus) {
                    strokeOrder[i].adviser = "待审核";
                    strokeOrder[i].remark = "审核";
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
                $(".cljkjhs li a").css("height", hei);
            }
            if (0 == res.data.total) {
                $(".load_c").hide();
                $("#loadMore").hide();
                $("#loadNoMore").hide();
                $(".body_bg").css({
                    'background': "url('/resources/img/homepage/noData.png')",
                    'background-size': "100%"
                });
            } else if (res.data.totalPage == currentPage1) {
                $("#loadMore").hide();
                $("#loadNoMore").show();
            } else {
                $("#loadNoMore").hide();
                $("#loadMore").show();
            }
            currentPage1++;
        }
    }, "json");
}


/**
 * 2017年3月2日 10:00:45
 * 查看客服版行程详细信息
 */
function details(id, regFormId, auditStatus) {
        window.location.href = basePath + "/service/strokeOrder/returnOrderDetails?id=" + id + "&regFormId=" + regFormId;
}
/**
 *
 * 2017年3月2日 13:50:18
 * @param id
 * @param regFormId
 * @param auditStatus
 */
function checkInfo(id, regFormId, auditStatus) {
    if (0 == auditStatus) {// 0表示待审核 需要客服审核
        window.location.href = basePath + "/service/strokeOrder/initStrokeOrderCheckPage?id=" + id + "&regFormId=" + regFormId + "&auditStatus=" + auditStatus;
        return;
    }
}