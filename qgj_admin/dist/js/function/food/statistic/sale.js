/**
 * 销售统计
 */

$(function () {
    //时间
    util.daterangepicker("time", false);
    //昨日
    $(".yesterdayMoment").click(function(){
        $("#time").val(util.yesterday());
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
    });
    //7日
    $("#sevenMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(6))
    });
    //30日
    $("#thirtyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(29))
    });

    // 帮助提示
    var layerIndex = '';
    $(".qgj-help").hover(
        function () {
            layerIndex = layer.tips($(".tips").html(), $(this), {
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