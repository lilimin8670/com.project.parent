/**
 * 初始化
 * @author abner
 */
$(function () {
  /*  edit = eval('(' + edit + ')');
    $("#id").val(edit.id);*/
    $(document).on('change', '.file', function (evt) {
        var a = this;
        if (!window.FileReader) return;
        var files = evt.target.files;
        for (var i = 0, f; f = files[i]; i++) {
            if (!f.type.match('image.*')) {
                continue;
            }
            change(files[0], a);
        }
    })
});

/**
 * 苹果手机上传图片,在pc端显示方向不正确,需要一下方法进行处理
 * @param file
 * @param a
 */
function change(file, a) {
    // var file = this.files[0];
    var orientation;
    //EXIF js 可以读取图片的元信息 https://github.com/exif-js/exif-js
    EXIF.getData(file, function () {
        orientation = EXIF.getTag(this, 'Orientation');
    });
    var reader = new FileReader();
    reader.onload = (function (theFile) {
        return function (e) {
            getImgData(this.result, orientation, function (data) {
                //这里可以使用校正后的图片data了
                $(a).next('img').attr("src", data);
            });
            if ($(a).attr("data-isvlaue") == 1) {
                $("#imgs").append("<li><div class='tianjia'><div class='before_con'><input type='file' name='fileUrl' data-isvlaue='1' class='file'/>" +
                    "<img name='previewImage' src='" + basePath + "/resources/img/tianjia.png'/></div></div></li>");
                $(a).attr("data-isvlaue", "0");
            }
        };
    })(file);
    reader.readAsDataURL(file);
}

// @param {string} img 图片的base64
// @param {int} dir exif获取的方向信息
// @param {function} next 回调方法，返回校正方向后的base64
function getImgData(img, dir, next) {
    var image = new Image();
    image.onload = function () {
        var degree = 0, drawWidth, drawHeight, width, height;
        drawWidth = this.naturalWidth;
        drawHeight = this.naturalHeight;
        //以下改变一下图片大小
        /*   var maxSide = Math.max(drawWidth, drawHeight);
         var minSide = Math.min(drawWidth, drawHeight);*/
        /*  if (maxSide > 1024) {
         var minSide = Math.min(drawWidth, drawHeight);
         console.log("minSide:" + minSide);
         minSide = minSide / maxSide * 1024;
         maxSide = 1024;
         if (drawWidth > drawHeight) {
         drawWidth = maxSide;
         drawHeight = minSide;
         } else {
         drawWidth = minSide;
         drawHeight = maxSide;
         }
         }*/
        var canvas = document.createElement('canvas');
        canvas.width = width = drawWidth;
        canvas.height = height = drawHeight;
        var context = canvas.getContext('2d');
        //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
        if (navigator.userAgent.match(/iphone/i)) {
            console.log('iphone');
            switch (dir) {
                //iphone横屏拍摄，此时home键在左侧
                case 3:
                    degree = 180;//需要180度旋转
                    drawWidth = -width;
                    drawHeight = -height;
                    break;
                //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
                case 6://需要顺时针（向左）90度旋转
                    canvas.width = height;
                    canvas.height = width;
                    degree = 90;
                    drawWidth = width;
                    drawHeight = -height;
                    break;
                //iphone竖屏拍摄，此时home键在上方
                case 8://需要逆时针（向右）90度旋转
                    canvas.width = height;
                    canvas.height = width;
                    degree = 270;
                    drawWidth = -width;
                    drawHeight = height;
                    break;
            }
        }
        /*   console.log("minSide1:" + minSide)
         console.log("maxSide2:" + maxSide);*/
        //使用canvas旋转校正
        context.rotate(degree * Math.PI / 180);
        context.drawImage(this, 0, 0, drawWidth, drawHeight);
        //返回校正图片
        next(canvas.toDataURL("image/jpeg", 0.8));
    }
    image.src = img;
}

/**
 * 保存当天跟踪
 * @author abner
 */
function save(){
    $("#form").submit();
}