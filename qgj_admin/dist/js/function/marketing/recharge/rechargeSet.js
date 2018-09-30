/**
 * 储值活动
 */
$(function () {
    // 文字字数限制
    $('.text-limit').on('keyup keydown', function () {
        util.textLimit(this,'',false)
    });

    //赠送优惠券查看
    $(document).on('click','.check-coupon',function () {
        layer.tips($(this).attr('data-value'), $(this), {
            tips: [1, '#3595CC'],
            time: 2000
        });
    });

    $(".js-DropdownBt").click(function (e) {
        util.stopPropagation(e);
        $(this).parent().addClass('open');
    });

    //颜色选中显示
    $(".js-dropdownList li").click(function (e) {
        var color = '',
            index = 0;
        $(this).parent().parent().removeClass('open');
        color = $(this).find("a").attr('data-value');
        $(this).parents('.dropdown-m').find(".js-bt-label").css({'background-color': color});

        index = $(".js-dropdownList").index($(this).parent());
        if(index == 0){
            $(".card-panel").attr("style",'background-color:'+ color)
        }else{
            $(".card-pic").attr("style",'background-color:'+ color)
        }
    });
    $(document).click(function () {
        $(".dropdown-m").removeClass('open');
    });

    // 颜色/图片选择切换
    colorSelect('coverRadio1');
    colorSelect('coverRadio2');

    //颜色选择
    util.setColor({
        target: '.js-card-pic-color', //选择后颜色作用的对象
        element: '.js-color-set1',
        el_reset:'.js-reset-color1',
        color:'#ffffff',  //默认颜色
    });
    util.setColor({
        target: '.js-color2', //选择后颜色作用的对象
        element: '.js-color-set2',
        el_reset:'.js-reset-color2',
        color:'#ff0000',  //默认颜色
    });

    //插入储值活动
    var t = new couponAdd({
        btn: '#btnCouponSure',
        checkboxName: 'checkboxCoupon',
        place: '#tbody',
        inputHiddenId: '#coupon_id',
        numID: '.jsBCInputNum'
    });
});

//颜色/图片选择切换
function colorSelect(name){
    var index = $("input[name='"+ name +"']:checked").attr('data-index');
    var inputObj = $("input[name='"+ name +"']");
    inputObj.parent().parent().find(".card-cover").hide().eq(index).show();

    inputObj.on('click',function () {
        index = parseInt($(this).attr('data-index'));
        $(this).parent().parent().find(".card-cover").hide().eq(index).show();
    });
}

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

            $(opts.place).html(_this.createTr(opts.checkboxName));

            //弹出框按钮点击事件
            $(opts.btn).on('click', function () {
                //选中的id组合在一起放入一个隐藏域里
                $(opts.inputHiddenId).val(_this.combId(opts.checkboxName));
                //生成一个tr，插入table里
                $(opts.place).html(_this.createTr(opts.checkboxName));
                //插入到左侧的“请选择充值金额”
                //$("#typeSelect").html(_this.insertRechargeType(opts.checkboxName))
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

            //出现弹出框时对弹出框进行初始判断勾选
            $('#modalCoupon').on('shown.bs.modal', function () {
                _this.changeCheckbox(opts.inputHiddenId, opts.checkboxName);
            })
        },
        //插入到左侧的“请选择充值金额”
        insertRechargeType: function (name) {
            var checkbox = $('input[name="' + name + '"]:checked');
            var valueObj = '',
                typeSelect = '';
            $.each(checkbox, function () {
                valueObj = $.parseJSON($(this).next().val()); //将json字符串转换成json对象
                console.log(valueObj)

                if(valueObj.giveMoney == '不赠送' && valueObj.giveCoupon == '无'){
                    typeSelect += '<li><div class="h4">任意充值</div>' +
                        '<div class="h6 text-gray-light">可充值任意金额</div></li>';
                    return false;
                }

                if(valueObj.firstCharge == '是'){
                    typeSelect += '<li><div class="flag">首充专享</div>';
                }else{
                    typeSelect += '<li>';
                }

                typeSelect += '<span>￥<em>'+ valueObj.prestore +'</em></span> ';

                if(valueObj.giveMoney != '不赠送'){
                    typeSelect += '赠 <span>'+ valueObj.giveMoney +'元</span>';
                }

                if(valueObj.giveCoupon != '无'){
                    typeSelect += '<p>赠<span>'+ valueObj.giveCoupon.split("/")[1] +'</span></p></li>';
                }
            });
            return typeSelect;
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
            $.each(checkbox, function () {
                valueObj = $.parseJSON($(this).next().val()); //将json字符串转换成json对象
                tr += '<tr><td>' + valueObj.name + '</td>' +
                    '<td>' + valueObj.prestore + '</td>' +
                    '<td>' + valueObj.giveMoney + '</td>';

                if(valueObj.giveCoupon == '无'){
                    tr += '<td>' + valueObj.giveCoupon + '</td>';
                }else{
                    tr += '<td><a href="javascript:;" class="check-coupon" data-value="'+ valueObj.giveCoupon.split("/")[1] +'">' + valueObj.giveCoupon.split("/")[0] + '</a></td>';
                }

                tr += '<td>' + valueObj.firstCharge + '</td>' +
                    '<td>' + valueObj.valid + '</td>' +
                    '<td>' + valueObj.status + '</td>' +
                    '<td><a href="javascript:;" class="jsBCDelTR" data-value="' + $(this).val() + '">删除</a></td></tr>';
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
