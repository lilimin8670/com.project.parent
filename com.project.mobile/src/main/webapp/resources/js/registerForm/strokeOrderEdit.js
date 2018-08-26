/**
 * @author  zhaihonghong
 * @type {number}
 */
$(function(){
    //定位头部不动
    $("body").children("div").eq("0").css("padding-top","60px");

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
        },
        card: {
            validator: function(value,param){
                var flag= isCardID(value);
                return flag==true?true:false;
            },
            message: '不是有效的身份证号码！'
        }
    });
});


/**
 * 校验身份证
 * @param sId
 */
function isCardID(idCard){
    var iSum=0 ;
    var info="" ;
    var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    if(!/^\d{17}(\d|x)$/i.test(idCard)){
        return "你输入的身份证长度或格式错误";
    }
    idCard=idCard.replace(/x$/i,"a");
    if(aCity[parseInt(idCard.substr(0,2))]==null){
        return "你的身份证地区非法";
    }
    sBirthday=idCard.substr(6,4)+"-"+Number(idCard.substr(10,2))+"-"+Number(idCard.substr(12,2));
    var d=new Date(sBirthday.replace(/-/g,"/")) ;
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
        return "身份证上的出生日期非法";
    }
    for(var i = 17;i>=0;i --){
        iSum += (Math.pow(2,i) % 11) * parseInt(idCard.charAt(17 - i),11);
    }
    if(iSum%11!=1){
        return "你输入的身份证号非法";
    }
    return true;
}



var rowid = 0;
$(function(){
    $("#orderForm").form("load",strokeOrder);
    $("#orderId").val(strokeOrder.id);
    var length = $(".moren_img").length;
    for (var i=1;i<=length;i++){
        var img = $("#previewImage"+i+"H").val();
        if (img != null && img != "" && img != " "){
            $("#previewImage"+i).attr("src",img);
        }
    }
    if (strokeOrderDetailsList.length > 0){
        for(var i=0;i<strokeOrderDetailsList.length;i++){
            var html = template("addDetail",{rowid:i});
            $(html).appendTo("#detailTable");
        }
        $.parser.parse('.datatr');
        var $trs=$("#detailTable").find("ul.datatr");
        for(var i=0;i<strokeOrderDetailsList.length;i++){
            $trs.eq(i).find("#id"+i).val(strokeOrderDetailsList[i].id);
            $trs.eq(i).find("#tripType"+i).val(strokeOrderDetailsList[i].tripType);
            $trs.eq(i).find("#name"+i).textbox("setValue",strokeOrderDetailsList[i].name);
            $trs.eq(i).find("#trafficMode"+i).val(strokeOrderDetailsList[i].trafficMode);
            $trs.eq(i).find("#flightNum"+i).val(strokeOrderDetailsList[i].flightNum);
            $trs.eq(i).find("#number"+i).val(strokeOrderDetailsList[i].number);
            if (strokeOrderDetailsList[i].startTime != null){
                $trs.eq(i).find("#startTime"+i).val(formatDate(new Date(strokeOrderDetailsList[i].startTime)));
                //$trs.eq(i).find("#startTime"+i).datetimebox("setValue",formatDate(new Date(strokeOrderDetailsList[i].startTime)));
            }
            if (strokeOrderDetailsList[i].arrivalTime != null){
                $trs.eq(i).find("#arrivalTime"+i).val(formatDate(new Date(strokeOrderDetailsList[i].arrivalTime)));
                //$trs.eq(i).find("#arrivalTime"+i).datetimebox("setValue",formatDate(new Date(strokeOrderDetailsList[i].arrivalTime)));
            }

        }
        rowid = i;
        dateTime();
    }
    console.log("编辑页面的doType的值为"+doType);
    if (doType == "1"){
        $("#submitBtn").hide();
        $(".del").hide();
        $("#addBtn").hide();
        $(".form").hide();
        $("#orderForm input,select").prop("disabled","disabled");
    }
});

/**
 * 添加一行
 */

function addRow(){
    var html = template("addDetail",{rowid:rowid++});
    $(html).appendTo("#detailTable");
    $.parser.parse('.datatr:last');
    dateTime();
}

/**
 * 删除一行
 * @param rowid
 */
function deleterow(rowid){
    var orderDetailId = $("#ul_"+rowid).find("#id"+rowid).val();
    if (orderDetailId != "" || orderDetailId != null){
        $.ajax({
            url : cp+"/service/strokeOrder/deleteStrokeOrderDetail",
            data : "orderDetailId="+orderDetailId,
            dataType : "json",
            success : function(result){
                if (result.success){
                    noty({text:result.message,timeout:2000});
                    $("#ul_"+rowid).remove();
                }else{
                    noty({text:result.message,timeout:2000});
                }
            }
        });
    }else {
        $("#ul_"+rowid).remove();
    }
}

function saveStrokeOrder(){
    $("#orderForm").form("submit",{
        url: cp + '/service/strokeOrder/editStrokeOrder',
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
            $.messager.progress("close");
            var data = eval('(' + result + ')');
            if (data.success) {
                history.go(-1);
            } else {
                $.messager.alert("错误", data.message, "error");
            }

        }

    });
}

