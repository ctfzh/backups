/*
 *  会员中心设置
 * */

$(function () {
    // 颜色选择
    $("input[name='coverRadio']").click(function () {
        var index = parseInt($(this).attr('data-index')) + 1;
        $(".card-cover").hide();
        $("#js-card-cover-type" + index).show();
    });
    $(".js-DropdownBt").click(function (e) {
        util.stopPropagation(e);
        $(this).parent().addClass('open');
    });
    $(".js-dropdownList li").click(function (e) {
        $(this).parent().parent().removeClass('open');
        var color = $(this).find("a").attr('data-value');
        $(".js-bt-label").css({'background-color': color, 'background-image': 'none'}).html(color);
        $("#jsCardPic").css({'background-color': color, 'background-image': 'none'});
        if($("input[name='color']")){
            $("input[name='color']").val(color)
        }
    });
    $(document).click(function () {
        $("#js-colorpicker").removeClass('open');
    });
});
