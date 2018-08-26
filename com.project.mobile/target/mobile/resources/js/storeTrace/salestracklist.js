var yy,YY,swipeY;
var body = document.getElementById("one");
var currentPage = 1;
var pageSize = 10;

/**
 * 初始化
 * @author abner
 */
$(function(){
    $('.feedback_rr img').click(function (event) {
        $("#cljkjhs").html("");
        $('.two').css('display', 'block');
        $('.one').css('display', 'none');
        search();
    });
    //$('.cancel').click(function (event) {
    //    $('.two').css('display', 'none');
    //    $('.one').css('display', 'block');
    //    $("#memberName").val("");
    //    $("#id").val("");
    //    currentPage = 1;
    //    pageSize = 2;
    //    $("#table").html("");
    //    loadData();
    //});
    body.addEventListener('touchstart',a);
    body.addEventListener('touchmove',b);
    body.addEventListener('touchend',c);
    loadData();
});

/**
 * 查询会员
 */
function search(){
    $("#cljkjhs").html("");
    $.ajax({
        url: basePath + "/service/storeTrace/searchMemberName",
        data: {
            "memberName":$("#memberName").val()
        },
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            $(".body_bg").css({'background': 'none'});
            if (result.success) {
                if (result.data.length != 0) {
                    var html = template("memberList", {"list": result.data});
                    var $tr = $(html).appendTo("#cljkjhs");
                    $.parser.parse($tr);
                } else {
                    $(".body_bg").css({'background': "url('/resources/img/homepage/noData.png') no-repeat", 'background-size': "100%"});
                }
            }
        }
    });
};

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

function searchStoreTraceList(){
    currentPage = 1;
    loadData();
}

/**
 * 加载列表
 * @author abner
 */
function loadData(){
    var searchText = $("#searchText").val();
    $.ajax({
        url:basePath + "/service/storeTrace/getStoreTraceList",
        data:{
            "currentPage":currentPage,
            "pageSize":pageSize,
            "type":type,
            "memberId":$("#id").val(),
            "searchText":searchText
        },
        type:"post",
        async: false,
        dataType:"json",
        success:function(result){
            $(".body_bg").css({'background': 'none'});
            if(currentPage==1){
                $("#table").empty();
            }
            if (result.success){
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
function show(id){
    window.location.href = basePath + "/service/storeTrace/initCalendar?trackRecordsId="+id+"&type="+ type;
};

/**
 * 跳转售后跟踪
 * @param id
 */
function skipRecord(id, planBookId){
    //window.location.href = basePath + "/service/storeTrace/skipRecord?trackRecordsId=" + id + "&type=" + type +"&planBookId="+ planBookId;
    window.location.href = basePath + "/service/planBook/getCheckView?id=" + planBookId + "&btnType=1&nameType=101&trackRecordsId="+ id+"&typeRecords=" + type;
};

/**
 * 选择会员
 */
function choiceMember(memberId){
    $("#id").val(memberId);
    currentPage = 1;
    pageSize = 6;
    $("#table").html("");
    loadData();
    $('.two').css('display', 'none');
    $('.one').css('display', 'block');
};

/**
 * 返回列表div
 */
function backDiv(){
    $('.two').css('display', 'none');
    $('.one').css('display', 'block');
    $("#memberName").val("");
    $("#id").val("");
    currentPage = 1;
    pageSize = 6;
    $("#table").html("");
    loadData();
}