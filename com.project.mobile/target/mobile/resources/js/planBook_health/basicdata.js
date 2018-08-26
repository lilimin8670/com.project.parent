/**
 * Created by yangxiao on 2016/7/20.
 */
$(function(){
    $(":radio").addClass("test");
    $(":radio").click(function() {
        /*console.log($(this).attr("class"));*/
        var class_ = $(this).attr("class");

        if (class_ == "test1") {
            $(this).attr("checked", false);
            $(this).attr("class", "test");
        } else {
            $(this).attr("class", "test1");
        }
    });
    initcardLevel();
    getData();
});

/**
 * 给页面赋值
 */
var formId = "";
function getData(){
    formId = $("#formId").val();
    //从父页面隐藏域获得json数据
    var data = window.parent.$("#"+formId+"FormParent").val();
    var memberLoginnameH=window.parent.$("#memberLoginnameHParent").val();
    var memberIdHid=window.parent.$("#memberIdHidParent").val();
    $("#memberLoginnameH").val(memberLoginnameH);
    $("#memberIdHid").val(memberIdHid);
    if(data){
        $("#selectId").css("display","none");
        var memLogNameH = JSON.parse(data).memLogNameH;
        $("#memberLoginName").val(memLogNameH);
        $("#memLogName").val(memLogNameH);
        $("#memberLoginnameH").val(memLogNameH);
        $("#"+formId+"Form").form('load',JSON.parse(data));
        var healthSystemH = JSON.parse(data).healthProjH;
        var cardlevel=JSON.parse(data).cardlevel;
        if(healthSystemH){
            $("#healthPro").combobox('setText',healthSystemH);
            //$("#healthPro").combobox("disable");
        }if(cardlevel){
            $("#cardlevel").combobox('setText',cardlevel);
        }
    }else{
        $("#showId").css("display","none");
    }
}

/**
 * 选择会员
 * @Author yangxiao
 * @Param
 * @Date 2016/7/13 11:31
 */
function selectMember(){
    $("#memberList").datagrid({
        url : CP+"/service/memberInfo/getMemsByUserByPlanBook",
        method : 'post',
        fit : true,
        idField : 'id',
        rownumbers:true,
        singleSelect:true,
        queryParams:{
            p:$("#memParam").val(),
            type:2
        },
        columns : [[
            {
                title : '会员账号',
                field : 'loginname',
                width:"50%"
            },
            {
                title : '会员姓名',
                field : 'memName',
                width:"50%"
            }]],
        onLoadSuccess:function () {
            // 高度
            var d_view=($(".window-body").height()) - ($(".header").height());
            console.log("d_view:"+d_view);
            $(".datagrid-view").css({"height":d_view+'px'});
            $(".datagrid-body").css({"max-height":d_view - 30 + 'px'});
            // 宽度
            var d_width=($(".datagrid-view2").width())/2;
            $(".datagrid-cell-c2-loginname").css({"width":d_width - 5 +'px'});
        },
        onSelect: function (rowIndex, rowData){
            //$("#"+formId+"Form").form('load',rowData);
            if(isPlanBook(rowData.id,2)=="false"){
                window.parent.layer.alert("该会员已有计划书,不能再发起",{closeBtn: 0},function(index){
                    $("#memLogName").val("");
                    $("#memberIdHid").val("");
                    $("#memberLoginnameH").val("");
                    $("#memLogNameH").val("");
                    $('input[name="memLogNameH"]').val("");
                    $("#memName").textbox('setValue',"");
                    $("#storeName").textbox('setValue',"");
                    $("#memAge").textbox('setValue',"");
                    $('#cardlevel').combobox('clear');
                    $('#dlg').dialog('close');
                    window.parent.layer.close(index);
                });
                return false;
            }
            console.log(rowData);
            $("#memLogName").val(rowData.loginname);
            //$("#memLogName").css('display','block');
            //$("#selectMemBtn").css('display','none');
            $("#memberIdHid").val(rowData.id);
            $("#memberLoginnameH").val(rowData.loginname);
            $("#memLogNameH").val(rowData.loginname);
            $('input[name="memLogNameH"]').val(rowData.loginname);
            $("#memName").textbox('setValue',rowData.memName);
            $("#storeName").textbox('setValue',rowData.storeName);
            $("input[name=memSex][value='"+rowData.sex+"']").prop("checked",true);
            //$("#memAge").textbox('setValue',rowData.age);
            if (rowData.birthday) {
                $("#memAge").textbox("setValue", ages(rowData.birthday.substring(0,10)));
            }
            $('#cardlevel').combobox('select',levelJson[rowData.level]);
            $('#dlg').dialog('close');
            //设置父页面会员ID，会员登录名
            window.parent.$("#memberIdHidParent").val(rowData.id);
            window.parent.$("#memberLoginnameHParent").val(rowData.loginname);
        }

    });
}
/**
 * 打开对话框
 */
function selectMem() {
    $("#memLogName").blur();
    $('#memberList').datagrid('loadData', { total: 0, rows: [] });
    $("#dlg").dialog({
        title:"查询会员",
        width: $(window).width()*0.8,
        height: window.screen.height*0.6,
        closable: true,
        cache: false,
        modal: true
    });
    var h=$(".window-body").height() - 80;
    $(".datagrid-body").css({"max-height":h+'px'});
    $(".datagrid-view").css({"height":h+'px'});
    $(".panel-tool").css({"background-color":"skyblue","display":"block"});


}
/**
 * 保存
 * @Author yangxiao
 * @Param
 * @Date 2016/7/20 15:49
 */
function saveBaseData(formId){
    //获取选择的系统
    var healthSystem = $("#healthPro").combobox("getText");
    var cardlevel=$("#cardlevel").combobox('getText');
    if(!healthSystem){
        window.parent.layer.alert("请选择系统！",{closeBtn: 0});
        return false;
    }if(!cardlevel){
        window.parent.layer.alert("请选择卡级！",{closeBtn: 0});
        return false;
    }
    //给当前页面隐藏域赋值系统
    $("#healthProjH").val(healthSystem);
    //给父页面隐藏域赋值系统
    window.parent.$("#healthSystemParent").val(healthSystem);
    window.parent.$("#systemName").text(healthSystem);
    $(window.parent.document).find("#"+formId+"FormParent").val("");
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    dataJson.cardlevel=cardlevel;
    var dataContent=JSON.stringify(dataJson);
    $(window.parent.document).find("#"+formId+"FormParent").val(dataContent);
    var memLoginName=$("#memberLoginnameH").val();
    var memberId=$("#memberIdHid").val();
    console.log(memLoginName+"%$^&*(&^%$#@"+memberId);
    var isValid = $("#"+formId+"Form").form("validate");
    /*if(optType==1){
        if (!isValid) {//校验不通过关提示信息
            $.messager.progress("close");
            return isValid;
        }
    }*/
    if (!isValid) {//校验不通过关提示信息
        return isValid;
    }
    if (!memLoginName || !memberId) {   //校验不通过提示信息
        window.parent.layer.alert("用户名不能为空！",{closeBtn: 0},function(index){
            window.parent.layer.close(index);
            return memLoginName && memberId;
        });
    }else{
        window.parent.$("#"+formId+"Div").css('display','none');
        $(window.parent.document).find("#memberLoginnameHParent").val(memLoginName);
        $(window.parent.document).find("#memberIdHidParent").val(memberId);
        //$(window.parent.document).find("#healthSystemParent").val(healthSystem);
        window.parent.savePlanBook_health('/service/planBook/savePlanBook',formId);
    }
}



/**
 * 验证输入框值
 */
$.extend($.fn.validatebox.defaults.rules,{
    minOrMax: {
        validator: function(value, param){
            return (value >= param[0] && value <= param[1]);
        },
        message: '只能输入{0}-{1}之间的数字'
    }
});


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
 * 初始化会员级别comboBox
 * @Author xuanYin
 * @Param
 * @Date 2016/6/22 13:26
 */
function initcardLevel(){
    $("#cardlevel").combobox({
        required:true,
        data:levelData,
        valueField:'code',
        textField:'name',
        editable:false,
        prompt:'请选择'
    });
}

/**
 * 根据出生日期得到年龄
 * @param str
 * @returns {*}
 */
var returnAge;
function ages(str) {
    if(str == null || str =="") return false;
    var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null)  return false;
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
        var thisYear = new Date().getFullYear();
        var thisMonth = new Date().getMonth() + 1;
        var thisDay = new Date().getDate();
        if (thisYear == r[1]) {
            returnAge = 0; //同年 则为0岁
        } else {
            var ageDiff = thisYear - r[1]; //年之差
            if (ageDiff > 0) {
                if (thisMonth == r[3]) {
                    var dayDiff = thisDay - r[4]; //日之差
                    if (dayDiff < 0) {
                        returnAge = ageDiff - 1;
                    } else {
                        returnAge = ageDiff;
                    }
                } else {
                    var monthDiff = thisMonth - r[3]; //月之差
                    if (monthDiff < 0) {
                        returnAge = ageDiff - 1;
                    } else {
                        returnAge = ageDiff;
                    }
                }
            }else{
                returnAge = "";
            }
        }
        return returnAge;
    }
    return ("年龄有误，不能获取年龄请手动输入！");
}