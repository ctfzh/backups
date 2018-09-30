$(function () {

    util.daterangepicker('time1');
    util.daterangepicker('time2',true);
    //今日
    $(".todayMoment").click(function(){
        $("#time1").val(util.getDayRange(0))
    });
    //昨日
    $(".yesterdayMoment").click(function(){
        $("#time2").val(util.yesterday());
    });

});