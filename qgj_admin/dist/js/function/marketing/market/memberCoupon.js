/**
 * 营销活动---
 */
$(function () {
    //活动时间切换
    util.radioToggle('time_active_type', '.js-times');

    //活动对象勾选的总人数计算
    $('input[name="inputGrade"]').click(function () {
        var total = 0;
        $('input[name="inputGrade"]:checked').each(function () {
            total += Math.round($(this).next().html())
        });
        $(this).parent().parent().find('.total span').html(total)
    });

    $('#time').daterangepicker({
        timePicker: true,
        singleDatePicker: true,
        format: "YYYY/MM/DD HH:mm:ss",
        autoUpdateInput:true,
        startDate: moment()
    });


    var data = "123123,213,12312,312,3,Cat,cat,dsfsdfs,";
    var aa = 'dsfsdfs,';
    console.log(data.replace(new RegExp(aa,'g'),""));
});