var yy, YY, swipeY;
var body = document.getElementById("auditdetails");
var currentPage = 1;
var pageSize = 10;
var show = false;
/**
 * 初始化
 * @author abner
 */
$(function () {
    $('.planreview-top-left').click(function (event) {
        $(this).addClass('current').siblings().removeClass('current')
    });
    $("#add").hide();
    body.addEventListener('touchstart', a);
    body.addEventListener('touchmove', b);
    body.addEventListener('touchend', c);
    loadData();
    $("#imgMax").hide();
    $(".memberdatails-tupian img").click(function () {
        $("#imgMax").show();
        var url = $(this).attr("src");
        $("#imgMax").find("img").attr("src", url);
        var Hei = $("#imgMax img").height();
        var padTop = ($(window).height() - Hei) / 2;
        $("#imgMax").find("img").css("padding-top", padTop);
    });
    $("#imgMax").click(function () {
        $("#imgMax").hide();
    });
});

/**
 * 删除绑定事件
 * @author abner
 */
function remove() {
    body.removeEventListener('touchstart', a);
    body.removeEventListener('touchmove', b);
    body.removeEventListener('touchend', c);
};

/**
 * 绑定事件
 * @author abner
 */
function a(event) {
    yy = event.targetTouches[0].screenY;
    swipeY = true;
};

/**
 * 绑定事件
 * @author abner
 */
function b(event) {
    YY = event.targetTouches[0].screenY;
};

/**
 * 绑定事件
 * @author abner
 */
function c() {
    if (swipeY && YY - yy < 0) {  //上下滑动
        swipeY = false;
        loadData();
    }
};
//
//function showAuditdetails(){
//    $("#auditdetails").show();
//    $("#planBook").hide();
//    $("#auditdetails").html('<div class="title">以下为人工跟踪记录内容：</div>');
//    currentPage = 1;
//    pageSize = 6;
//    loadData();
//
//};
//
//function showPlanBook(){
//    $("#auditdetails").hide();
//    $("#planBook").show();
//    $("#add").hide();
//
//};

/**
 * 加载列表
 * @author abner
 */
function loadData() {
    $.ajax({
        url: basePath + "/service/sysTrace/getSysTraceRecordsList?time=" + (new Date()).valueOf(),
        data: {
            "currentPage": currentPage,
            "pageSize": pageSize,
            "trackRecordsId": trackRecordsId,
            "type": type
        },
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            if (result.success) {
                var html = template("list", {"list": result.data.list});
                var $tr = $(html).appendTo("#auditdetails");
                $.parser.parse($tr);
                if (result.data.edit) {
                    $("#add").show();
                } else {
                    $("#add").hide();
                }
                if (result.data.totalPage == currentPage) {
                    remove();
                }
                currentPage++;
            }
        }
    });
};

/**
 * 添加当天跟踪记录
 * @author abner
 * @param id
 */
function add() {
    window.location.href = basePath + "/service/sysTrace/initAddTrackRecord?trackRecordsId=" + trackRecordsId + "&type=" + type + "&time=" + (new Date()).valueOf();
};
