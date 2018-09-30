/*优惠页设置*/

$(function () {
    //颜色选择
    $(".js-DropdownBt").click(function (e) {
        util.stopPropagation(e);
        $(this).parent().addClass('open');
    });
    $(".js-dropdownList li").click(function (e) {  //颜色选中显示
        var color = '',
            index = 0;
        $(this).parent().parent().removeClass('open');
        color = $(this).find("a").attr('data-value');
        $(this).parents('.dropdown-m').find(".js-bt-label").css({'background-color': color});
        $(this).parents('.dropdown-m').next().val(color);

        index = $(".js-dropdownList").index($(this).parent());
        if(index == 0){
            $(".card-pic").attr("style",'background-color:'+ color)
        }else{
            $(".card-panel").attr("style",'background-color:'+ color)
        }
    });
    $(document).click(function () {  //关闭颜色值
        $(".dropdown-m").removeClass('open');
    });

    // 颜色/图片选择切换
    colorSelect('.cover-radio1');
    colorSelect('.cover-radio2');

    //颜色选择
    util.setColor({
        target: '.js-card-pic-color', //选择后颜色作用的对象
        element: '.js-color-set1',
        el_reset:'.js-reset-color1',
        color:'#2C2F33',  //默认颜色
    });
    util.setColor({
        target: '.js-storeSwitch', //选择后颜色作用的对象
        element: '.js-color-set2',
        el_reset:'.js-reset-color2',
        color:'#ffffff',  //默认颜色
    });

    //插入表单值
    var t = new couponAdd({
        btn: '#btnCouponSure',
        checkboxName: 'checkboxCoupon',
        place: '#tbody',
        inputHiddenId: '#coupon_id',
        numID: '.jsBCInputNum'
    });

    // 参数说明： inputHiddenVal：现有隐藏域的值； checkboxCoupon：多选框的name; modalCoupon: 弹出框的id
    // changeCheckbox(inputHiddenVal,"checkboxCoupon","modalCoupon");

});

//颜色/图片选择切换
function colorSelect(classname){
    var index = $(classname+":checked").attr('data-index');
    var inputObj = $(classname);
    inputObj.parent().parent().find(".card-cover").hide().eq(index).show();

    inputObj.on('click',function () {
        index = parseInt($(this).attr('data-index'));
        $(this).parent().parent().find(".card-cover").hide().eq(index).show();
    });
}

//优惠券弹出框搜索默认勾选
function changeCheckbox(inputHiddenId, checkboxName,id) { // 把隐藏域coupon_id里有的值，显示弹出框默认勾选上
    var checkbox = $('input[name="' + checkboxName + '"]');
    checkbox.prop("checked", false);

    if(val){
        var arr = inputHiddenVal.split(",");
        for(var i = 0, len=arr.length; i < len-1; i++){
            //对应value对象的勾选
            $("#" + id + " [value='"+ arr[i] +"']").prop("checked",true)
        }
    }
}

/*
 * 优惠券添加
 * */
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
                //生成一个tr，插入table里
                $(opts.place).append(_this.createTr(opts.checkboxName,opts.inputHiddenId));
                //选中的id组合在一起放入一个隐藏域里
                $(opts.inputHiddenId).val(_this.combId(opts.checkboxName));
                //清除没有id的tr
                _this.removeTr(opts.place,opts.inputHiddenId);
            });

            //删除tr, 删除后隐藏域值变更
            $(document).on('click', '.jsBCDelTR', function () {
                _this.delTr(opts.inputHiddenId, $(this));
            });

            //出现弹出框时对弹出框进行初始判断勾选   //新增
            $('#modalCoupon').on('shown.bs.modal', function (e) {
                _this.changeCheckbox(opts.inputHiddenId, opts.checkboxName,e.target.id);
            });

            //下移/上移
            $(document).on('click', '.js-down', function () {
                var $tr = $(this).parents("tr"),
                    $next = $tr.next();

                $next.after($tr.prop("outerHTML"));
                $tr.remove();
                _this.repeatId(opts);
            });
            $(document).on('click', '.js-up', function () {
                var $tr = $(this).parents("tr"),
                    $prev = $tr.prev();

                $prev.before($tr.prop("outerHTML"));
                $tr.remove();
                _this.repeatId(opts);
            });
        },
        changeTdHidden: function (that,num) { //当数量改变后，调用该方法调整隐藏域里的num值
            var obj = $.parseJSON(that.val()); //字符串转成json 对象
            obj.num = num;
            obj = JSON.stringify(obj);
            that.val(obj);
        },
        changeCheckbox: function (inputHiddenId, checkboxName,id) { // 把隐藏域coupon_id里有的值，显示弹出框默认勾选上
            var val = $(inputHiddenId).val(),checkbox = $('input[name="' + checkboxName + '"]');
            checkbox.prop("checked", false);

            if(val){
                var arr = val.split(",");
                for(var i = 0, len=arr.length; i < len-1; i++){
                    //对应value对象的勾选
                    $("#" + id + " [value='"+ arr[i] +"']").prop("checked",true)
                }
            }
        },
        combId: function (name) { //组合id 然后赋值给文本编辑器
            var idArr = '',checkbox = $('input[name="' + name + '"]:checked');
            $.each(checkbox, function () {
                idArr += $(this).val() + ',';
            });

            return idArr;
        },
        createTr: function (name,inputHiddenId) {
            var checkbox = $('input[name="' + name + '"]:checked'),valueObj = '',tr = '',tdHidden = {}, arr = []; //每个tr里的对象--主要包括

            $.each(checkbox, function (i) {
                valueObj = $.parseJSON($(this).next().val()); //将json字符串转换成json对象
                tdHidden.card_id = $(this).val();
                tdHidden.num = 1;
                arr = $(inputHiddenId).val().split(",");

                // 判断是否为数组，是再判断当前的值是否存在数组里，不是则添加
                if(Array.isArray(arr)){
                    if(!util.IsInArray(arr,$(this).val())){
                        tdHidden = JSON.stringify(tdHidden);  //将json对象转换成json字符串
                        tr += '<tr data-index="'+ $(this).val() +'"><td>' + valueObj.type + '</td>' + '<td>' + valueObj.name + '</td>' + '<td>' + valueObj.content + '</td>' + '<td>' + valueObj.valid + '</td>' + '<td>' + valueObj.times + '</td>' + '<td>' + valueObj.stock + '</td>' + '<td>' + valueObj.status + '</td>' + '<td><a href="javascript:;" class="mr10 js-down">下移</a><a href="javascript:;" class="mr10 js-up">上移</a><a href="javascript:;" class="jsBCDelTR" data-value="' + $(this).val() + '">删除</a></td></tr>';
                        tdHidden = {};  //对象初始化
                    }
                }
            });
            return tr;
        },
        delTr: function (inputHiddenId, e) { //删除某个tr
            var id = e.attr("data-value") + ',';
            e.parents("tr").remove();
            $(inputHiddenId).val($(inputHiddenId).val().replace(id, ''))
        },
        repeatId: function (opts) {  //重新排序隐藏域里的id
            var $tbody = $(opts.place),
                $inputHiddenId = $(opts.inputHiddenId),
                id = '';

            $tbody.children("tr").each(function () {
                id += $(this).attr("data-index") + ',';
            });
            $inputHiddenId.val(id)
        },
        removeTr: function (tbody, inputHiddenId) { //删除隐藏域不存在的对应id的tr项
            var arr_id = $(inputHiddenId).val().split(","),  //获取保存的id数组
                arr_tr= $(tbody).find("tr");

            $.each(arr_tr,function (j,o1) {
                if(!util.contains(arr_id,$(o1).attr("data-index"))){
                    $(o1).remove();
                }
            });

        }
    };
    window.couponAdd = window.couponAdd || couponAdd;
})(window, jQuery);
