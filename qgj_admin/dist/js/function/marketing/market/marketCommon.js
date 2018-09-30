/**
 * 营销活动公共js
 */
$(function () {
    //活动时间切换
    util.radioToggle('time_active_type', '.js-times');

    // 时间插件,
    util.daterangepicker("time", false);

});

//活动规则内容重复控制
(function (window, $) {
    function checkSingleControl(options) {
        var defaults = {
            ruleCon: '',  //每块规则区域的样式
            classname: '', //下拉框/文本框的样式名
            button: '#button', //提交保持的按钮id
            singleError: '.single-error', //显示在每个规则下的错误提示
            errorClass: '',  //错误提示对象的样式名
            errorText: '',  //错误提示的内容
            buttonAdd: '',  //添加规则的样式名
            buttonDel: ''   //删除规则的样式名
        };

        var opts = $.extend({}, defaults, options);

        this.init(opts);
    }

    checkSingleControl.prototype = {
        init: function (opts) {
            var that = this;

            that.checkRepeat(that, opts);

            // 添加规则
            $(opts.buttonAdd).click(function () {
                that.checkRepeat(that, opts);
            });

            // 删除规则
            $(document).on('click', opts.buttonDel, function () {
                that.checkRepeat(that, opts);
            });

            // 值改变后执行操作
            $(document).on('change', opts.classname, function () {
                that.checkRepeat(that, opts);
                that.isNull(opts);
            });

            //按钮提交
            $(opts.button).click(function () {
                that.isNull(opts);
            });
        },
        //执行操作
        checkRepeat: function (that, opts) {
            var arr = that.getArr(opts.classname);
            if (that.isRepeat(arr)) {
                $(opts.button).attr('disabled', 'disabled');
                $(opts.errorClass).html(opts.errorText).show();
            } else {
                $(opts.button).removeAttr('disabled');
                $(opts.errorClass).html('').hide();
            }
        },
        //判断数组是否重复值
        isRepeat: function (arr) {
            var hash = {};
            for (var i in arr) {
                if (hash[arr[i]]) {
                    return true;
                }
                hash[arr[i]] = true;
            }
            return false;
        },
        //得到一组数组
        getArr: function (className) {
            var arr = [];

            $(className).each(function () {
                // 如果是select类型
                if ($(this).attr("type") == 'select') {
                    arr.push($(this).find('option:selected').val());
                } else {
                    arr.push($(this).val()*100/100); //主要作用是为了使10.00跟10的相同
                }
            });

            return arr ;
        },
        //对值进行非空判断
        isNull: function (opts) {
            $(opts.singleError).hide().html('');
            $(opts.ruleCon).find("input,select,textarea").each(function () {
                if(!$(this).val()){
                    $(this).parents(opts.ruleCon).find(opts.singleError).show().html($(this).attr('data-error'));
                    return false;
                }
            });
        }
    };
    window.checkSingleControl = window.checkSingleControl || checkSingleControl;
})(window, jQuery);


// 活动规则添加删除功能
function activeRule(addBtn, delBtn) {
    //添加规则
    $(addBtn).click(function () {
        var data = $(this).prev() && $(this).prev().clone();
        if (data.find('.js-del-rule').length < 1) {
            data.children().eq(0).append('<a href="javascript:;" class="js-del-rule">删除规则</a>'); //添加删除规则
        }
        data.find('input, textarea').val('');  //清空表单元素的值
        data.find(".tbody").html('');
        $(this).before(data);
    });
    //删除规则
    $(document).on('click', delBtn, function () {
        $(this).parent().parent().remove();
    });
}