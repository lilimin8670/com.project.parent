////////////////////////////////////////////////////////////////////
//							_ooOoo_								  //
//						   o8888888o							  //
//						   88" . "88							  //
//						   (| ^_^ |)							  //
//						   O\  =  /O							  //
//						____/`---'\____							  //
//					  .'  \\|     |//  `.						  //
//					 /  \\|||  :  |||//  \						  //
//					/  _||||| -:- |||||-  \						  //
//					|   | \\\  -  /// |   |						  //
//					| \_|  ''\---/''  |   |						  //
//					\  .-\__  `-`  ___/-. /						  //
//				  ___`. .'  /--.--\  `. . ___					  //
//				."" '<  `.___\_<|>_/___.'  >'"".				  //
//			  | | :  `- \`.;`\ _ /`;.`/ - ` : | |				  //
//			  \  \ `-.   \_ __\ /__ _/   .-` /  /                 //
//		========`-.____`-.___\_____/___.-`____.-'========		  //
//				             `=---='                              //
//		^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^        //
//			佛祖保佑		永无BUG		永不修改			         	  //
////////////////////////////////////////////////////////////////////
/**
 *
 * 　　　┏┓　　　┏┓
 * 　　┏┛┻━━━┛┻┓
 * 　　┃　　　　　　　┃
 * 　　┃　　　━　　　┃
 * 　　┃　┳┛　┗┳　┃
 * 　　┃　　　　　　　┃
 * 　　┃　　　┻　　　┃
 * 　　┃　　　　　　　┃
 * 　　┗━┓　　　┏━┛Code is far away from bug with the animal protecting
 * 　　　　┃　　　┃    神兽保佑,代码无bug
 * 　　　　┃　　　┃
 * 　　　　┃　　　┗━━━┓
 * 　　　　┃　　　　　    ┣┓
 * 　　　　┃　　　　      ┏┛
 * 　　　　┗┓┓┏━┳┓┏┛
 * 　　　　　┃┫┫　┃┫┫
 * 　　　　　┗┻┛　┗┻┛
 *
 */
$(function(){
	$("header").next().css("padding-top","60px");
	// var wid_uplod = $(".moren_img").width();
	// $(".moren_img").css("height",wid_uplod);
	/*已阅 未阅*/
	var heigh=$(".faceContent ol li img:last").height();
	$(".faceContent ol li:last").css({"height":heigh,"border":"none"});
	var count=0;
	$(".yiweiyue").click(function(){
		if(count%2==0){
			$(this).addClass("yiyue").removeClass("weiyue").text("已阅");
			$(this).next("input").val(1);
			window.parent.$("#fxfxYueFouParent").val(1);
		}
		else{
			$(this).removeClass("yiyue").addClass("weiyue").text("未阅");
			$(this).next("input").val(0);
			window.parent.$("#fxfxYueFouParent").val(0);
		}
		count=count+1;
	});
	var count1=0;
	$(".yiweiyueOne").click(function(){
		if(count1%2==0){
			$(this).addClass("yiyueOne").removeClass("weiyueOne").text("已阅");
			$(this).next("input").val(1);
		}
		else{
			$(this).removeClass("yiyueOne").addClass("weiyueOne").text("未阅");
			$(this).next("input").val(0);
		}
		count1=count1+1;
	});
	var count2=0;
	$(".yiweiyueTwo").click(function(){
		if(count2%2==0){
			$(this).addClass("yiyueTwo").removeClass("weiyueTwo").text("已阅");
			$(this).next("input").val(1);
		}
		else{
			$(this).removeClass("yiyueTwo").addClass("weiyueTwo").text("未阅");
			$(this).next("input").val(0);
		}
		count2=count2+1;
	});

	$(":radio").addClass("test");
	$(":radio").click(function() {
		var class_ = $(this).attr("class");

		if (class_ == "test1") {
			$(this).attr("checked", false);
			$(this).attr("class", "test");
		} else {
			$(this).attr("class", "test1");
		}
	});
});
//basicdata
var hei = $(".menu li").height();
var heiTwo = $(".menu li a i").height();
var ihei = (hei-heiTwo)/2;
$(".menu li a span").css("line-height",hei+'px');
$(".menu li a i").css("margin-top",ihei+'px')

//图片上传
	$(".row span").hide();
	$(".row span.sh").click(function(){
		$("#upload-container div").remove();
		$(this).hide()
		$('.uploadimg').show();
		});
	$(".row span.mx").click(function(){
		$("#upload-containerTwo div").remove();
		$(this).hide()
		$('.uploadimgTwo').show();
		});
	$(".row span.fa1").click(function(){
		$("#upload-container div").remove();
		$(this).hide()
		$('.upload_face1').show();
		});
	$(".row span.fa2").click(function(){
		$("#upload-containerTwo div").remove();
		$(this).hide()
		$('.upload_face2').show();
		});
	$(".row span.fa3").click(function(){
		$("#upload-containerThree div").remove();
		$(this).hide()
		$('.upload_face3').show();
		});



//肤质提升计划
$(".skinCont ul li a").click(function(){
	$(this).addClass("hover").siblings("a").removeClass("hover");
	});
//


