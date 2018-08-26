
$(function(){
    //点击查看大图更多
    $(".attachmentAdd").on("touchend",".h_moreright",function(e){
        $(this).find("ul").show();
        e.stopPropagation();
    });

    $("body").on("touchend",".imgZoomPack",function(){
        $('.more_ul').hide();
    });

	//附件图片及说明一起删除
    $(".attachmentAdd").on("click",".attach_del",function(){
        var imgUrl = $(this).prev().find("input:hidden").val();
        if (imgUrl){
            deleteImg(imgUrl);
        }
        $(this).parents("li").remove();
        assignment()
    });

    //点击关闭显示主页面的头部
    $(".attachmentAdd").on("click",".return_btn",function(){
        $(this).parents(".imgZoomPack").find(".imgzoom_img").find("img").attr("src","");
        $(this).parents(".imgZoomPack").hide();
        $(".question_nav").show();
        $(".pubPosContent").css({"top":"62px"});
    });

    //上传图片或者放大图片
    $(".attachmentAdd").on("click",".moren_imged",function(){

        var $this=$(this);
        var $imgUrl = $this.children(".upload_files_img").find("img").attr('src');
        if($imgUrl.indexOf("pc_upload.png")>0){
            //上传图片
            $(this).find(".beforePic").show();
        }else{
            //放大图片
            $(".imgZoomPack").find(".imgzoom_img").find("img").attr("src",$imgUrl);
            var liIndex = $this.parents("li").index();
            $(".imgZoomPack").find("#liIndex").val(liIndex);
            $(".question_nav").hide();
            $(".pubPosContent").css({"top":"0"});
        }
    }).on("click",".btn_delete",function(){
    	//删除图片
        var $this=$(this);
        $(this).parents('.more_ul').hide();
        var $bigImg=$(this).parents(".imgZoomPack");
        var imgUrl = $bigImg.find(".imgzoom_img").find("img").attr("src");
        deleteImg(imgUrl);
        $bigImg.find(".imgzoom_img").find("img").attr("src","");
        var liIndex = $bigImg.find("#liIndex").val();
        $bigImg.hide();
        $(".question_nav").show();
        $(".pubPosContent").css({"top":"62px"});
        $(".attachmentAdd").find("li:eq("+liIndex+")").find("img").attr("src",cp+"/resources/img/pc_upload.png");
        $(".attachmentAdd").find("li:eq("+liIndex+")").find("input[type='hidden']").val("");
        $(".attachmentAdd").find("li:eq("+liIndex+")").find(".beforePic").show();
    }).on("click",".btn_download",function () {
        $(this).parents('.more_ul').hide();
        var imgUrl = $(this).parents(".imgZoomPack").find(".imgzoom_img").children("img").attr("src");
        downloadPic(imgUrl);
        $(this).parents(".imgZoomPack").find(".imgzoom_img").find("img").attr("src","");
        $(this).parents(".imgZoomPack").hide();
        $(".question_nav").show();
        $(".pubPosContent").css({"top":"62px"});
    });
});
//附近增加
function attachment_add(){
    var html = template("AttachAdd");
    $("#lookPicture").prepend(html);
    assignment();
    loading();
}
//排序
function assignment(){
    $(".attachmentAdd ul li").each(function(){
        var num = $(this).index();

        $(this).find(".file").attr({"id":"attachmentAdd"+num,"onChange":"IDCard1('attachmentAdd"+num+"','attachmentImage"+num+"')"});
        $(this).find("textarea").attr("id","attachmentExplain"+num);
        $(this).find("input:hidden").attr({"id":"attachmentImage"+num+"H"});
        $(this).find(".moren_imged").find("img").attr("id","attachmentImage"+num);
    })
}
//放大图片
function loading(){
    ImagesZoom.init({
        "elem": ".BigListItem"
    });
}

/**
 * 下载图片
 * @param imgUrl
 */
function downloadPic(imgUrl) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid){
        window.mobile.downloadImage(imgUrl);
        /*var myFrame= document.createElement("iframe");
        myFrame.src = cp+'/service/fileStorage/download?imgUrl='+imgUrl;
        myFrame.style.display = "none";
        document.body.appendChild(myFrame);
        var message = "";
        if(userType=='1'){
           message = "文件管理的手机(sd卡)目录下的com.unionx.yilingboshi.kefu文件夹中"
        }else {
            message = "文件管理的手机(sd卡)目录下的com.unionx.yilingboshi.store文件夹中"
        }
        $.messager.alert('提示','下载成功，请到'+message+'查看','info');*/
    }
    if (isiOS){
        window.downloadImage(imgUrl);
    }


}
