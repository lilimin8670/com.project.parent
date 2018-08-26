$(function(){
    $('.feedback_rr img').click(function(event) {
        $('.two').css('display', 'block');
        $('.one').css('display', 'none');
    });
    $('#fanhuiBtn').click(function(event) {
        $('.two').css('display', 'none');
        $('.one').css('display', 'block');
        $("#memberName").val("");
        $("#memberListUl").html("");
    });

    refresher.init({
        id:"wrapper",
        pullDownAction:Refresh,
        pullUpAction:Load,
        childHtmlTag:"div"
    });

    Load();
});



var currentPage = 1;
var pageSize = 5;
var memberId = "";

/**
 * 显示详情
 * @param id
 * @param doType
 */
function showDetail(id,type,regProStateId,processId,doType){
    window.location.href = cp + "/service/check/registerForm/returnNewRegisterFormDetail?regFormId="+id+"&type="+type+"&classify="+classify+
        "&processId="+processId+"&regProStateId="+regProStateId+"&doType="+doType+"&from="+from+"&actionFrom=manger";
}


function search(){
    var memName = $("#memberName").val();
    $("#memberListUl").html("");
    $.ajax({
        url: cp + "/service/sysTrace/searchMemberName",
        data: {
            "memberName":memName
        },
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            if (result.data != null) {
                var html = template("memberList",{"list": result.data});
                $(html).appendTo("#memberListUl");
            }
        }
    });
}

function choiceMember(id){
    memberId = id;
    $("#memberName").val("");
    $("#memberListUl").html("");
    currentPage = 1;
    $("#registerFormTable").html("");
    loadData(1);
    $('.two').css('display', 'none');
    $('.one').css('display', 'block');
}


/**
 * 查看进度
 * @param id
 */
function showProcess(id){
    window.location.href = cp + "/service/check/registerForm/returnRegisterFormProgress?regFormId="+id+"&from="+from;
}

function goBack() {
    window.location.href = cp + "/service/homepage/initSecondKefuPage?code=m-kf-2&title=报名表管理";
}


/**
 * 当前加载状态
 * @type {string}
 */
var loadStatus = "ok";

/**
 * 向下拖动屏幕刷新数据
 */
function Refresh() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    currentPage = 1;
    console.log("refresh:"+currentPage);
    loadData(1);
}

/**
 * 向上拖动屏幕，加载下一页数据
 */
function Load() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    console.log("load:"+currentPage);
    loadData(0);
}

/**
 * 请求后台，根据条件加载数据
 * @param optFlag 0,加载数据;1,刷新数据
 * @param down 是否为下拉屏幕刷新数据
 */
function loadData(optFlag) {
    loadStatus = "loading";
    $.ajax({
        url:cp+"/service/dj/registerForm/getNewRegisterFormList",
        data:{
            "currentPage":currentPage,
            "pageSize":pageSize,
            "classify":classify,
            "memberId":memberId,
            "type":type
        },
        async:false,
        dataType:"json",
        success:function(result){
            //如果是下拉屏幕，数据加载完成后隐藏加载loading图标
            if(optFlag==1){
                document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
            }
            var registerForms = result.registerForms;
            if (registerForms != null && registerForms.length > 0){
                console.log(registerForms);
                var tr = "";
                for (var i=0;i<registerForms.length;i++){
                    var status = registerForms[i].status;
                    registerForms[i].status = statusJson[status];
                    var type = registerForms[i].type;
                    registerForms[i].typeName = typesJson[type];
                    var submitDate = registerForms[i].submitDate;
                    registerForms[i].submitDate = submitDate.substring(0,10);
                    tr += template("registerForm",registerForms[i]);
                }
                //如果是加载数据，将新的数据追加到列表后面
                if (optFlag == 0){
                    $(tr).appendTo("#registerFormTable");
                }else if (optFlag == 1){//如果是刷新数据将当前显示的数据清空，替换成新的数据
                    $("#registerFormTable").empty().append(tr);
                }
                currentPage++;
                if(document.getElementById("wrapper").querySelector(".pullDownLabel")){
                    document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
                    document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML="刷新成功";
                    setTimeout(function () {
                        document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML=" ";
                    },1000);
                }
                wrapper.refresh();
            }else {
                wrapper.refresh();
                document.getElementById("wrapper").querySelector(".pullUpIcon").style.display="none";
                document.getElementById("wrapper").querySelector(".pullUpLabel").innerHTML="已没有数据!";
            }

            if ($("#registerFormTable").children().length==0){
                $("body").css({'background':"url('/resources/img/homepage/noData.png') no-repeat",'background-size':"100%"});
                $("#wrapper").hide();
            }
            loadStatus = "ok";
        }
    });
}
