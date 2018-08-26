$(function () {

   if (!planBookId){
       layer.alert("请先填写会员基本信息！", function(index){
           layer.close(index);
           window.location.href = CP+"/service/kfPlanBook/addPlanBook?type=7&nameType="+nameType+"&btnType="+btnType;
       });
   }else {
       $.post(CP+"/service/planBook/findPlanBookById",{"id":planBookId},function (result) {
           var healthData = JSON.parse(result.data.content);
           $("#basic").fill(healthData.planBookData, {debug: true});
           $("#basic").find("input[type='checkbox']:checked").next("div").addClass("layui-form-checked");
           $("#basic").find("input[type='radio']:checked").next("div").addClass("layui-form-radioed");
           //身材
           if ($("#analysis_ul").length>0){
               $("#analysis_ul").find("input[type='radio']:checked").parents("li").css("border","1px solid #07b1f0");
               var index = $("#analysis_ul").find("input[type='radio']:checked").val();
               if (index){
                   $("#analysisDiv").find("ul:eq("+(index-1)+")").show();
                   $("#faceanaltrue").find("li:eq("+(index-1)+")").show();
                   $("#faceanalfalse").find("li:eq("+(index-1)+")").show();
               }
           }

           if ($(".hair_cont").length>0){
               $(".hair_cont").find("input[type='checkbox']:checked").parent("li").css("border","1px solid #07b1f0");
           }

           $(".smile_design_check input[type='radio']").each(function () {
               if ($(this).attr("checked")){
                    if ($(this).val() && $(this).val()!=1){
                        $(this).parent(".smile_design_check").find("input[type='checkbox']").prop("disabled", false);
                        $(this).parent(".smile_design_check").find("input[type='checkbox']").next("div").removeClass("layui-checkbox-disbaled layui-disabled");
                    }
               }
           });
           $(".smile_design_redio").each(function (index) {
               $this = $(this).find("input[type='radio']:checked");
               if ($this.val() && $this.val()!=1){
                   $(".smile_design_redio_two:eq(" + index + ") input[type='radio']").prop("disabled", false);
                   $(".smile_design_redio_two:eq(" + index + ") .layui-form-radio").removeClass("layui-radio-disbaled layui-disabled");
               }
           });
           $(".smile_design_rediocheck").each(function (index) {
               $this = $(this).find("input[type='radio']:checked");
               if ($this.val() && $this.val()!=1){
                   $(".smile_design_rediocheck_two:eq(" + index + ") input[type='radio']").prop("disabled", false);
                   $(".smile_design_rediocheck_two:eq(" + index + ") .layui-form-radio").removeClass("layui-radio-disbaled layui-disabled");
               }
           });

           $(".smile_design_rediocheck_two").each(function (index) {
               $this = $(this).find("input[type='radio']:checked");
               if ($this.val() && $this.val()!=1){
                   $(".smile_design_rediocheck_three:eq(" + index + ") input[type='checkbox']").prop("disabled", false);
                   $(".smile_design_rediocheck_three:eq(" + index + ") input[type='checkbox']").next("div").removeClass("layui-checkbox-disbaled layui-disabled");
               }
           });

           $(".facial_input").each(function (index) {
               $this = $(this).find("input[type='radio']:checked");
               if ($this.val() && $this.val()!=1){
                   $(".facial_input:eq(" + index + ") input[type='text']").prop("disabled", false);
               }
           });

           if ($(".upload").length>0){
                $(".upload li").each(function (index) {
                    var url = $(this).find("input[type=hidden]").val();
                    console.log(url);
                    if (url){
                        $(this).find("img").attr("src",url);
                        $(this).find(".default").css("display","none");
                        $(this).find(".moren_img").css("display","block");
                    }
                });
           }

           if (btnType=="1"){//查看详情
               $("#basic").find("input[type=text]").attr("readonly","readonly");
               $("#basic").find("textarea").attr("readonly","readonly");
               $("#basic").find("select").attr("disabled","disabled");
               $("#basic").find("input[type=radio]").attr("disabled","disabled");
               $("#basic").find("input[type=checkbox]").attr("disabled","disabled");
               $("#submit").hide();
           }

       },"json");
   }
    //Demo
    layui.use(['form', 'layedit', 'laydate','element'], function(){
        var laydate = layui.laydate; //时间插件
        var element = layui.element();
        var form = layui.form()
            ,layer = layui.layer
            ,layedit = layui.layedit
            ,laydate = layui.laydate;

        //脸型选择
        form.on("select(SelectFeature)", function(data){
            var OptionIndex = data.elem.selectedIndex; //得到选中的下标
            var text = data.elem.options[OptionIndex].text; //得到选中下标的文本信息
            var index=data.value;
            if(text!='请选择'){
                //适合的发型
                $("#facehair").find("ul:eq("+(index-1)+")").show();
                $("#facehair").find("ul:eq("+(index-1)+")").siblings("ul").hide();

                //不适合的发型
                $("#notfacehair").find("ul:eq("+(index-1)+")").show();
                $("#notfacehair").find("ul:eq("+(index-1)+")").siblings("ul").hide();

                //腮红
                $("#blusher").find("li:eq("+(index-1)+")").show();
                $("#blusher").find("li:eq("+(index-1)+")").siblings("li").hide();

                //眉形
                $("#camber").find("ul:eq("+(index-1)+")").show();
                $("#camber").find("ul:eq("+(index-1)+")").siblings("ul").hide();
            }else{
                $("#facehair").find("ul").hide();
                $("#notfacehair").find("ul").hide();
                $("#blusher").find("li").hide();
                $("#camber").find("ul").hide();
            }
        });

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
    delete dataJson.submit;
    var dataContent = JSON.stringify(dataJson);
    console.log("content: "+dataContent);
    var param = {
        "content": dataContent,
        "id": planBookId
    };
    console.log(param);
    $.post(url, param, function (result) {
        if (result.success) {
            layer.alert("保存成功！");
            planBookId = result.data.id;

            if (nameType == 1){
                //客服
                window.location.href = CP + "/service/kfPlanBook/getCheckView?id=" + planBookId + "&nameType="+nameType+"&btnType="+btnType;
            }else if (nameType == 5){
                //区域中心
                window.location.href=CP+"/service/planBook/getCheckView?id="+planBookId+"&nameType="+nameType+"&btnType="+btnType;
            }else {
                var  indexUrl=CP+"/service/kfPlanBook/editPlanBook" ;
                window.location.href =indexUrl+"?type=7&id="+planBookId+"&nameType="+nameType+"&btnType="+btnType;
            }

        } else {
            layer.alert("保存失败！");
        }
    }, "json");
}

