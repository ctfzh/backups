
//图片上传控件
function upload_goods_img(butId, upload_path, img_type, goods_folder, goods_thumb, show_img) {
    upload_img_card(butId, upload_path, img_type, goods_folder, goods_thumb,
        function (fileName) {
            var path = show_img + fileName;
            var html = '';
            html += '<li class="sort imgurl">';
            html += '<img src="' + path + '" alt="">';
            html += '<a href="javascript:void(0);" class="js-delete-pic close close-bg">x</a>';
            html += '<input name="imgs[]" value="' + fileName + '" type="hidden">';
            html += '</li>';
            $('#img_upload').parent().before(html);
            $('.tempImgs').remove();
        });
}

//
function firstValidate(source, where) {
    // $("input[name='numcount']").attr("disabled", true);
    // $("input[name='pricecount']").attr("disabled", true);
    // $("input[name='weight']").attr("disabled", true);

    var form = $("#goods-form");
    if (source == 0) {
        $('#classify').removeClass('hide');
        $('#basice,#details').addClass('hide');
    } else if (source == 1) {
        $('#basice').removeClass('hide');
        $('#classify,#details').addClass('hide');
    } else if (source == 2) {
        if (!validate.form()) return false;
        $('#details').removeClass('hide');
        $('#classify,#basice').addClass('hide');
    } else if (source == 3 || source == 4) {
        var status = source == 3 ? 1 : 2;
        form.find('input[name=status]').val(status);
        if (validate.form()) {
            form.submit();
        }
    }
    //去掉头部所有的active选中样式
    $('#titleModal').find('.active').removeClass('active');
    $('#titleModal li').eq(source).addClass('active');
}

//原价规则验证
jQuery.validator.addMethod("comparePrice", function(value, element) {
    var val_prev = parseFloat($(element).prev().val()) || 0;
    var flag = (value && val_prev != 0 && parseFloat(value) >= val_prev ) || !value ? true : false;
    return flag;
}, "原价不能小于现价");

jQuery.validator.addMethod("vailExpressMoney", function(value, element) {
    var is_checked = $("#total_express").is(':checked');
    var express_money = $("#express_money").val() != '';
    var is_checked_model = $("#model_express").is(':checked');
    return is_checked && express_money || is_checked_model;
}, '请输入商品运费');

jQuery.validator.addMethod("isMoney", function(value, element) {
    var diagit = /^[0-9]+(.[0-9]{1,2})?$/;
    return this.optional(element) || (diagit.test(value));
}, "请输入正数，精确到小数点后两位");

//表单验证
var validate = $("#goods-form").validate({
    debug: false, //调试模式为true则只本地调试
    rules: {
        'goods_group_id[]': {
            required: true
        },
        name: {
            required: true
        },
        'imgs[]': {
            required: true
        },
        'prices[]': {
            required: true
        },
        'nums[]': {
            required: true
        },
        'sku_numbers[]': {
            required: true
        },
        numcount: {
            digits: true,
            required: true
        },
        pricecount: {
            isMoney: true,
            required: true
        },
        weight: {
            isMoney: true,
            required: true
        },
        freight_money: {
            vailExpressMoney: true
        },
        original_pricecount:{
            comparePrice:true
        }
    },
    messages: {
        'goods_group_id[]': {
            required: '请选择商品分组'
        },
        name: {
            required: '请输入商品名称'
        },
        'imgs[]': {
            required: '至少上传一张商品图片'
        },
        'prices[]': {
            required: '请输入商品sku库存'
        },
        'nums[]': {
            required: '请输入商品sku库存'
        },
        'sku_numbers[]': {
            required: '请输入商品sku编码'
        },
        numcount: {
            digits: '请输入正整数',
            required: '请输入商品库存'
        },
        pricecount: {
            required: '请输入商品价格'
        },
        weight: {
            required: '请输入商品重量'
        }
    },
    errorPlacement: function (error, element) {
        error.appendTo(element.parent());
    },
    errorClass: "text-danger",
    ignore: ''
});

//获商品一级规格对应的二级规格
function findProperty(where) {
    var categoryId = $(where).parent().parent().find("select[name='category[]']").val();
    if (categoryId == '') {
        layer.msg('请先选择商品规格!');
        return false;
    }
    $.ajax({
        url: '/goods/category/property-list.html',
        type: 'get',
        dataType: "json",
        async: false,
        data: {categoryId: categoryId},
        success: function (data) {
            $('select[name=propertyData]').html(data.property);
        }
    });
}

$(function () {
    //初始化文本编辑器
    var ue = UE.getEditor('right_content', {initialFrameWidth: '100%'});
    $("#right_content").css("width", "61.5%");

    var $tableClass = $(".table-class"),
        $saleTime = $('#saleTime');

    $("#classify").on("click", ".btn-group-justified button", function () {
        $("#classify").find(".active").removeClass('active');
        $(this).addClass("active");
        $("#basice").find(".classifyName").text($(this).text());
        var sorts = $(this).attr('data-val');
        $("input[name=sorts]").val(sorts);
    });
    $tableClass.on("blur", ".prices", function () {
        var price = 0, prices = 0;
        var sku_num = $("input[name=sku_num]").val();
        for (var i = 0; i < sku_num; i++) {
            prices = parseFloat($('input[name="prices[' + i + ']"]').val());
            if (prices > 0 && (price == 0 || prices < price))
                price = prices;
        }
        $("input[name=pricecount]").val(price);
    });
    $tableClass.on("blur", ".nums", function () {
        var num = 0, nums = 0;
        var sku_num = $("input[name=sku_num]").val();
        for (var i = 0; i < sku_num; i++) {
            nums = parseInt($('input[name="nums[' + i + ']"]').val());
            if (nums > 0)
                num += nums;
        }
        $("input[name=numcount]").val(num);
    });
    $tableClass.on("blur", ".sku_weight", function () {
        var num = 0, nums = 0;
        var sku_num = $("input[name=sku_num]").val();
        for (var i = 0; i < sku_num; i++) {
            nums = parseFloat($('input[name="sku_weight[' + i + ']"]').val());
            if (nums > 0 && nums > num)
                num = nums;
        }
        $("input[name=weight]").val(num);
    });

    //添加规格 初始化
    var se = new specification({
        skuGroupPlace: '.js-sku-list-container', //放置sku组的位置
        addSkuGroup: '.js-add-sku-group',   //添加sku组 对象
        deleteSkuGroup: '.js-delete-sku-group', //删除sku组 对象
        addSkuItem: '.add-sku',  //添加sku组里的单个项
        deleteSkuItem: '.js-delete-sku-item',  //添加sku组里的单个项,
        shopStock: '.jd-shopStock' //商品库存表格项
    });

    //分组下拉选择
    $(".js-select-group").select2({
        width: "30%"
    });

    $(".js-example-basic-multiple").select2();

    //商品图列表图片关闭
    $(document).on('click', ".js-pic-list .js-delete-pic", function () {
        $(this).parent().remove();
    })

    recalculate();

    // 可用时段切换
    util.radioToggle('time_limit_type','.js-times');
    //开售时间
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem: '#saleTime'
            ,type: 'datetime'
            ,format: 'yyyy-MM-dd HH:mm'
        });
    });

});

//刷新分组信息
function findGroup() {
    var goods_group = $("select[name='goods_group_id']");
    $.ajax({
        'url': '/goods/group/get-group-list.html',
        'type': 'get',
        'dataType': "json",
        'success': function (data) {
            goods_group.empty();
            var option = '';
            for (var optionData  in data.data) {
                option += '<option value="' + optionData.id + '">' + optionData.name + '</option>';
            }
            goods_group.html(option);
        }
    });
}

//生成sku属性
function recalculate() {
    /*
     * category：数据格式为(商品一级属性id||商品一级属性名称)；
     * categorys_property：数据格式为(商品二级属性id||商品一级属性id||商品二级属性名称)
     */
    var category = [], categorys_property = [];
    $('select[name="category[]"]').each(function () {
        var categoryval = $(this).val();
        category.push(categoryval);
    });
    $('input[name="categorys_property[]"]').each(function () {
        var propertyId = $(this).val();
        categorys_property.push(propertyId);
    });

    var goodsId = GetQueryString("id");
    $.ajax({
        'url': 'get-sku.html',
        'type': 'get',
        'data': {category: category, categorys_property: categorys_property, goodsId: goodsId},
        'success': function (rs) {
            $('.table-class').html(rs);
            addRules($('input[name="sku_num"]').val());
        }
    });
}

(function (window, $, undefined) {
    var specification = function (options) {
        var settings = $.extend({
            click: ''
        }, options);

        this.init(settings);
    };

    specification.prototype = {
        //存放初始值对象
        init: function (opts) {
            var _this = this;
            var skuGroupPlace = $(opts.skuGroupPlace),
                addSkuGroup = $(opts.addSkuGroup),
                templateSku = '',
                skuBdList = '',
                skuGroupArr = [], //存放已有规格数组；
                skuArr = [], //存放已有的sku数组;
                curIndex = 0, //索引值
                selectValue; //获取当前选中属性下拉框的值

            _this.addSkuGroupArr(skuGroupArr); //初始化添加选中的规格的内容
            $(".js-example-basic-single").select2();

            //判断是否隐藏商品库存表格项
            _this.isShopStock(opts);

            //添加一组规格
            addSkuGroup.click(function () {
                var len = skuGroupPlace.children().length;
                if(len > 2){
                    $(this).hide();
                }else{
                    _this.addSkuGroup(skuGroupPlace, _this.templateGroup(len));
                }
                //默认初始化
                $(".js-example-basic-single").each(function () {
                    $(this).select2();  //初始化select2
                    var res= $(this).select2("data") ; //单选
                    if(res != ''){
                        $(this).parent().parent().next().find(".js-add-sku").removeClass('hide');
                    }
                });

                _this.isShopStock(opts);
            });
            //删除一组规格
            $(document).on('click', opts.deleteSkuGroup, function (e) {
                $(this).parent().parent().remove();
                addSkuGroup.show();  //显示添加规格按钮
                _this.addSkuGroupArr(skuGroupArr); //添加选中的规格的内容
                _this.resetIndex(".js-add-sku"); //重置索引值
                recalculate();
                _this.isShopStock(opts);
            });

            //当回车时往select2里里面增值
            $(document).on('keyup', "input.select2-search__field", function (e) {
                //获得当前打开状态的select对象
                var select = $(".select2.select2-container--open").prev();
                var csrf = '';
                var categoryName = $(this).val();
                var url = '';
                var postData = '';
                var categoryId = '';
                //如果是属性下拉框
                if (select.hasClass('js-example-basic-single')) {
                    url = '/goods/category/add.html';
                    postData = {name: categoryName, '_csrf': csrf};
                } else {
                    //如果是sku
                    categoryId = selectValue.split('||');
                    url = '/goods/category/property-add.html';
                    postData = {name: categoryName, '_csrf': csrf, categoryId: categoryId[0]};
                }

                if (categoryName && select && e.keyCode == 13) {
                    $.ajax({
                        'url': url,
                        'type': 'post',
                        'async': false,
                        'data': postData,
                        'success': function (redata) {
                            //往select2里插值
                            if (select.hasClass('js-example-basic-single')) {
                                select.append(new Option(categoryName, redata + '||' + categoryName, false, true));
                            } else {
                                select.append(new Option(categoryName, redata + '||' + categoryId[0] + '||' + categoryName, false, true));
                            }
                            //关闭
                            select.select2("close");
                            select.parents('.js-sku-sub-group').find('.js-add-sku').removeClass('hide'); //显示添加sku按钮
                        }
                    });
                }
            });

            //单选改变后显示单个sku添加按钮
            $(document).on('change', ".js-example-basic-single", function (e) {
                var index = $(".js-example-basic-single").index($(this));
                _this.addSkuGroupArr(skuGroupArr);  //添加选中的规格的内容

                if (_this.isRepeat(skuGroupArr)) {
                    layer.msg('规格名不能相同!');
                    $(this).select2().val('').trigger('change'); // 恢复初始值
                } else {
                    $(this).parents('.js-sku-sub-group').find('.js-add-sku').attr('data-value', index).removeClass('hide'); //显示添加sku按钮
                }
            });

            //添加单个sku
            $(document).on('click', ".js-add-sku", function (e) {
                curIndex = $(this).attr('data-value');
                selectValue = $(".js-example-basic-single").eq(curIndex).find("option:selected").val();  //获取当前select选中项的索引值
                
                _this.popover($(this));
                skuBdList = $(this).prev();

                //把已有的值存入数组
                skuArr = []; //清空sku数组
                _this.storeSkuArr(skuBdList, skuArr);

                $(".js-example-basic-multiple").select2().val(null).trigger("change"); //清除已选项
            });
            //删除单个sku
            $(document).on('click', opts.deleteSkuItem, function (e) {
                $(this).parent().remove();
                //重新把已有的值存入数组
                skuArr = []; //清空sku数组
                _this.storeSkuArr($(this).parents('.js-sku-bd-list'), skuArr);
                recalculate();
            });

            //尺寸选择弹出框 确认按钮
            $(document).on('click', ".btn-popover-sure", function (e) {
                var data = $(".js-example-basic-multiple").select2('data'),
                    flag = false;

                for (var i = 0; i < data.length; i++) {
                    flag = _this.contains(skuArr, data[i].text);
                    if (!flag) {
                        templateSku += '<div class="sku-item"><span>' + data[i].text + '</span> <a href="javascript:;" class="close close-bg js-delete-sku-item">×</a><input name="categorys_property[]" value="' + data[i].id + '" type="hidden"></div>';
                    } else {
                        layer.msg('值重复，请重新选择');
                    }
                }
                skuBdList.append(templateSku);
                $(this).parent().hide();  //隐藏sku选择弹出框
                templateSku = '';
                recalculate();
            });
            //尺寸选择弹出框 取消按钮 点击
            $(document).on('click', ".btn-popover-cancel", function (e) {
                $(this).parent().hide();
            });

        },
        templateGroup: function (id) {
            var templateGroup = '<div class="sku-sub-group js-sku-sub-group">';
            templateGroup += '<div class="sku-title">';
            templateGroup += '<div class="js-sku-name">';
            templateGroup += '<select class="js-example-basic-single js-states form-control w200" name="category[]">';
            var category = '';
            $.ajax({
                'url': '/goods/category/list.html',
                'async': false,
                'type': 'get',
                'success': function (data) {
                    category = data;
                }
            });

            if (category != '') {
                var json = JSON.parse(category)//.eval("("+category+")");
                for (var u in json) {
                    templateGroup += '<option value="' + u + '||' + json[u].name + '">' + json[u].name + '</option>';
                }
            }
            templateGroup += '</select>';
            templateGroup += '</div>';
            templateGroup += '<a href="javascript:void(0);" class="close close-bg js-delete-sku-group">×</a>';
            templateGroup += '</div>';
            templateGroup += '<div class="sku-bd">';
            templateGroup += '<div class="sku-bd-list js-sku-bd-list"></div>';
            templateGroup += '<a href="javascript:;" class="add-sku js-add-sku hide" data-value="'+id+'" onclick="findProperty($(this));">+添加</a>';
            templateGroup += '</div>';
            templateGroup += '</div>';
            return templateGroup;
        },
        addSkuGroupArr: function (skuGroupArr) { //把所有规格内容存入数组
            skuGroupArr.splice(0, skuGroupArr.length); //先清空
            $(".js-example-basic-single option:selected").each(function () {
                skuGroupArr.push($(this).text());
            });
        },
        addSkuGroup: function (skuGroupPlace, templateGroup) { //添加规格
            skuGroupPlace.append(templateGroup);
        },
        resetIndex: function (element) {
            $(element).each(function (index) {
                $(this).attr('data-value', index);
            })
        },
        popover: function (element) { //sku弹出框
            var offset = element.offset();
            var popover = $(".popover");
            popover.show().css({
                left: offset.left - popover.outerWidth() / 2,
                top: offset.top + element.outerHeight() + 10
            });
        },
        storeSkuArr: function (element, arr) { //添加每个规格里已有的sku
            var sku = element.children();
            if (sku.length) {
                sku.each(function () {
                    arr.push($(this).find("span").text())
                })
            }
        },
        contains: function (arr, obj) { //判断某个对象是否在数组里
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        },
        removeByValue: function (arr, val) { //清除数组里的值
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        },
        isShopStock: function (opts) {  //判断是否隐藏商品库存表格项
            if($(opts.skuGroupPlace).children().length < 1){
                $(opts.shopStock).hide();
            }else{
                $(opts.shopStock).show();
            }
        },
        isRepeat: function (arr) {  //判断数组值是否重复
            var hash = {};
            for (var i in arr) {
                if (hash[arr[i]]) {
                    return true;
                }
                hash[arr[i]] = true;
            }
            return false;
        }
    };

    window.specification = window.specification || specification;
})(window, jQuery);


/**
 * 获取URL参数
 * @param name
 * @returns {null}
 * @constructor
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

//动态添加表单的验证规则
jQuery.validator.addMethod("isDiagit", function(value, element) {
    var diagit = /^[1-9]\d*$/;
    return (this.optional(element) || (diagit.test(value))) && value != 0;
}, "请输入正整数");
jQuery.validator.addMethod("isMoney", function(value, element) {
    var diagit = /^[0-9]+(.[0-9]{1,2})?$/;
    return (this.optional(element) || (diagit.test(value))) && value != 0;
}, "请输入正数，可精确到小数点后两位");
function addRules(count_end){
    var count_start = 0;
    while (count_start <= count_end) {
        $("input[name='prices["+ count_start +"]']").rules("add",{
            required: true,
            isMoney: true,
            messages:{required:"请填写价格"}
        });
        $("input[name='nums["+ count_start +"]']").rules("add",{
            required: true,
            isDiagit: true,
            messages:{required:"请填写库存"}
        });
        $("input[name='sku_weight["+ count_start +"]").rules("add",{
            required: true,
            isMoney: true,
            messages:{required:"请填写重量"}
        });
        count_start = count_start + 1;
    }
}