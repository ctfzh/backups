/**
 * 营销活动---老会员赠券
 */
$(function () {
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