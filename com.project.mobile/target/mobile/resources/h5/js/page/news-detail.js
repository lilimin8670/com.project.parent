var sessionId = getQueryString("sessionid");
var userAgent = getQueryString("userAgent");
var newsId=getQueryString("newsId");
//var from=getQueryString("from")||"";
$(function () {
    init();
    /*$(".l,.c").click(function(){
        if(from&&"native"==from){
            window.location.href="/back";
        }else{
            window.history.go(-1);
        }
    });
    $("body").children("div:first").css({"padding-top":"60px"});*/
});
function init() {
    if (!sessionId) {
        alert("must have sessionId");
        return;
    }
    if (!userAgent) {
        alert("must have userAgent");
        return;
    }
    $.ajax({
        url: '/news-detail', //请求的url地址，这是相对于现在的位置的地址
        dataType: 'json',                      //返回格式为json
        async: true,                           //请求是否异步，默认为异步，这也是ajax重要特性
        type: 'POST',                          //请求方式
        data: JSON.stringify({newsId:newsId}),
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            request.setRequestHeader("X-Session-Id", sessionId);
            request.setRequestHeader("X-User-Agent", userAgent);
        },
        success: function (response) { //请求成功时处理
            console.log(response);
            if (response) {
                if (response.status == 0) {
                    var newsDetail = response.data;
                    $("#newsDetail").html(template("newsDetailTemplate",newsDetail));
                    $(".new_details_content>p>iframe").attr("width","100%").attr("height","auto").prop("allowfullscreen",true);
                    console.log(newsDetail);
                    return;
                }
                if (response.message) {
                    alert(response.message);
                    window.location.href="/relogin";
                }
            }
        },
        error: function (data) {          //请求出错处理
            console.log(data);
        }
    });
}
