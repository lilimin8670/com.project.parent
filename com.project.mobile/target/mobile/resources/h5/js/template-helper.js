/**
 * 依赖common.js
 */
template.helper('dateFormat', function(date, format) {
    return dateFormat(new Date(date), format);
});
template.helper('abbr', function(str, length) {
    return abbreviate(str,length);
});
template.helper('fixed', function(num, length) {
    return num.toFixed(length);
});
template.helper('format', function (date) {
    var formatDate = date.substring(0,10);
    return formatDate;
});