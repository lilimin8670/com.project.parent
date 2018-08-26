(function ($) {
    $.fn.serializeJson = function () {
        var serializeObj = JSON.parse(JSON.stringify(result));
        var array = this.serializeArray();
        var str = this.serialize();
        $(array).each(function () {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
        return serializeObj;
    };
})(jQuery);
$(function(){

   $("#visit_form").validate({
        onfocusout: function(element) {
            // $(element).valid();
        }, //失去焦点时不执行验证
        errorPlacement: function(error, element) { //错误提示，错误对象
            error.appendTo(element.parents("div").find(">label"));
        },
        errorClass: "errorMes",
        errorElement:'span'
    });

    loadData(result);
    if(act=="view"){
        disableLabel();
    }

    $(".return_btn").click(function () {
        window.history.go(-1);
    })


});




function commitVisit(){
    var visitJson = $("#visit_form").serializeJson()
    var visitJsonString = JSON.stringify(visitJson);
    console.log(visitJsonString);

    var flag = $("#visit_form").valid();
    if(!flag){
        return;
    }
    var visitJson = $("#visit_form").serializeJson()
    var visitJsonString = JSON.stringify(visitJson)
    console.log(visitJsonString)
    var url = CP+"/service/artificial/commitVisit";
    var data = {"feedback":visitJsonString};
    $.post(url,data,function(result){
        if(result.success){
            window.history.go(-1);
        }else{
            layer.msg(result.message,"2000");
        }
    },'json')
}

function loadData(obj){;
    var key,value,tagName,type,arr;
    for(x in obj){
        key = x;
        value = obj[x];
        $("[name='"+key+"'],[name='"+key+"[]']").each(function(){
            tagName = $(this)[0].tagName;
            type = $(this).attr('type');
            if(tagName=='INPUT'){
                if(type=='radio'){
                    $(this).attr('checked',$(this).val()==value);
                }else if(type=='checkbox'){
                    if(value!=null&&value!="") {
                        for (var i = 0; i < value.length; i++) {
                            if ($(this).val() == value[i]) {
                                $(this).attr('checked', true);
                                break;
                            }
                        }
                    }
                }else{
                    $(this).val(value);
                }
            }else if(tagName=='SELECT' || tagName=='TEXTAREA'){
                $(this).val(value);
            }else if(tagName=="SPAN"){
                $(this).html(value);
            }
        });
    }
}

/**
 * 禁用label的点击事件
 */
function disableLabel(){
    $('input').attr("readonly",true);
    $('.radio,.checkbox').click(function() {return false});
    $(".header_r a").hide();
}