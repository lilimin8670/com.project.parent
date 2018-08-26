$(function() {
    //ios10禁止缩放
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    });
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    //会员ID
    $(".khid").hide();
    $('#memLogName').on({
        keyup: function () {
            $(".khid").show();
            $(".khid").css('height', 'auto');
            $(".khid_cent tr").hide().filter(":contains('" + ($(this).val()) + "')").show();
            if ($(this).val() == "") {
                $(".khid_cent tr").show();
            }
        },
        blur: function () {
            if (!$(this).next(".khid").attr("hovered")) {
                $(this).next(".khid").css({'visibility': 'hidden'});
            }

            /**
             * 当会员ID文本框中的内容为空的话 把下面带出来的信息清空
             */
            if (!$("#memLogName").val()){
                $("#memberId,#memberLoginnameH").val("");
                $("#basic").form("reset");
            }
        }
    });
    $(".khid_cent tbody tr").click(function () {
        var val = $(this).find("td:eq(0)").text();
        $(this).parents(".khid").prev("input").val(val);
    });

    //单选单选
    $(".smile_design_check").each(function () {
        $(this).on("click", ".layui-form-radio", function () {
            var eq1 = $(this).prev(":radio").val();
            if (eq1 == "1") {
                $(this).parent(".smile_design_check").find("input[type='checkbox']").prop({
                    "checked": false,
                    "disabled": true
                });
                $(this).parent(".smile_design_check").find("input[type='checkbox']").next("div").addClass("layui-checkbox-disbaled layui-disabled").removeClass("layui-form-checked");
            } else if (eq1 == "2") {
                $(this).parent(".smile_design_check").find("input[type='checkbox']").prop("disabled", false);
                $(this).parent(".smile_design_check").find("input[type='checkbox']").next("div").removeClass("layui-checkbox-disbaled layui-disabled");
            }
        })
    })
    //单选多选
    $(".smile_design_redio").each(function (index) {
        $(this).on("click", ".layui-form-radio", function () {
            var eq1 = $(this).prev(":radio").val();
            if (eq1 == "1") {
                $(".smile_design_redio_two:eq(" + index + ") input[type='radio']").prop({
                    "checked": false,
                    "disabled": true
                });
                $(".smile_design_redio_two:eq(" + index + ") .layui-form-radio").addClass("layui-radio-disbaled layui-disabled").removeClass("layui-form-radioed");

            } else if (eq1 == "2") {
                $(".smile_design_redio_two:eq(" + index + ") input[type='radio']").prop("disabled", false);
                $(".smile_design_redio_two:eq(" + index + ") .layui-form-radio").removeClass("layui-radio-disbaled layui-disabled");
            }
        })
    })
    //单选单选多选
    $(".smile_design_rediocheck").each(function (index) {
        $(this).on("click", ".layui-form-radio", function () {
            var eq1 = $(this).prev(":radio").val();
            if (eq1 == "1") {
                $(".smile_design_rediocheck_two:eq(" + index + ") input[type='radio']").prop({
                    "checked": false,
                    "disabled": true
                });
                $(".smile_design_rediocheck_two:eq(" + index + ") .layui-form-radio").addClass("layui-radio-disbaled layui-disabled").removeClass("layui-form-radioed");
                $(".smile_design_rediocheck_three:eq(" + index + ") input[type='checkbox']").prop({
                    "checked": false,
                    "disabled": true
                });
                $(".smile_design_rediocheck_three:eq(" + index + ") input[type='checkbox']").next("div").addClass("layui-checkbox-disbaled layui-disabled").removeClass("layui-form-checked");
            } else if (eq1 == "2") {
                $(".smile_design_rediocheck_two:eq(" + index + ") input[type='radio']").prop("disabled", false);
                $(".smile_design_rediocheck_two:eq(" + index + ") .layui-form-radio").removeClass("layui-radio-disbaled layui-disabled");
            }
        })
    });

    $(".smile_design_rediocheck_two").each(function (index) {
        $(this).on("click", ".layui-form-radio", function () {
            console.log(index);
            var eq1 = $(this).prev(":radio").val();
            if (eq1 == "1") {
                $(".smile_design_rediocheck_three:eq(" + index + ") input[type='checkbox']").prop({
                    "checked": false,
                    "disabled": true
                });
                $(".smile_design_rediocheck_three:eq(" + index + ") input[type='checkbox']").next("div").addClass("layui-checkbox-disbaled layui-disabled").removeClass("layui-form-checked");
            } else if (eq1 == "2") {
                $(".smile_design_rediocheck_three:eq(" + index + ") input[type='checkbox']").prop("disabled", false);
                $(".smile_design_rediocheck_three:eq(" + index + ") input[type='checkbox']").next("div").removeClass("layui-checkbox-disbaled layui-disabled");
            }
        })
    })
    //单选填空
    $(".facial_input").each(function (index) {
        $(this).on("click", ".layui-form-radio", function () {
            var eq1 = $(this).prev(":radio").val();
            if (eq1 == "1") {
                $(".facial_input:eq(" + index + ") input[type='text']").prop("disabled", true).val("");
            } else if (eq1 == "2") {
                $(".facial_input:eq(" + index + ") input[type='text']").prop("disabled", false);
            }
        })
    })
    //有无做过以下牙科治疗
    $(".layui-tab-item li").click(function () {
        var textindex = $(".layui-tab-item li").index(this) + 1;
        var name = "tooth_0"+textindex;
        var id = "texttooth_0"+textindex;
        $(".tooth_cont textarea").val("").prop("name", "planBookData." + name).prop("id",id);
        layer.open({
            type: 1,
            content: $('.tooth_cont'),
            skin: 'layui-layer-rim', //加上边框
            title: '牙齿详情' + textindex,
            area: ['80%', '230px'],//宽高
            btn: ['确定', '取消'],
            yes: function(index){
                //确定按钮的回调函数
                $("#tooth_0"+textindex).val($("#"+id).val());
                layer.close(index);
            }
        });
        $("#"+id).val($("#tooth_0"+textindex).val());
    });
    //移除对号
    $("p").on("click", ".layui-form-checkbox", function () {
        if ($(this).hasClass("layui-form-checked")) {
            $(this).children("i").css("color", "#07B1F0");
        } else {
            $(this).children("i").css("color", "#FFFFFF");
        }
    });

    //身材内容
    $("#analysis_ul").on("click",".layui-form-radio",function(){
        var index=$(this).prev(":radio").val();

        //身材内容
        $("#analysisDiv").find("ul:eq("+(index-1)+")").show();
        $("#analysisDiv").find("ul:eq("+(index-1)+")").siblings("ul").hide();
        //身形的搭配方式 正确的选择
        $("#faceanaltrue").find("li:eq("+(index-1)+")").show();
        $("#faceanaltrue").find("li:eq("+(index-1)+")").siblings("li").hide();
        //身形的搭配方式 错误的选择
        $("#faceanalfalse").find("li:eq("+(index-1)+")").show();
        $("#faceanalfalse").find("li:eq("+(index-1)+")").siblings("li").hide();
    });

    $(".hair_cont ul li").click(function(){
        console.log($(this).find("input[type='checkbox']").val());
        if($(this).find("input[type='checkbox']").attr('checked')) {
            $(this).css("border","1px solid #cccccc");
            $(this).find("input[type='checkbox']").attr("checked",false);
            $(this).find("div").removeClass("layui-form-checked")
        }else{
            $(this).css("border","1px solid #07B1F0");
            $(this).find("input[type='checkbox']").attr("checked",true);
            $(this).find("div").addClass("layui-form-checked")
        }
    })
});