var sessionId = getQueryString("sessionid");
var userAgent = getQueryString("userAgent");
var pageNumber = 1, pageSize = 20;
$(function () {
    init();
    $(".l,.c").click(function () {
        //window.history.go(-1);
        window.location.href = "/back";
    });
    var hei = document.body.clientWidth;
    var hei_load = $(".load_b_box").width();
    var heinew = (hei - hei_load) / 2;
    $(".load_b_box").css("margin-left", heinew);
    $("header").css({"z-index": 10000}).show();
    $("body").children("div:first").css({"padding-top": "60px"});
    $("header").css({"z-index": 10000}).show();
    //下拉刷新
    refresher.init({
        id: "wrapper",
        pullDownAction: refresh,
        pullUpAction: load,
        childHtmlTag: "div"
    });
});
function refresh() {
    setTimeout(function () {
        $("#wrapper").find(".pullDownIcon").hide();
        $("#wrapper").find(".pullDownLabel").append('刷新成功');
        setTimeout(function () {
            wrapper.refresh();
            document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML = "";
            pageNumber=1;
            $("#newsList").empty();
            init();
        }, 10);//模拟下拉刷新显示成功效果
    }, 10);
}
function load() {
    setTimeout(function () {
        init();
        wrapper.refresh();
    }, 10);
}
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
        url: '/news-list',              //请求的url地址，这是相对于现在的位置的地址
        dataType: 'json',                      //返回格式为json
        async: true,                           //请求是否异步，默认为异步，这也是ajax重要特性
        type: 'POST',                          //请求方式
        data: JSON.stringify({pageNumber: pageNumber, pageSize: pageSize}),
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            request.setRequestHeader("X-Session-Id", sessionId);
            request.setRequestHeader("X-User-Agent", userAgent);
        },
        success: function (response) { //请求成功时处理
            console.log(response);
            if (response) {
                if (response.status == 0) {
                    var newsList = response.data;
                    if (newsList.newsList.length) {
                        $("#newsList").append(template("newsListTemplate", newsList));
                        ++pageNumber;
                    }
                } else if (response.message) {
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
function openNewsDetail(newsId) {
    window.location.href = "/h5/news-detail.html?sessionid=" + sessionId + "&userAgent=" + userAgent + "&newsId=" + newsId + "&shareOrNot=1";
}
