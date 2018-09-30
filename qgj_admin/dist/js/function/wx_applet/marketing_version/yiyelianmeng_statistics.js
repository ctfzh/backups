/*异业联盟报表*/

$(function () {
    //时间
    util.daterangepicker("time", false);
    //7日
    $(".sevenMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input[type='text']").val(util.getDayRange(7,-1))
    });
    //15日
    $(".fifthMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input[type='text']").val(util.getDayRange(15,-1))
    });
    //30日
    $(".thirtyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input[type='text']").val(util.getDayRange(30,-1))
    });
});