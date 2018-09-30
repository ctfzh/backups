/**
 * 活动管理列表
 */
$(function () {
    $(".ML-link").click(
        function (e) {
            util.qjgTips($(this),".qgj-tips");
            util.stopPropagation(e);
        }
    );
    //除弹出框对象外的地区点击则隐藏
    $(document).bind('click',function () {
        $(".qgj-tips").hide();
    });

    //弹出对象显示
    $(".qgj-tips").bind('click',function (e) {
        util.stopPropagation(e);
    });
});
