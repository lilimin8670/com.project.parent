/**
 * Created by Administrator on 2016/7/16.
 */

//肤质提升计划
$(function(){
    initSkinData();
    $(".skinCont ul li a").click(function(){
        $(this).addClass("hover").siblings("a").removeClass("hover");
        var thisIndex=(-$(this).index())+5;
        $(this).siblings("input").val(thisIndex);
    });
});
//
/**
 * 保存计划书-------肤质分析
 * @param formId
 */
function saveSkin(formId){
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    var dataContent=JSON.stringify(dataJson);
    console.log(dataContent);
    $(window.parent.document).find("#"+formId+"FormParent").val(dataContent);
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
}
/**
 * 初始化肤质数据
 */
function initSkinData(){
    var fzFormParent=window.parent.$("#fzFormParent").val();
    if(fzFormParent){
        var fzFormParentJson=JSON.parse(fzFormParent||"{}");
        console.log(fzFormParentJson);
        $("#fzForm").form("load",fzFormParentJson);
        $(".skinCont ul li").each(function(i){
            var skinVal=$(this).find("input[name='skin_js"+(i+1)+"']").val();
            $(this).find("a").each(function(){
                var thisIndex=(-$(this).index())+5;
                if(thisIndex==skinVal){
                    $(this).addClass("hover").siblings("a").removeClass("hover");
                }
            });

        });
    }
}