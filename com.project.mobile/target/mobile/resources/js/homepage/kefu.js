/**
 * Created by yangxiao on 2016/7/18.
 */
$(function(){
    initMemPage();
})
function initMemPage(){
    $.ajax({
        url:CP+"/service/homepage/findKefuPage",
        type:"post",
        dataType:"json",
        success:function(result){
            var html = "";
            var list = result.memList;
            for (var i=0;i<list.length;i++){
                var url = "/resources/img/homepage/"+list[i].icon;
                html += '<a onclick="tiaozhuan('+"\'"+list[i].code+"\'"+","+"\'"+list[i].url+"\'"+","+"\'"+list[i].name+"\'"+')"><li><span><img src="'+url+'" alt=""></span>'+list[i].name+'<strong><img src="/resources/img/homepage/right.png"></strong></li></a>';
            }
            $("#ul").append(html);
        },
        error:function(){
            alert("网络错误！");
        }

    })
}

function tiaozhuan(code,url,title){
    //alert(code+url);
    if(url != null && url != "" && url !="undefined" && url != "null"){
        window.location=CP+url;
    }else {
        window.location = CP + "/service/homepage/initSecondKefuPage?code=" + code+"&title="+title;
    }
}

function fanhui(){
    window.location.href = "/back";
}
