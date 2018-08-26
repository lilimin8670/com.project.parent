var sessionId = getQueryString("sessionid");
var userAgent = getQueryString("userAgent");
var studyId=getQueryString("studyId");
var pageNumber= 1,pageSize=5;
$(function () {
    $("#cominput").val("");
    $(".comfs a:eq(1)").hide();
    studyDetail();
});
function studyDetail() {
    if (!sessionId) {
        alert("must have sessionId");
        return;
    }
    if (!userAgent) {
        alert("must have userAgent");
        return;
    }
    $.ajax({
        url: '/study-detail',          //请求的url地址，这是相对于现在的位置的地址
        dataType: 'json',                      //返回格式为json
        async: true,                           //请求是否异步，默认为异步，这也是ajax重要特性
        type: 'POST',                          //请求方式
        data: JSON.stringify({studyId:studyId}),
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            request.setRequestHeader("X-Session-Id", sessionId);
            request.setRequestHeader("X-User-Agent", userAgent);
        },
        success: function (response) { //请求成功时处理
            //console.log(response);
            if (response) {
                if (response.status == 0) {
                    var studyDetail = response.data;
                    console.log(studyDetail);
                    $("#studyDetail").html(template("studyDetailTemplate",studyDetail));
                    $(".new_details_content>p>iframe").attr("width","100%").attr("height","auto").attr("allowfullscreen",true);
                    var evaluateList=response.data.learnworldEvaluateList;
                    var evaluateCount=response.data.evaluateCount;
                    $("#evaluateCount").text(evaluateCount);
                    $("#learnworldEvaluate").html("<h2>热门评论</h2>");
                    $("#learnworldEvaluate").append(template("evaluateTemplate",studyDetail));
                        if(evaluateCount<pageSize){
                            if(evaluateCount==0){
                                $("#loadNoMore").html("没有评论");
                                $("#loadNoMore").show();
                            }else{
                                $("#loadNoMore").html("没有更多了...");
                                $("#loadMore").hide();
                                $("#loadNoMore").show();
                            }
                        }else{
                            $("#loadMore").hide();
                            $("#loadNoMore").show();
                            $("#loadNoMore").html("");
                            $("#moreEvaluations").show();
                        }
                    return;
                }
                if (response.message) {
                    layer.msg(response.message,{time:2000});
                    window.location.href="/relogin";
                }
            }
        },
        error: function (data) {          //请求出错处理
            console.log(data);
        }
    });
}
/**
 * 保存评论
 * @Author xuanYin
 * @Param
 * @Date 2016/11/16 13:24
 */
var btnAvailable=true;
function saveEvaluation(){
    var evaluateContent=$("#cominput").val();
    if(evaluateContent){
        if(btnAvailable){
            btnAvailable=false;
            $.ajax({
                url: '/study-evaluate',                   //请求的url地址，这是相对于现在的位置的地址
                dataType: 'json',                      //返回格式为json
                async: true,                           //请求是否异步，默认为异步，这也是ajax重要特性
                type: 'POST',                          //请求方式
                data: JSON.stringify({evaluateContent: evaluateContent,learnworldReleaseId:studyId}),
                beforeSend: function (request) {
                    request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
                    request.setRequestHeader("X-Session-Id", sessionId);
                    request.setRequestHeader("X-User-Agent", userAgent);
                },
                success: function (response) { //请求成功时处理
                    if (response) {
                        if (response.status == 0) {
                            //layer.msg(response.message,{time:2000},function(index){
                                $("#cominput").removeClass('focus');
                                $("#cominput").val("");
                                $(".comfs a:eq(1)").hide();
                                $(".comfs a:eq(0)").show();
                                pageNumber=1;
                                $("#learnworldEvaluate").html("<h2>热门评论</h2>");
                                init();
                                btnAvailable=true;
                            //});
                            return;
                        }
                        if (response.message) {
                            layer.msg(response.message,{time:2000});
                            window.location.href="/relogin";
                        }
                    }
                },
                error: function (data) {          //请求出错处理
                    console.log(data);
                }
            });
        }
    }else{
        btnAvailable=true;
        layer.msg("评论内容不能为空",{time:2000});
        return false;
    }
}
/**
 * 查询评论列表
 * @Author xuanYin
 * @Param
 * @Date 2016/11/16 14:17
 */
function  init(){
    $("#loadNoMore").html("没有更多了...");
    $("#moreEvaluations").hide();
    if(pageNumber==1){
        $("#learnworldEvaluate").html("<h2>热门评论</h2>");
    }
    $.ajax({
        url: '/study-evaluateList',              //请求的url地址，这是相对于现在的位置的地址
        dataType: 'json',                      //返回格式为json
        async: true,                           //请求是否异步，默认为异步，这也是ajax重要特性
        type: 'POST',                          //请求方式
        data: JSON.stringify({pageNumber:pageNumber,pageSize:pageSize,learnworldReleaseId:studyId}),
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            request.setRequestHeader("X-Session-Id", sessionId);
            request.setRequestHeader("X-User-Agent", userAgent);
        },
        success: function (response) { //请求成功时处理
            if (response) {
                if (response.status == 0) {
                    var evaluateList= response.data;//eval('('+response.data.evaluateList +')');
                    var fragment= template("evaluateTemplate",evaluateList);
                    $("#learnworldEvaluate").append(fragment);
                    $("#evaluateCount").text(response.data.evaluateCount);
                    console.log("列表数据长度："+evaluateList.learnworldEvaluateList.length);
                    if(evaluateList.learnworldEvaluateList.length<pageSize){
                        $("#loadMore").hide();
                        $("#loadNoMore").show();
                    }else{
                        $("#loadMore").show();
                        $("#loadNoMore").hide();
                        ++pageNumber;
                    }
                    return;
                }
                if (response.message) {
                    layer.msg(response.message,{time:2000});
                    window.location.href="/relogin";
                }
            }
        },
        error: function (data) {          //请求出错处理
            console.log(data);
        }
    });
}
