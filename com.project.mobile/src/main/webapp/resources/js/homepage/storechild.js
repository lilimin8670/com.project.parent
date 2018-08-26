/**
 * Created by yangxiao on 2016/7/18.
 */
$(function(){
    $("body").children("div").eq("0").css("padding-top","44px");
    initSecondStorePage();
})
function initSecondStorePage(){
    var code = $("#code").html();
    var name = $("#name").html();
    $.ajax({
        url:CP+"/service/homepage/findSecondStorePage",
        data:{"code":code},
        type:"post",
        dataType:"json",
        success:function(result){
            var html = "";
            var list = result.memList;
            for(var i=0;i<list.length;i++){
                if(code.indexOf("m-dj-1")>=0){
                    if(list[i].name == "发起"){
                        $("#startPlan").css('display','block');
                    }else if(list[i].name == "审核"){
                        $("#checkPlan").css('display','block');
                    }
                }else if(code.indexOf("m-dj-2")>=0){
                    if(list[i].name == "发起"){
                        $("#startOrder").css('display','block');
                    }else if(list[i].name == "审核"){
                        $("#checkOrder").css('display','block');
                    }
                }else if(code.indexOf("m-dj-7")>=0){
                    $("#newRegisterForm").css('display','block');
                }
                //美丽
                else if(list[i].code=="m-dj-3-1"){
                    html+="<div class=\"planmanage-content\" onclick=\"returnJsp('"+list[i].url+"')\">";
                    html+="<div class=\"left\">美丽跟踪表</div><div class=\"right\"><img src=\"/resources/img/homepage/jiantou.png\"></div> </div>";
                }//健康
                else if(list[i].code=="m-dj-3-2"){
                    html+="<div class=\"planmanage-content\" onclick=\"returnJsp('"+list[i].url+"')\">";
                    html+="<div class=\"left\">健康跟踪表</div><div class=\"right\"><img src=\"/resources/img/homepage/jiantou.png\"></div> </div>";
                }
                $("#strokeOrderDiv").html(html);
            }
        },
        error:function(){
            alert("网络错误！");
        }

    })
}

/**
 * 返回
 */
function fanhui(userAgent){
    if (from == "native"){
        window.location.href="/back";
    }else {
        /*if (userAgent == null){
            window.location.href="/back";
        }else {
            window.location=CP+"/service/index?userAgent="+userAgent;
        }*/
        window.location.href="/back";
    }
}

function returnJsp(url){
    window.location.href = url;
}