/**
 * Created by Administrator on 2016/7/15.
 */

/**
 * 设置显示发型图片
 */
$(function(){
    var faceParent=$(window.parent.document).find("#faceParent").val();
    var fxfxFormParent=window.parent.$("#fxfxFormParent").val();
    if(fxfxFormParent){
        var fxfxFormParentJson=JSON.parse(fxfxFormParent||"{}");
        console.log(fxfxFormParentJson);
        $("#hairFalse").val(fxfxFormParentJson.fxfxYueFou);
        setYuefouCss("hairFalse",fxfxFormParentJson.fxfxYueFou);
        if(fxfxFormParentJson.face){
            if(!faceParent){
                faceParent=fxfxFormParentJson.face;
            }
        }
    }
    switch(faceParent) {
        case "1":
            $("#rightHair1").attr("src",CP+"/resources/img/planBook_beauty/3.png");
            $("#rightHair2").attr("src",CP+"/resources/img/planBook_beauty/4.png");
            $("#rightHair3").attr("src",CP+"/resources/img/planBook_beauty/5.png");
            break;
        case "2":
            $("#rightHair1").attr("src",CP+"/resources/img/planBook_beauty/11.png");
            $("#rightHair2").attr("src",CP+"/resources/img/planBook_beauty/12.png");
            $("#rightHair3").attr("src",CP+"/resources/img/planBook_beauty/13.png");
            $("#wrongHair1").attr("src",CP+"/resources/img/planBook_beauty/4.png");
            $("#wrongHair2").attr("src",CP+"/resources/img/planBook_beauty/14.png");
            break;
        case "3":
            $("#rightHair1").attr("src",CP+"/resources/img/planBook_beauty/6.png");
            $("#rightHair2").attr("src",CP+"/resources/img/planBook_beauty/7.png");
            $("#rightHair3").attr("src",CP+"/resources/img/planBook_beauty/8.png");
            $("#wrongHair1").attr("src",CP+"/resources/img/planBook_beauty/9.png");
            $("#wrongHair2").attr("src",CP+"/resources/img/planBook_beauty/10.png");
            break;
        case "4":
            $("#rightHair1").attr("src",CP+"/resources/img/planBook_beauty/16.png");
            $("#rightHair2").attr("src",CP+"/resources/img/planBook_beauty/17.png");
            $("#rightHair3").attr("src",CP+"/resources/img/planBook_beauty/18.png");
            $("#wrongHair1").attr("src",CP+"/resources/img/planBook_beauty/19.png");
            $("#wrongHair2").attr("src",CP+"/resources/img/planBook_beauty/20.png");
            break;
        case "5":
            $("#rightHair1").attr("src",CP+"/resources/img/planBook_beauty/21.png");
            $("#rightHair2").attr("src",CP+"/resources/img/planBook_beauty/22.png");
            $("#rightHair3").attr("src",CP+"/resources/img/planBook_beauty/23.png");
            $("#wrongHair1").attr("src",CP+"/resources/img/planBook_beauty/24.png");
            $("#wrongHair2").attr("src",CP+"/resources/img/planBook_beauty/25.png");
            break;
        case "6":
            $("#rightHair1").attr("src",CP+"/resources/img/planBook_beauty/26.png");
            $("#rightHair2").attr("src",CP+"/resources/img/planBook_beauty/27.png");
            $("#rightHair3").attr("src",CP+"/resources/img/planBook_beauty/28.png");
            $("#wrongHair1").attr("src",CP+"/resources/img/planBook_beauty/29.png");
            $("#wrongHair2").attr("src",CP+"/resources/img/planBook_beauty/30.png");
            break;
        case "7":
            $("#rightHair1").attr("src",CP+"/resources/img/planBook_beauty/31.png");
            $("#rightHair2").attr("src",CP+"/resources/img/planBook_beauty/32.png");
            $("#rightHair3").attr("src",CP+"/resources/img/planBook_beauty/33.png");
            $("#wrongHair1").attr("src",CP+"/resources/img/planBook_beauty/34.png");
            $("#wrongHair2").attr("src",CP+"/resources/img/planBook_beauty/35.png");
            break;
    }
});

/**
 * 保存发型已阅/未阅
 * @param formId
 */
function saveHair(formId){
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    var dataContent=JSON.stringify(dataJson);
    $(window.parent.document).find("#fxfxFormParent").val(dataContent);
    var yueValue="{\"fxfxYueFou\":\""+$("#hairFalse").val()+"\"}";
    $(window.parent.document).find("#fxfxYueFouParent").val(yueValue);
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
}

/**
 * 设置已阅/未阅的样式
 * @param yueFouValue
 */
function setYuefouCss(cssId,yueFouValue){
    if(yueFouValue=="1"){
        $("#"+cssId).prev("a").addClass("yiyue").removeClass("weiyue").text("已阅");
    }else if(yueFouValue=="0"){
        $("#"+cssId).prev("a").removeClass("yiyue").addClass("weiyue").text("未阅");
    }
}