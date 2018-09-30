/**
 * 积分商城
 */

$(function () {
    addRules($("#free_sku_count").val());
    //点击复制链接
    $('.input-group-addon').click(function () {
        var url = $('#qrcode_url');
        url.select();
        document.execCommand("Copy"); // 执行浏览器复制命令
    });

    //点击隐藏二维码
    $('.close').click(function () {
        $(".qgj-tips").hide();
        $('#qrcode_div').hide();
        $('.img-responsive').attr('src', '');
        $('#download_qrcode').attr('href', '');
    });

    //点击链接显示二维码
    $(".ML-link").click(function () {
        var url = $(this).attr('data-url');
        var pos = $(this).offset();
        var top = $(this).height() + pos.top + 5;
        var left = pos.left - $(".qgj-tips").width()-90;
        $('#qrcode_url').val(url);
        $(".qgj-tips").css({
            left: left,
            top: top
        }).show();

        $("#qrcode_div").show();
        $(".img-responsive").attr('src', '/goods/goods/show-qrcode.html?url='+encodeURI(url));
    });

    //修改积分比例
    util.pointPop({
        obj:'.js-path-pop',
        temp_btnID: 'js-save1',
        temp_inputID: 'ratio',
        isValidate: false,
        callback: function (data) {//回调函数
            //询问框
            layer.confirm('确定要修改统一兑换比例吗？', {
                btn: ['确定','取消'] //按钮
            }, function(index){
                var ratio = $("#ratio").val();
                $.ajax({
                    url: '/integralmall/set/setsystemintegral.html',
                    type: 'get',
                    async: false,
                    data: {ratio: ratio},
                    success: function (data) {
                        data = JSON.parse(data);
                        if(data.errCode == 0){
                            $("#base_integral").html(data.data.system_bonus);

                            //重新计算每个商品所需积分
                            if($("#goods_sign").val() == 2){
                                //如果存在sku
                                $(".js-point-num").each(function () {
                                    var singal_price = $(this).parent().find("input[class='singal-sku-price']").val();
                                    var new_bonus = singal_price * data.data.system_bonus / 100;
                                    $(this).html(Math.ceil(new_bonus));
                                });
                            }else{
                                //如果不存在sku
                                //计算新商品积分
                                var bonus = parseInt(data.data.system_bonus) * parseInt($("#singal_goods_price").val()) / 100;
                                $("#goods_integral").html(Math.ceil(bonus));
                            }

                            $(".pop-point").hide();
                            layer.msg('保存成功');
                        }
                    }
                });
            });
        }
    });

    //时间选择
    $("#time").daterangepicker({
        timePicker: true,
        singleDatePicker: false,
        format: "YYYY/MM/DD HH:mm:ss",
        minDate: moment()
    });

    //全选/单选
    util.ckAll('.js-single-ck','.js-all-ck');
    util.ckAll('.js-single-ck2','.js-all-ck2');

    //积分价格
    $("input[name='pointRatio']").click(function () {
        $(".radio-next").hide(); // 隐藏全部已显示的输入内容的层
        $(this).parents(".point-ratio-type").find(".radio-next").show();
        $("#hiddenPointShopVal").val('');
        if($(this).attr("data-index") == 0){
            $(".js-path-pop").show();
            $(".js-uniform-scale").show();
            $("input[name='bonus']").val('');
            $("input[name='price']").val('');
        }else{
            $(".pop-point").hide();
            $(".js-uniform-scale").hide();
        }
    });

    /*
     * 判断存放积分值的对象是否存在，如果存在再判断当前选中的是“使用统一兑换比例”，还是“自定义兑换价格”,取到值存到一个数组里，然后赋值到一个隐藏域里
     * */
    $("#btnPointShop").click(function () {
        var arrs = [],
            obj = {},
            integral_sku_id = '',
            goods_sku_id = '',
            $price = '',
            $pointRatio = $("input[name='pointRatio']:checked");
        $pointNum = $pointRatio.parents(".point-ratio-type").find(".js-point-num"); //查找当前选中项下面是否有积分这个对象

        //如果能获取积分的对象存在
        if($pointNum.length){
            $pointNum.each(function () {
                $integral_sku_id = $(this).parents("tr").find(".js-integralSkuId");
                goods_sku_id = $(this).parents("tr").find(".js-goodsSkuId").val();
                $price = $(this).parents("tr").length ? $(this).parents("tr").find(".js-price-num") : $(this).parent().parent().find(".js-price-num");

                //如果有多选框存在，则执行以下方法
                if($integral_sku_id.length){
                    // 如果多选框选中了
                    if($integral_sku_id.prop("checked")){
                        obj.integral_sku_id = $integral_sku_id.val();
                        obj.goods_sku_id = goods_sku_id;
                        //如果是Input就用val()取，否则用html()
                        obj.bonus = $(this).val() ? $(this).val() : $(this).html();
                        //如果是Input就用val()取，否则用html()
                        obj.price = $price.val() ? $price.val() : $price.html();

                        arrs.push(obj);
                    }

                }else{ //如果没有多选框的情况下要执行的方法
                    obj.integral_sku_id = '';
                    obj.goods_sku_id = '';
                    //如果是Input就用val()取，否则用html()
                    obj.bonus = $(this).val() ? $(this).val() : $(this).html();
                    //如果是Input就用val()取，否则用html()
                    obj.price = $price.val() ? $price.val() : $price.html();

                    arrs.push(obj);
                }
                obj = {};
            });

            //如果存储的数据有 就存值，没有就提示
            if(arrs.length){
                $("#hiddenPointShopVal").val(JSON.stringify(arrs))
            }
            arrs = [];
        }

        //表单验证提交
        if(validator.form()){
            $("#form").submit();
            $("#btnPointShop").attr('disabled', true);
        }

    })
});

jQuery.validator.addMethod("isDiagitGoods", function(value, element) {
    var diagit = /^[1-9]\d*$/;
    var type_checked = $("#free_check").prop("checked");
    return (this.optional(element) || (diagit.test(value))) && (value != 0 && type_checked || !type_checked);
}, "请输入大于0的整数积分");
jQuery.validator.addMethod("isDiagit", function(value, element) {
    var diagit = /^[1-9]\d*$/;
    var is_checked = $(element).parents("tr").find(".js-integralSkuId").prop("checked");
    var type_checked = $("#free_check").prop("checked");
    return (this.optional(element) || (diagit.test(value))) && (value != 0 && is_checked || !is_checked || !type_checked);
}, "请输入正整数");
jQuery.validator.addMethod("isMoney", function(value, element) {
    var diagit = /^[0-9]+(.[0-9]{1,2})?$/;
    return this.optional(element) || (diagit.test(value));
}, "请输入大于0金额，可小数");


//动态添加表单的验证规则
function addRules(count_end){
    var count_start = 0;
    while (count_start <= count_end) {
        $("input[name='point["+ count_start +"]']").rules("add",{
            isDiagit: true
        });
        $("input[name='price["+ count_start +"]']").rules("add",{
            isMoney: true
        });
        count_start = count_start + 1;
    }
}

var validator = $("#form").validate({
    debug: false, //false状态表单就能提交
    rules:{
        time:{
            required: true
        },
        limit_num:{
            required: true
        },
        integral_json:{
            required: true
        },
        price:{
            isMoney:true
        },
        bonus:{
            isDiagitGoods:true
        }
    },
    messages:{
        time:{
            required: '请选择兑换时间'
        },
        limit_num:{
            required: '请填写兑换限制'
        },
        integral_json:{
            required: '请选择积分商品'
        }
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent());
    },
    errorClass: "text-danger",
    ignore: ''
});


//当勾选有动作时时清空隐藏域的值
$(".js-single-ck").click(function () {
    $("#hiddenPointShopVal").val('');
});
$(".js-single-ck2").click(function () {
    $("#hiddenPointShopVal").val('');
});