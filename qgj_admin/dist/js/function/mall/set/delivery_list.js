/**
 * 快递配送页
 */

$(function () {
    //伸展快递模板
    $(".toggleStretch").click(function () {
        var $targetElem = $(this).parents("table").find(".qgj-detail");
        if ($targetElem.is(":visible")) {
            $targetElem.hide();
            $(this).html('展开');
        } else {
            $targetElem.show();
            $(this).html('收起');
        }
    });
});
