var studyId=getQueryString("studyId");
$(function () {
    studyDetailShare();
});
function studyDetailShare() {
    $.ajax({
        url: '/service/learnworld/getStudyDetail',          //请求的url地址，这是相对于现在的位置的地址
        dataType: 'json',                      //返回格式为json
        async: true,                           //请求是否异步，默认为异步，这也是ajax重要特性
        type: 'POST',                          //请求方式
        data: {studyId:studyId},
        success: function (response) { //请求成功时处理
            if (response) {
                if (response.success) {
                    var studyDetail = response.data;
                    $("#studyDetail").html(template("studyDetailTemplate",studyDetail));
                    $(".new_details_content>p>iframe").attr("width","100%").attr("height","auto").attr("allowfullscreen",true);
                }else{
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
