/**
 * 点餐设置
 */

$(function () {
    // 点餐模式切换
    $(".js-mode-radio").change(function () {
        if ($(this).attr('data-index') == "0") {
            $(".js-mode").show();
        } else {
            $(".js-mode").hide();
        }
    });
    // 开启预约点餐
    $(".js-openOrder").change(function () {
        if ($(this).prop("checked")) {
            $(".js-openOrderSelect").show();
        } else {
            $(".js-openOrderSelect").hide();
        }
    });
    //点餐营业时间初始化
    new shophours({
        is24hours: false,  //是否显示24小时
        addText : '新增时间段'
    });

    $("#button").click(function () {
        getTimePickerVal();
    });

    // 帮助提示
    var layerIndex = '';
    $(".qgj-help").hover(
        function () {
            layerIndex = layer.tips($(this).attr("data-value"), $(this), {
                tips: [1, '#000'],
                area: "300px",
                time: 0
            });
        },
        function () {
            layer.close(layerIndex);
        }
    );
});