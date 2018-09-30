/**
 *  分享赠券
 */
$(function () {
    //分享设置切换
    util.radioToggle('jsShareCouponFR', '.jsShareCouponFW');

    //分享赠券页面---关注公众号
    $('.jsConcernMP').on('change', function () {
        if($(this).prop('checked')){
            $(this).parent().next().show();
        }else{
            $(this).parent().next().hide();
        }
    });
});