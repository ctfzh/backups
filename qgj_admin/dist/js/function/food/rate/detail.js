/**
 * 评分管理详情
 */


$(function () {
    //时间
    util.daterangepicker("time", false);

    // 帮助提示
    var layerIndex = '';
    $(".qgj-help").hover(
        function () {
            layerIndex = layer.tips($(this).attr("data-value"), $(this), {
                tips: [1, '#000'],
                area: "260px",
                time: 0
            });
        },
        function () {
            layer.close(layerIndex);
        }
    );
    $("#time").on('apply.daterangepicker',function(){
        console.log(1)

    });
    $("#time").on('cancel.daterangepicker',function(){
        console.log(2)

    });
    $("#time").on('clean.daterangepicker',function(){
        console.log(3)
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
    //30日
    $("#ninetyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(89))
    });
});