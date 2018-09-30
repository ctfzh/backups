/**
 * 营销活动
 */
$(function () {
    //活动时间切换
    util.radioToggle('time_active_type', '.js-times');

    // 时间插件,
    util.daterangepicker("time", false);

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

    //支付渠道选择
    $(".js-example-basic-multiple").select2();

    //支付即会员---选择收款账号弹出框
    $('#btnMPMSure').on('click', function () {
        var $checkbox = $('input[name="checkNname"]:checked');
        var value = getMPMId($checkbox);
        $(".MPMAccount-place").html(value.split("&")[0]);
        $(".js_MPMAccount_input").val(value.split("&")[1])
    });
    //删除微信商户号
    $(document).on('click', '.js_MPMAccount_del', function () {
        var $inputSel = $('.js_MPMAccount_input');
        var v = $(this).prev().html() + ",";
        var newVal = $inputSel.val().replace(v, '');
        $(this).parent().remove();
        $inputSel.val(newVal);
    });
    //得到微信商户号并赋值
    function getMPMId(checkboxArr) {
        var temp = '';
        var idArr = '';

        $.each(checkboxArr, function (i, event) {
            temp += '<li>微信商户号: <span>' + $(event).val() + '</span> <a href="javascript:;" class="ml5 js_MPMAccount_del">删除</a></li>';
            idArr += $(event).val() + ",";
        });

        return temp + '&' + idArr;
    }

    // 选择微信商户号弹出框显示时执行方法
    $('#modalMPMAccount').on('show.bs.modal', function () {
        setMPMId();
    });

    // 根据现有的值对弹出框进行勾选
    function setMPMId() {
        var v = $('.js_MPMAccount_input').val();
        var checkbox = $("#modalMPMAccount input").prop("checked",false);
        var vArr = v.split(",");
        for (var i = 0, len = vArr.length; i < len - 1; i++) {
            for (var j = 0, len1 = checkbox.length; j < len1; j++) {
                if (vArr[i] == checkbox[j].value) {
                    checkbox[j].checked = true;
                }
            }
        }
    }

});

$.validator.addMethod("checkMoneyBit",function(value,element,params){
    var checkCode = /^[0-9]+(.[0-9]{1,2})?$/;
    return this.optional(element)||(checkCode.test(value));
},"请输入正数，精确到小数点后2位");

$(function () {
    $("#submit").click(function () {
        if(validate.form()){

        }
    });
});

var validate = $("#createForm").validate({
    debug: false, //调试模式取消submit的默认提交功能
    rules:{
        title:{
            required: true,
            maxlength: 30
        },
        recharge_money:{
            required: true,
            checkMoneyBit:true
        },
        give_money:{
            required: true,
            checkMoneyBit:true
        },
        time:{
            required: true
        }
    },
    messages:{
        title:{
            required:"活动名称必填",
            maxlength:"活动名称最多为30个字"
        },
        recharge_money:{
            required:"充值金额必填"
        },
        give_money:{
            required: "赠送金额必填"
        },
        time:{
            required: "活动时间必选"
        }
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent());
    },
    errorClass: "text-danger"
});