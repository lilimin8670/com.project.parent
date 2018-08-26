/**
 * Created by Administrator on 2016/7/16.
 */



/**
 * 设置显示腮红及眉型图片
 */
$(function(){
    var faceParent=$(window.parent.document).find("#faceParent").val();
    var zrfxFormParent=window.parent.$("#zrfxFormParent").val();
    if(zrfxFormParent){
        var zrfxFormParentJson=JSON.parse(zrfxFormParent||"{}");
        console.log(zrfxFormParentJson);
        if(zrfxFormParentJson.face){
            if(!faceParent){
                faceParent=zrfxFormParentJson.face;
            }
        }
    }
    switch(faceParent) {
        case "1":
            $("#blush").attr("src",CP+"/resources/img/planBook_beauty/39.png");
            $("#standardEyebrow").attr("src",CP+"/resources/img/planBook_beauty/40.png");
            $("#oneEyebrow").attr("src",CP+"/resources/img/planBook_beauty/41.png");
            break;
        case "2":
            $(".uploadBox dl dt").children("#standardEyebrow").remove();
            $("#blush").attr("src",CP+"/resources/img/planBook_beauty/42.png");
            $("#oneEyebrow").attr("src",CP+"/resources/img/planBook_beauty/43.png");
            break;
        case "3":
            $("#blush").attr("src",CP+"/resources/img/planBook_beauty/44.png");
            $("#standardEyebrow").attr("src",CP+"/resources/img/planBook_beauty/45.png");
            $("#oneEyebrow").attr("src",CP+"/resources/img/planBook_beauty/46.png");
            break;
        case "4":
            $("#blush").attr("src",CP+"/resources/img/planBook_beauty/47.png");
            $("#standardEyebrow").attr("src",CP+"/resources/img/planBook_beauty/48.png");
            $("#oneEyebrow").attr("src",CP+"/resources/img/planBook_beauty/49.png");
            break;
        case "5":
            $("#blush").attr("src",CP+"/resources/img/planBook_beauty/50.png");
            $("#standardEyebrow").attr("src",CP+"/resources/img/planBook_beauty/51.png");
            $("#oneEyebrow").attr("src",CP+"/resources/img/planBook_beauty/52.png");
            break;
        case "6":
            $("#blush").attr("src",CP+"/resources/img/planBook_beauty/53.png");
            $("#standardEyebrow").attr("src",CP+"/resources/img/planBook_beauty/54.png");
            $("#oneEyebrow").attr("src",CP+"/resources/img/planBook_beauty/55.png");
            break;
        case "7":
            $("#blush").attr("src",CP+"/resources/img/planBook_beauty/36.png");
            $("#standardEyebrow").attr("src",CP+"/resources/img/planBook_beauty/37.png");
            $("#oneEyebrow").attr("src",CP+"/resources/img/planBook_beauty/38.png");
            break;
    }
});