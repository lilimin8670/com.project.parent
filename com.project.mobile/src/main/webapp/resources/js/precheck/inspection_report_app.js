$(function(){
	$(".question_nav:eq(1)").hide();
	$(".question_nav:eq(0)").on("click","a:eq(1)",function(){
		$(".question_nav:eq(0)").hide();
		$(".question_nav:eq(1)").show();
	})
	$(".question_nav:eq(1)").on("click","a:eq(0)",function(){
		$(".question_nav:eq(0)").show();
		$(".question_nav:eq(1) .search").val("");
		$(".question_nav:eq(1)").hide();
	})
	var leftHei = $(".details_cont_left").height()
	var rightHei = $(".details_cont_right").height();
	if(leftHei>rightHei){
		var padTop = leftHei - rightHei;
		$(".details_cont_right").css({"padding-top":padTop});
	} else{
		var padTop2 = rightHei - leftHei;
		$(".details_cont_left").css("padding-top",padTop2);
	}


});
