/**
 * 储值活动
 */
$(function () {
    // 时间插件,
    util.daterangepicker("time", false);

    //支付渠道选择
    $(".js-example-basic-multiple").select2();

    $(".js-open-online").click(function () {
        layer.tips('线上储值活动页面未编辑，请编辑完成后开启',$(this))
    });

    //赠送优惠券查看
    $('.check-coupon').on('click',function () {
        layer.tips($(this).attr('data-value'), $(this), {
            tips: [1, '#3595CC'],
            time: 2000
        });
    });
});


