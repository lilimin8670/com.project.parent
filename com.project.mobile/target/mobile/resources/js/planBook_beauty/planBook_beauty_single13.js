/**
 * Created by Administrator on 2016/7/16.
 */

/**
 * 初始化---想成为什么样的人--数据
 */
$(function(){
    var xcwsmydrFormParent=window.parent.$("#xcwsmydrFormParent").val();
    if(xcwsmydrFormParent){
        var xcwsmydrFormParentJson=JSON.parse(xcwsmydrFormParent||"{}");
        console.log(xcwsmydrFormParentJson);
        $("#xcwsmydrForm").form("load",xcwsmydrFormParentJson);
    }
});
/**
 * 保存计划书----想成为什么样的人
 */
function  saveXcwsmydr(formId,url){
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    var dataContent=JSON.stringify(dataJson);
    console.log(dataContent);
    $(window.parent.document).find("#"+formId+"FormParent").val(dataContent);
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty(url,formId);
}