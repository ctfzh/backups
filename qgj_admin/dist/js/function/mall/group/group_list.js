/*
*  分组管理
* */

$(function () {
    $(".ML-link").click(
        function (e) {
            util.qjgTips($(this),".qgj-tips");
            util.stopPropagation(e);
        }
    );
});