//配置通用的默认提示语
$.extend($.validator.messages, {
	required: '必填项不能为空',
});
//数字
jQuery.validator.addMethod("data-rule-number", function (value, element) {
	var num = /^\d+$/;
	return this.optional(element) || (num.test(value));
}, "只能填写数字");
//有两位小数
jQuery.validator.addMethod("data-rule-numpoint", function (value, element) {
	var textValid = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d\*$|^[1-9]\d*$/;
	return this.optional(element) || (textValid.test(value));
}, "输入不符合规范");
//手机号+电话
jQuery.validator.addMethod("data-rule-phone", function (value, element) {
		var mobile  = /^1[34578]\d{9}$/;
		var phone = /^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/;
	return this.optional(element) || (mobile.test(value) && phone.test(value));
}, "电话号输入有误");
//邮箱
jQuery.validator.addMethod("data-rule-email", function (value, element) {
	var email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return this.optional(element) || (email.test(value));
}, "邮箱格式不正确");
//url
jQuery.validator.addMethod("data-rule-url", function (value, element) {
	var urllink = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/;
	return this.optional(element) || (urllink.test(value));
}, "连接格式不正确");
//日期格式
jQuery.validator.addMethod("data-rule-date", function (value, element) {
	var dateval = /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/;
	return this.optional(element) || (dateval.test(value));
}, "日期格式不正确");
//身份证
jQuery.validator.addMethod("data-rule-identity", function (value, element) {
	var identity = /(^\d{15}$)|(^\d{17}(x|X|\d)$)/;
	return this.optional(element) || (identity.test(value));
}, "请输入正确的身份证号");
//面部
jQuery.validator.addMethod("data-rule-face", function (value, element) {
	var face = /[123]/;
	return this.optional(element) || (face.test(value.trim()));
}, "请输入1,2,3这三个数字中的一个");
//年
jQuery.validator.addMethod("data-rule-year", function (value, element) {
	var year=/^\d{4}$/;
	return this.optional(element) || (year.test(value));
}, "请输入正确的年份");
//月
jQuery.validator.addMethod("data-rule-mouth", function (value, element) {
	var mouth=/^(0?[1-9]|1[0-2])$/;
	return this.optional(element) || (mouth.test(value));
}, "请输入正确的月份");
//日
jQuery.validator.addMethod("data-rule-day", function (value, element) {
	var day =/^((0?[1-9])|((1|2)[0-9])|30|31)$/;
	return this.optional(element) || (day.test(value));
}, "请输入正确的日期格式");
