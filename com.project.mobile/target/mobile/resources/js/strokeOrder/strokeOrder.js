/**
 * Created by xuchengbin on 2016/7/20.
 */
var rowid = 0;
$(function(){
    initStrokeOrder();
 //   hidUpload("images");
    $.extend($.fn.validatebox.defaults.rules, {
        radio: {
            validator: function (value, param) {
                var input = param[0], ok = false;
                $('input[name="' + input + '"]').each(function () {
                    if (this.checked) {
                        ok = true;
                        return false;
                    }
                });
                return ok
            },
            message: '请选择一项'
        }
    });
})
function initStrokeOrder(){
    var $form = $("#strokeData");
    var url = basePath + "/service/strokeOrder/getStrokeOrderInfo";
    $.post(url, {id: id, regFormId: regFormId}, function (res) {
        if (res.success) {
            var strokeOrder = res.data.strokeOrder;
            var details = res.data.detailsDate;
            $form.form("load", strokeOrder);
            if(null != strokeOrder && "" != strokeOrder ){
                if(null != strokeOrder.zjFront && "" != strokeOrder.zjFront){
                    $("#previewImage1").attr("src", strokeOrder.zjFront);
                }
                if (null != strokeOrder.zjSide && "" != strokeOrder.zjSide) {
                    $("#previewImage2").attr("src", strokeOrder.zjSide);
                }
                if (null != strokeOrder.zjCardFront && "" != strokeOrder.zjCardFront) {
                    $("#previewImage3").attr("src", strokeOrder.zjCardFront);
                }
                if (null != strokeOrder.zjCardSide && "" != strokeOrder.zjCardSide) {
                    $("#previewImage4").attr("src", strokeOrder.zjCardSide);
                }
                if (null != strokeOrder.zjOthone && "" != strokeOrder.zjOthone) {
                    $("#previewImage5").attr("src", strokeOrder.zjOthone);
                }
                if (null != strokeOrder.zjOthtwo && "" != strokeOrder.zjOthtwo) {
                    $("#previewImage6").attr("src", strokeOrder.zjOthtwo);
                }
                if (null != strokeOrder.zjOththree && "" != strokeOrder.zjOththree) {
                    $("#previewImage7").attr("src", strokeOrder.zjOththree);
                }

                if (null != strokeOrder.fwFront && "" != strokeOrder.fwFront) {
                    $("#previewImage8").attr("src", strokeOrder.fwFront);
                }
                if (null != strokeOrder.fwSide && "" != strokeOrder.fwSide) {
                    $("#previewImage9").attr("src", strokeOrder.fwSide);
                }
                if (null != strokeOrder.fwCardFront && "" != strokeOrder.fwCardFront) {
                    $("#previewImage10").attr("src", strokeOrder.fwCardFront);
                }
                if (null != strokeOrder.fwPassFront && "" != strokeOrder.fwCardSide) {
                    $("#previewImage11").attr("src", strokeOrder.fwCardSide);
                }
                if (null != strokeOrder.fwPassFront && "" != strokeOrder.fwPassFront) {
                    $("#previewImage12").attr("src", strokeOrder.fwPassFront);
                }
                if (null != strokeOrder.fwPassSide && "" != strokeOrder.fwPassSide) {
                    $("#previewImage13").attr("src", strokeOrder.fwPassSide);
                }
                if (null != strokeOrder.fwEndorsement && "" != strokeOrder.fwEndorsement) {
                    $("#previewImage14").attr("src", strokeOrder.fwEndorsement);
                }
                if (null != strokeOrder.fwOthone && "" != strokeOrder.fwOthone) {
                    $("#previewImage15").attr("src", strokeOrder.fwOthone);
                }
                if (null != strokeOrder.fwOthtwo && "" != strokeOrder.fwOthtwo) {
                    $("#previewImage16").attr("src", strokeOrder.fwOthtwo);
                }
                if (null != strokeOrder.fwOththree && "" != strokeOrder.fwOththree) {
                    $("#previewImage17").attr("src", strokeOrder.fwOththree);
                }
            }
            for (var i = 0; i < details.length; i++) {
                details[i].rowid = i;
                var tr = template("stroke", details[i]);

                $(tr).appendTo("#appendStroke");
                $.parser.parse('.datatr');
            }
            rowid = i;
            dateTime();

        } else {
            $.messager.alert("错误", res.message, "error");
        }
    }, "json");
}

/**
 * 修改行程信息
 */
function updateStrokeOrder(){
    $('#strokeData').form('submit', {
        url: basePath + '/service/strokeOrder/updateStrokeOrder',
        method: "post",
        onSubmit: function () {
            $.messager.progress({
                title: "处理中,请稍候...."
            });
            //校验表单
            var isValid = $(this).form("validate");
            if (!isValid) {//校验不通过关提示信息
                $.messager.progress("close");
            } else {
                $.messager.progress("close");
            }
            return isValid;
        },
        success: function (result) {
            var data = eval('(' + result + ')');
            if (data.success) {
                window.location.href = basePath + "/service/strokeOrder/initApplyPage";
                noty({text: data.message, timeout: 2000});
            } else {
                $.messager.alert("错误", data.message, "error");
            }
        }
    });

}
/**
 * 添加一行
 */
function addRow() {
    var html = template("stroke", {rowid: rowid++});
    $(html).appendTo("#detailTable");
    $.parser.parse('.datatr');
    dateTime();
}
/**
 * 删除一行
 * @param rowid
 */
function deleteRow(rowid) {
    var id = $("#id_"+ rowid).val();
    $("#tr_" + rowid).remove();
    var url = basePath + "/service/strokeOrder/deleteSingleTrip";
    if(null != id && "" != id){
        $.post(url, {id: id}, function (res) {
        }, "json");
    }
}

function formatDate(now) {
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":"
        + second;
}
