/*
 * 用户列表
 * */

$(function () {
    //备注修改
    $(".remark-group").each(function () {
        util.remarkClick($(this));
    });

    //静态分组添加
    $(".jsULCreateGroup").click(function () {
        $(this).hide().next().show();
    });
    $(".jsULCancelGroup").click(function () {
        $(this).parent().hide().prev().show();
    });
    $(".jsULAddGroup").click(function () {
        $(this).parent().hide().prev().show();
        $(this).prev().val()
    });

});
