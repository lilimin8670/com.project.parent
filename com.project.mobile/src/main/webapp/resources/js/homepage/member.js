/**
 * Created by yangxiao on 2016/7/28.
 */
$(function(){
$("body").children("div").eq(0).css("padding-top","60px");
});

/**
 * 跳转页面
 */
function tiaozhuan(url){
    //$.ajax({
    //    url:CP+"/service/homepage/initMemSecondPage",
    //    data:{"url":url},
    //    type:"post",
    //    success:function(result){
    //        alert("success");
    //    },
    //    error:function(){
    //        alert("访问网络失败");
    //    }
    //})
    window.location.href=CP+"/service/homepage/initMemSecondPage?url="+url;

}
