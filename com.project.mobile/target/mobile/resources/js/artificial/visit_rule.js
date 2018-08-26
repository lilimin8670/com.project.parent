
//第五次回访
$("input[name='_4S2']").change(function(){
    var ele = $(this);
    var value = ele.val();
    if(value==2){
        $('input:radio[name="_4S3"]')
        $('input:radio[name="_4S3"]').removeAttr('checked').attr("disabled","disabled");
        $('#_4S3_DIV').hide();
    }else{
        $('input:radio[name="_4S3"]').removeAttr("disabled")
        $('#_4S3_DIV').show();
    }
});

//第七次回访
$("input[name='_2S6S1']").change(function(){
    var ele = $(this);
    var value = ele.val();
    if(value==2){
        $('input[name="_2S6S2"]').val("");
        $('input[name="_2S6S3"]').val("");
        $('input[name="_2S6S4"]').val("");
        $('input[name="_2S6S5"]').val("");
        $('input[name="_2S6S6"]').val("");
        $('#_2S6S1_SON_DIV').hide();
    }else{
        $('#_2S6S1_SON_DIV').show();
    }
});
$("input[name='_2S6S7']").change(function(){
    var ele = $(this);
    var value = ele.val();
    if(value!=3){
        $('input[name="_2S6S8"]').val("");
        $('#_2S6S8_DIV').hide();
    }else{
        $('#_2S6S8_DIV').show();
    }
});
function checkValue(obj) {
    var val = $(obj).attr("name");
    var value = $.trim($(obj).val());
    var prefix = val.substring(0,val.length-1);
    var suffix = Number(val.substring(val.length-1,val.length))+1;
    val = prefix+suffix;
    if(value==null ||value==""){
        $('input:radio[name="'+val+'"]').removeAttr('checked').attr("disabled","disabled");
    }else{
        $('input:radio[name="'+val+'"]').removeAttr("disabled")
    }

}
function  isHave(obj) {
    var val = $(obj).attr("name");
    var value = $(obj).val();
    var prefix = val.substring(0,val.length-1);
    var suffix = Number(val.substring(val.length-1,val.length))+1;
    val = prefix+suffix;
    var hideDiv = "#"+val+"_DIV";
    if(value==2){
        $('input:radio[name="'+val+'"]').removeAttr('checked').attr("disabled","disabled");
        $(hideDiv).hide();
    }else{
        $('input:radio[name="'+val+'"]').removeAttr("disabled")
        $(hideDiv).show();
    }
}




