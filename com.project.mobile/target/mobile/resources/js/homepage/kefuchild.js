/**
 * Created by yangxiao on 2016/7/18.
 */
$(function(){
    initSecondMemPage();
})
function initSecondMemPage(){
    var code = $("#code").html();
    $.ajax({
        url:CP+"/service/homepage/findSecondKefuPage",
        data:{"code":code},
        type:"post",
        dataType:"json",
        success:function(result){
            var html = "";
            var list = result.memList;
            for (var i=0;i<list.length;i++){
                if(list[i].code=='m-kf-1-3'||list[i].code=='m-kf-1-4'){
                    continue;
                }
                html += '<a onclick="tiaozhuan('+"\'"+list[i].code+"\'"+","+"\'"+list[i].name+"\'"+","+"\'"+list[i].url+"\'"+')"><li><span><img src="'+CP+'/resources/img/homepage/sevicer02.png" alt=""></span>'+list[i].name+'<strong><img src="'+CP+'/resources/img/homepage/right.png"></strong></li></a>';
            }
            $("#ul").append(html);
        },
        error:function(){
            alert("网络错误！");
        }

    })
}


function tiaozhuan(code,name,url){
    //alert(code+url);
    if(url != null && url != "" && url !="undefined" && url != "null"){
        if (url.indexOf("?")>0){
            window.location=CP+url+"&code="+parentCode+"&title="+name+"&from="+from;
        }else {
            window.location=CP+url+"?code="+parentCode+"&title="+name+"&from="+from;
        }

    }else{
        window.location=CP+"/service/homepage/initSecondKefuPage?code="+code;
    }


}

/**
 * 返回
 */
function fanhui(userAgent){
    if (from == "native"){
        window.location.href="/back";
    }else{
        /*if (userAgent == null){
            window.location.href="/back";
        }else {
            window.location.href=CP+"/service/index?userAgent="+userAgent;
        }*/
        window.location.href="/back";

    }

}
