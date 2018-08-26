/**
 * Created by Administrator on 2016/7/15.
 */
/**
 * 脸型js
 * @Author xuanYin
 * @Param
 * @Date 2016/7/15 11:56
 */
//脸型选择
$(function(){
    $("#selectedFaceType").val("");
    var faceParent=$(window.parent.document).find("#lxfxFormParent").val();
    var faceParentJson= JSON.parse(faceParent||"{}");
    console.log(faceParentJson);
    var witchOne=$("#selectedFaceType").val();
    if(witchOne){
        setFaceImg(witchOne);
    }else{
        $("#lxfxForm").form('load', faceParentJson);
        setFaceImg($("#selectedFaceType").val());
    }
    $('.faceContent dl').click(function(){
        var url = $(this).find("img").attr("src");
        if(url.indexOf("1.png") > 0 ){
            var url1 = url.replace("1.png","2.png");
            $('.faceContent dl').each(function(index, element) {
                switch(index) {
                    case 0:
                        $(this).find("img").attr("src",CP+"/resources/img/planBook_beauty/faceone1.png");
                        break;
                    case 1:
                        $(this).find("img").attr("src",CP+"/resources/img/planBook_beauty/facetwo1.png");
                        break;
                    case 2:
                        $(this).find("img").attr("src",CP+"/resources/img/planBook_beauty/facethree1.png");
                        break;
                    case 3:
                        $(this).find("img").attr("src",CP+"/resources/img/planBook_beauty/facefour1.png");
                        break;
                    case 4:
                        $(this).find("img").attr("src",CP+"/resources/img/planBook_beauty/facefive1.png");
                        break;
                    case 5:
                        $(this).find("img").attr("src",CP+"/resources/img/planBook_beauty/facesix1.png");
                        break;
                    case 6:
                        $(this).find("img").attr("src",CP+"/resources/img/planBook_beauty/faceseven1.png");
                        break;
                }
            });
        }
        if(url.indexOf("2.png") > 0 ){
            var url1 = url.replace("2.png","1.png");
        }
        $(this).find("img").attr("src",url1).siblings("img").attr("src",url);
        var number = $(this).find("img").attr("src");
        if(number.indexOf("2.png") > 0){
            getFaceValue(number);
            $(this).css("color","#999");
            $(this).siblings("dl").css("color","#333");
        }
        else if(number.indexOf("1.png") > 0){
            $("input[name=face]").val("");
            $(this).css("color","#333");
        }
    });
});

/**
 * 获取选中脸型的值
 * @param number
 */
function getFaceValue(number){
    var numberArry=number.split("/");
    var lastnumberArry=numberArry[numberArry.length-1];
    var index=lastnumberArry.substr(0,(lastnumberArry.length)-5);
    switch(index) {
        case "faceone":
            $("input[name=face]").val(1);
            break;
        case "facetwo":
            $("input[name=face]").val(2);
            break;
        case "facethree":
            $("input[name=face]").val(3);
            break;
        case "facefour":
            $("input[name=face]").val(4);
            break;
        case "facefive":
            $("input[name=face]").val(5);
            break;
        case "facesix":
            $("input[name=face]").val(6);
            break;
        case "faceseven":
            $("input[name=face]").val(7);
            break;
    }

}
/**
 *保存计划书-------脸型分析
 */
function saveFace(formId){
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    var dataContent=JSON.stringify(dataJson);
    $(window.parent.document).find("#lxfxFormParent").val(dataContent);
    $(window.parent.document).find("#faceParent").val($("input[name=face]").val());
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
}


/**
 * 设置脸型选中图片
 */
function setFaceImg(faceValue){
    switch(faceValue) {
        case "1":
            $("#face"+faceValue).attr("src",CP+"/resources/img/planBook_beauty/faceone2.png");
            break;
        case "2":
            $("#face"+faceValue).attr("src",CP+"/resources/img/planBook_beauty/facetwo2.png");
            break;
        case "3":
            $("#face"+faceValue).attr("src",CP+"/resources/img/planBook_beauty/facethree2.png");
            break;
        case "4":
            $("#face"+faceValue).attr("src",CP+"/resources/img/planBook_beauty/facefour2.png");
            break;
        case "5":
            $("#face"+faceValue).attr("src",CP+"/resources/img/planBook_beauty/facefive2.png");
            break;
        case "6":
            $("#face"+faceValue).attr("src",CP+"/resources/img/planBook_beauty/facesix2.png");
            break;
        case "7":
            $("#face"+faceValue).attr("src",CP+"/resources/img/planBook_beauty/faceseven2.png");
            break;
    }
}
