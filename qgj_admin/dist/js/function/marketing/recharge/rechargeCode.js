/**
 * 储值码
 */
$(function () {
    //添加储值码---有效时间
    $("#time").daterangepicker({
        timePicker: false,
        singleDatePicker: false,
        format: "YYYY/MM/DD",
        minDate: moment().startOf('day')
    });

    //出现弹出框后把错误关闭
    $('#rechargeCode').on('show.bs.modal', function () {
        $("label.validate-error").hide();
    });

    //兑换入口连接
    $(".ML-link").click(
        function (e) {
            util.qjgTips($(this),".qgj-tips");
            util.stopPropagation(e);
        }
    );
    $(document).bind('click',function () {
        $(".qgj-tips").hide();
    });
    $(".qgj-tips").bind('click',function (e) {
        util.stopPropagation(e);
    });

    //插入表单值
    var t = new couponAdd({
        btn: '#btnCouponSure',
        checkboxName: 'checkboxCoupon',
        place: '#tbody',
        inputHiddenId: '#coupon_id',
        numID: '.jsBCInputNum'
    });

    //出现弹出框后把错误关闭
    $('#modalCoupon').on('show.bs.modal', function () {
        $('#rechargeCode').modal("hide");
    });
    $('#modalCoupon').on('hide.bs.modal', function () {
        $('#rechargeCode').modal("show");
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
                //选中的id组合在一起放入一个隐藏域里
                $(opts.inputHiddenId).val(_this.combId(opts.checkboxName));
                //生成一个tr，插入table里
                $(opts.place).html(_this.createTr(opts.checkboxName));
            });

            //删除tr, 删除后隐藏域值变更
            $(document).on('click', '.jsBCDelTR', function () {
                _this.delTr(opts.inputHiddenId, $(this));
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
                            _this.changeTdHidden($(this).next(),$(this).val())
                        }
                    }
                }
            });

            //出现弹出框时对弹出框进行初始判断勾选   //新增
            $('#modalCoupon').on('shown.bs.modal', function () {
                _this.changeCheckbox(opts.inputHiddenId, opts.checkboxName);
            })
        },
        changeTdHidden: function (that,num) { //当数量改变后，调用该方法调整隐藏域里的num值
            var obj = $.parseJSON(that.val()); //字符串转成json 对象
            obj.num = num;
            obj = JSON.stringify(obj);
            that.val(obj);
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
                console.log(valueObj)
                tdHidden.card_id = $(this).val();
                tdHidden.num = 1;
                tdHidden = JSON.stringify(tdHidden);  //将json对象转换成json字符串
                tr += '<tr><td>' + valueObj.type + '</td>' + '<td>' + valueObj.name + '</td>' + '<td>' + valueObj.limit + '</td>' + '<td>' + valueObj.stock + '</td>' + '<td>' + valueObj.valid + '</td>' + '<td><input type="text" name="" value="1" class="form-control jsBCInputNum" size="1" maxlength="5" data-value="' + valueObj.limit + ',' + valueObj.stock + '"><input type="hidden" value='+ tdHidden +'></td><td><a href="javascript:;" class="jsBCDelTR" data-value="' + $(this).val() + '">删除</a></td></tr>';
                tdHidden = {};  //对象初始化
            });
            return tr;
        },
        delTr: function (inputHiddenId, e) { //删除tr
            var id = e.attr("data-value") + ',';
            e.parents("tr").remove();
            $(inputHiddenId).val($(inputHiddenId).val().replace(id, ''))
        }
    };
    window.couponAdd = window.couponAdd || couponAdd;
})(window, jQuery);
