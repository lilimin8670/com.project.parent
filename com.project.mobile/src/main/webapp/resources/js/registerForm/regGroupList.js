$(function(){
    //定位头部不动
    // $("body").children("div").eq("0").css("padding-top","60px");
    refresher.init({
        id:"wrapper",
        pullDownAction:Refresh,
        pullUpAction:Load,
        childHtmlTag:"ul"
    });

    //加载数据
    Load();
    minHeight();
});

/**
 * 2017/7/11
 * 最小高度计算(填充)
 *
 */

function  minHeight(){
    var doch=$(window).height() - 100;
    $("#regGroupTable").css({'min-height':doch});
}


/**
 * 当前加载状态
 * @type {string}
 */
var loadStatus = "ok";


function Load(){
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    console.log("load:"+currentPage);
    loadData(2);
}

function Refresh() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    currentPage = 1;
    console.log("refresh:"+currentPage);
    loadData(1);
}

var currentPage = 1;
var pageSize = 10;
/**
 *
 * @param isLoad 2,加载数据;1,刷新数据
 */
function loadData(isLoad){
    console.log("isLoad:"+isLoad);
    $.ajax({
        url:basePath+"/service/dj/registerForm/getRegGroupList",
        data:{
            "type":type,
            "currentPage":currentPage,
            "pageSize":pageSize
        },
        dataType:"json",
        success:function(result){
            if(isLoad==1){
                document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
            }
            var regGroups = result.data.regGroups;
            if (regGroups != null && regGroups.length > 0){
                if (isLoad == 1){
                    $("#regGroupTable").empty();
                }
                for (var i=0;i<regGroups.length;i++){

                    var regDeadline = regGroups[i].regDeadline;
                    if (regDeadline != null && regDeadline != ""){
                        regGroups[i].regDeadline = regDeadline.substring(0,10);
                    }else {
                        regGroups[i].regDeadline = "";
                    }
                    var tr = template("regGroup",regGroups[i]);
                    $(tr).appendTo("#regGroupTable");
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
            if ($("#regGroupTable").children().length==0){
                $("body").css({'background':"url('/resources/img/homepage/noData.png') no-repeat",'background-size':"100%"});
                $(".wrapper").hide();
            }
            loadStatus = "ok";
        }
    });
}

function showAddRegisterForm(id,regDeadline){
    window.location.href = basePath + "/service/dj/registerForm/returnAddRegisterForm?type="+type+"&classify="+classify+"&regDeadline="+regDeadline+"&regGroupId="+id+"&code="+code+"&name="+name+"&from="+from;
}

function goBack(){
    window.location.href = basePath + "/service/dj/registerForm/returnNewRegisterFormList?type="+type+"&classify="+classify+"&code="+code+"&title="+title+"&from="+from;
}