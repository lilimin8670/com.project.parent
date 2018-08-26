$(function () {
    var hei = $(document.body).width();
    var hei_load = $(".load_b_box").width();
    var heinew = (hei - hei_load) / 2;
    $(".load_b_box").css("margin-left", heinew);
    $("#loading").hide();

    $(document).ajaxStart(function () {
        $("#loadMore").hide();
        $("#loading").show();
    }).ajaxStop(function () {
        $("#loading").hide();
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            if (!$("#loadNoMore").is(":visible")) {
                searchMemName();
            }
        }
    });
});