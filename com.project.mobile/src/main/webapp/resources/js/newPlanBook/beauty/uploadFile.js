/**
 * 上传
 */
function IDCard1(fileId,imgId){
    if (image_check(fileId)) {
        //上传图片
        $.ajaxFileUpload({
            url: CP + "/service/fileStorage/upload?allowSize=1",//处理图片脚本
            //async: false,
            type: "POST",
            secureuri: false,
            fileElementId: fileId,//file控件id
            dataType: 'JSON',
            success: function (data) {
                var dataJson = eval('(' + delJson(data) + ')');
                if (dataJson.success) {
                    deleteImg(fileId, imgId, true);
                    var url = dataJson.fileId;
                    $("#" + imgId).attr("src", url);
                    $("#" + imgId + "H").val(url);
                    $("#" + imgId).parent("div").css("display", "block");
                    $("#" + fileId).parents(".default").css("display", "none");
                } else {
                    $.messager.alert("错误", dataJson.message, "error");
                }
            },
            error: function (data, status, e) {
                $.messager.alert("错误", data.message, "error");
            }
        });
    }
}

/**
 * 验证图片上传格式是否正确
 * @param feid
 * @returns {boolean}
 */
function image_check(feid) { //自己添加的文件后缀名的验证
    var img = document.getElementById(feid);
    return /.(BMP|JPG|JPEG|PNG|JEPG)$/.test(img.value.toUpperCase())?true:(function() {
        $.messager.alert("提示","上传的文件格式不对,请上传BMP,JPG,JPEG,PNG,JEPG这几种格式的文件");
        return false;
    })();
}


/**
 * 删除图片
 */
function deleteImg(fileId,imgId,isUpload){
    var oldImgUrl = $("#"+imgId).attr("src");
    console.log(oldImgUrl);
    if(oldImgUrl.indexOf("group1")>-1){
        $.ajax({
            cache: true,
            type: "POST",
            url:CP+'/service/fileStorage/delete',
            dataType:'json',
            data:{"fileId":oldImgUrl},
            async: false,
            success: function(data) {
                console.log(data.success);
                $("#"+imgId).attr("src","");
                $("#"+imgId+"H").val("");
                if (!isUpload){
                    $("#"+imgId).parent("div").css("display","none");
                    $("#"+fileId).parents(".default").css("display","block");
                }

            },
            error:function(data){
                $.messager.alert("错误",data.message,"error");
            }

        });
    }
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