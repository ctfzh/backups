/**
 * 储值结算
 */
$(function () {
    //日报表时间选择
    util.layDate.getTime({
        elem: '#time',
        format: 'yyyy/MM/dd'
        , range: true
    });
    //月报表月份选择
    util.layDate.getTime({
        elem: '#month'
        , type: 'month'
        , format: 'yyyy/MM'
        , range: true
    });

    //日期类型切换,把之前隐藏掉的元素禁用掉
    $(".js-type-switch").on('change', function () {
        if ($(this).val() == '1') {
            $(".form-group-day")
                .removeClass('hide')
                .find('input, button').removeAttr('disabled', 'disabled');
            $(".form-group-month")
                .addClass('hide')
                .find('input, button').attr('disabled', 'disabled');
        } else {
            $(".form-group-month")
                .removeClass('hide')
                .find('input, button').removeAttr('disabled', 'disabled');
            $(".form-group-day")
                .addClass('hide')
                .find('input, button').attr('disabled', 'disabled');
        }
    })
});
