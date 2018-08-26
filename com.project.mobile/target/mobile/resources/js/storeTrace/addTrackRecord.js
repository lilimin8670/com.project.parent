/**
 * 初始化
 * @author abner
 */
$(function () {
   /* edit = eval('(' + edit + ')');
    $("#id").val(edit.id);*/
    $(document).on('change', '.file', function (evt) {
        var a = this;
        if (!window.FileReader) return;
        var files = evt.target.files;
        for (var i = 0, f; f = files[i]; i++) {
            if (!f.type.match('image.*')) {
                continue;
            }
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    $(a).next('img').attr("src", e.target.result);
                    if($(a).attr("data-isvlaue") == 1){
                        $("#imgs").append("<li><div class='tianjia'><div class='before_con'><input type='file' name='fileUrl' data-isvlaue='1' class='file'/>" +
                            "<img name='previewImage' src='" + basePath + "/resources/img/tianjia.png'/></div></div></li>");
                        $(a).attr("data-isvlaue","0");
                    }
                };
            })(f);
            reader.readAsDataURL(f);
        }
    })
});

/**
 * 保存当天跟踪
 * @author abner
 */
function save(){
    $("#form").submit();
}