/**
 * Created by Administrator on 2016/7/16.
 */

/**
 * 初始化加载
 */
$(function(){
    var mlwjFormParent=window.parent.$("#mlwjFormParent").val();
    if(mlwjFormParent){
        var mlwjFormParentJson=JSON.parse(mlwjFormParent||"{}");
        console.log(mlwjFormParentJson);
        $("#mlwjForm").form("load",mlwjFormParentJson);
    }
});
/**
 * 保存计划书----美丽问卷
 * @param formId
 */
function savemlwenjuan(formId){
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    var dataContent=JSON.stringify(dataJson);
    console.log(dataContent);
    $(window.parent.document).find("#"+formId+"FormParent").val(dataContent);
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
}