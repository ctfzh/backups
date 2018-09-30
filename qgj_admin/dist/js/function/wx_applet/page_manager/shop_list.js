$(function () {
    $(".ML-link").click(
        function (e) {
            util.qjgTips($(this),".qgj-tips");
            util.stopPropagation(e);
        }
    );
    //除弹出框对象外的地区点击则隐藏
    $(".qgj-tips .close").click(function (e) {
        $(this).parent().hide()
    });

    //复制路径
    util.pathPop('.js-path-pop','right','http://www.qinguanjia.com');
});