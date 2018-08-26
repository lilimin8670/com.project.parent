/**
 * Created by Administrator on 2016/7/15.
 */

/**
 * 初始化数据
 */
$(function(){
    var wglkFormParent=window.parent.$("#wglkFormParent").val();
    if(wglkFormParent){
        var wglkFormParentJson=JSON.parse(wglkFormParent||"{}");
        console.log(wglkFormParentJson);
        $("#wglkForm").form("load",wglkFormParentJson);
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
 * 保存计划书-------五官轮廓
 * @param formId
 */
function saveFacialFeatures(formId){
    //校验
    var isValid = $("#"+formId+"Form").form("validate");
    if(!isValid){
        return isValid;
    }
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    var dataContent=JSON.stringify(dataJson);
    console.log(dataContent);
    $(window.parent.document).find("#"+formId+"FormParent").val(dataContent);
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
}