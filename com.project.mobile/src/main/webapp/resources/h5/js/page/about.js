var sessionId = getQueryString("sessionid");
var userAgent = getQueryString("userAgent");
$(function () {
    init();
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
        url: '/about-us-info', //请求的url地址，这是相对于现在的位置的地址
        dataType: 'json',                      //返回格式为json
        async: true,                           //请求是否异步，默认为异步，这也是ajax重要特性
        type: 'POST',                          //请求方式
        data: {},
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            request.setRequestHeader("X-Session-Id", sessionId);
            request.setRequestHeader("X-User-Agent", userAgent);
        },
        success: function (response) { //请求成功时处理
            console.log(response);
            if (response) {
                if (response.status == 0) {
                    var data = response.data;
                    if (data.imgUrl) {
                        $("#imgId").attr("src", data.imgUrl);
                    }
                    return;
                }
                if (response.message) {
                    alert(response.message);
                    window.location.href = "/relogin";
                }
            }
        },
        error: function (data) {          //请求出错处理
            console.log(data);
        }
    });
}
