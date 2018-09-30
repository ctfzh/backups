/**
 * 营销活动---会员升级赠券
 */
$(function () {
    //活动时间切换
    util.radioToggle('time_active_type', '.js-times');

    //活动规则初始化
    activeRule('.js-add-rule', '.js-del-rule');
    //给当前选择的优惠券anniu添加唯一标识
    util.addOnlyId('reset-coupon', 'couponActive');

    //会员升级统计
    util.daterangepicker("time1", true);
    util.daterangepicker("time2", true);
    //7日
    $(".sevenMoment").click(function () {
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input").val(util.getDayRange(7, -1))
    });
    //15日
    $(".fifthMoment").click(function () {
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input").val(util.getDayRange(15, -1))
    });
    //30日
    $(".thirtyMoment").click(function () {
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input").val(util.getDayRange(30, -1))
    });

    /*
     * 检查添加的数据是否重复
     * */
    var t = new checkSingleControl({
        ruleCon: '.js-rule-con', //每块规则区域的样式
        classname: '.selectname', //下拉框/文本框的样式名
        button: 'button',    //提交保持的按钮id
        errorClass: '.rule-error', //错误提示对象的样式名
        errorText: '会员等级不能选择重复，请重新选择',  //错误提示的内容
        buttonAdd: '.js-add-rule',  //添加规则的样式名
        buttonDel: '.js-del-rule'   //删除规则的样式名
    });

    //插入优惠券
    var c = new couponAdd({
        btn: '#btnCouponSure',
        checkboxName: 'checkboxCoupon',
        place: '.rule-active',
        inputHiddenId: '.coupon_id',
        numID: '.jsBCInputNum'
    });

});


//选取优惠券,并插入到table里
(function (window, $, undefined) {
    function couponAdd(options) {
        var defaults = {
            btn: '', //弹出框按钮点击对象
            checkboxName: '',  //多选框的name对象
            place: '', //放置数据的地方
            inputHiddenId: '', //放置选中对象的id组合
            numID: '' // input输入框验证
        };

        var opts = $.extend({}, defaults, options);

        this.init(opts);
    }

    couponAdd.prototype = {
        init: function (opts) {
            var _this = this;

            //弹出框按钮点击事件
            $(opts.btn).on('click', function () {
                //选中的id组合在一起放入这组里的一个隐藏域里
                $(opts.place).parent().parent().find(opts.inputHiddenId).val(_this.combId(opts.checkboxName));
                //生成一个tr，插入table里
                $(opts.place).parent().parent().find(".tbody").html(_this.createTr(opts.checkboxName));
                //把每组的优惠券数据组合在一起，并赋值给id=coupon_package里
                _this.combJson($('.rule-active'));
            });

            //删除tr, 删除后隐藏域值变更
            $(document).on('click', '.jsBCDelTR', function () {
                _this.delTr($(opts.place).parent().parent().find(opts.inputHiddenId), $(this));
            });

            //数量不能大于限制值,库存,只能输入数字
            $(document).on('change', opts.numID, function () {
                var data = $(this).attr("data-value").split(",");

                if($(this).val() && !util.check.digit($(this).val())){
                    layer.msg('只能输入数字');
                }else{
                    if(data){
                        if($(this).val() > parseInt(data[0])){
                            layer.msg('单张券的数量不能大于领取限制');
                        }else if($(this).val() > parseInt(data[1])){
                            layer.msg('单张券的数量不能大于库存');
                        }else{
                            _this.changeTdHidden($(this).next(),$(this).val());
                            _this.combJson($(this));
                        }
                    }
                }
                if(!$(this).val() || $(this).val() == '0'){
                    $(this).val("1")
                }
            });

            //加一个当前操作坐标，主要当优惠券弹出框点击确定后，给当前点击的“优惠券按钮”赋值
            $(document).on('click', 'a[href="#modalCoupon"]', function () {
                $(opts.place).removeClass('rule-active');
                $(this).addClass('rule-active');
                _this.changeCheckbox($(opts.place).parent().parent().find(opts.inputHiddenId), opts.checkboxName);
            });

        },
        changeTdHidden: function (that,num) { //当数量改变后，调用该方法调整隐藏域里的num值
            var obj = $.parseJSON(that.val()); //字符串转成json 对象
            obj.num = num;
            obj = JSON.stringify(obj);
            that.val(obj);
        },
        combJson: function (that) {  //把每组的优惠券数据组合在一起
            var $ruleCon = that.parents(".js-rule-con"),
                $hiddenJson = $ruleCon.find(".js-hiddenJson"),
                json = [];

            $hiddenJson.each(function () {
                json.push(JSON.parse($(this).val()));
            });
            $ruleCon.find("#coupon_package").val(JSON.stringify(json));
        },
        changeCheckbox: function (inputHiddenId, checkboxName) { // 把隐藏域coupon_id里有的值，显示弹出框默认勾选上
            var val = $(inputHiddenId).val();
            var checkbox = $('input[name="' + checkboxName + '"]');
            checkbox.prop("checked", false);

            if(val){
                val = val.substring(0,val.length-1).split(",");
                for(var i = 0, len=val.length; i < len; i++){
                    for(var j =0, len1 = checkbox.length; j < len1; j++){
                        if($(checkbox[j]).val() == val[i]){
                            $(checkbox[j]).prop("checked", true);
                        }
                    }
                }
            }
        },
        combId: function (name) { //组合id 然后赋值给文本编辑器
            var idArr = '';
            var checkbox = $('input[name="' + name + '"]:checked');
            $.each(checkbox, function () {
                idArr += $(this).val() + ',';
            });

            return idArr;
        },
        createTr: function (name) {
            var checkbox = $('input[name="' + name + '"]:checked');
            var valueObj = '';
            var tr = '';
            var tdHidden = {}; //每个tr里的对象--主要包括
            $.each(checkbox, function () {
                valueObj = $.parseJSON($(this).next().val()); //将json字符串转换成json对象
                tdHidden.card_id = $(this).val();
                tdHidden.num = 1;
                tdHidden = JSON.stringify(tdHidden);  //将json对象转换成json字符串
                tr += '<tr><td>' + valueObj.type + '</td>' + '<td>' + valueObj.name + '</td>' + '<td>' + valueObj.limit + '</td>' + '<td>' + valueObj.stock + '</td>' + '<td>' + valueObj.valid + '</td>' + '<td><input type="text" name="" value="1" class="form-control jsBCInputNum" size="1" maxlength="5" data-value="' + valueObj.limit + ',' + valueObj.stock + '"><input type="hidden" class="js-hiddenJson" value='+ tdHidden +'></td><td><a href="javascript:;" class="jsBCDelTR" data-value="' + $(this).val() + '">删除</a></td></tr>';
                tdHidden = {};  //对象初始化
            });
            return tr;
        },
        delTr: function (inputHiddenId, e) { //删除tr
            var id = e.attr("data-value") + ',',
                couponPackage = $(inputHiddenId).next(),
                couponPackage_val = JSON.parse(couponPackage.val());
            e.parents("tr").remove();
            $(inputHiddenId).val($(inputHiddenId).val().replace(id, ''));
            //删除数据组合里的对应数据
            $.each(couponPackage_val,function (i,o) {
                if(o.card_id && o.card_id == e.attr("data-value")){
                    couponPackage_val.splice(i,1);
                    return false;
                }
            });
            couponPackage.val(JSON.stringify(couponPackage_val));
        }
    };
    window.couponAdd = window.couponAdd || couponAdd;
})(window, jQuery);
