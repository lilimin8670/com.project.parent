/**
 * Created by yangxiao on 2016/7/18.
 */
$(function(){
    $("body").children("div").eq("0").css("padding-top","60px");
    initStorePage();
})
function initStorePage(){
    $.ajax({
        url:CP+"/service/homepage/findStorePage",
        type:"post",
        dataType:"json",
        success:function(result){
            var html = "";
            var list = result.memList;
            for (var i=0;i<list.length;i++){
                var url = "/resources/img/homepage/"+list[i].icon;
                html += '<a onclick="tiaozhuan('+"\'"+list[i].code+"\'"+","+"\'"+list[i].name+"\'"+","+"\'"+list[i].url+"\'"+')"><li><span><img src="'+url+'" alt=""></span>'+list[i].name+'<strong><img src="/resources/img/homepage/right.png"></strong></li></a>';
            }
            $("#ul").append(html);
        },
        error:function(){
            alert("网络错误！");
        }

    })
}

function tiaozhuan(code,name,url){
    if(url != null && url != "" && url !="undefined"){
        window.location=CP+url;
        //alert("跳转地址");
    }else{
        window.location=CP+"/service/homepage/initSecondStorePage?code="+code+"&name="+name;
    }
}
function fanhui(){
    window.location.href = "/back";
}
