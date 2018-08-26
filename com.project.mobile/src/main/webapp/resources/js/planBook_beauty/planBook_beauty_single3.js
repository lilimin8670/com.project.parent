$(function(){
    initData(viewId);
    hidUpload("moren_img1");
    hidUpload("moren_img2");
    hidUpload("moren_img3");
    hidUpload("moren_img4");
    hidUpload("moren_img5");
    hidUpload("moren_img6");
    hidUpload("moren_img7");
    hidUpload("moren_img8");
});
/**
 * 上传
 */
function IDCard1(fileId,imgId){
    //上传图片
    $.ajaxFileUpload({
        url:CP+"/service/fileStorage/upload?allowSize=1",//处理图片脚本
        secureuri :false,
        fileElementId :fileId,//file控件id
        dataType : 'JSON',
        success : function (data,status){
            var dataJson =eval('('+delJson(data)+')');
            if(dataJson.success){
                deleteImg(imgId);
                var url=dataJson.fileId;
                $("#"+imgId).attr("src",url);
                $("#"+imgId+"H").val(url);
                $("#"+imgId+"A").css("display","block");
            }else{
                layer.alert(dataJson.message,{closeBtn: 0});
            }
        },
        error: function(data, status, e){
            $.messager.alert("错误",data.message,"error");
        }
    });
}

/**
 * 删除图片
 */
function deleteImg(imgId){
    if(imgId.length > 40){
        $.ajax({
            cache: true,
            type: "POST",
            url:CP+'/service/fileStorage/delete',
            dataType:'json',
            data:{"fileId":imgId},
            async: false,
            success: function(data) {
            },
            error:function(data){
                $.messager.alert("错误",data.message,"error");
            }

        });
    }
}
/**
 * 隐藏上传按钮
 * @Author xuanYin
 * @Param
 * @Date 2016/6/15 18:57
 */
function hidUpload(imgId){
    $('#'+imgId).hover(function(e) {
        $(this).children('.form').fadeIn('1000')

    },function(e) {
        $('.form').css('display','none')
    });
}

/**
 * 处理上传返回数据
 * @Author xuanYin
 * @Param
 * @Date 2016/6/15 19:48
 */
function delJson(str){
    var data = str;
    var start = data.indexOf(">");
    if(start != -1) {
        var end = data.indexOf("<", start + 1);
        if(end != -1) {
            data = data.substring(start + 1, end);
        }
    }
    return data;
}

/**
 *保存计划书-------造型前照片
 */
function saveBeforemodeling(formId,optType){
    var dataJson=$("#"+formId+"Form").form2json();
    delete dataJson.file;
    console.log("=============="+dataJson);
    var dataContent=JSON.stringify(dataJson);
    //允许审核的时候暂存
    /*if(optType){
        if(!isUploadPrePic()){
            window.parent.layer.alert("请上传造型前照片",{closeBtn: 0});
            return false;
        }
    }*/
    console.log(dataContent);
    $(window.parent.document).find("#"+formId+"FormParent").val(dataContent);
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
}
/**
 *保存计划书-------造型后照片
 */
function savePromote(formId){
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    delete dataJson.file;
    console.log("=============="+dataJson);
    var dataContent=JSON.stringify(dataJson);
    console.log(dataContent);
    $(window.parent.document).find("#"+formId+"FormParent").val(dataContent);
    window.parent.$("#"+formId+"Div").css('display','none');
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
}


/**
 * 根据页面Ifrrame的id对页面赋值
 * @param viewId
 */
function initData(viewId){
    var viewIdFormParent=window.parent.$("#"+viewId+"FormParent").val();
    if(viewIdFormParent) {
        var viewIdFormParentJson =JSON.parse(viewIdFormParent||"{}");
        console.log(viewIdFormParentJson);
        $("#"+viewId+"Form").form("load",viewIdFormParentJson);
        //赋值照片数据
        if(viewId=="zxqzp"){
            for(var i=0;i<4;i++){
                console.log("变身前照片"+$("input[name=previewImage"+i+"H]").val());
                if($("input[name=previewImage"+i+"H]").val()!=''){
                    $("#previewImage"+i).attr("src",$("input[name=previewImage"+i+"H]").val());
                }
            }
        }else if(viewId=="zxhzp"){
            for(var i=0;i<4;i++) {
                console.log("变身后照片" + $("input[name=modelafter" + i + "H]").val());
                if ($("input[name=modelafter" + i + "H]").val() != '') {
                    $("#modelafter" + i).attr("src", $("input[name=modelafter" + i + "H]").val());
                }
            }
        }
    }
}


/**
 * 判断是否上传了美丽蜕变前照片
 */
function isUploadPrePic(){
    for(var i=0;i<3;i++){
        if(!$("#previewImage"+i+"H").val()){
            return false;
        }else{
            window.parent.$("#previewImage"+i+"H_P").val($("#previewImage"+i+"H").val());
        }
    }
    return true;
}