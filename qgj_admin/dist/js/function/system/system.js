$(function () {
    //微信支付设置--商户类型选择
    $("input[name='merchantType']").click(function () {
        if ($(this).val() === "0") {
            $(".ordinaryMerchant").hide();
        } else {
            //普通商户情况下
            $(".ordinaryMerchant").show();
        }
    });

    //时间
    var aa = $('#time').daterangepicker({
        timePicker: false,
        opens: 'right',
        format: 'YYYY/MM/DD',
        dateLimit: true,
        maxDate: moment()
    });

    //支付宝设置支付宝收款账号 备注内容可点击
    $(".addRemark").click(function () {
        var html = $(this).html();
        $(this).removeClass("show").addClass("hide");
        $(this).prev().removeClass("hide").addClass("show");
    })
    $(".btnRemark").click(function () {
        var v = $(this).prev().val() || '添加备注';  //获取值
        var account_id = $(this).parent().parent().find("input[type='hidden']").val();
        var remark_html = $(this).parent().next().html();
        $(this).parent().removeClass("show").addClass("hide");
        $(this).parent().next().html(v).removeClass("hide").addClass("show");
    })
});