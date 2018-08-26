$(function(){
	var hei = $(".upload .default").width();
	$(".upload .default").css("height",hei);
	$(".moren_img").css("height",hei);
	$(".default span").css("line-height",hei+'px');
	//默认
	var defa = $(".upload .moren_img");
	defa.hide();
	//上传成功后显示.moren_img 隐藏.default
});
