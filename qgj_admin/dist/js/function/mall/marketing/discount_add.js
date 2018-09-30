/**
 * 限时折扣添加
 */

$(function () {
    util.ckAll('.js-single-ck','.js-all-ck'); //全选/单选
    util.ckAll('.js-single-ck1','.js-all-ck1'); //全选/单选
    util.ckReserve('.js-single-ck','.js-all-ck','.js-inverse-ck'); //反选

    //时间
    layui.use('laydate', function() {
        var laydate = layui.laydate;

        initTime('#startTime1','#endTime1');
        initTime('#startTime2','#endTime2');
        initTime('#startTime3','#endTime3');

        function initTime(startTime,lastTime){
            var startStr = '';
            var start = {
                elem: startTime,
                type: 'time',
                done: function (date){
                    startStr = date;
                }
            };
            var end = {
                elem: lastTime,
                type: 'time',
                done: function (date){
                    console.log($(lastTime).val())
                }
            };

            laydate.render(start);
            laydate.render(end);
        }

    });

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

    //按周期循环
    $(".js-cycle-checkbox").click(function () {
        if($(this).prop("checked")){
            $(this).parent().next().show();
        }else{
            $(this).parent().next().hide();
        }
    });
    //重复周期 日/月/周 选择
    $("input[name='cycle-radio']")
        .on('change',function () {  //改变值的时候
            defaultWeek($(this));
        })
        .each(function () {  //默认加载
            defaultWeek($(this));
        });

    //选择每周的时间
    $(".js-week-item").click(function () {
        if(!$(this).hasClass("disabled") && $(this).hasClass("active")){
            $(this).removeClass("active");
        }else{
            $(this).addClass("active");
        }
    });

    //修改批量打折
    util.pointPop({
        obj: '#batchDiscount',
        temp_btnID: 'js-save1',
        temp_inputID: 'batchDiscountInput',
        tbody_id: "#activity_goods_list",   //商品选择后放置商品的id
        single_ck : '.js-single-ck1',  //表格里单选输入框
        btn: '#js-save1',  //按钮名称
        callback: function (data) {  //回调函数

            //获取输入框的值，赋值到折扣输入框里面
            var value = $("#"+data.temp_inputID).val(),
                flag = digitRegion(value);

            if(flag) {
                $(".js-discount-input").each(function () {
                    //对勾选的赋值
                    if($(this).parents("tr").find("input[type='checkbox']").prop("checked")){
                        changeDiscount($(this), value, "0");
                        $(this).focus();
                    }
                });

                $(".js-batch").remove();  //弹出框隐藏
            } else {
                layer.msg("请输入大于0小于10的一位小数")
            }
        }
    });

    //修改批量减价
    util.pointPop({
        obj: '#batchSale',
        temp_inputID: 'batchSaleInput',
        temp_btnID: 'js-save2',
        tbody_id: "#activity_goods_list",   //商品选择后放置商品的id
        single_ck : '.js-single-ck1',  //表格里单选输入框
        btn: '#js-save2',  //按钮名称
        callback: function (data) {//回调函数

            //获取输入框的值，赋值到折扣输入框里面
            var value = $("#"+data.temp_inputID).val(),
                flag = region2(value),
                value1 = ''; //减价后值;

            if (flag) {
                $(".js-saling-input").each(function () {
                    priceVal = $(this).parents("tr").find(".js-price").html();

                    //对勾选的赋值
                    if($(this).parents("tr").find("input[type='checkbox']").prop("checked")){
                        //假如输入的值小于当前商品的价格，则赋值，否则提示错误，并终止循环
                        if (priceVal - value > 0) {
                            changeDiscount($(this), value, "1");
                            $(this).focus();
                        } else {
                            layer.msg("减价设置有误，请重新设置");
                            return false;
                        }
                    }
                });
                $(".js-batch").remove();
            } else {
                layer.msg("请输入大于0的数字")
            }
        }
    });

    //”打折“值改变后
    var prevVal = ''; //保持之前的值
    $(document).on("change", ".js-discount-input", function () {
        changeDiscount($(this), $(this).val(), "0", prevVal);
    });
    $(document).on("focus", ".js-discount-input", function () {
        prevVal = $(this).val();
        $(this).parent().addClass("discount-set-focus").siblings().removeClass("discount-set-focus");
        changeDiscount($(this), $(this).val(), "0");
    });

    //”减价“值改变后
    $(document).on("change", ".js-saling-input", function () {
        changeDiscount($(this), $(this).val(), "1", prevVal);
    });
    $(document).on("focus", ".js-saling-input", function () {
        prevVal = $(this).val();
        $(this).parent().addClass("discount-set-focus").siblings().removeClass("discount-set-focus");
        changeDiscount($(this), $(this).val(), "1");
    });
});

/*
* 按周期重复的方法
* @param：radio对象
* */
function defaultWeek(o){
    if(o.prop("checked")){
        o.parents(".discount-cycle").find(".form-control, input[name='week_day']").attr("disabled","disabled");
        o.parent().next().find(".form-control, input[name='week_day']").removeAttr("disabled");
        if(o.attr("data-index") == "2"){
            $(".js-week-item").removeClass("disabled");
        }else{
            $(".js-week-item").addClass("disabled");
        }
    }
}

/*
* 同一个商品里面的打折，减价，打折后的值改变
* @param: 当前要改变值的对象
* @param: 赋值给当前对象的值
* @param: 类型：1-打折对象，2-减价对象，3-打折后对象
* */
function changeDiscount(o, value, type, prevVal) {
    var $tr = o.parents("tr"),  //以tr循环
        $price = $tr.find(".js-price"),
        priceVal = parseFloat($price.html()),
        $saledInput = $tr.find(".js-saled-input"),  //减价后
        value = parseFloat(value),
        value1 = '';

    //只对选中的赋值
    if($tr.find(".qkj-checkbox").prop("checked")){
        //切换”打折“和”减价“优惠方式
        $(this).parent().addClass("discount-set-focus").siblings().removeClass("discount-set-focus");
        switch (type) {
            case "0" :
                $saledInput.prev().html("打折后");
                value1 = parseFloat((priceVal*value*10/100).toFixed(2)); //打折后值

                o.val(value.toFixed(1)); //当前对象赋值
                $saledInput.val(value1.toFixed(2));

                break;
            case "1":
                $saledInput.prev().html("减价后");
                value1 = parseFloat((priceVal-value).toFixed(2)); //减价后值

                o.val(value.toFixed(2)); //当前对象赋值
                $saledInput.val(value1);

                break;
            default:
        }
    }

}

//验证0.1~9.9的折扣
function digitRegion(value) {
    //0(\.\d){1}：小数点一位
    //^[1-9](\.\d){0,1}：1到9的小数点或非小数点
    var reg = new RegExp(/^0(\.\d){1}$|^[1-9](\.\d){0,1}$/);
    return reg.test(value);
}

//减价和打折后金额验证
function region2(value){
    var reg = /^0\.([1-9]\d?|0[1-9])$|^[1-9]\d*(\.\d+){0,2}$/;
    return reg.test(value);
}
