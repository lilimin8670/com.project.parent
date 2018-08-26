/**
 * 用来调整ios和安卓“返回”和箭头对不齐的问题，在jquery之后引入
 * @type {string}
 */
var ua = navigator.userAgent.toLowerCase();
if (/iphone|ipad|ipod/.test(ua)) {
    //alert("IOS");
    $(".l span").css('margin-top', '21px');
    $(".feedback_l span").css('margin-top', '21px');
} else if (/android/.test(ua)) {
    // alert("安卓");
    $(".l span").css('margin-top', '20px');
    $(".feedback_l span").css('margin-top', '20px');
}

