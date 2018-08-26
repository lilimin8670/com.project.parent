/**
 * Created by Administrator on 2016/7/15.
 */

$(function(){
    //获取父页面的值，设置选中
    var scfxFormParent=window.parent.$("#scfxFormParent").val();
    console.log(scfxFormParent);
    var scfxFormParentJson=JSON.parse(scfxFormParent||"{}");
    $("#scfxForm").form('load',scfxFormParentJson);
    var analysisCurrent=$("input[name='analysis']").val();
    if(analysisCurrent){
        setanalysisImg(analysisCurrent);
    }
//身材选择
    $(".makeupContent dl dd").click(function(){
        $(this).find("a").addClass("hover");
        $(this).siblings("dd").children("a").removeClass("hover");
        //获取选中身材的值
        var selectId=$(this).find("a").attr("id");
        $("input[name=analysis]").val(selectId.substr(selectId.length-1,selectId.length));
    });
});

/**
 * 保存计划书----身材分析
 */
function  saveFigure(formId){
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    var dataContent=JSON.stringify(dataJson);
    $(window.parent.document).find("#"+formId+"FormParent").val(dataContent);
    $(window.parent.document).find("#analysisParent").val($("input[name=analysis]").val());
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
}

/**
 * 设置选中的身材类型
 * @param analysisCurrent
 */
function setanalysisImg(analysisCurrent){
    $("#analysis"+analysisCurrent).addClass("hover");
    $("#analysis"+analysisCurrent).siblings("a").removeClass("hover");
}