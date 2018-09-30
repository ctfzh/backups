/**
 * 拼团
 */

$(function () {
    util.ckAll('.js-single-ck','.js-all-ck'); //全选/单选
    util.ckAll('.js-single-ck1','.js-all-ck1'); //全选/单选
    util.ckReserve('.js-single-ck','.js-all-ck','.js-inverse-ck'); //反选

    //选择活动商品步骤切换
    $(".js-discount-step li").click(function () {
        var index = $(this).index();
        $(this).siblings().removeClass("active").end().addClass("active");
        $(this).parent().next().children().hide().eq(index).show();
        $(".js-batch").remove(); //去除批量设置弹出框
    });

    // 帮助提示
    var layerIndex = '';
    $(".qgj-help").hover(
        function () {
            layerIndex = layer.tips($(this).attr("data-value"), $(this), {
                tips: [1, '#000'],
                area: "250px",
                time: 0
            });
        },
        function () {
            layer.close(layerIndex);
        }
    );

    //修改批量拼团价
    util.pointPop({
        obj:'#batchDiscount',
        temp_inputID: 'batchDiscountInput',
        temp_btnID: 'js-save1',
        tbody_id: "#activity_goods_list",   //商品选择后放置商品的id
        single_ck : '.js-single-ck1',  //table里单选框的值
        btn: '#js-save1',  //按钮名称
        callback: function (data) { //回调函数

            //获取输入框的值，赋值到拼团价输入框里面
            var value = $("#"+data.temp_inputID).val(),
                flag = util.check.isPositive(value);

            if(flag){
                $(".js-groupPrice-input").each(function () {
                    //对勾选的赋值
                    if($(this).parents("tbody").find("input[type='checkbox']").prop("checked")) {
                        priceVal = $(this).parents("tr").find(".js-price").html();
                        changeDiscount($(this), value, "0");

                        //假如输入的值小于当前商品的价格，则赋值，否则提示错误，并终止循环
                        if (priceVal - value > 0) {
                            changeDiscount($(this), value, "1");
                            $(this).focus();
                        } else {
                            layer.msg("拼团价设置有误，请重新设置");
                            return false;
                        }
                    }
                });

                $(".js-batch").remove();
            }else{
                layer.msg("请输入大于0的二位小数")
            }
        }
    });

    //修改批量团长优惠价格
    util.pointPop({
        obj:'#batchSale',
        temp_inputID: 'batchSaleInput',
        temp_btnID: 'js-save2',
        tbody_id: "#activity_goods_list",   //商品选择后放置商品的id
        single_ck : '.js-single-ck1',  //table里单选框的值
        btn: '#js-save2',  //按钮名称
        callback: function (data) {//回调函数
            //获取输入框的值，赋值到折扣输入框里面
            var value = $("#"+data.temp_inputID).val(),
                flag = util.check.isGreaterZero(value),
                $price = '',
                value1 = ''; //减价后值;

            if(flag){
                $(".js-groupOwnerPrice-input").each(function () {
                    priceVal = $(this).parents("tr").find(".js-price").html();

                    //对勾选的赋值
                    if($(this).parents("tbody").find("input[type='checkbox']").prop("checked")) {
                        //假如输入的值小于当前商品的价格，则赋值，否则提示错误，并终止循环
                        if (priceVal - value > 0) {
                            changeDiscount($(this), value, "1");
                            $(this).focus();
                        } else {
                            layer.msg("团长优惠价设置有误，请重新设置");
                            return false;
                        }
                    }
                });
                $(".js-batch").remove();
            }else{
                layer.msg("请输入大于0的数字")
            }
        }
    });

    //”打折“值改变后
    var prevVal = ''; //保持之前的值
    $(document).on("change", ".js-groupPrice-input", function () {
        changeDiscount($(this), $(this).val(), "0", prevVal);
    });

    //”减价“值改变后
    $(document).on("change", ".js-groupOwnerPrice-input", function () {
        changeDiscount($(this), $(this).val(), "1", prevVal);
    });
});

/*
* 同一个商品里面的打折，减价，打折后的值改变
* @param: 当前要改变值的对象
* @param: 赋值给当前对象的值
* @param: 类型：0-拼团对象，1-团购优惠对象
* */
function changeDiscount(o, value, type, prevVal) {
    var $tr = o.parents("tbody"),  //以tbody循环
        $price = $tr.find(".js-price"),
        priceVal = parseFloat($price.html()), //原价
        $discountInput = $tr.find(".js-groupPrice-input"),  //拼团价
        $salingInput = $tr.find(".js-groupOwnerPrice-input"),  //团长优惠价
        value = parseFloat(value ? value : 0),
        value1 = 0;

    //只对选中的赋值
    if($tr.find(".qkj-checkbox").prop("checked")) {
        switch (type) {
            case "0" :
                value1 = parseFloat((priceVal * value * 10 / 100).toFixed(2)); //拼团
                o.val(value.toFixed(2)); //当前对象赋值
                break;
            case "1":
                value1 = parseFloat((priceVal - value).toFixed(2)); //团长优惠价
                o.val(value.toFixed(2)); //当前对象赋值

                break;
            default:
        }
    }
}
