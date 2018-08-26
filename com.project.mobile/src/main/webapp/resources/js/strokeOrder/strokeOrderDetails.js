/**
 * Created by Administrator on 2016/7/20.
 */
$(function(){
    initStrokeOrder();

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
            if( 0 == strokeOrder.isCome){
                $("#isCome").val("是");
            }else{
                $("#isCome").val("否");
            }
            if (0 == strokeOrder.isLive) {
                $("#isLive").val("是");
            } else {
                $("#isLive").val("否");
            }
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
            for (var i = 0; i < details.length; i++) {
                if ("1" == details[i].tripType) {
                    details[i].tripType = "来程";
                }
                if ("2" == details[i].tripType) {
                    details[i].tripType = "返程";
                }
                var tr = template("stroke", details[i]);
                $(tr).appendTo("#appendStroke");
            }
        } else {
            $.messager.alert("错误", res.message, "error");
        }
    }, "json");
}



