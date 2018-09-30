/**
 * 免配送费
 */

$(function () {
    // 免费送费活动是否开启
    $(".js-isOpen").change(function () {
        if ($(this).val() == "1") {
            $(".js-openWrap").show();
            $("#money-error").show();
        } else {
            $(".js-openWrap").hide();
            $("#money-error").hide();
        }
    });

    //表单提交
    $("#button").click(function () {
        if (validate.form()) {
            console.log(2);
        }
    });
});

jQuery.validator.addMethod("isMoney", function (value, element) {
    var diagit = /(^[1-9]\d*(\.\d{1,2})?$)|(0(\.\d{1,2})$)/;
    return this.optional(element) || (diagit.test(value));
}, "请输入正数，精确到小数点后两位");

jQuery.validator.addMethod("isMaxlength", function (value, element) {
    var length = value.length;
    return this.optional(element) || (value.indexOf(".")>0 && length < 9 || (value.indexOf(".")<0 && length < 6));
}, "最多可输入5位数");

//表单验证
var validate = $("#form").validate({
    debug: false, //调试模式为true则只本地调试
    rules: {
        money: {
            required: true,
            isMoney: true,
            isMaxlength: true
        }
    },
    messages: {
        money: {
            required: '请设置优惠条件',
            isMoney: '请设置正确的优惠条件',
            isMaxlength: '最多可输入5位数'
        }
    },
    errorPlacement: function (error, element) {
        error.appendTo(element.parent().parent());
    },
    errorClass: "text-danger",
});