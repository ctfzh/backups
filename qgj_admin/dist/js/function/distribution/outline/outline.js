/**
 * 分销概况
 */
$(function () {
    //7日
    $(".sevenMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(6))
    });
    //30日
    $(".thirtyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(29))
    });
});

