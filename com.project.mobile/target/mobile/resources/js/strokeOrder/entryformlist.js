/**
 * Created by Administrator on 2016/7/20.
 */
var currentPage = 1;
var pageSize = 10;
$(function(){
    //$("body").children("div").eq("0").css("padding-top","60px");
})
/**
 * 报名表列表
 */
function loadData(isLoad){
    if (isLoad == 1) {
        currentPage = 1;
    }
    $(".body_bg").css('background', '#f0f0f0');
    var url = basePath + "/service/strokeOrder/getStrokeOrderList";
    $.post(url, {type: 0 ,currentPage: currentPage, pageSize: pageSize}, function (res) {
        if (res.success) {
            if (isLoad == 1) {
                $("#LoopDiv").empty();
            }
            var strokeOrder = res.data.data;
            for (var i = 0; i< strokeOrder.length;i++){
                if(0 == strokeOrder[i].auditStatus){
                    strokeOrder[i].auditStatus = "待审核";
                    strokeOrder[i].servicer ="dsh";
                }
                if (1 == strokeOrder[i].auditStatus) {
                    strokeOrder[i].auditStatus = "审核通过";
                    strokeOrder[i].servicer ="shtg";
                }
                if (2 == strokeOrder[i].auditStatus) {
                    strokeOrder[i].auditStatus = "驳回";
                    strokeOrder[i].servicer = "shwc";
                }
                var tr = template("strokeList", strokeOrder[i]);
                $(tr).appendTo("#LoopDiv");

            }
            juzhong();
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
    var  status = "";
    var url = basePath + "/service/strokeOrder/getIsReceive";
    $.post(url, {id:id}, function (res) {
        if (res.success) {
            status = res.data;
            if ("1" == status){
                //如果该行程有一人已确认接待,就显示详情信息
                window.location.href = basePath + "/service/strokeOrder/returnOrderDetails?type=storeStroke&regFormId=" + regFormId ;
                return;
            }
            if ("0" == status) {
                if(auditStatus == "待审核"){
                    window.location.href = basePath + "/service/strokeOrder/returnOrderDetails?type=storeStroke&regFormId=" + regFormId;
                    return;
                }else{
                    window.location.href = basePath + "/service/strokeOrder/initStrokeOrderPage?id=" + id + "&regFormId=" + regFormId;
                }
            }
        }
    }, "json");

}

function juzhong(){
    var num = $(".planreview-content").length;
    for(var i=0; i<num; i++){
        var shheight = $('.launchplan-left:eq('+ i +') div').height()+15;
        $('.launchplan-right:eq('+ i +') div').css('height', shheight);
    }

}

