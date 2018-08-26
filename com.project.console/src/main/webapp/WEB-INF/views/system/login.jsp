<%@ page language="java" pageEncoding="utf-8"%>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>信息管理后台 - 登录</title>
    <link rel="stylesheet" href="../../../resources/layui/css/layui.css">
    <link rel="stylesheet" href="../../../resources/css/public.css">
</head>
<style>
   body{
        background: #00F7DE;
        background-image: url("../../../resources/images/background.jpg");
        height:100%;
        width:100%;
        overflow: hidden;
        background-size:cover;
    }
</style>
<body class="layui-layout-body">
<div class="login_main">
    <div class="lg_topimg"><img src="../../../resources/images/ht_dl_03.png" width="382" height="200" /></div>
    <div class="login_box">
        <%--<div class="login_title"><img src="./resources/images/tangshanlogo.png" width="327" height="60" /></div>--%>
        <ul>
            <li class="login_input"><span><img src="../../../resources/images/ht_dl_10.png" width="22" height="22" /></span>
                <input name="" id="userName" type="text" placeholder="用户名" /></li>
            <li class="login_input margin_top15"><span><img src="../../../resources/images/ht_dl_13.png" width="22" height="22" /></span>
                <input name="" type="password" id="password" placeholder="密码" /></li>
            <li class="login_jzmm"><input type="checkbox" value="y" id="rember" name="rember"/>记住密码</li>
            <!-- <li class="margin_top15 login_jzmm"><input name="" type="checkbox" value="" />记住密码</li> -->
            <li class="margin_top15 login_button"><input name="loginBtn" id="loginBtn" type="button"  value="登 录"/></li>
        </ul>
    </div>
</div>
<script src="../../../resources/layui/layui.js"></script>
<script>
    //JavaScript代码区域
    layui.use(['form','element'], function(){
        var element = layui.element,
        form = layui.form;
    });
</script>
</body>
</html>