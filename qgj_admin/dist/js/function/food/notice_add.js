/**
 * 公告
 */

$(function () {
    $('.js-post-title').on('keyup', function () {
        $("#postContent").html($(this).val());
    });
});
