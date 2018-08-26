
/**
 * 初始化
 * @author abner
 */
$(function () {
    list = eval('(' + list + ')');
    var html="";
    if(type == 2){
        html = template("healthList", {"list":list});
    }
    if(type == 1){
        html = template("beautyList", {"list":list});
    }
    var $tr = $(html).appendTo("#html");
    $.parser.parse($tr);
    $("#html").css("min-height", $(window).height() - 60);
    $(".memberdatails-tupian img").click(function () {
        $("#imgMax").show();
        var url = $(this).attr("src");
        $("#imgMax").find("img").attr("src", url);
        var Hei = $("#imgMax img").height();
        var padTop = ($(window).height() - Hei) / 2;
        $("#imgMax").find("img").css("padding-top", padTop);
        $("#imgMax").css("z-index", "9999");
    });
    $("#imgMax").click(function () {
        $("#imgMax").css("z-index", "-1");
    });


});