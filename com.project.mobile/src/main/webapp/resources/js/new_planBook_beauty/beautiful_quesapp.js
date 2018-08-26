$(function() {
	//ios10禁止缩放
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
		}, false)

//验证
$("#basic").validate({
		onfocusout: false, //失去焦点时不执行验证
		errorPlacement: function(error, element) { //错误提示，错误对象
			layer.tips(error[0].innerText, element, { //1.错误信息，2提示位置，3同时提示多个错误
				tips: [1, '#3595CC'],
				time:[1000],
				tipsMore: true //错误信息可以同时提示多个，...
			});
		}
	});
//会员ID
	$(".khid").hide();

	$(".khid_cent tbody tr").click(function() {
		var val = $(this).find("td:eq(0)").text();
		$(this).parents(".khid").prev("input").val(val);
	});

//会员生殖健康美问卷调查
	$(".yj").on("click",".layui-form-radio",function(){
		var eq1=$(this).prev(":radio").val();
		if(eq1=="1"){
			$("#yjtime1").prop("checked",true);
			$("#yjtime2").prop("checked",false);
			$("#yjtime3").prop("checked",false);
			$("#yjtq").prop("readonly",false);
			$("#yjch").prop("readonly",true).val("");
			
		}else if(eq1=="2"){
			$("#yjtime1").prop("checked",false);
			$("#yjtime2").prop("checked",true);
			$("#yjtime3").prop("checked",false);
			$("#yjtq").prop("readonly",true).val("");
			$("#yjch").prop("readonly",false);
		}else if(eq1=="3"){
			$("#yjtime1").prop("checked",false);
			$("#yjtime2").prop("checked",false);
			$("#yjtime3").prop("checked",true);
			$("#yjtq").prop("readonly",false).val("");
			$("#yjch").prop("readonly",false).val("");
		}
	});
	$(".pqjys").on("click",".layui-form-radio",function(){
		var eq1=$(this).prev(":radio").val();
		if(eq1=="1"){
			$("#pqjy1").prop("checked",true);
			$("#pqjy2").prop("checked",false);
			$("#pqhs").prop("readonly",true).val("");
			
		}else if(eq1=="2"){
			$("#pqjy1").prop("checked",false);
			$("#pqjy2").prop("checked",true);
			$("#pqhs").prop("readonly",false);
		}
	});
	$(".hpvyn").on("click",".layui-form-radio",function(){
		var eq1=$(this).prev(":radio").val();
		if(eq1=="1"){
			$("#hpv1").prop("checked",true);
			$("#hpv2").prop("checked",false);
			$("#hpvn").prop("readonly",true).val("");
			
		}else if(eq1=="2"){
			$("#hpv1").prop("checked",false);
			$("#hpv2").prop("checked",true);
			$("#hpvn").prop("readonly",false);
		}
	});
//遗传病
$(".genetic").on("click",".layui-form-radio",function(){
		var eq1=$(this).prev(":radio").val();
		if(eq1=="1"){
			$("#xyycb1").prop("checked",false);
			$("#xyycb2").prop("checked",true);
			$("#gene").prop("readonly",false);
		}else if(eq1=="2"){
			$("#xyycb1").prop("checked",true);
			$("#xyycb2").prop("checked",false);
			$("#gene").prop("readonly",true).val("");
		}
		});
//吸烟
	$(".smokehide").hide();
	$(".smoking").on("click",".layui-form-radio:eq(1),.layui-form-radio:eq(2)",function(){
		$(".smokehide input[type='text']").val("");
		$(".smokehide").eq(0).show();
		$(".smokehide").eq(1).hide();
	});
	$(".smoking").on("click",".layui-form-radio:eq(3)",function(){
		$(".smokehide input[type='text']").val("");
		$(".smokehide").eq(1).show();
		$(".smokehide").eq(0).hide();
	});
	$(".smoking").on("click",".layui-form-radio:eq(0)",function(){
		$(".smokehide input[type='text']").val("");
		$(".smokehide").hide();
	});
	//喝酒
	$(".drinkhide").hide();
	$(".drink").on("click",".layui-form-radio:eq(1)",function(){
		$(".drinkhide input[type='text']").val("");
		$(".drinkhide input[type='checkbox']").prop("checked",false);
		$(".drinkhide .layui-form-checkbox").removeClass("layui-form-checked");
		$(".drinkhide").eq(2).show();
		$(".drinkhide").eq(1).hide();
		$(".drinkhide").eq(0).hide();
	});
	$(".drink").on("click",".layui-form-radio:eq(2),.layui-form-radio:eq(3)",function(){
		$(".drinkhide input[type='text']").val("");
		$(".drinkhide input[type='checkbox']").prop("checked",false);
		$(".drinkhide .layui-form-checkbox").removeClass("layui-form-checked");
		$(".drinkhide").eq(2).hide();
		$(".drinkhide").eq(1).show();
		$(".drinkhide").eq(0).show();
	});
	$(".drink").on("click",".layui-form-radio:eq(0)",function(){
		$(".drinkhide input[type='text']").val("");
		$(".drinkhide input[type='checkbox']").prop("checked",false);
		$(".drinkhide .layui-form-checkbox").removeClass("layui-form-checked");
		$(".drinkhide").hide();
	});
	//运动
	$(".motionhide").hide();
	$(".motion").on("click",".layui-form-radio:eq(0),.layui-form-radio:eq(1)",function(){
		$(".motionhide input[type='text']").val("");
		$(".motionhide").eq(0).hide();
	});
	$(".motion").on("click",".layui-form-radio:eq(2),.layui-form-radio:eq(3)",function(){
		$(".motionhide input[type='text']").val("");
		$(".motionhide").eq(0).show();
	});
	//咖啡
	$(".coffeehide").hide();
	$(".coffee").on("click",".layui-form-radio:eq(0),.layui-form-radio:eq(1)",function(){
		$(".coffee input[type='radio']").prop("checked",false);
		$(".coffeehide .layui-form-radio").removeClass("layui-form-radioed");
		$(".coffeehide").eq(0).hide();
	});
	$(".coffee").on("click",".layui-form-radio:eq(2)",function(){
		$(".coffeehide").eq(0).show();
	});
//会员口腔问卷调查
	$(".ywgm").on("click",".layui-form-radio",function(){
		var eq1=$(this).prev(":radio").val();
		if(eq1=="1"){
			$("#ywgm1").prop("checked",true);
			$("#ywgm2").prop("checked",false);
			$("#gmyw").prop("readonly",true).val("");
			
		}else if(eq1=="2"){
			$("#ywgm1").prop("checked",false);
			$("#ywgm2").prop("checked",true);
			$("#gmyw").prop("readonly",false);
		}
	});
//有无做过以下牙科治疗
	$(".dentaltreat").on("click",".layui-form-radio",function(){
		var eq1=$(this).prev(":radio").val();
		if(eq1=="1"){
			$(".dentaltreat input[type='checkbox']").prop({"checked":false,"disabled":true});
			$("#ykzl").prop("readonly",true).val("");
			$(".dentaltreat input[type='checkbox']").next("div").addClass("layui-checkbox-disbaled layui-disabled").removeClass("layui-form-checked");
			
		}else if(eq1=="2"){
			$(".dentaltreat input[type='checkbox']").prop("disabled",false);
			$(".dentaltreat input[type='checkbox']").next("div").removeClass("layui-checkbox-disbaled layui-disabled");
			$("#ykzl").attr("readonly",false);
		}
	});

//layer
	layui.use(['form', 'layedit', 'laydate'], function () {
		var laydate = layui.laydate; //时间插件
		var form = layui.form()
			, layer = layui.layer
			, layedit = layui.layedit
			, laydate = layui.laydate;

		//创建一个编辑器
		layedit.build('LAY_demo_editor');
		//监听保存
		form.on('submit(formSave)', function (data) {
			var url = CP + "/service/planBook/saveNewPlanBook";
			savePlanBook(url);
			return false;
		});
	});


});

function savePlanBook(url) {
	var dataJson = $('#basic').form2json({checkOneUseArray: 1});
	delete dataJson.file;
	var dataContent = JSON.stringify(dataJson);
	console.log("memberId: "+$("#memberId").val());
	console.log("conent: "+dataContent);
	var param = {
		"type": $("#planBookType").val(),
		"content": dataContent,
		"memberId": $("#memberId").val(),
		"memberLoginname": $("#loginName").val(),
		"id": $("#planBookId").val(),
		"processId": $("#processIdHid").val()
	};
	$.post(url, param, function (result) {
		if (result.success) {
			layer.alert("保存成功！");
			window.parent.location.reload();
		} else {
			layer.alert("保存失败！");
		}
	}, "json");
}