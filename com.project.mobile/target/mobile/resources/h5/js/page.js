/**
 * 分页插件
 */
$(function(){
	$(document).ajaxStart(function(){
		$("#loadMore").hide();
		$("#loading").show();
	}).ajaxStop(function(){
		$("#loading").hide();
	});
	//手机拉倒底部之后，开始加载更多数据
	$(window).scroll(function(){
		if($(window).scrollTop()+$(window).height()==$(document).height()){
			//console.log("到底了");加载更多
			if(!$("#loadNoMore").is(":visible")){
				loadPage();
			}
		}
	});
});

function loadPage() {
	init();
}
