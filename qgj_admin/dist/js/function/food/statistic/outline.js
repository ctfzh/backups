/**
 * 营业概要
 */

$(function () {
    //时间
    util.daterangepicker("time", false);
    //昨日
    $(".yesterdayMoment").click(function(){
        $(this).parent().find(".time").val(util.yesterday());
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
    });
    //7日
    $(".sevenMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find(".time").val(util.getDayRange(7,-1))
    });
    //15日
    $(".fifthMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find(".time").val(util.getDayRange(15,-1))
    });
    //30日
    $(".thirtyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find(".time").val(util.getDayRange(30,-1))
    });

    $('.store-pop').on('shown.bs.modal', function (e) {
        $("#btnStoreSure").attr("data-index", e.relatedTarget.dataset.index);
    });

    // 帮助提示
    $(".qgj-help").each(function (i) {
        var layerIndex = '';
        $(this).hover(
            function () {
                layerIndex = layer.tips($(".tips"+(i+1)).html(), $(this), {
                    tips: [1, '#f8f8f8'],
                    area: "500px",
                    time: 0
                });
            },
            function () {
                layer.close(layerIndex);
            }
        );
    });
});
