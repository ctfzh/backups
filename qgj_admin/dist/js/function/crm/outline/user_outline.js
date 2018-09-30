/*
 * 用户增长
 * */

$(function () {

    util.daterangepicker("time1",true);
    util.daterangepicker("time2",true);
    //7日
    $("#sevenMoment1").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time1").val(util.getDayRange(7,-1))
    });
    //15日
    $("#fifthMoment1").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time1").val(util.getDayRange(15,-1))
    });
    //30日
    $("#thirtyMoment1").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time1").val(util.getDayRange(30,-1))
    });

    //7日
    $("#sevenMoment2").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time2").val(util.getDayRange(7,-1))
    });
    //15日
    $("#fifthMoment2").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time2").val(util.getDayRange(15,-1))
    });
    //30日
    $("#thirtyMoment2").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time2").val(util.getDayRange(30,-1))
    });
});