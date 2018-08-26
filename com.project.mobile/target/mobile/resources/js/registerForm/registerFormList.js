/**
 * @author zhh
 * @type {number}
 */

$(function(){

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

/**
 * 当前加载状态
 * @type {string}
 */
var loadStatus = "ok";

function Load() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    console.log("load:"+currentPage+"   loadStatus:"+loadStatus);
    loadData(0);
}

function Refresh() {
    if(loadStatus !== "ok"){
        return;
    }
    loadStatus = "loading";
    currentPage = 1;
    console.log("refresh:"+currentPage+"   loadStatus:"+loadStatus);
    loadData(1);
}

function loadData(isLoad){
    $.ajax({
        url:cp+"/service/dj/registerForm/getRegisterFormList",
        data:{
            "classify":classify,
            "type":type,
            "currentPage":currentPage,
            "pageSize":pageSize
        },
        async:false,
        dataType:"json",
        success:function(result){
            if(isLoad==1){
                document.getElementById("wrapper").querySelector(".pullDownIcon").style.display="none";
            }
            var registerForms = result.registerForms;
            console.log(registerForms.length);
            if (registerForms != null && registerForms.length>0){
                if (isLoad == 1){
                    $("#registerFormTable").empty();
                }
                for (var i=0;i<registerForms.length;i++){
                    var status = registerForms[i].status;
                    registerForms[i].statusText = formTypeMap[status];
                    var submitDate = registerForms[i].submitDate;
                    registerForms[i].submitDate = submitDate.substring(0,10);
                    var tr = template("registerForm",registerForms[i]);
                    $(tr).appendTo("#registerFormTable");
                    if (status == 1){
                        $("#"+registerForms[i].id).addClass("delete");
                    }
                }

                currentPage++;

                if(document.getElementById("wrapper").querySelector(".pullDownLabel")){
                    document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML="刷新成功";
                    setTimeout(function () {
                        document.getElementById("wrapper").querySelector(".pullDownLabel").innerHTML=" ";
                    },1000);
                }
                wrapper.refresh();
            }else{
                wrapper.refresh();
                document.getElementById("wrapper").querySelector(".pullUpIcon").style.display="none";
                document.getElementById("wrapper").querySelector(".pullUpLabel").innerHTML="已没有数据!";
            }
            if ($("#registerFormTable").children().length==0){
                $("#loadMore").hide();
                $("body").css({'background':"url('/resources/img/homepage/noData.png') no-repeat",'background-size':"100%"});
            }
            loadStatus = "ok";
            console.log("加载完数据 loadStatus:"+loadStatus);
            mobile_touch();
        }
    });
}
/**
 * 显示详情
 * @param id
 * @param doType
 */
function showDetail(id,doType){
    window.location.href = cp + "/service/dj/registerForm/returnEditRegiterForm?type="+type+"&id="+id+"&doType="+doType+"&classify="+classify+"&code="+code+"&title="+title+"&from="+from;
}
/**
 * 跳转到预约团信息页面
 */
function showRegGroup(){
    $.get(cp + "/service/dj/registerForm/isProcessDef",{"type":type},function(result){
        if(!result.success){
            noty({text:result.message,timeout:3000});
            return ;
        }
        window.location.href = cp + "/service/dj/registerForm/returnRegGroupList?type="+type+"&classify="+classify+"&code="+code+"&title="+title+"&from="+from;
    },"json");
}
/**
 * 跳转到编辑页面
 * @param id
 */
function editRegisterForm(id){
    window.location.href = cp + "/service/dj/registerForm/returnEditRegiterForm?id="+id+"&type="+type+"&classify="+classify+"&doType=2"+"&code="+code+"&title="+title;
}

/**
 * 查看进度
 * @param id
 */
function showProcess(id){
    window.location.href = cp + "/service/check/registerForm/returnRegisterFormProgress?regFormId="+id+"&code="+code+"&title="+title+"&from="+from;
}

/**
 * 删除预约单
 * @param id
 */
function deleteRegisterForm(id){
    $.messager.confirm('确认','您确认想要删除记录吗？',function(r){
        if (r){
            $.messager.progress({
                title:"提示",
                text:"数据处理中，请稍后...."
            });
            $.ajax({
                async:false,
                url:cp+"/service/dj/registerForm/deleteRegisterForm",
                data:"id="+id,
                dataType:"json",
                success:function(result){
                    if (result.success){
                        noty({text:result.message,timeout:2000});
                        $("#"+id).remove();
                    }else{
                        $.messager.alert('提示',result.message);
                    }
                }
            });
            $.messager.progress("close");
        }
    });
}

/**
 * 申请作废预约单
 * 弹框填写作废原因
 * @param id
 */
function cancleDialog(id,status){
    //判断是否有正在跟踪的跟踪计划书
    $.post(cp+"/service/dj/registerForm/gettrackRecordStatus", {"regFromId":id}, function (result) {
        if(result.success) {
            //如果有不进行任何操作提示先停止跟踪
            if (result.data == "2"){
                noty({text:"该报名表对应的计划书正在进行跟踪，请先停止跟踪！",timeout:3000});
            }else{
                //如果没有跟踪则进行操作
                $("#id").val(id);
                $("#formstatus").val(status);
                $("#cancleDialog").dialog({
                    title: '作废原因',
                    width: "80%",
                    height: 200,
                    closed: false,
                    cache: false,
                    border:'thin',
                    modal: true,
                    buttons: [{
                        text:'确定',
                        handler:function(){
                            cancleRegisterForm(id);
                        }
                    },{
                        text:'取消',
                        handler:function(){
                            $('#cancleDialog').dialog('close');
                        }
                    }]
                });
                //定位弹框的位置
                //letDivCenter("#"+id);
            }
        }else {
            $.messager.alert("错误",result.message,"error");
        }
        $.messager.progress("close");
    },"json");

}
/**
 * 取消作废操作
 * @param id
 * @param perCancelStatus
 */
function notcancleDialog(id,perCancelStatus){
    var statusText = formTypeMap[perCancelStatus];
    $.messager.confirm('确认','您确认取消作废吗？',function(r){
        if (r){
            $.messager.progress({
                title:"提示",
                text:"数据处理中，请稍后...."
            });
            $.ajax({
                async:false,
                url:cp+"/service/dj/registerForm/notcancleRegisterForm",
                data:{
                    "id":id,
                    "perCancelStatus":perCancelStatus
                },
                dataType:"json",
                success:function(result){
                    if (result.success){
                        noty({text:result.message,timeout:2000});
                        var status = result.data.status;
                        result.data.statusText = formTypeMap[status];
                        $("#"+id).replaceWith(template("registerForm",result.data));
                    }else{
                        $.messager.alert('提示',result.message);
                    }
                }
            });
            $.messager.progress("close");
        }
    });
}
/**
 * 提交作废原因
 */
function cancleRegisterForm(id){
    $.messager.progress({
        title:"提示",
        text:"数据处理中，请稍后...."
    });
    var param = {
        "id":$("#id").val(),
        "status":$("#formstatus").val(),
        "cancelReason":$("#cancelReason").val()
    };
    console.log(param);
    var isValid = $("#cancelReason").validatebox("isValid");
    console.log(isValid);
    if (!isValid){
        $("#cancelReason").focus();
        $.messager.progress("close");
        return isValid;
    }
    $.post(cp+"/service/dj/registerForm/cancleRegisterForm", param, function (result) {
        $.messager.progress("close");
        if(result.success) {
            noty({text:result.message,timeout:3000});
            $("#cancleDialog").dialog('close');
            var status = result.data.status;
            result.data.statusText = formTypeMap[status];
            $("#"+id).replaceWith(template("registerForm",result.data));
        }else {
            $.messager.alert("错误",result.message,"error");
        }

    },"json");
}

function cancleSuggestion(id){
    window.location.href = cp+"/service/dj/registerForm/returnCancleSuggestion?id="+id+"&code="+code+"&title="+title+"&from="+from;
}

function mobile_touch() {
    $(".delete").on("swipeleft",function(){
        $(this).find(".launchplan_cont_box").animate({width:"100%"},100)
    });
    $(".delete").on("swiperight",function(){
        $(this).find(".launchplan_cont_box").css({width:"calc(100% + 60px)"})
    });
}

/**
 * 定位dialog的位置
 * @param divName  id的名字
 */
function letDivCenter(divName){
    console.log(divName);
    var top = ($(window).height() - $(divName).height())/2;
    var left = ($(window).width() - $(divName).width())/2;
    var scrollTop = $(document).scrollTop();
    var scrollLeft = $(document).scrollLeft();
    $("#cancleDialog").css( { position : 'absolute', 'top' : top + scrollTop, left : left + scrollLeft } ).show();
}

function juzhong(){
    var num = $(".launchplan").length;
    for(var i=0; i<num; i++){
        var shheight = $('.launchplan-left:eq('+ i +') div').height()+15;
        $('.launchplan-right:eq('+ i +') div').css('height', shheight);
    }

}

function fanhui(){
    window.location.href = cp+"/service/dj/registerForm/returnRegisterFormTypes?classify="+classify+"&code="+code+"&title="+title+"&from="+from;
}
