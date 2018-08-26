$(function() {
	document.addEventListener('touchstart', function(event) {
		if(event.touches.length > 1) {
			event.preventDefault();
		}
	})
	var lastTouchEnd = 0;
	document.addEventListener('touchend', function(event) {
		var now = (new Date()).getTime();
		if(now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	}, false);
	//	安卓4-6获取焦点
	if(/Android [4-6]/.test(navigator.appVersion)) {
		window.addEventListener("resize", function() {
			if(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
				window.setTimeout(function() {
					document.activeElement.scrollIntoViewIfNeeded();
				}, 0);
			}
		})
	};
	//	基本信息开始
	$("#basicInfo").validate({
		onfocusout: false, //失去焦点时不执行验证
		errorPlacement: function(error, element) { //错误提示，错误对象
			layer.tips(error[0].innerText, element, { //1.错误信息，2提示位置，3同时提示多个错误
				tips: [1, '#3595CC'],
				time: [1000],
				tipsMore: true //错误信息可以同时提示多个，...
			});
		}
	});
	//会员ID
	$(".khid").hide();
	//$('#loginName').on({
	//	keyup: function() {
	//		$(".khid").show();
	//		$(".khid").css('height', 'auto')
	//		//$(".khid_cent tr").hide().filter(":contains('" + getmemberList($(this).val()) + "')").show();
	//	},
	//	blur: function() {
	//		if(!$(this).next(".khid").attr("hovered")) {
	//			$(this).next(".khid").css({
	//				'visibility': 'hidden'
	//			});
	//		}
	//	}
	//});
	//$(".khid_cent tbody tr").click(function() {
	//	var val = $(this).find("td:eq(0)").text();
	//	console.log(val);
	//	$(this).parents(".khid").prev("input").val(val);
	//});

	//	生活习惯和状态

	$("#lifestyleState").validate({
		onfocusout: false, //失去焦点时不执行验证
		errorPlacement: function(error, element) { //错误提示，错误对象
			layer.tips(error[0].innerText, element, { //1.错误信息，2提示位置，3同时提示多个错误
				tips: [1, '#3595CC'],
				time: [1000],
				tipsMore: true //错误信息可以同时提示多个，...
			});
		}
	});
	//女士提问
	$(".con_none").hide();
	$("input[name='menopause']").click(function() {
		var id = $(this).attr("id");
		if(id == "menopause01") {
			$("#menopause01").parent("li").next(".con_none").show();
		} else {
			$("#menopause01").parent("li").next(".con_none").hide();
			$("#menopause01").parent("li").next(".con_none").find(".con_chooser").children("input[type='text']").val("");
		}
	});
	$("input[name='pregnant']").click(function() {
		var id = $(this).attr("id");
		if(id == "pregnant04") {
			$("#pregnant04").parent("li").next(".con_none").show();
		} else {
			$("#pregnant04").parent("li").next(".con_none").hide();
			$("#pregnant04").parent("li").next(".con_none").find(".con_chooser").children("input[type='text']").val("");
		}
	});
	//	 饮食习惯
	$(".smoke_dl1").on("click", ".layui-form-radio", function() {
		var pitch1 = $(this).prev(":radio").val();
		if(pitch1 == '3') {
			$(".smoke_dd3").find(".con_none").show();
			$(".smoke_dd4").find(".con_none").hide();
			$(".smoke_dd4").find(".con_none").children("input").val('');
		} else if(pitch1 == '4') {
			$(".smoke_dd4").find(".con_none").show();
			$(".smoke_dd3").find(".con_none").hide();
			$(".smoke_dd3").find(".con_none").children("input").val('');
		} else if(pitch1 == '1' || pitch1 == '2') {
			$(".smoke_dd3, .smoke_dd4").find(".con_none").hide();
			$(".smoke_dd3, .smoke_dd4").find(".con_none").children("input").val('');
		}
	});
	$(".drink_dl").on("click", ".layui-form-radio", function() {
		var pitch2 = $(this).prev(":radio").val();
		if(pitch2 == '3') {
			$(".drink_dd3").find(".con_none").show();
			$(".drink_dd5").find(".con_none").hide();
			$(".drink_dd5").find(".con_none").children("input").val('');
		} else if(pitch2 == '5') {
			$(".drink_dd5").find(".con_none").show();
			$(".smoke_dd3").find(".con_none").hide();
			$(".smoke_dd3").find(".con_none").children("input").val('');
		} else if(pitch2 == '1' || pitch2 == '2' || pitch2 == '4') {
			$(".drink_dd3, .drink_dd5").find(".con_none").hide();
			$(".drink_dd3, .drink_dd5").find(".con_none").children("input").val('');
		}
	});
	$(".yundong_dl").on("click", ".layui-form-radio", function() {
		var pitch3 = $(this).prev(":radio").val();
		if(pitch3 == '4') {
			$(".yundong_dd4").find(".con_none").show();
		} else {
			$(".yundong_dd4").find(".con_none").hide();
			$(".yundong_dd4").find(".con_none").children("input").val('');
		}
	});
	$(".coffee_dd4,.coffee_dd5").hide();
	$(".coffee_dl").on("click", ".layui-form-radio", function() {
		var pitch4 = $(this).prev(":radio").val();
		if(pitch4 == '3') {
			$(".coffee_dd4,.coffee_dd5").show();
		} else if(pitch4 == '1' || pitch4 == '2') {
			$(".coffee_dd4 input[type='radio'],.coffee_dd5 input[type='radio']").prop("checked", false);
			$(".coffee_dd4 .layui-form-radio,.coffee_dd5 .layui-form-radio").removeClass("layui-form-radioed");
			$(".coffee_dd4,.coffee_dd5").hide();

		}
	});
	//	内分泌系统(月经不调)
	$(".neifenmi_dl").on("click", ".layui-form-checkbox", function() {
		var pitch5 = $(this).prev(":checkbox").val();
		console.log(pitch5);
		if(pitch5 == '25') {
			$(".neifenmi_dd25").find(".con_none").show();
		} else {
			$(".neifenmi_dd25").find(".con_none").hide();
		}
	});
});