/*
 *  用户详情
 * */

$(function () {
    //备注修改
    util.remarkClick(".remark-group");

    $("#time").daterangepicker({
        timePicker:false,
        singleDatePicker:false,
        format:"YYYY/MM/DD"
    })
});
