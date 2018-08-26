var yy,YY,swipeY;
var body = document.getElementById("body");
var currentPage = 1;
var pageSize = 6;

/**
 * 初始化
 * @author abner
 */
$(function(){
    body.addEventListener('touchstart',a);
    body.addEventListener('touchmove',b);
    body.addEventListener('touchend',c);
    loadData();
});

/**
 * 删除绑定事件
 * @author abner
 */
function remove(){
    body.removeEventListener('touchstart', a);
    body.removeEventListener('touchmove', b);
    body.removeEventListener('touchend', c);
};

/**
 * 绑定事件
 * @author abner
 */
function a(event){
    yy = event.targetTouches[0].screenY;
    swipeY = true;
};

/**
 * 绑定事件
 * @author abner
 */
function b(event){
    YY = event.targetTouches[0].screenY;
};

/**
 * 绑定事件
 * @author abner
 */
function c() {
    if (swipeY && YY - yy < 0) {  //上下滑动
        swipeY = false;
        loadData();
    }
};

/**
 * 加载列表
 * @author abner
 */
function loadData(){
    $.ajax({
        url:basePath + "/service/memberTrace/getMemberTraceList",
        data:{
            "currentPage":currentPage,
            "pageSize":pageSize
        },
        type:"post",
        async: false,
        dataType:"json",
        success:function(result){
            if (result.success) {
                if (result.data.total != 0) {
                    for (var i = 0; i < result.data.list.length; i++) {
                        var createDate = result.data.list[i].createDate;
                        if (createDate != null && createDate != "") {
                            result.data.list[i].createDate = createDate.substring(0, 10);
                        } else {
                            result.data.list[i].createDate = "";
                        }
                        var html = template("list", result.data.list[i]);
                        var $tr = $(html).appendTo("#table");
                        $.parser.parse($tr);
                    }
                    if (result.data.totalPage == currentPage) {
                        remove();
                    }
                    currentPage++;
                } else {
                    remove();
                    $(".body_bg").css({'background': "url('/resources/img/homepage/noData.png') no-repeat", 'background-size': "100%"});
                }
            }
        }
    });
};

/**
 * 跳转实施情况
 * @author abner
 * @param id
 * @param type
 */
function show(id,type){
    window.location.href = basePath + "/service/memberTrace/initCalendar?trackRecordsId="+id+"&type="+ type;
};

/**
 * 跳转计划书
 * @param id
 */
function skipRecord(id) {
    //window.location.href = basePath + "/service/memberTrace/skipPlanBook?id=" + id;
    window.location.href = basePath + "/service/memPlanBook/getCheckView?id=" + id + "&btnType=1&nameType=100";
};