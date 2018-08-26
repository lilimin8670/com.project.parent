/**
 * Created by Administrator on 2016/7/20.
 */

$(function(){
    loadData();
})
/**
 * 报名表列表
 */
var t = "";
var icon = "";
function loadData(){
    var url = basePath + "/service/strokeOrder/getStrokeOrderAauditInfo";
    $.post(url, {id: id}, function (res) {
        if (res.success) {
            if(res.data.length ==0){
                $(".auditdetails").css("display", "none");
                $(".text").css("padding-top","60px")
            //    $("#auditdetailsInfo").css("display","none");
            }else{
                for (var i = 0; i< res.data.length;i++){
                    if(1 ==res.data[i].status){
                        res.data[i].statusStr = "通过";
                        res.data[i].icon = "auditdetails_yes";
                    }
                    if (2 == res.data[i].status) {
                        res.data[i].statusStr = "不通过";
                        res.data[i].icon = "auditdetails_no";
                    }

                 res.data[i].auditDate = res.data[i].auditDate.substring(0,10);
                 var tr = template("detailsLoop", res.data[i]);
                 $(tr).appendTo("#auditdetailsInfo");
                 }
            }

        }
    }, "json");
}
/**
 * 在点击审核和驳回按钮的时候判断该行程单是否已经审核过
 * 如果已经审核过在提示 该行程已被审核!
 */
function queryStatus(status){
    var url = basePath + "/service/strokeOrder/queryStatus";
    $.post(url, {id: id}, function (res) {
        if (res.success) {
            noty({text: "该行程已被审核!", timeout: 1000, callback:{
                afterClose: function () {
                    window.location.href = basePath + "/service/strokeOrder/initKfApplyPage";
                }}
            });
        }else{
            updateStatus(status);
        }
    }, "json");
}



/**
 *行程审核和驳回
 * @param status
 */
function updateStatus(status){
    var opinion = $("#opinion").val();
    var url = basePath + "/service/strokeOrder/updateStatus";
    $.post(url, {id: id, status: status, opinion:opinion}, function (res) {
        if (res.success) {
            noty({
                text: res.message, timeout: 1000, callback: {
                    afterClose: function () {
                        window.location.href = basePath + "/service/strokeOrder/initKfApplyPage";
                    }
                }
            });
        }
    }, "json");
}
function formatDate(now) {
    var data = new Date(now);
    var year = data.getFullYear();
    var month = data.getMonth() + 1;
    var date = data.getDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    return year + "-" + month + "-" + date;
}