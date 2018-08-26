document.querySelector('input.promoteimg').addEventListener('change', function () {
	
    var that = this;
    lrz(that.files[0], {
        width: 800
    })
        .then(function (rst) {
            var img = new Image(),
                div = document.createElement('div'),
                p = document.createElement('p'),
                sourceSize = toFixed2(that.files[0].size / 1024),
                resultSize = toFixed2(rst.fileLen / 1024),
                scale = parseInt(100 - (resultSize / sourceSize * 100));
            div.className = 'col-sm-6';
            div.appendChild(img);
            div.appendChild(p);

            img.onload = function () {
                document.querySelector('#upload-container').appendChild(div);
            };
            img.src = rst.base64;
            return rst;
        });
	$(this).parent(".upload_face1").parent('.col-xs-12').parent('.row').find('span.fa1').show();
	$('.upload_face1').hide();
		
});

document.querySelector('input.promoteimg2').addEventListener('change', function () {
	
    var that = this;
    lrz(that.files[0], {
        width: 800
    })
        .then(function (rst) {
            var img = new Image(),
                div = document.createElement('div'),
                p = document.createElement('p'),

                sourceSize = toFixed2(that.files[0].size / 1024),
                resultSize = toFixed2(rst.fileLen / 1024),
                scale = parseInt(100 - (resultSize / sourceSize * 100));
            div.className = 'col-sm-6';
            div.appendChild(img);
            div.appendChild(p);

            img.onload = function () {
                document.querySelector('#upload-containerTwo').appendChild(div);
            };
            img.src = rst.base64;
            return rst;
        });
	$(this).parent(".upload_face2").parent('.col-xs-12').parent('.row').find('span.fa2').show();
	$('.upload_face2').hide();
});

document.querySelector('#version').innerHTML = lrz.version;
document.querySelector('.UA').innerHTML      = 'UA: ' + navigator.userAgent;

function toFixed2 (num) {
    return parseFloat(+num.toFixed(2));
}

/**
 * 替换字符串 !{}
 * @param obj
 * @returns {String}
 * @example
 */
String.prototype.render = function (obj) {
    var str = this, reg;
    Object.keys(obj).forEach(function (v) {
        reg = new RegExp('\\!\\{' + v + '\\}', 'g');
        str = str.replace(reg, obj[v]);
    });

    return str;
};
/**
 * 触发事件 - 只是为了兼容演示demo而已
 * @param element
 * @param event
 * @returns {boolean}
 */
function fireEvent (element, event) {
    var evt;
    if (document.createEventObject) {
        // IE浏览器支持fireEvent方法
        evt = document.createEventObject();
        return element.fireEvent('on' + event, evt)
    }
    else {
        // 其他标准浏览器使用dispatchEvent方法
        evt = document.createEvent('HTMLEvents');
        // initEvent接受3个参数：
        // 事件类型，是否冒泡，是否阻止浏览器的默认行为
        evt.initEvent(event, true, true);
        return !element.dispatchEvent(evt);
    }
}