/**
 * Created by xuanYin on 2016/7/13.
 */

$(function(){
    var jbzlFormParent=window.parent.$("#jbzlFormParent").val();
    var memberLoginnameH=window.parent.$("#memberLoginnameHParent").val();
    var memberIdHid=window.parent.$("#memberIdHidParent").val();
    if(jbzlFormParent){
        var jbzlFormParentJson=JSON.parse(jbzlFormParent||"{}");
        console.log(jbzlFormParentJson);
        $("#jbzlForm").form("load",jbzlFormParentJson);
        var memLogName=$('input[name="memLogNameH"]').val();
        $("#memberLoginnameH").val(memberLoginnameH);
        $("#memberIdHid").val(memberIdHid);
        $("#memLogName").val(memLogName);
        $("#logName").val(memLogName);
        $("#memLi").css('display','none');
        $("#memLiH").css('display','block');
    }else{
        $("#memLi").css('display','block');
        $("#memLiH").css('display','none');
    }
    //selectMember();
});

/**
 * 选择会员
 * @Author xuanYin
 * @Param
 * @Date 2016/7/13 11:31
 */
var searchParam={"type":1};
function getSearchParam(){
    return searchParam;
}
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
            type:1
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
            var h=($(".laybox").height()) - ($(".header").height());
            $(".laybox > .panel").css({"height":h+'px'});
            $(".datagrid-body").css({"max-height":(h-40)+'px'});
            //宽度
            var d_width=($(".datagrid-view2").width())/2;
            console.log(d_width);
            $(".datagrid-cell-c2-loginname").css({"width":d_width - 7 +'px'});
        },
       onSelect: function (rowIndex, rowData){
            console.log(rowData);
            if(isPlanBook(rowData.id,1)=="false"){
                layer.alert("该会员已有计划书,不能再发起",{closeBtn: 0});
                // layer.alert("该会员已有计划书,不能再发起",{closeBtn: 0});
                $("#memLogName").val("");
                $("#memberIdHid").val("");
                $("#memberLoginnameH").val("");
                $('input[name="memLogNameH"]').val("");
                $('input[name="memName"]').val("");
                $("#storeName").textbox('setValue',"");
                $('input[name="memAge"]').val("");
                $('#dlg').dialog('close');
                return false;
            }
           //查询会员绑定的客服
           var urlByMem=CP+"/service/memberInfo/getPostByMemberId";
           var urlParam={"memberId":rowData.id};
           $.post(urlByMem,urlParam,function(data) {
               if(null!=data.data){
                   var postList=data.data.postList;
                   for(var i=0;i<postList.length;i++){
                       if(postList[i].post==06){
                           $("#Group").textbox('setValue',postList[i].organName);
                       }if(postList[i].post==12){
                           $("#expertH").textbox('setValue',postList[i].name);
                       }
                   }
               }
           },"json");
            $("#memLogName").val(rowData.loginname);
            $("#memberIdHid").val(rowData.id);
            $("#memberLoginnameH").val(rowData.loginname);
            $('input[name="memLogNameH"]').val(rowData.loginname);
            $("#memName").textbox('setValue',rowData.memName);
            $("#storeName").textbox('setValue',rowData.storeName);
           if(rowData.sex=="男"){
               $("input[name=memSex][value='1']").prop("checked",true);
           }else if(rowData.sex=="女"){
               $("input[name=memSex][value='2']").prop("checked",true);
           }
            //$("#memAge").textbox('setValue',rowData.age);
           if (rowData.birthday) {
               $("#memAge").textbox("setValue", ages(rowData.birthday.substring(0,10)));
           }
           $("#belief").textbox('setValue',beliefJson[rowData.religiousBelief]);
            $('#dlg').dialog('close');
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
    var h=($(".laybox").height()) - ($(".header").height());
    $(".laybox > .panel").css({"height":h+'px'});
    $(".datagrid-body").css({"max-height":(h-40)+'px'});
    $(".panel-tool").css({"background-color":"skyblue","display":"block"});
}
/**
 * 保存
 * @Author xuanYin
 * @Param
 * @Date 2016/7/13 15:49
 */
function saveBaseData(formId){
    var dataJson=$("#"+formId+"Form").form2json({ allowEmptyMultiVal: true});
    var dataContent=JSON.stringify(dataJson);
    $(window.parent.document).find("#"+formId+"FormParent").val(dataContent);
    var memLoginName=$("#memberLoginnameH").val();
    var memberId=$("#memberIdHid").val();
    var isValid = $("#jbzlForm").form("validate");
    /*!isValid||*/
    if (!memLoginName || !memberId) {   //校验不通过提示信息
        if(!memLoginName || !memberId){
            layer.alert("用户编号不能为空",{closeBtn: 0});
        }
        return false;
    }
    if(!isValid){
        return isValid;
    }
    //允许审核的时候暂存
    /*if(optType==1){
        if(!isValid){
            return isValid;
        }
    }*/
    window.parent.$("#"+formId+"Div").css('display','none');
    $(window.parent.document).find("#memberLoginnameHParent").val(memLoginName);
    $(window.parent.document).find("#memberIdHidParent").val(memberId);
    window.parent.savePlanBook_beauty('/service/planBook/savePlanBook',formId);
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