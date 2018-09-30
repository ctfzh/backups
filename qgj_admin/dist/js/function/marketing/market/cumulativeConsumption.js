/**
 * Created by Bei on 2017/6/7.
 */

$(function () {
    //活动规则初始化
    activeRule('.js-add-rule','.js-del-rule');

    //给当前选择的优惠券anniu添加唯一标识
    util.addOnlyId('reset-coupon','couponActive');

    //表单提交
    $("#button").click(function () {
        fnAddRule();
        if (validate.form() && buildRule() && fnAddRule()) {
            $("#button").attr('disabled', 'disabled');
            $("#formStore").submit();
        }
    });

    // 检查添加的数据是否重复
    var t = new checkSingleControl({
        classname: '.inputname', //下拉框/文本框的样式名
        button: '#button',    //提交保持的按钮id
        errorClass: '.rule-error', //错误提示对象的样式名
        errorText: '消费金额不能重复，请重新填写',  //错误提示的内容
        buttonAdd: '.js-add-rule',  //添加规则的样式名
        buttonDel: '.js-del-rule'   //删除规则的样式名
    });
});

//活动时间类型选择
$('input[name="time_type"]').change(function () {
    var val = $(this).attr('data-index');
    if (val == '0') {
        $('.js-times').hide();
    } else {
        $('.js-times').show();
    }
});

//时间插件
$("#time").daterangepicker({
    timePicker: false,
    singleDatePicker: false,
    format: "YYYY/MM/DD",
    autoUpdateInput:true,
    minDate: moment()
});

//优惠券选择后，把值赋给隐藏域
$('#btnCouponSure').on('click', function () {
    var $radio = $('input[name="radioCoupon"]:checked');
    var $next = $radio.parent().next();
    if ($radio.length) {
        var name = $next.html();
        $(".couponActive").text('重新选择');
        $(".couponActive").prev().html(name).show();
        $(".couponActive").next().val($radio.val());
    }
});

//赠券提示验证
function fnAddRule() {
    var flag = false, len = '';
    $(".js-rule-con textarea").each(function () {
        len = $(this).next().length;
        if($(this).val()){
            if(len){
                $(this).next().remove();
            }
            flag = true;
        }else{
            if(len < 1){
                $(this).after('<div class="text-danger">请填写赠券提示</div>');
            }
            flag = false;
        }
    });
    $(document).on("change",".js-rule-con textarea", function () {
        len = $(this).next().length;
        if($(this).val()){
            if(len){
                $(this).next().remove();
            }
            flag = true;
        }else{
            if(len < 1){
                $(this).after('<div class="text-danger">请填写赠券提示</div>');
            }
            flag = false;
        }
    });
    return flag;
}

//组装活动规则
function buildRule() {
    var data = [];
    var money = '';
    var coupon_id = '';
    var coupon_name = '';
    var receive_tip = '';
    var json = '';
    var flag = 1;
    $(".js-rule-con").each(function () {
        money = $(this).find('input[id="money"]').val();
        coupon_id = $(this).find('input[id="coupon_id"]').val();
        coupon_name = $(this).find('span[id="coupon_name"]').html();
        receive_tip = $(this).find('textarea[id="receive_tip"]').val();

        if (money == '' || coupon_id == '' || coupon_name == '' || receive_tip == '') {
            flag = 2;
        } else {
            json = {money: money, coupon_id: coupon_id, coupon_name: coupon_name, receive_tip: receive_tip};
            data.push(json);
        }
    });

    data = JSON.stringify(data);
    $('input[name="rule"]').val(data);
    if (flag === 1) {
        return true;
    } else {
        return false;
    }
}

/** 表单验证 */
$.validator.addMethod("checkTime",function(value,element,params){
    var time_type = $('input[name="time_type"]:checked').val();
    if (time_type == 1) {
        return true;
    }
    if (time_type == 2 && value != '') {
        return true;
    }
    return false;
}, "请选择活动时间");

var validate = $("#formStore").validate({
    debug: false, //调试模式取消submit的默认提交功能
    rules:{
        title:{
            required:true,
            maxlength: 64
        },
        time_type: {
            required: true
        },
        time:{
            checkTime:true
        }
    },
    messages:{
        title:{
            required: "请填写活动名称",
            maxlength: '活动名称最多{0}个字'
        },
        time_type: {
            required: '请选择活动时间类型'
        }
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent());
    },
    errorClass: "text-danger mt5",
    ignore: ''
});