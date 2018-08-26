var sessionId = getQueryString("sessionid");
var userAgent = getQueryString("userAgent");
var newsId = getQueryString("newsId");
$(function () {
    $(".feedback_l,.feedback_c").click(function () {
        // window.history.go(-1);
        window.location.href = "/back";
    });
    var $wordCount = $("#wordCount");
    //实时的触发textarea的change事件
    $("#text").bind("propertychange input",function () {
        var word = $(this).val() || "";
        if (word.length > 500) {
            $(this).val(word.substring(0, 499));
        }
        $wordCount.text(500 - $(this).val().length);
    });
    $wordCount.text(500 - $("#text").val().length);
    // $("body").children("div:first").css({"padding-top": "60px"});
});
function postFeedback() {
    if (!sessionId) {
        layer.alert("must have sessionId",{closeBtn: 0});
        return;
    }
    if (!userAgent) {
        layer.alert("must have userAgent",{closeBtn: 0});
        return;
    }
    var textValue = $("#text").val();
    if (!textValue) {
        layer.alert("请输入反馈内容！",{closeBtn: 0});
        return;
    }
    $.ajax({
        url: '/feedback',                   //请求的url地址，这是相对于现在的位置的地址
        dataType: 'json',                      //返回格式为json
        async: true,                           //请求是否异步，默认为异步，这也是ajax重要特性
        type: 'POST',                          //请求方式
        data: JSON.stringify({text: textValue}),
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            request.setRequestHeader("X-Session-Id", sessionId);
            request.setRequestHeader("X-User-Agent", userAgent);
        },
        success: function (response) { //请求成功时处理
            console.log(response);
            if (response) {
                if (response.status == 0) {
                    layer.alert("提交成功！",{closeBtn: 0},function(){
                        window.location.href = "/back";
                    });
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
