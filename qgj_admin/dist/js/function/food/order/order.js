$(function () {
    //时间
    $('#time').daterangepicker({
        timePicker: false,
        singleDatePicker: false,
        format: "YYYY/MM/DD",
    });

    $(".js-remark").click(function () {
        var order_no = $(this).attr("data-id");
        var value = $("#remark" + order_no).html();
        layer.prompt({title: '备注', formType: 2, maxlength: 100, value: value}, function (pass, index) {
            $.ajax({
                url: '/catering/order/remark.html',
                type: 'get',
                dataType: "json",
                async: false,
                data: {order_no: order_no, remark: pass},
                success: function (data) {
                    $("#remark" + order_no).html(pass);
                    $("#remark" + order_no).parent().parent().show();
                }
            });
            layer.close(index);
        });
    });

    //今日
    $("#todayMoment").click(function () {
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(0));
        $('#time').data('daterangepicker').setStartDate(moment().startOf('day'));
        $('#time').data('daterangepicker').setEndDate(moment());
        $("input[name=timetype]").val('todayMoment');
    });
    //7日
    $("#sevenMoment").click(function () {
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(6, 0));
        $('#time').data('daterangepicker').setStartDate(moment().subtract('days', 6));
        $('#time').data('daterangepicker').setEndDate(moment());
        $("input[name=timetype]").val('sevenMoment');
    });
    //30日
    $("#thirtyMoment").click(function () {
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(29, 0));
        $('#time').data('daterangepicker').setStartDate(moment().subtract('days', 29));
        $('#time').data('daterangepicker').setEndDate(moment());
        $("input[name=timetype]").val('thirtyMoment');
    });
});

//取消订单
function CancelOrder(order_no) {
    layer.confirm('确定要取消订单吗？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            'type': 'get',
            'url': '/catering/order/cancel.html',
            'data': {order_no: order_no},
            'success': function (data) {
                var obj = eval('(' + data + ')');
                if (obj.errCode == 0) {
                    layer.msg('取消订单成功');
                    location.reload();
                } else {
                    layer.msg(obj.errMsg);
                }
            }
        });
    }, function () {

    });
}

//详情添加备注
function SetRemark(order_no) {
    layer.prompt({title: '备注', formType: 2}, function (pass, index) {
        $.ajax({
            url: '/catering/order/remark.html',
            type: 'get',
            dataType: "json",
            async: false,
            data: {order_no: order_no, remark: pass},
            success: function (data) {
                $("#admin_remark").html(pass);
                $("#admin_remark_div").show();
            }
        });
        layer.close(index);
    });
}