/**
 * Created by Administrator on 2016/7/16.
 */


/**
 * 设置显示搭配图片
 */
$(function(){
    var analysisParent=$(window.parent.document).find("#analysisParent").val();
    var scFormParent=window.parent.$("#scFormParent").val();
    if(scFormParent){
        var scFormParentJson=JSON.parse(scFormParent||"{}");
        $("#fzczTrue").val(scFormParentJson.fzczTrue);
        $("#fzczFalse").val(scFormParentJson.fzczFalse);
        setYuefouCss("fzczTrue",scFormParentJson.fzczTrue);
        setYuefouCss("fzczFalse",scFormParentJson.fzczFalse);
        console.log(scFormParentJson);
        if(scFormParentJson.analysis){
            if(!analysisParent){
                analysisParent=scFormParentJson.analysis;
            }
        }
    }
    switch(analysisParent) {
        case "1":
            $("#rightSelect").attr("src",CP+"/resources/img/planBook_beauty/stature_02.png");
            $("#wrongSelect").attr("src",CP+"/resources/img/planBook_beauty/stature_04.png");
            break;
        case "2":
            $("#rightSelect").attr("src",CP+"/resources/img/planBook_beauty/stature_06.png");
            $("#wrongSelect").attr("src",CP+"/resources/img/planBook_beauty/stature_08.png");
            break;
        case "3":
            $("#rightSelect").attr("src",CP+"/resources/img/planBook_beauty/stature_10.png");
            $("#wrongSelect").attr("src",CP+"/resources/img/planBook_beauty/stature_12.png");
            break;
        case "4":
            $("#rightSelect").attr("src",CP+"/resources/img/planBook_beauty/stature_14.png");
            $("#wrongSelect").attr("src",CP+"/resources/img/planBook_beauty/stature_16.png");
            break;
        case "5":
            $("#rightSelect").attr("src",CP+"/resources/img/planBook_beauty/stature_18.png");
            $("#wrongSelect").attr("src",CP+"/resources/img/planBook_beauty/stature_20.png");
            break;
    }
});

/**
 * 保存搭配方式已阅/未阅
 * @param formId
 */
function saveFiguerdp(formId){
    //获取已阅/未阅属性值
    var yueValue="{\"fzczTrue\":\""+$("#fzczTrue").val()+"\",\"fzczFalse\":\""+$("#fzczFalse").val()+"\"}";
    //赋值给父页面搭配方式存值隐藏域
    $(window.parent.document).find("#dpfsFormParent").val(yueValue);
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
}


/**
 * 设置已阅/未阅的样式
 * @param yueFouValue
 */
function setYuefouCss(cssId,yueFouValue){
    if(cssId=="fzczTrue"){
        if(yueFouValue=="1"){
            $("#"+cssId).prev("a").addClass("yiyueOne").removeClass("weiyueOne").text("已阅");
        }else if(yueFouValue=="0"){
            $("#"+cssId).prev("a").removeClass("yiyueOne").addClass("weiyueOne").text("未阅");
        }
    }else if(cssId=="fzczFalse"){
        if(yueFouValue=="1"){
            $("#"+cssId).prev("a").addClass("yiyueTwo").removeClass("weiyueTwo").text("已阅");
        }else if(yueFouValue=="0"){
            $("#"+cssId).prev("a").removeClass("yiyueTwo").addClass("weiyueTwo").text("未阅");
        }
    }
}