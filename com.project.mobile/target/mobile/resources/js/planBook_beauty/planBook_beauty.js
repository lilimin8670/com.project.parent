/**
 * Created by Administrator on 2016/7/14.
 */
var wh=$(window).height();
$(function(){
    findPlanBookById();
});

/**
 * 新增售后计划
 * @author abner
 */
function addTrackRecord(id, registerId) {
    $.ajax({
        url: CP + "/service/sysTrace/addTrackRecord",
        data: {
            "id": id,
            "registerId": registerId
        },
        type: "post",
        async: false,
        dataType: "json",
        success: function (result) {
            if (result.success) {
                window.reback();
            }
        }
    });
}

/**回到首页面
 * @Author xuanYin
 * @Param
 * @Date 2016/7/13 13:52
 */
function closeDiv(divId){
    $("header").css('display','block');
    $(".aside-menu").css('display','block');
    $("#"+divId).css('display','none');
}

/**
 * 打开iframe
 * @param divId
 */
function openIframe(singleId,url){
    //给iframe页面赋值url，打开iframe嵌套div
    $("#"+singleId+"Iframe").attr('src', url);
    $("#"+singleId+"Div").css('display','block');
    $("body").css('height',wh);
    $("#"+singleId+"Iframe").load(function(){
        //iframe加载完全后设置iframe高度为窗口高度
        $(this).height(wh);
        //隐藏父页面的header以及主div
        $("header").css('display','none');
        $(".aside-menu").css('display','none');
        //根据btnType的值(0：是1：否)
        //如果是允许操作的状态则显示保存按钮否则不显示保存按钮
        if(btnType){
            if(btnType==1){
                $("#"+singleId+"Iframe").contents().find(".feedback_rr").children("a").css('display','none');
            }else{
                if(kefuPost=="11"){
                    $("#"+singleId+"Iframe").contents().find(".feedback_rr").children("a").css('display','none');
                }else{
                    $("#"+singleId+"Iframe").contents().find(".feedback_rr").children("a").css('display','block');
                }
            }
        }
    });
}
/**
 * 根据IframeName获得父窗口
 * @param iframeName
 * @returns {Boolean}
 */
function getCompatibleIframe(iframeName){
    return document.getElementById(iframeName).contentWindow||parent.frames[iframeName];
}
/**
 * 根据id查询计划书对象
 * @Author xuanYin
 * @Param
 * @Date 2016/7/18 17:17
 */
function findPlanBookById(){
    var id=$("#planBookId").val();
    if(id){
        var url = CP+"/service/planBook/findPlanBookById";
        var param = {"id":id};
        $.post(url, param, function (result) {
            if(result.success) {
                $("#memberIdHidParent").val(result.data.memberId);
                $("#processIdHid").val(result.data.processId);
                $("#planBookParent").val(result.data.content);
                var planBookData=$("#planBookParent").val();
                console.log("planBookData:"+planBookData);
                var planBookDataJson=JSON.parse(planBookData);
                $("#memberLoginnameHParent").val(planBookDataJson.memLogNameH);
                //给子页面赋值
                setSonValue('jbzl',planBookData);
                setSonValue('mlwj',planBookData);
                setSonValue('zxqzp',planBookData);
                setSonValue('lxfx',planBookData);
                setSonValue('fxfx',planBookData);
                setSonValue('zrfx',planBookData);
                setSonValue('scfx',planBookData);
                setSonValue('dpfs',planBookData);
                setSonValue('fz',planBookData);
                setSonValue('wglk',planBookData);
                setSonValue('sc',planBookData);
                setSonValue('zxhzp',planBookData);
                setSonValue('xcwsmydr',planBookData);
                //设置提交按钮显示
                if(result.data.status==2){
                    $("#submitBtn").show();
                }else{
                    $("#submitBtn").hide();
                }
            }else {
                window.parent.layer.alert(result.message,{closeBtn: 0});
            }
        },"json");
    }
}
/**
 * 保存计划书
 */
function savePlanBook_beauty(url,formId){
    $("header").css('display','block');
    $(".aside-menu").css('display','block');
    var memberIdHidParent=$("#memberIdHidParent").val();
    var memberLoginnameHParent=$("#memberLoginnameHParent").val();
    var contentJson;
    //校验表单
    $.messager.progress({
        title:"提示",
        text:"数据处理中，请稍后...."
    });
    if(!memberIdHidParent){
        $.messager.progress("close");
        layer.alert("用户不能为空!",{closeBtn: 0});
        return false;
    }
    var jbzlFormParent=JSON.parse($("#jbzlFormParent").val()||"{}");
    //console.log("基本资料："+jbzlFormParent.height);
    var mlwjFormParent=JSON.parse($("#mlwjFormParent").val()||"{}");
    var zxqzpFormParent=JSON.parse($("#zxqzpFormParent").val()||"{}");
    var lxfxFormParent=JSON.parse($("#lxfxFormParent").val()||"{}");
    var fxfxFormParent=JSON.parse($("#fxfxFormParent").val()||"{}");
    var zrfxFormParent=JSON.parse($("#zrfxFormParent").val()||"{}");
    var scfxFormParent=JSON.parse($("#scfxFormParent").val()||"{}");
    var dpfsFormParent=JSON.parse($("#dpfsFormParent").val()||"{}");
    var fzFormParent=JSON.parse($("#fzFormParent").val()||"{}");
    var wglkFormParent=JSON.parse($("#wglkFormParent").val()||"{}");
    var scFormParent=JSON.parse($("#scFormParent").val()||"{}");
    var zxhzpFormParent=JSON.parse($("#zxhzpFormParent").val()||"{}");
    var xcwsmydrFormParent=JSON.parse($("#xcwsmydrFormParent").val()||"{}");
    //添加已阅未阅属性
    var fxfxYueFouParent=JSON.parse($("#fxfxYueFouParent").val()||"{}");
    //父页面隐藏域
    var planBookParent=JSON.parse($("#planBookParent").val()||"{}");
    var id=$("#planBookId").val();
    if(id){
        var formJson=JSON.parse($("#"+formId+"FormParent").val()||"{}");
        contentJson= $.extend(planBookParent,formJson,fxfxYueFouParent);
    }else{
        contentJson=$.extend(jbzlFormParent,mlwjFormParent,zxqzpFormParent,lxfxFormParent,fxfxFormParent,
            zrfxFormParent,scfxFormParent,dpfsFormParent,fzFormParent,wglkFormParent,
            scFormParent,zxhzpFormParent,xcwsmydrFormParent,fxfxYueFouParent);
    }
    $("#previewImage0H_P").val(contentJson.previewImage0H);
    $("#previewImage1H_P").val(contentJson.previewImage1H);
    $("#previewImage2H_P").val(contentJson.previewImage2H);
    $("#previewImage3H_P").val(contentJson.previewImage3H);
    /*if(optType==1){
        if(!isUploadPrePic()){
            $.messager.progress("close");
            layer.alert("请上传蜕变前照片!",{closeBtn: 0});
            return false;
        }
    }*/
    var dataContent=JSON.stringify(contentJson||"{}");
    var param = {
        "id":$("#planBookId").val(),
        "type":$("#planBookType").val(),
        "content":dataContent,
        "memberId":$("#memberIdHidParent").val(),
        "processId":$("#processIdHid").val(),
        "memberLoginname":$("#memberLoginnameHParent").val()
    };
    console.log("param:"+dataContent);
    var url = CP+url;
     $.post(url, param, function (result) {
         if(result.success) {
             layer.alert(result.message,{closeBtn: 0},function(index){
                 //赋值id
                 $("#planBookId").val(result.data.id);
                 findPlanBookById();
                 //给审核页面赋值
                 $("#planBookContent").val(dataContent);
                 $("#"+formId+"Div").css('display','none');
                 if(url.indexOf("submitPlanBook")>=0){
                     window.location.href=CP+"/service/kfPlanBook/index?type=1";
                 }
                 //window.parent.$("#sonHeader").css('display','block');
                 //window.parent.$("#planBookDiv").css('padding-top','60px');
                 layer.close(index);
             });
         }else {
            layer.alert(result.message,{closeBtn: 0});
         }
            $.messager.progress("close");
     },"json");
}

/**
 * 给子页面赋值
 * @param frameId
 */
function setSonValue(sonId,planBookData){
    $("#"+sonId+"FormParent").val(planBookData);
}

/**
 * 点击返回按钮
 * @Author xuanYin
 * @Param
 * @Date 2016/7/22 14:28
 */
var orgIndex = window.history.length;
function reback(){
    var goIndex = orgIndex - window.history.length-1;
    window.history.go(goIndex); //如果iframe的url变了1次，那么goIndex就是-2，类推
}

/**
 * 判断是否上传了美丽蜕变前照片
 */
function isUploadPrePic(){
    for(var i=0;i<3;i++){
        if(!$("#previewImage"+i+"H_P").val()){
            return false;
        }
    }
    return true;
}

/**
 * 安卓返回按钮回调函数
 */
function onKeyBackPressed(){
    reback();
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid){
        window.location.reload();
    }
}
