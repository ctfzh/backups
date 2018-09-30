/**
 * 首页设置
 */

$(function () {
    $(".ui-sortable").sortable({
        items: ".sort",
        stop: function( event, ui ) {
            //$(ui.item).trigger('click');
        }
    });

});