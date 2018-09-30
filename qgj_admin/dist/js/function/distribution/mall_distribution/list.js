/**
 * 商城分销
 */

$(function () {
    //全选/单选
    util.ckAll('.js-single-ck','.js-all-ck');

    //弹出框显示
    $('#modalCommission').on('shown.bs.modal', function (e) {
        var $account_id = $("#account_id"),
            val = '';

        //判断是否是批量设置佣金
        if(!e.relatedTarget){
            var firstdefault = 0;
            var seconddefault = 0;
            $(".js-single-ck").each(function () {
                if($(this).prop("checked")){
                    val += $(this).parents("tr").find(".js-set").attr("data-id") + ',';
                }

                firstdefault = $(this).parents("tr").find(".js-set").attr("data-firstdefault");
                seconddefault = $(this).parents("tr").find(".js-set").attr("data-seconddefault");
            });
            $account_id.val(val);
            $("#default_first").html(firstdefault);
            $("#default_secound").html(seconddefault);
            val = '';
        }else{
            $account_id.val(e.relatedTarget.dataset.id);

            //显示编辑内容
            var distrStatus = e.relatedTarget.dataset.distrstatus;
            var rateType = e.relatedTarget.dataset.ratetype;
            var firstStage = e.relatedTarget.dataset.firststage;
            var secondStage = e.relatedTarget.dataset.secondstage;
            var firstDefault = e.relatedTarget.dataset.firstdefault;
            var secondDefault = e.relatedTarget.dataset.seconddefault;

            //是否参与推广 1不参与 2参与
            if(distrStatus == 2){
                $("#join").prop("checked", true);
                $("#unjoin").prop("checked", false);
            }else {
                $("#join").prop("checked", false);
                $("#unjoin").prop("checked", true);
            }

            //是否默认比例 1默认 2自定义
            if(rateType == 1){
                $("#default").prop("checked", true);
                $("#free").prop("checked", false);
            }else{
                $("#default").prop("checked", false);
                $("#free").prop("checked", true);
            }

            //默认佣金比例
            $("#default_first").html(firstDefault);
            $("#default_secound").html(secondDefault);

            //佣金比例
            $("input[name='first_stage_commission_rate']").val(firstStage);
            $("input[name='second_stage_commission_rate']").val(secondStage);

            val = '';
        }
    });

    $("#btnCommission").click(function () {
        if(validate.form()){
            $("#payset").submit();
        }
    });

    //未选择分销商品大的时候做提示
    $(".js-batch-set").click(function () {
        if($(".js-single-ck:checked").length > 0){
            $("#modalCommission").modal("show");
        }else{
            layer.msg("未选中商品");
        }
    })
});

jQuery.validator.addMethod("isMoney", function(value, element) {
    // var diagit = /^[0-9]{1,2}?$/;
    var diagit = /^\d*\.{0,1}\d{0,1}$/;
    return diagit.exec(value) != null;
}, "请输入两位以内正数,最多保留一位小数");

jQuery.validator.addMethod("checkSelect", function(value, element) {
    return $("#default").is(":checked") || $("#free").is(":checked");
}, "请选择佣金比例类型");

jQuery.validator.addMethod("checkFirstStage", function(value, element) {
    return $("#free").is(":checked") && $("input[name='first_stage_commission_rate']").val() != '' || !$("#free").is(":checked");
}, "请输入一级佣金比例");

jQuery.validator.addMethod("checkSecondStage", function(value, element) {
    return $("#free").is(":checked") && $("input[name='second_stage_commission_rate']").val() != '' || !$("#free").is(":checked");
}, "请输入二级佣金比例");

jQuery.validator.addMethod("checkStageSum", function(value, element) {
    var first = $("input[name='first_stage_commission_rate']").val();
    var second = $("input[name='second_stage_commission_rate']").val();
    if(first == ''){
        first = 0;
    }
    if(second == ''){
        second = 0;
    }
    return $("#free").is(":checked") &&  (parseFloat(first) + parseFloat(second)) <= 100 || !$("#free").is(":checked");
}, "佣金比例和不能超过100");

var validate = $("#payset").validate({
    debug: false, //调试模式为true则只本地调试
    rules: {
        'commission_rate_type': {
            checkSelect: true
        },
        'first_stage_commission_rate': {
            isMoney: true,
            checkFirstStage: true,
            checkStageSum: true
        },
        'second_stage_commission_rate':{
            isMoney: true,
            checkSecondStage: true
        }
    },
    messages: {

    },
    errorPlacement: function (error, element) {
        error.appendTo(element.parent());
    },
    errorClass: "text-danger",
    ignore: ''
});

$("#goods_type").click(function () {
    switch ($(this).val()) {
        case '1':
            $("#distr_status").val(1);
            $("#commission_rate_type").val('');
            break;
        case '2':
            $("#distr_status").val('');
            $("#commission_rate_type").val(2);
            break;
        default:
            $("#distr_status").val('');
            $("#commission_rate_type").val('');
            break;
    }
});