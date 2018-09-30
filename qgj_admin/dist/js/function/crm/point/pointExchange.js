/**
 * 积分兑换
 */

$(function () {
    //活动时间切换
    util.radioToggle('time_active_type', '.js-times');

    //插入表单值
    var t = new couponAdd({
        btn: '#btnCouponSure',
        checkboxName: 'radioCoupon',
        place: '#tbody',
        inputHiddenId: '#coupon_id'
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
        };

        var opts = $.extend({}, defaults, options);

        this.init(opts);
    }

    couponAdd.prototype = {
        init: function (opts) {
            var _this = this;

            //初始化
            $(opts.place).html(_this.createTr(opts.checkboxName));

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

            //出现弹出框时对弹出框进行初始判断勾选   //新增
            $('#modalCoupon').on('shown.bs.modal', function () {
                _this.changeCheckbox(opts.inputHiddenId, opts.checkboxName);
            })
        },
        changeCheckbox: function (inputHiddenId, checkboxName) { // 把隐藏域coupon_id里有的值，显示弹出框默认勾选上
            var val = $(inputHiddenId).val();
            var checkbox = $('input[name="' + checkboxName + '"]');
            checkbox.prop("checked", false);

            if(val){
                for(var i = 0, len=val.length; i < len; i++){
                    for(var j =0, len1 = checkbox.length; j < len1; j++){
                        if($(checkbox[j]).val() == val){
                            $(checkbox[j]).prop("checked", true);
                        }
                    }
                }
            }
        },
        combId: function (name) { //组合id 然后赋值给文本编辑器
            var idArr = $('input[name="' + name + '"]:checked').val();

            return idArr;
        },
        createTr: function (name) {
            var checkbox = $('input[name="' + name + '"]:checked');
            var valueObj = '';
            var tr = '';

            if(checkbox){
                $.each(checkbox, function () {
                    valueObj = $.parseJSON($(this).next().val()); //将json字符串转换成json对象
                    console.log(valueObj)
                    tr += '<tr><td>' + valueObj.type + '</td>' + '<td>' + valueObj.name + '</td>' + '<td id="limit_'+ checkbox.val() +'">' + valueObj.limit + '</td>' + '<td>' + valueObj.stock + '</td>' + '<td>' + valueObj.valid + '</td>' + valueObj.limit + ',' + valueObj.stock + '"></td><td><a href="javascript:;" class="jsBCDelTR" data-value="' + $(this).val() + '">删除</a></td></tr>';
                });
            }

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