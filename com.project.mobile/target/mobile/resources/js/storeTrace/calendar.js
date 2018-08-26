
/**
 * 初始化
 * @author abner
 */
$(function () {
    list = eval('(' + list + ')');
    $('#cc').calendar({
        fit: true,
        current: new Date(),
        weeks: ['日', '一', '二', '三', '四', '五', '六'],
        months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        onSelect: function (date) {
            var d, m,y;
            if(Number(date.getDate())<10){
                d = "0" + date.getDate();
            }else{
                d = date.getDate();
            }
            if((Number(date.getMonth()) + 1)<10){
                m = Number(date.getMonth()) + 1;
                m = "0" + m;
            }else{
                m = Number(date.getMonth()) + 1;
            }
            y = date.getFullYear();
            var createDate = y + "-" + m + "-" + d;
            var show = false;
            for (var i = 0; i < list.length; i++) {
                if(list[i].createDate == createDate && list[i].isAnswer == 1){
                    show = true;
                }
            }

            if(show){
                window.location.href = basePath + "/service/storeTrace/showDetails?trackRecordsId=" + trackRecordsId + "&type=" + type + "&createDate=" + createDate;
            }
            //跳转页面
        }
    });
});

function showAddClass() {
    for(var i = 0; i < list.length;i++){
        var split = list[i].createDate.split("-");
        if(list[i].isAnswer == 0){
            $("td[abbr='" + Number(split[0]) + "," + Number(split[1]) + "," + Number(split[2]) + "']").addClass("md1");
        }
        if (list[i].isAnswer == 1) {
            $("td[abbr='" + Number(split[0]) + "," + Number(split[1]) + "," + Number(split[2]) + "']").addClass("md");
        }
        if($("td[abbr='" + Number(split[0]) + "," + Number(split[1]) + "," + Number(split[2]) + "']").hasClass("md")){
            $("td[abbr='" + Number(split[0]) + "," + Number(split[1]) + "," + Number(split[2]) + "']").removeClass("md1");
        }
    };
};