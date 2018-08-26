//编辑提交触发事件
var saveIndex;
var editIndex;
var strokeIndex;
$.ajaxSetup({async:false});
function editStrokeData(){
			$("#editStrokeData").ajaxSubmit({
				beforeSend: function () {
					//在表单提交后后端未作出响应时，禁用提交按钮，提高用户体验。
					$(".step").removeAttr("onclick");
					saveIndex = layer.load(2, {shade: [0.8, '#393D49']});
				},
				complete: function () {
					//后端响应后放开按钮
					$(".step").attr("onclick", "vilidate()");
				},
				success: function (result) {
					if (result.success) {
							layer.msg(result.message, {
								icon: 1,
								time: 1000
							},function(){
								layer.close(saveIndex);
								/*history.go(-1);*/
                                if (code!=undefined && code != null && code != ""){
                                    window.location.href = basePath + "/service/check/registerForm/returnNewRegisterFormCheck?" +
                                        "regFormId="+regFormId+"&type="+type+"&classify="+classify+"&processId="+processId+"&regProStateId="+regProStateId+"&from=&actionFrom=check&code="+code;
                                }else {
                                    window.location.href = basePath +"/service/check/registerForm/returnRegisterFormCheck?regFormId="+ regFormId+"&type="+ type+"&classify="+ classify+"&processId="+ processId+"&regProStateId="+ regProStateId + "&doType=" + doType+"&from="+"&actionFrom=check";
                                }
							});
					} else {
						layer.msg(result.message);
					}
				},
				dataType: 'json'
			});
}
//保存提交触发事件
function saveStrokeData() {
	$("#saveStrokeData").ajaxSubmit({
		beforeSend: function () {
			//在表单提交后后端未作出响应时，禁用提交按钮，提高用户体验。
			$(".step").removeAttr("onclick");
			editIndex = layer.load(2, {shade: [0.8, '#393D49']});
		},
		complete: function () {
			//后端响应后放开按钮
			$(".step").attr("onclick", "vilidate()");
		},
		success: function (result) {
			if (result.success) {
				layer.msg(result.message, {
					icon: 1,
					time: 1000
				}, function () {
					layer.close(editIndex);
				/*	history.go(-1);*/
                    if (code!=undefined && code != null && code != ""){
                        window.location.href = basePath + "/service/check/registerForm/returnNewRegisterFormCheck?" +
                            "regFormId="+regFormId+"&type="+type+"&classify="+classify+"&processId="+processId+"&regProStateId="+regProStateId+"&from=&actionFrom=check&code="+code;
                    }else {
                        window.location.href = basePath + "/service/check/registerForm/returnRegisterFormCheck?regFormId=" + regFormId + "&type=" + type + "&classify=" + classify + "&processId=" + processId + "&regProStateId=" + regProStateId +"&doType="+ doType+ "&from=" + "&actionFrom=check";
                    }
				});
			} else {
				layer.msg(result.message);
			}
		},
		dataType: 'json'
	});
}
//区域中心版行程单编辑提交事件
function clubEditStrokeData() {
	$("#clubEditStrokeData").ajaxSubmit({
		beforeSend: function () {
			//在表单提交后后端未作出响应时，禁用提交按钮，提高用户体验。
			$(".step").removeAttr("onclick");
			strokeIndex = layer.load(2, {shade: [0.8, '#393D49']});
		},
		complete: function () {
			//后端响应后放开按钮
			$(".step").attr("onclick", "vilidate()");
		},
		success: function (result) {
			if (result.success) {
				layer.msg(result.message, {
					icon: 1,
					time: 1000
				}, function () {
					layer.close(strokeIndex);
					window.location.href = basePath + "/service/strokeOrder/initApplyPage";
				});
			} else {
				layer.msg(result.message);
			}
		},
		dataType: 'json'
	});
}
