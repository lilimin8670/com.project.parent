$(function(){
	$(".enlarge").css({"height":window.screen.height,"line-height":window.screen.height+"px"}).hide();
	$(".basicdata").on("click","img",function(){
		var src = $(this)[0].src;
		$(".enlarge img").attr("src",src);
		$(".enlarge").show();
	});
	$(".enlarge").click(function(){
		$(this).hide();
	});
});
