var currentPage = 1;
var pageSize = 10;
/**
 * 初始化页面列表
 */
$(function () {
    Load();
    refresher.init({
        id: "wrapper",
        pullDownAction: Refresh,
        pullUpAction: Load,
        childHtmlTag: ""
    });
});
function Load() {
    setTimeout(function () {
        search(2);
        wrapper.refresh();
    }, 300);
}
function Refresh() {
    setTimeout(function () {
        //这里写你的刷新代码
        $("#wrapper").find(".pullDownIcon").hide();
        $("#wrapper").find(".pullDownLabel").html('刷新成功');
        setTimeout(function () {
            wrapper.refresh();
            search(1);
            $("#wrapper").find(".pullDownLabel").html(' ');
        }, 300);//模拟下拉刷新显示成功效果
    },500);
}
/**
 *
 */
function search(isLoad) {
    if (isLoad == 1) {
        // $("#cljkjhs").html("");
        currentPage = 1;
    }
    $.ajax({
        url: basePath + "/service/sysTrace/searchTraceList",
        data: {
            "memberName": $("#memberName").val(),
            "currentPage": currentPage,
            "pageSize": pageSize,
            "type": type
        },
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            $(".body_bg").css({'background': 'none'});
            if (result.success) {
                if (result.data.total != 0 || result.data.total.length > 0) {
                    var planBook = result.data.data;
                    if (type == 1) {
                        for (var i = 0; i < planBook.length; i++) {
                            var html = template("beautyList", planBook[i]);
                             $(html).appendTo("#cljkjhs");
                            //    $.parser.parse($tr);
                        }
                    }
                    if (type == 2) {
                        for (var i = 0; i < planBook.length; i++) {
                            var html = template("healthList", planBook[i]);
                            $(html).appendTo("#cljkjhs");
                            //    $.parser.parse($tr);
                        }
                    }
                    if(type==7){
                        for (var i = 0; i < planBook.length; i++) {
                            var html = template("newBeautyList", planBook[i]);
                            $(html).appendTo("#cljkjhs");
                        }
                    }
                    if(type==8){
                        for (var i = 0; i < planBook.length; i++) {
                            var html = template("newHealthList", planBook[i]);
                            $(html).appendTo("#cljkjhs");
                        }
                    }
                    currentPage++;
                } else {
                    $(".body_bg").css({
                        'background': "url('/resources/img/homepage/noData.png') no-repeat",
                        'background-size': "100%"
                    });
                }
            }
        }
    });
};
/**
 * 打开计划书进行编辑
 * @param memberId
 */
function openRecord(id) {
    window.location.href = basePath + "/service/kfPlanBook/getCheckView?id=" + id + "&btnType=0&nameType=105";
};
/*
function backList(){
    window.location.href = basePath +"/service/homepage/initSecondKefuPage?code=m-kf-1&title=计划书管理";
}
*/

/**
 * 嵌套了Iframe的页面返回上一页面
 * @type {number}
 */
var orgIndex = window.history.length;
function backList() {
        var goIndex = orgIndex - window.history.length - 1;
        window.history.go(goIndex); //如果iframe的url变了1次，那么goIndex就是-2，类推
}