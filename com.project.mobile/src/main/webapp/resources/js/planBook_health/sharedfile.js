/**
 * Created by yangxiao on 2016/7/21.
 */
$(function(){
    $("input[type='radio']").each(function(){
        if($(this).prop("checked")){
            $(this).addClass("test1").removeClass("test");
        }else if(!$(this).prop("checked")){
            $(this).addClass("test").removeClass("test1");
        }
    });
    $(":radio").click(function() {
        var class_ = $(this).attr("class");
        var radName = $(this).attr('name');
        if (class_ == "test1") {
            $(this).attr("checked", false);
            $(this).addClass("test").removeClass("test1");
        } else {
            $(this).attr("class", "test1");
            $("input:radio[name="+ radName +"]").each(function (index,domEle) {
                if(!$(domEle).prop("checked")){
                    $(domEle).addClass("test").removeClass("test1");
                }
            });
        }
    });
    //吸烟
    $(".smokrdio:eq(0) input:radio").click(function(){
        if($('.smokrdio:eq(0) input:radio[name="whethersmoking"]').prop("checked")){
            //禁用平均每天吸烟多少支，吸烟多少年
            $('#branch').numberbox('disable',true);
            $("#branch").numberbox('setValue','');
            $('#year1').numberbox('disable',true);
            $("#year1").numberbox('setValue','');
            //设置戒烟年份禁用
            $('#year2').numberbox('disable',true);
            $("#year2").numberbox('setValue','');
            //设置戒烟月数禁用
            $('#month1').numberbox('disable',true);
            $("#month1").numberbox('setValue','');
            //设置戒烟前吸烟数禁用
            $('#branch1').numberbox('disable',true);
            $("#branch1").numberbox('setValue','');
        }
    });
    $(".smokrdio:eq(1) input:radio").click(function(){
        if($('.smokrdio:eq(1) input:radio[name="whethersmoking"]').prop("checked")){
            //平均每天吸烟多少支，吸烟多少年
            $('#branch').numberbox('enable',true);
            $('#year1').numberbox('enable',true);
            //设置戒烟年份禁用
            $('#year2').numberbox('disable',true);
            $("#year2").numberbox('setValue','');
            //设置戒烟月数禁用
            $('#month1').numberbox('disable',true);
            $("#month1").numberbox('setValue','');
            //设置戒烟前吸烟数禁用
            $('#branch1').numberbox('disable',true);
            $("#branch1").numberbox('setValue','');
        }else{
            //禁用平均每天吸烟多少支，吸烟多少年
            $('#branch').numberbox('disable',true);
            $("#branch").numberbox('setValue','');
            $('#year1').numberbox('disable',true);
            $("#year1").numberbox('setValue','');
        }
    });
    $(".smokrdio:eq(2) input:radio").click(function(){
        if($('.smokrdio:eq(2) input:radio[name="whethersmoking"]').prop("checked")){
            //平均每天吸烟多少支，吸烟多少年
            $('#branch').numberbox('enable',true);
            $('#year1').numberbox('enable',true);
            //设置戒烟年份禁用
            $('#year2').numberbox('disable',true);
            $("#year2").numberbox('setValue','');
            //设置戒烟月数禁用
            $('#month1').numberbox('disable',true);
            $("#month1").numberbox('setValue','');
            //设置戒烟前吸烟数禁用
            $('#branch1').numberbox('disable',true);
            $("#branch1").numberbox('setValue','');
        }else{
            //禁用平均每天吸烟多少支，吸烟多少年
            $('#branch').numberbox('disable',true);
            $("#branch").numberbox('setValue','');
            $('#year1').numberbox('disable',true);
            $("#year1").numberbox('setValue','');
        }
    });
    $(".smokrdio:eq(3) input:radio").click(function(){
        //如果当前按钮是选中状态则对应填空解开
        if($('.smokrdio:eq(3) input:radio[name="whethersmoking"]').prop("checked")){
            //设置戒烟戒了多少年，几个月，戒烟前每天吸烟数量允许填写
            $('#year2').numberbox('enable',true);
            $('#month1').numberbox('enable',true);
            $('#branch1').numberbox('enable',true);
            //禁用平均每天吸烟多少支，吸烟多少年
            $('#branch').numberbox('disable',true);
            $("#branch").numberbox('setValue','');
            $('#year1').numberbox('disable',true);
            $("#year1").numberbox('setValue','');
        }else{
            //设置戒烟年份禁用
            $('#year2').numberbox('disable',true);
            $("#year2").numberbox('setValue','');
            //设置戒烟月数禁用
            $('#month1').numberbox('disable',true);
            $("#month1").numberbox('setValue','');
            //设置戒烟前吸烟数禁用
            $('#branch1').numberbox('disable',true);
            $("#branch1").numberbox('setValue','');
        }
    });
    //饮酒
    $(".drinkwine:eq(0) input:radio").click(function(){
        if($('.drinkwine:eq(0) input:radio[name="neverdrink"]').prop("checked")){
            $('#drinkingyear').numberbox('disable',true);
            $("#drinkingyear").numberbox('setValue','');
            $('#drinkingmonth').numberbox('disable',true);
            $("#drinkingmonth").numberbox('setValue','');
            $('#second').numberbox('disable',true);
            $("#second").numberbox('setValue','');
            $('#bottle').numberbox('disable',true);
            $("#bottle").numberbox('setValue','');
            $('#else').attr('disabled',true);
            $("#else").val("");
            //禁用checkBox
            $(".liquor").attr('disabled',true);
        }
    });
    $(".drinkwine:eq(1) input:radio").click(function(){
        if($('.drinkwine:eq(1) input:radio[name="neverdrink"]:checked').prop("checked")){
            $('#drinkingyear').numberbox('enable',true);
            $('#drinkingmonth').numberbox('enable',true);
            $('#second').numberbox('disable',true);
            $("#second").numberbox('setValue','');
            $('#bottle').numberbox('disable',true);
            $("#bottle").numberbox('setValue','');
            $('#else').attr('disabled',true);
            $("#else").val("");
            //禁用checkBox
            $(".liquor").attr('disabled',true);
        }else{
            $('#drinkingyear').numberbox('disable',true);
            $("#drinkingyear").numberbox('setValue','');
            $('#drinkingmonth').numberbox('disable',true);
            $("#drinkingmonth").numberbox('setValue','');
        }
    });
    $(".drinkwine:eq(2) input:radio").click(function(){
        if($('.drinkwine:eq(2) input:radio[name="neverdrink"]:checked').prop("checked")){
            $('#drinkingyear').numberbox('disable',true);
            $("#drinkingyear").numberbox('setValue','');
            $('#drinkingmonth').numberbox('disable',true);
            $("#drinkingmonth").numberbox('setValue','');
            $('#second').numberbox('enable',true);
            $('#bottle').numberbox('enable',true);
            $('#else').attr('disabled',false);
            $(".liquor").attr('disabled',false);
        }else{
            $('#second').numberbox('disable',true);
            $("#second").numberbox('setValue','');
            $('#bottle').numberbox('disable',true);
            $("#bottle").numberbox('setValue','');
            $('#else').attr('disabled',true);
            $("#else").val("");
            //禁用checkBox
            $(".liquor").attr('disabled',true);
        }
    });
    //运动习惯
    $(".unmotion input:radio").click(function(){
        if($('.unmotion:eq(0) input:radio[name="exercisehabit"]:checked').prop("checked")||
            $('.unmotion:eq(1) input:radio[name="exercisehabit"]:checked').prop("checked")){
            $('#exercisesecond').numberbox('disable',true);
            $("#exercisesecond").numberbox('setValue','');
            $('#exercisetime').attr('disabled',true);
            $('#exercisetime').val("");
            $('#exercisetype').attr('disabled',true);
            $('#exercisetype').val("");
        }
    });
    $(".motion input:radio").click(function(){
        if($('.motion:eq(0) input:radio[name="exercisehabit"]:checked').prop("checked")||
            $('.motion:eq(1) input:radio[name="exercisehabit"]:checked').prop("checked")||
            $('.motion:eq(2) input:radio[name="exercisehabit"]:checked').prop("checked")){
            $('#exercisesecond').numberbox('enable',true);
            $('#exercisetime').attr('disabled',false);
            $('#exercisetype').attr('disabled',false);
        }else{
            $('#exercisesecond').numberbox('disable',true);
            $("#exercisesecond").numberbox('setValue','');
            $('#exercisetime').attr('disabled',true);
            $('#exercisetime').val("");
            $('#exercisetype').attr('disabled',true);
            $('#exercisetype').val("");
        }
    });
    //coffee习惯
    $(".uncoffee input:radio").click(function(){
        if($(this).prop("checked")){
            $(".coffees input").attr("checked",false);
            $(".coffees input").attr('disabled',true);
        }
    });
    $(".coffee input:radio").click(function(){
        if($(this).prop('checked')){
            $(".coffees input").attr('disabled',false);
        }else{
            $(".coffees input").attr("checked", false);
            $(".coffees input").attr('disabled',true);
        }
    });
    getData();
});

/**
 * 给页面赋值
 */
function getData(){
    var formId = $("#formId").val();
    if(formId=="livinghabits"){
        setRadioDisabled();
    }
    var data = window.parent.$("#"+formId+"FormParent").val();
    if(data){
        $("#"+formId+"Form").form('load',JSON.parse(data));
        if(formId=="livinghabits"){
            setRadio(JSON.parse(data));
        }
    }
}

/**
 * 保存
 * @Author yangxiao
 * @Param
 * @Date 2016/7/20 15:49
 */
function saveBaseData(formId,url){
    //alert("保存"+formId);
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    var dataContent=JSON.stringify(dataJson);
    var isValid = $("#"+formId+"Form").form("validate");
    if(formId=="commissionerdetail"||formId=="functionalrisk"||formId=="generisk"){
        if(!isValid){
            return isValid;
        }
    }
    $(window.parent.document).find("#"+formId+"FormParent").val(dataContent);
    //window.parent.$("#"+formId+"Div").css('display','none');
    //window.parent.$("#sonHeader").css('display','block');
    window.parent.$("#planBookDiv").css('padding-top','60px');
    if(url){
        window.parent.savePlanBook_health(url,formId);
    }else{
        window.parent.savePlanBook_health('/service/planBook/savePlanBook',formId);
    }
}
/**
 * 编辑计划书时处理radio以及绑定的填空
 * @param planBookContent
 */
function setRadio(planBookContent){
    console.log(planBookContent);
    //吸烟
    var whethersmoking=planBookContent.whethersmoking;
    if(whethersmoking=="1"|| !whethersmoking){
        //设置戒烟戒了多少年，几个月，戒烟前每天吸烟数量允许填写
        $('#year2').numberbox('disable',true);
        $('#month1').numberbox('disable',true);
        $('#branch1').numberbox('disable',true);
        //禁用平均每天吸烟多少支，吸烟多少年
        $('#branch').numberbox('disable',true);
        $('#year1').numberbox('disable',true);
    }if(whethersmoking=="3"||whethersmoking=="2"){
        //设置戒烟戒了多少年，几个月，戒烟前每天吸烟数量允许填写
        $('#year2').numberbox('disable',true);
        $('#month1').numberbox('disable',true);
        $('#branch1').numberbox('disable',true);
        //解禁平均每天吸烟多少支，吸烟多少年
        $('#branch').numberbox('enable',true);
        $('#year1').numberbox('enable',true);
    }else if(whethersmoking=="4"){
        //设置戒烟戒了多少年，几个月，戒烟前每天吸烟数量允许填写
        $('#year2').numberbox('enable',true);
        $('#month1').numberbox('enable',true);
        $('#branch1').numberbox('enable',true);
        //禁用平均每天吸烟多少支，吸烟多少年
        $('#branch').numberbox('disable',true);
        $('#year1').numberbox('disable',true);
    }
    //饮酒
    var neverdrink=planBookContent.neverdrink;
    if(neverdrink=="1"||!neverdrink){
        $('#drinkingyear').numberbox('disable',true);
        $('#drinkingmonth').numberbox('disable',true);
        $('#second').numberbox('disable',true);
        $('#bottle').numberbox('disable',true);
        $('#else').attr('disabled',true);
        //禁用checkBox
        $(".liquor").attr('disabled',true);
    }else if(neverdrink=="2"){
        $('#drinkingyear').numberbox('enable',true);
        $('#drinkingmonth').numberbox('enable',true);
        $('#second').numberbox('disable',true);
        $('#bottle').numberbox('disable',true);
        $('#else').attr('disabled',true);
        //禁用checkBox
        $(".liquor").attr('disabled',true);
    }else if(neverdrink=="3"){
        $('#drinkingyear').numberbox('disable',true);
        $('#drinkingmonth').numberbox('disable',true);
        $('#second').numberbox('enable',true);
        $('#bottle').numberbox('enable',true);
        $('#else').attr('disabled',false);
    }
    //运动
    var exercisehabit=planBookContent.exercisehabit;
    if(!exercisehabit||exercisehabit=="1"||exercisehabit=="2"){
        $('#exercisesecond').numberbox('disable',true);
        $('#exercisetime').attr('disabled',true);
        $('#exercisetype').attr('disabled',true);
    }else if(exercisehabit=="3"||exercisehabit=="4"||exercisehabit=="5"){
        $('#exercisesecond').numberbox('enable',true);
        $('#exercisetime').attr('disabled',false);
        $('#exercisetype').attr('disabled',false);
    }
    var coffee=planBookContent.coffee;
    if(!coffee||coffee=="1"||coffee=="2"){
        $(".coffees input").attr('disabled',true);
    }else if(coffee=="3"){
        $(".coffees input").attr('disabled',false);
    }
}

/**
 * 新增页面对radio的处理
 */
function setRadioDisabled(){
    //禁用平均每天吸烟多少支，吸烟多少年
    $('#branch').numberbox('disable',true);
    $('#year1').numberbox('disable',true);
    //设置戒烟年份禁用
    $('#year2').numberbox('disable',true);
    //设置戒烟月数禁用
    $('#month1').numberbox('disable',true);
    //设置戒烟前吸烟数禁用
    $('#branch1').numberbox('disable',true);
    //饮酒
    $('#drinkingyear').numberbox('disable',true);
    $('#drinkingmonth').numberbox('disable',true);
    $('#second').numberbox('disable',true);
    $('#bottle').numberbox('disable',true);
    $('#else').attr('disabled',true);
    //禁用checkBox
    $(".liquor").attr('disabled',true);
    //运动
    $('#exercisesecond').numberbox('disable',true);
    $('#exercisetime').attr('disabled',true);
    $('#exercisetype').attr('disabled',true);
}

/**
 * 验证数字输入框值
 */
$.extend($.fn.validatebox.defaults.rules,{
    minOrMax: {
        validator: function(value, param){
            return (value >= param[0] && value <= param[1]);
        },
        message: '只能输入{0}-{1}之间的数字'
    }
});