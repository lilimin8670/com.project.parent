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
	//	海南肝排会报名表-总监--或对接医院医院白海峰
	$("#hepaticDrain").validate({
		onfocusout: false, //失去焦点时不执行验证
		errorPlacement: function(error, element) { //错误提示，错误对象
			layer.tips(error[0].innerText, element, { //1.错误信息，2提示位置，3同时提示多个错误
				tips: [1, '#3595CC'],
				time: [1000],
				tipsMore: true //错误信息可以同时提示多个，...
			});
		}
	});
	//	肝排会报名表-总监
	$("#hepaticDrain2").validate({
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
	$('#memLogName').on({
		keyup: function() {
			$(".khid").show();
			$(".khid").css('height', 'auto')
			$(".khid_cent tr").hide().filter(":contains('" + ($(this).val()) + "')").show();
			if($(this).val() == "") {
				$(".khid_cent tr").show();
			};
		},
		blur: function() {
			if(!$(this).next(".khid").attr("hovered")) {
				$(this).next(".khid").css({
					'visibility': 'hidden'
				});
			}
		}
	});
	$(".khid_cent tbody tr").click(function() {
		var val = $(this).find("td:eq(0)").text();
		$(this).parents(".khid").prev("input").val(val);
	});
	//	会员对之前调理项目的满意度
	$(".basic_input> .oldmanyidu").change(function() {
		var getSelectVal = $(".oldmanyidu option:selected").text();
		console.log(getSelectVal);
		if(getSelectVal=="不满意"){
			$(".manyi_none").show();
		}else{
			$(".manyi_none").hide();
		}
	});
});