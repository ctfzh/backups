
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
    $(".js-attr-multiple").select2();  //属性初始化

    //商品图列表图片关闭
    $(document).on('click', ".js-pic-list .js-delete-pic", function () {
        $(this).parent().remove();
    });

    recalculate();
});

//生成sku属性
function recalculate() {
    /**
     * category：数据格式为(商品一级属性id||商品一级属性名称)；
     * categorys_property：数据格式为(商品二级属性id||商品一级属性id||商品二级属性名称)
     **/
    var category = [], categorys_property = [];
    $('select[name="category[]"]').each(function () {
        var categoryval = $(this).val();
        category.push(categoryval);
    });
    $('input[name="categorys_property[]"]').each(function () {
        var propertyId = $(this).val();
        categorys_property.push(propertyId);
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
                    //$(this).select2().val('').trigger('change'); // 恢复初始值  不注释掉会卡
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

                $(".js-example-basic-multiple").select2({
                    width: "600px"
                }).val(null).trigger("change"); //清除已选项
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
            var offset = element.offset(),
                popover = $(".popover");

            setTimeout(function () { //select2未加载完，所以宽度一开始没算成功
                popover.css({
                    left: offset.left - popover.width() / 2,
                    top: offset.top + element.height() + 10
                }).show();
            },50)
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
