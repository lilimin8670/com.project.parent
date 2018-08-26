/**
 * Created by Administrator on 2016/7/28.
 */
var arrayList = [];
function dateTime(){
    (function (m) {
        m.init();
        var btns = m('.btn');
        btns.each(function (i, btn) {
            var id = $(this).attr("id");
            if ($.inArray(id, arrayList)<0){
                arrayList.push(id);
                btn.addEventListener('tap', function () {
                    var optionsJson = this.getAttribute('data-options') || '{}';
                    var options = JSON.parse(optionsJson);
                    var id = this.getAttribute('id');

                    var year = new Date().getFullYear();

                    var picker = new m.DtPicker({
                        "type": "datetime",
                        "beginYear":year,
                        "endYear": 2099,
                        "labels": ["年", "月", "日", "时", "分"]
                    });
                    picker.show(function (rs) {
                        $("#"+ id).val(rs.text);
                        validTime(rs.text, id);
                        picker.dispose();
                    });
                }, false);
            }
        });
    })(mui);
}


/**
 * 校验时间大小
 * @param time
 * @param this_id
 */
function validTime(this_time, this_id) {
    switch (this_id) {
        case "hy_qctime" :
            var _time = $("#hy_ddtime").val();
            if( new Date(this_time.replace(/-/g, "\/")).getTime() > new Date(_time.replace(/-/g, "\/")).getTime() || new Date(this_time.replace(/-/g, "\/")).getTime() == new Date(_time.replace(/-/g, "\/")).getTime() ){
                popupMessage(true, "抵达时间必须晚于启程时间!");
                return false;
            }else{
                return true;
            }
            break;
        case "hy_ddtime" :
            var _time = $("#hy_qctime").val();
            if( new Date(this_time.replace(/-/g, "\/")).getTime() < new Date(_time.replace(/-/g, "\/")).getTime() || new Date(this_time.replace(/-/g, "\/")).getTime() == new Date(_time.replace(/-/g, "\/")).getTime() ){
                popupMessage(true, "抵达时间必须晚于启程时间!");
                return false;
            }else{
                return true;
            }
            break;

        case "pt_qctime" :
            var _time = $("#pt_ddtime").val();
            if (new Date(this_time.replace(/-/g, "\/")).getTime() > new Date(_time.replace(/-/g, "\/")).getTime() || new Date(this_time.replace(/-/g, "\/")).getTime() == new Date(_time.replace(/-/g, "\/")).getTime()) {
                popupMessage(true, "抵达时间必须晚于启程时间!");
                return false;
            } else {
                return true;
            }
            break;
        case "pt_ddtime" :
            var _time = $("#pt_qctime").val();
            if (new Date(this_time.replace(/-/g, "\/")).getTime() < new Date(_time.replace(/-/g, "\/")).getTime() || new Date(this_time.replace(/-/g, "\/")).getTime() == new Date(_time.replace(/-/g, "\/")).getTime()) {
                popupMessage(true, "抵达时间必须晚于启程时间!");
                return false;
            } else {
                return true;
            }
            break;

        case "beHospitalized_date" :
            var _time = $("#hospitalDischarge_date").val();
            if( new Date(this_time.replace(/-/g, "\/")).getTime() > new Date(_time.replace(/-/g, "\/")).getTime() || new Date(this_time.replace(/-/g, "\/")).getTime() == new Date(_time.replace(/-/g, "\/")).getTime()  ){
                popupMessage(true, "出院时间必须晚于入院时间!");
                return false;
            }else{
                return true;
            }
            break;
        case "hospitalDischarge_date" :
            var _time = $("#beHospitalized_date").val();
            if ( new Date(this_time.replace(/-/g, "\/")).getTime() < new Date(_time.replace(/-/g, "\/")).getTime() || new Date(this_time.replace(/-/g, "\/")).getTime() == new Date(_time.replace(/-/g, "\/")).getTime() ) {
                popupMessage(true, "出院时间必须晚于入院时间!");
                return false;
            } else {
                return true;
            }
            break;
    }
}
/**
 * 弹出提示信息
 * @param flag
 * @param info
 */
function popupMessage(flag,info){
    if (flag) {
        layer.msg(info);
    }
}