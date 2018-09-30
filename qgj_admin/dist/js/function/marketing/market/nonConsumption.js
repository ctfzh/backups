/**
 * 营销活动---未消费会员赠券
 */
$(function () {
    util.daterangepicker("time1",true);
    util.daterangepicker("time2",true);
    //7日
    $("#sevenMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(6))
    });
    //15日
    $("#thirtyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(29))
    });
    //30日
    $("#thirtyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(29))
    });

});
