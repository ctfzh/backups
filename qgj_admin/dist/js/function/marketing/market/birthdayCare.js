/**
 * 营销活动---生日关怀
 */
$(function () {
    //活动时间切换
    util.radioToggle('time_active_type', '.js-times');

    util.daterangepicker("time1",true);
    util.daterangepicker("time2",true);
    //7日
    $(".sevenMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input").val(util.getDayRange(7,-1))
    });
    //15日
    $(".fifthMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input").val(util.getDayRange(15,-1))
    });
    //30日
    $(".thirtyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input").val(util.getDayRange(30,-1))
    });

});
