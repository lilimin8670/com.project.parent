/**
 * 初始化身材提升计划数据
 */
$(function(){
    var scFormParent=window.parent.$("#scFormParent").val();
    if(scFormParent){
        var scFormParentJson=JSON.parse(scFormParent||"{}");
        console.log(scFormParentJson);
        $("#scForm").form("load",scFormParentJson);
    }
});
/**
 * 验证输入框值
 */
$.extend($.fn.validatebox.defaults.rules,{
    minOrMax: {
        validator: function(value, param){
            return (value >= param[0] && value <= param[1]);
        },
        message: '只能输入{0}-{1}之间的整数'
    }
});

/**
 * 保存计划书-----身材分析
 * @param formId
 */
function saveBodyPlan(formId){
    //校验
    var isValid = $("#"+formId+"Form").form("validate");
    if(!isValid){
        return isValid;
    }
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    var dataContent=JSON.stringify(dataJson);
    console.log(dataContent);
    $(window.parent.document).find("#scFormParent").val(dataContent);
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
}
