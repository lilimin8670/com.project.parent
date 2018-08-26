/**
 * Created by xuanYin on 2017/5/18.
 */
$(function(){
    //判断是否有保存按钮
    if(btnType=="1"){
        $("#saveBtn").css('display','block');
    }
    //如果计划书ID为空则为新增计划书，需要加载查询会员的列表
    if(!planBookId){
        $("#loginName").val("");
        $("#loginName").keyup(function(){
            var loginName=$("#loginName").val();
            getmemberList(loginName);
        });
        $(".khid_cent tbody").on("click","tr",function(){
            var memberId=$(this).find("td:eq(0)").text();
            setMemberInfo(memberId);
            $(".khid").hide();
        });
    }else{
        //如果计划书ID不为空则为编辑计划书，禁用会员查询框
        $("#loginName").attr('readonly',true);
        //根据计划书ID查询计划书详情
        findPlanBookById(planBookId);
    }

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
 * 自定义加载会员列表数据
 * @param param
 * @param success
 * @param error
 * @returns {boolean}
 */
function getmemberList(param) {
    console.log("fangfa");
    var searchParam = {"type": 4,"p":param};
    var url = CP+"/service/memberInfo/getMemsByUserByPlanBook";
    $.ajax({
        url: url,
        type: "post",
        data: searchParam,
        dataType: "json",
        success: function (result) {
            if (result.success) {
                var memberData = result.rows;
                    $("#showMemberList").empty();
                    var html = template("memberList", {"list": memberData});
                    $("#showMemberList").append(html);
                   $(".khid").show();
                if (result.length <= 0) {
                    $("#showMemberList").append("会员信息暂无数据 ！！！");
                }
            }
        },
        error: function () {
            layer.msg('会员信息加载失败！');
        }
    })
};

/**
 * 根据选中会员给各个控件赋值
 * @param obj
 */
function setMemberInfo(memberId){
    //判断会员能否发起计划书
    if(isPlanBook(memberId,4)=="false"){
        layer.alert("该会员已有计划书,不能再发起",{closeBtn: 0},function(index){
            $("#loginName").val("");
            $("#memberIdHid").val("");
            $("#memberLoginnameH").val("");
            $("#memName").val("");
            $("#storeName").val("");
            $("#memAge").val("");
            $('#cardlevel').val('');
            layer.close(index);
        });
        return false;
    }
    //查询会员绑定的客服
    var urlByMem=CP+"/service/memberInfo/getPostByMemberId";
    var urlParam={"memberId":memberId};
    $.post(urlByMem,urlParam,function(data) {
        if(null!=data.data){
            var member=data.data;
            $("#loginName").val(member.loginname);
            $("#memberIdHid").val(member.id);
            $("#memberLoginnameH").val(member.loginname);
            $("#memName").val(member.memName);
            $("#storeName").val(member.storeName);
            $("#memAge").val(member.age);
            $('#cardlevel').val(levelJson[member.level]);
            $("#sex").find("option[value='"+member.sex+"']").prop("selected",true);
        }
    },"json");
}


/**
 * 判断是否能新增或者提交计划书
 */
function isPlanBook(memberId,type){
    var json = {
        "memberId":memberId,
        "type":type
    };
    var resp = $.ajax({
        type:"POST",
        url:CP+"/service/planBook/isPlanBook",
        data:json,
        async : false,
        cache : false,
        dataType:"json"
    }).responseText;
    return resp;
}

/**
 * 保存新的计划书
 */
function saveNewPlanBook(formId){
    var url= CP+"/service/planBook/saveNewPlanBook";
    var dataJson = $('#'+formId).form2json({checkOneUseArray: 1});
    dataJson.healthProjH = $("#selectHealth").val();
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

/**
 * 根据计划书ID查询计划书详情并赋值
 * @param planBookId
 */
function findPlanBookById(planBookId){
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
        }else {
            layer.alert(result.message,{closeBtn: 0});
        }
    },"json");

}