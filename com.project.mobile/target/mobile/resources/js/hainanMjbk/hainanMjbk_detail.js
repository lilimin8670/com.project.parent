/**
 * Created by xuanYin on 2016/12/20.
 */


$( function(){
    //getHainanMjbkById();
});

/**
 * 查询报告详情
 */
var hainanMjbkData;
function getHainanMjbkById(){
    var url=CP+"/service/hainanMjbk/getHainanMjbkById";
    $.post(url, {"mjbkId":id}, function (result) {
        if(result.success) {
            console.log(result.data.mjbkContent);
            hainanMjbkData=result.data;
        }else {
            layer.alert(result.message,{closeBtn: 0});
        }
    },"json");
}

/**
 * 基本信息
 */
function basicData(){
    $("#memName").val(hainanMjbkData.memName);
    $("#storeName").val(hainanMjbkData.storeName);
    if(hainanMjbkData.planBookType==1){
        $("#planBookType").val("美丽计划书");
    }else if(hainanMjbkData.planBookType==2){
        $("#planBookType").val("健康计划书");
    }
    $("#planBookId").val(hainanMjbkData.planBookId);
}

/**
 * 检测结果
 */
function detection(){
    var mjbkContent=hainanMjbkData.mjbkContent;
    var mjbkContentJson=JSON.parse(mjbkContent);
    $("#id").val(hainanMjbkData.id);
    $("#OperName").val(hainanMjbkData.operName);
    $("#OperTime").val(dateFormat(new Date(hainanMjbkData.operTime),'yyyy-MM-dd HH:mm:ss'));
    $("#Color").html(mjbkContentJson.Color);
    $("#ColorRepore").html(mjbkContentJson.ColorRepore);
    $("#Style").html(mjbkContentJson.Style);
    $("#StyleRepore").html(mjbkContentJson.StyleRepore);
    $("#Face").html(mjbkContentJson.Face);
    $("#FaceRepore").html(mjbkContentJson.FaceRepore);
    $("#Stature").html(mjbkContentJson.Stature);
    $("#StatureRepore").html(mjbkContentJson.StatureRepore);
    if(mjbkContentJson.ColorPhoto){
        $("#ColorPhoto").attr('src',mjbkContentJson.ColorPhoto);
    }
    if(mjbkContentJson.StylePhoto){
        $("#StylePhoto").attr('src',mjbkContentJson.StylePhoto);
    }
    if(mjbkContentJson.FacePhoto){
        $("#FacePhoto").attr('src',mjbkContentJson.FacePhoto);
    }
    if(mjbkContentJson.StaturePhoto){
        $("#StaturePhoto").attr('src',mjbkContentJson.StaturePhoto);
    }
    if(mjbkContentJson.FaceImage){
        $("#FaceImage").attr('src',mjbkContentJson.FaceImage);
    }
    if(mjbkContentJson.YesImage1){
        $("#YesImage1").attr('src',mjbkContentJson.YesImage1);
    }
    if(mjbkContentJson.YesImage2){
        $("#YesImage2").attr('src',mjbkContentJson.YesImage2);
    }
    if(mjbkContentJson.YesImage3){
        $("#YesImage3").attr('src',mjbkContentJson.YesImage3);
    }
    if(mjbkContentJson.NoImage1){
        $("#NoImage1").attr('src',mjbkContentJson.NoImage1);
    }
    if(mjbkContentJson.NoImage2){
        $("#NoImage2").attr('src',mjbkContentJson.NoImage2);
    }
    if(mjbkContentJson.BlusherImage){
        $("#BlusherImage").attr('src',mjbkContentJson.BlusherImage);
    }
    if(mjbkContentJson.EyebrowImage1){
        $("#EyebrowImage1").attr('src',mjbkContentJson.EyebrowImage1);
    }
    if(mjbkContentJson.EyebrowImage2){
        $("#EyebrowImage2").attr('src',mjbkContentJson.EyebrowImage2);
    }
    //批量处理
    getPicList(mjbkContentJson.BagImagesImages,'BagImagesImages');
    getPicList(mjbkContentJson.PantsImages,'PantsImages');
    getPicList(mjbkContentJson.CollarImages,'CollarImages');
    getPicList(mjbkContentJson.ShoeImages,'ShoeImages');
    if(hainanMjbkData.memberSex=="男"){
        getPicList(mjbkContentJson.ManCoatImages,'ManCoatImages');
        getPicList(mjbkContentJson.ManJacketImages,'ManJacketImages');
        getPicList(mjbkContentJson.ManTieImages,'ManTieImages');
        getPicList(mjbkContentJson.ManShirtImages,'ManShirtImages');
        getPicList(mjbkContentJson.ManFormalImages,'ManFormalImages');
    }else if(hainanMjbkData.memberSex=="女"){
        getPicList(mjbkContentJson.LadyShoulderImages,'LadyShoulderImages');
        getPicList(mjbkContentJson.LadyDressImages,'LadyDressImages');
        getPicList(mjbkContentJson.LadyDressesImages,'LadyDressesImages');
        getPicList(mjbkContentJson.LadySetImages,'LadySetImages');
    }
}

/**
 * 批量图片处理
 */
function getPicList(picList,picListName){
    var data={
        "picList":picList
    };
    var html=template('picListNameTmp',data);
    $("#"+picListName).append(html);
}