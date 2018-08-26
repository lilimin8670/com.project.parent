/**
 * Created by xuanYin on 2017/5/19.
 */

$(function(){
    //判断是否有保存按钮
    if(btnType=="1"){
        $("#saveBtn").css('display','block');
    }
    //根据计划书ID查询计划书详情
    findPlanBookById(planBookId);


    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form(),
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate;
        //创建一个编辑器
        layedit.build('LAY_demo_editor');
        //自定义验证规则
        form.verify({
            planBookSex: function (value) {//计划书性别验证
                var fleg = $('input[name="planBookData.sex"]').is(":checked");
                var radioId = $('input[name="planBookData.sex"]:first').parent("div").attr('id');
                if (!fleg) {
                    window.location.href = '#' + radioId;
                    return "性别为必选项"
                }
            }
        });
        //创建一个编辑器
        layedit.build('LAY_demo_editor');
        //监听保存
        if(isCheck=="1"){
            alert("进入验证");
            form.on('submit(formSave)', function (data) {
                var formId=$("#formId").val();
                saveNewPlanBook(formId);
                return false;
            });
        }
    });
});



/**
 * 根据计划书ID查询计划书详情并赋值
 * @param planBookId
 */
function findPlanBookById(planBookId){
    if(planBookId){
        var url = CP+"/service/planBook/findPlanBookById";
        var param = {"id":planBookId};
        $.post(url, param, function (result) {
            if(result.success) {
                $("#memberIdHid").val(result.data.memberId);
                $("#memberLoginnameH").val(result.data.memberLoginname);
                $("#processIdHid").val(result.data.processId);
                var planBookData=JSON.parse(result.data.content);
                var formId=$("#formId").val();
                $("#"+formId).fill(planBookData.planBookData, {debug: true});
                console.log(planBookData.planBookData.healthProjH);
            }else {
                layer.alert(result.message,{closeBtn: 0});
            }
        },"json");
    }
}

/**
 * 保存新的计划书
 */
function saveNewPlanBook(formId){
    var url= CP+"/service/planBook/saveNewPlanBook";
    var dataJson = $('#'+formId).form2json({checkOneUseArray: 1});
    var dataContent = JSON.stringify(dataJson);
    var param = {
        "type": $("#planBookType").val(),
        "content": dataContent,
        "memberId": $("#memberIdHid").val(),
        "memberLoginname": $("#memberLoginnameH").val(),
        "id":planBookId,
        "processId":$("#processIdHid").val()
    };
    $.post(url, param, function (result) {
        if (result.success) {
            layer.alert(result.message,{closeBtn: 0});
            window.location.href=CP+"/service/kfPlanBook/addPlanBook?type=4";
        } else {
            layer.alert("保存失败！");
        }
    }, "json");
}