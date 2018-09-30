/**
 * 财务
 */
$(function () {
    //时间
    util.daterangepicker("time", false)
    //今日
    $("#todayMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(0))
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

    //$('#time').data('daterangepicker').setStartDate('2014-03-01'); //初始化时间插件的开始时间
    //$('#time').data('daterangepicker').setEndDate('2014-03-31'); //初始化时间插件的结束时间

    // 交易汇总（月汇总/日汇总切换）
    $('[role="presentation"]').on('click', function (index) {
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parent().next().children().hide().eq(index).show();
    });

    // 存在的情况下才会加载时间插件
    if($("#month1").length){
        util.datepicker("month1");
        util.datepicker("month2");
    }

    //支付渠道选择
    $(".js-example-basic-multiple").select2({
        "width": 'auto'
    });

    //伸展明细
    util.toggleStretch('.toggleStretch','.qgj-detail');

    //财务汇总明细展开收缩
    (function(){
        var $clickElem = $(".toggleTdStretch");
        $clickElem.click(function () {
            $targetElem = $(this).parents("tr").next();
            if($targetElem.is(":visible")){
                $targetElem.slideUp();
                $(this).html('展开 <i class="icon-pull-down"></i>');
            }else{
                $targetElem.slideDown();
                $(this).html('收起 <i class="icon-pull-up"></i>');
            }
        })
    })();

    //退款id赋值到弹出框的隐藏域里
    $('.refund-link').click(function () {
        var value = $(this).attr('data-value').split(",");
        for(var i=0,len=value.length; i < len; i++){
            if(i == 0){
                $("#account_id").val(value[i]);
            }else{
                $('.refund-content').eq(i-1).html(value[i]);
            }
        }
    });

});