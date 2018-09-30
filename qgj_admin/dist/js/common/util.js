/*
 * 描述：主要存放公共方法
 * */
var util = {
    // 验证方法
    check: {
        digit: function (str) { //大于0的数字
            var reg = /^[0-9]*$/;
            return reg.test(str)
        },
        isGreaterZero: function (str) { //大于等于0并且保留2位小数的数
            var reg = /^\d*(\.\d{1,2})?$/;
            return reg.test(str);
        },
        isPositive: function (str) {  //正数，最多两位小数
            var reg = /(^[1-9]\d*(\.\d{1,2})?$)|(0(\.\d{1,2})$)/;
            return reg.test(str);
        },
        validDigit: function () { //检验正整数
            return $.validator.addMethod("isValidDigit", function (value, element) {
                var tel = /^[0-9]*$/;
                return this.optional(element) || (tel.test(value));
            }, "只能输入数字");
        },
        validPositiveInteger: function () { //检验大于0正整数
            return $.validator.addMethod("isPositiveInteger", function (value, element) {
                var tel = /^[1-9][0-9]*$/;
                return this.optional(element) || (tel.test(value));
            }, "只能输入数字");
        },
        naturalNumber: function () {
            return $.validator.addMethod("isNaturalNumber", function (value, element) {
                var tel = /^\d+(\.\d{0,2})?$/;
                return this.optional(element) || (tel.test(value));
            }, "只能输入非负数字");
        },
        checkTelephone: function () { //检验座机/手机号码
            return $.validator.addMethod("checkTelephone", function (value, element, params) {
                var checkTelephone = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
                return this.optional(element) || (checkTelephone.test(value));
            }, "请正确填写座机号或手机号");
        }
    },
    //layer插件
    layDate: {
        /*
         * 时间插件
         * @param: 需要的参数内容
         * */
        getTime: function (options) {
            layui.use('laydate', function () {
                var laydate = layui.laydate;
                var opts = options ? options : {
                    elem: '#time'
                    , range: true
                    , theme: '#30a5ff'
                };
                laydate.render(options);
            });
        }
    },
    /*
     * 给点击对象赋值一个唯一属性，其余相同对象里的属性去除
     * @param className: 点击对象的样式; @param classNameActive: 点击对象后要添加的唯一标识
     * */
    addOnlyId: function (className, classNameActive) {
        $(document).on('click', '.' + className, function () {
            $('.' + className).removeClass(classNameActive);
            $(this).addClass(classNameActive);
        })
    },
    /*
     * 全选/全不选
     * @param ckAll:全选项的名字; @param ckSingle:单选项的名字
     * @param id: 存储隐藏域的值
     * */
    ckAll: function (ckSingle, ckAll, id) {
        var $ckSingle = $(ckSingle),
            $ckAll = $(ckAll);


        $(document).on('click', ckSingle, function () {
            if ($(this).prop("checked") && $(ckSingle + ":checked").length == $(ckSingle).length) {
                $ckAll.prop("checked", true);
            } else {
                $ckAll.prop("checked", false);
            }

            $(id).val(combId($ckSingle));
        });

        //全选操作
        $(document).on('click', ckAll, function () {
            $ckSingle = $(ckSingle);
            if ($(this).prop("checked")) {
                $ckSingle.prop("checked", true);
                $ckAll.prop("checked", true);
            } else {
                $ckSingle.prop("checked", false);
                $ckAll.prop("checked", false);
            }
            $(id).val(combId($ckSingle));
        });

        //组合id 然后赋值给隐藏域
        function combId (obj) {
            var idArr = '',
                checkbox = $(ckSingle+":checked");

            $.each(checkbox, function () {
                idArr += $(this).val() + ',';
            });

            return idArr;
        }
    },
    /*
     * 反选
     * @param ckAll:全选项的名字; @param ckSingle:单选项的名字; @param inverse:反向
     * */
    ckReserve: function (ckSingle, ckAll, inverse) {
        var $ckSingle = $(ckSingle),
            $ckAll = $(ckAll),
            $inverse = $(inverse);

        //反选操作
        $(document).on('click', inverse, function () {
            $ckSingle.each(function () {
                if ($(this).prop("checked")) {
                    $(this).prop("checked", false);
                } else {
                    $(this).prop("checked", true);
                }
            })
            if ($(ckSingle + ":checked").length == $(ckSingle).length) {
                $ckAll.prop("checked", true);
            } else {
                $ckAll.prop("checked", false);
            }
        })
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
    /*
     * 日时间插件
     * @param id: 时间input的id
     * @param flag: true---只显示今日之前的日期
     * */
    daterangepicker: function (id, flag) {
        var $o = $('#' + id);

        if (flag) {
            $o.daterangepicker({
                timePicker: false,
                singleDatePicker: false,
                format: "YYYY/MM/DD",
                startDate: moment().add(-1, 'days'),
                endDate: moment().add(-1, 'days'),
                maxDate: moment().add(-1, 'days')
            })
        } else {
            $o.daterangepicker({
                timePicker: false,
                singleDatePicker: false,
                format: "YYYY/MM/DD"
            })
        }
    },
    // 月时间插件
    datepicker: function (id) {
        var $o = $('#' + id);
        $o.datepicker({
            format: "yyyy/mm",
            startView: "months",
            minViewMode: "months",
            language: "zh-CN",
            autoclose: true
        });
    },
    //今日'今日': [moment().startOf('day'), moment()],
    //'昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
    //'最近7日': [moment().subtract('days', 6), moment()],
    //'最近30日': [moment().subtract('days', 29), moment()]
    //nDays：数字,如果是想要前一天的时间段就填写-1，否则可以不填
    getDayRange: function (nDays, num) {
        var days = num ? [moment().subtract('days', nDays), moment().add(-1, 'days')] : [moment().subtract('days', nDays), moment()];
        var start = moment(days[0]).format('YYYY/MM/DD');
        var last = moment(days[1]).format('YYYY/MM/DD');
        return start + " - " + last;
    },
    getPrevDayRange: function (nDays) {
        var days = [moment().subtract('days', nDays * 2).startOf('day'), moment().subtract('days', nDays + 1).endOf('day')];
        var start = moment(days[0]).format('YYYY/MM/DD');
        var last = moment(days[1]).format('YYYY/MM/DD');
        return start + " - " + last;
    },
    yesterday: function () {
        var days = [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')];
        var start = moment(days[0]).format('YYYY/MM/DD');
        var last = moment(days[1]).format('YYYY/MM/DD');
        return start + " - " + last;
    },
    /*
     * 得到年/月的区间
     * @param nMonth:月间隔数字,例如3个月就填3
     * */
    getMonthRange: function (nMonth) {
        var months = [moment().subtract('month', nMonth), moment()];
        var start = moment(months[0]).format('YYYY/MM');
        var last = moment(months[1]).format('YYYY/MM');
        var monthRange = [];
        monthRange.push(start);
        monthRange.push(last);
        return monthRange;
    },
    IsInArray: function (arr, val) {  //判断某变量是否为某数组中
        var testStr = ',' + arr.join(",") + ",";
        return testStr.indexOf("," + val + ",") != -1;
    },
    /*
     * 瀑布加载
     * @param container: 最外框; @param list: 列表项; @param space：项之间的间距
     * */
    masonryInit: function (container, list, space) {
        var $container = $(container) || $('.masonry');
        var list = list || '.list';
        var space = space || 20;
        $container.imagesLoaded(function () {
            $container.masonry({
                itemSelector: list,
                gutter: space,  // 间隔
                isAnimated: true
            });
        });
    },
    /*
     * 复制路径选择
     * @param element: 点击发起对象; @param direction: 方向
     * */
    pathPop: function (element, direction, temp) {
        var temp = temp ? temp : '<div class="pop-path" style="width: 270px">' +
        '<input type="text" class="text" value="" id="qrcode_url">' +
        '<span class="input-copy" id="js-copy-path">复制</span>' +
        '<div class="icon-arrow"></div>' +
        '<a href="javascript:;" class="close close-bg">×</a> ' +
        '</div>';
        var url = '';

        //显示位置
        $(document).on('click', element, function () {
            pos = $(this).offset(),
                _top = pos.top - $(this).outerHeight() / 2;

            if ($(".pop-path").length < 1) {
                if (direction == 'left') {
                    $("body").append(
                        $(temp).css({
                            left: pos.left + $(this).outerWidth() + 20,
                            top: _top
                        }).show().addClass("pop-path-l")
                    )
                } else {
                    $(".pop-path").remove();
                    $("body").append(
                        $(temp).css({
                            left: pos.left - $(temp).outerWidth() - 6,
                            top: _top
                        }).show()
                    )
                }
                $("#qrcode_url").val($(element).attr("data-path"));
            }
        });

        //复制链接
        $(document).on('click', '#js-copy-path', function () {
            $("#qrcode_url").select();
            document.execCommand("Copy"); // 执行浏览器复制命令
            layer.msg('复制成功');
            $(this).parent().remove();
        });

        $(document).on('click', '.pop-path .close, .pop-path .cancel', function () {
            $(this).parent().remove();
        });
    },
    /**
     * tips层弹出框
     * @param { options } options 是个对象，第一个参数为触发对象，第二个为方向，第三个参数内置在弹出框的模板，第四个为回调函数
     */
    pointPop: function (options) {
        var defaults = {
                direction: 'left',  //方向
                noSelectedShopTip: '未选择商品，请选择后设置',
                temp_inputID: '',  //弹出框里的输入框
                temp_btnID: '',  //弹出框的按钮
                template: '',
                isValidate: true
            },
            opts = $.extend({}, defaults, options),
            data = [], data_obj = {};

        opts.template = '<div class="pop-path pop-point js-batch">' +
            '<div class="input"><input type="text" class="text w100" value="" id="' + opts.temp_inputID + '"></div>' +
            '<a href="javascript:;" class="input-copy" id="' + opts.temp_btnID + '">保存</a>' +
            '<a href="javascript:;" class="cancel">取消</a>' +
            '<div class="icon-arrow"></div>' +
            '</div>';

        //显示位置
        $(document).on('click', opts.obj, function () {
            var pos = $(this).offset(),
                _top = pos.top - $(this).height() / 2,
                $popPath = $(".pop-path");

            if (opts.isValidate) {
                if ($(opts.tbody_id).find("tbody").length) {
                    if (!$(opts.tbody_id).find("tbody " + opts.single_ck + ":checked").length) {
                        layer.msg("未选择商品，请选择后设置");
                        return false;
                    }
                } else {
                    if (!$(opts.tbody_id).find(opts.single_ck + ":checked").length) {
                        layer.msg("未选择商品，请选择后设置");
                        return false;
                    }
                }
            }
            $popPath.remove();
            if (opts.direction == 'left') {
                $("body").append(
                    $(opts.template).css({
                        left: pos.left + $(this).outerWidth() + 5,
                        top: _top
                    }).show().addClass("pop-path-l")
                )
            } else {
                $popPath.remove();
                $("body").append(
                    $(opts.template).css({
                        left: pos.left - $(opts.template).outerWidth() - 6,
                        top: _top
                    }).show().addClass("pop-path-r")
                )
            }
        });

        //保存按钮执行
        $(document).on('click', '#' + opts.temp_btnID, function () {
            data_obj.temp_inputID = opts.temp_inputID;
            data_obj.temp_btnID = opts.temp_btnID;
            data.push(data_obj);
            opts.callback.apply($(this), data)
        });

        //删除/取消
        $(document).on('click', '.pop-path .close, .pop-path .cancel', function () {
            $(this).parent().remove();
        });
    },
    /*
     * 弹出层显示隐藏
     * @param event: radio 组 name; @param toggleElement: 要切换的对象; @param targetOffset: 偏移值的参考对象
     * */
    qjgTips: function (source, target, targetOffset) {
        var pos = source.offset(), pos1 = '',
            top = '',
            left = pos.left - $(target).outerWidth() + source.outerWidth(),
            distance = $(window).height() - pos.top,  //屏幕可视高度-点击对象距离顶部的偏移高度
            targetH = $(target).outerHeight() + source.height();  //弹出框的高度+ 点击对象的本身高度

        //如果在main-con里则还要减去90padding
        if (targetOffset) {  //主要用在 弹出框里点击再出现弹出框
            top = $(targetOffset).css("top");
            pos1 = $(targetOffset).offset();
            $(target).css({
                left: pos1.left - $(target).outerWidth() - 20 - 90, //20:间距，90为在main-con里则还要减去90padding
                top: top
            }).show();
        } else {
            top = distance > targetH ? source.outerHeight() + pos.top + 5 : pos.top - targetH + source.height();
            $(target).css({
                left: left - 90,
                top: top
            }).show();
        }

    },
    /*
     * 备注编辑
     * @param element: 元素
     * */
    remarkClick: function (element, text, flag) {
        var $inputWrap = $(element).next();
        var $input = $inputWrap.find('input');  // 输入内容的input对象
        var text = text || '备注';
        var flag = flag || false;
        var $elementhild = $(element).children().eq(0); // 显示内容的对象
        $(element).click(function () {
            $(this).hide();
            $inputWrap.show();
            $input.focus();
            if ($elementhild.html() != text) {
                $input.val($elementhild.html());
            }
        });
        $input.on('keyup keydown', function (e) {
            util.textLimit($(this));
            if (e.keyCode == 13) {
                $inputWrap.hide();
                $(element).show();
            }
        });
        $input.on('blur', function () {
            if (flag) {
                var v = $(this).val();
                if (v) {
                    $elementhild.html($(this).val());
                } else {
                    $elementhild.html(text);
                }
            }
            $inputWrap.hide();
            $(element).show();
        })
    },
    /*
     * 删除数组值
     * @param arr: 数组对象; @param val: 要删除的值
     * */
    removeByValue: function (arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    },
    /*
     * radio组状态选中事件操作
     * @param radioname: radio 组 name; @param toggleElement: 要切换的对象
     * */
    radioToggle: function (radioname, toggleElement) {
        var dataIndex = '', length = $(toggleElement).length;
        var $obj = (radioname.indexOf(".") > -1) ? $(radioname) : $("input[name='" + radioname + "']");
        $obj.change(function () {
            dataIndex = $(this).attr('data-index');
            if (length < 2) {
                if ($(this).attr('data-index') == "1") {
                    $(toggleElement).show();
                } else {
                    $(toggleElement).hide();
                }
            } else {
                $(toggleElement).hide().eq(dataIndex).show();
            }

        });
    },
    /*
     * 滚动到某个位置元素固定
     * @param element: 元素; @param className: 固定样式; @param position：滚动到达的位置
     * */
    setScrollFixed: function (element, className) {
        var offset = $(element).offset();
        $(window).scroll(function () {
            var $this = $(this),
                viewH = $(this).height(), //可见高度
                contentH = $(document).height(), //内容高度
                scrollTop = $(this).scrollTop(); //滚动高度

            if (scrollTop - offset.top < 0) {
                $(element).css({
                    "position": '',
                    "left": 0
                });
            } else {
                $(element).css({
                    "position": 'fixed',
                    "left": offset.left,
                    "top": 0
                });
            }
        });
    },
    /*
     * 多个块之间的选择
     * */
    selectActive: function (element, classname) {
        $(element).find("li").click(function () {
            $(this).addClass(classname).siblings().removeClass(classname);
        })
    },
    /*
     * 设置排序值
     * */
    setSeqNum: function (element, callback) {
        var $target = $(element).find("span");
        var $targetEdit = $target.next();
        var value = '', index = '';

        $target.click(function (i) {
            $(this).hide().next().show().val($(this).html()).select().focus();
        });

        $targetEdit.change(function () {
            value = $(this).val();
            index = $(this).parent().attr("data-index");
            $(this).hide().prev().show().html(value);
            callback(value, index)
        });

        $targetEdit.blur(function () {  //失去焦点后
            $target.show().next().hide();
        });
    },
    /*
     * 设置颜色值
     * @param element: 颜色对象，可以是id，或classname; @param target: 作用对象; @param color:默认颜色，可以为空
     * */
    setColor: function (options) {
        var defaults = {
                element: '.color-set', //颜色发起对象
                el_reset: '.reset-color', //颜色重置对象
                target: '', //选择后颜色作用的对象
                color: '#ffffff',  //默认颜色
            },
            opts = $.extend({}, defaults, options),
            color = $(opts.element).prev().val() ? $(opts.element).prev().val() : opts.color;

        $(opts.element).css({'background-color': color});  //设置“颜色选择框”的默认颜色
        if ($(opts.target).attr("data-index") == 1) {
            $(opts.target).css({'background-color': color});
        } else {
            $(opts.target).css({'color': color});  //选择后颜色作用的对象的颜色默认值
        }

        //$(".colpick").remove();  //删除颜色
        $(opts.element).each(function () {  //初始颜色
            $(this).colpick({
                colorScheme: 'light',
                layout: 'rgbhex',
                color: color,
                onSubmit: function (hsb, hex, rgb, el) {
                    $(el).css('background-color', '#' + hex).prev().val('#' + hex);
                    if ($(opts.target).attr("data-index") == 1) {
                        $(opts.target).css({'background-color': '#' + hex});
                    } else {
                        $(opts.target).css({'color': '#' + hex});
                    }
                    $(el).colpickHide();  //隐藏
                }
            });
        });

        //重置颜色
        $(document).on('click', opts.el_reset, function () {
            var value = $(this).attr("data-value");
            $(this).prev().css({'background-color': value}).prev().val(value);
            if ($(opts.target).attr("data-index") == 1) {
                $(opts.target).css({'background-color': value});
            } else {
                $(opts.target).css({'color': value});
            }

            util.setColor({
                target: opts.target, //选择后颜色作用的对象
                element: opts.element,
                el_reset: opts.el_reset,
                color: value
            });
        });

    },
    /*
     * 事件阻止冒泡
     * */
    stopPropagation: function (e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    },
    /*
     * tab切换效果
     * @param element: 点击对象; @param className: 选中样式
     * */
    tab: function (element, classname) {
        var index = "";
        var children = $(element).children();
        children.click(function () {
            index = $(this).index();
            $(this).addClass(classname).siblings().removeClass(classname);
            $(this).parent().next().children().eq(index).show().siblings().hide();
        })
    },
    /*
     * 字数限制
     * @param filed: 表单名字; @param fieldCount: 剩余数字显示名字; @param flag：倒数减就用false
     * */
    textLimit: function (field, fieldCount, flag) {
        var $field = $(field);
        var $fieldCount = fieldCount ? $(fieldCount) : $field.next().find("em");
        var field_v = $field.val();
        var maxlimit = $field.attr('maxlength');
        var flag = flag ? flag : true;

        // 如果输入字符大于最大限制数，按最大字数截取
        if (field_v.length <= maxlimit) {
            if (flag) {
                $fieldCount.html(field_v.length);
            } else {
                $fieldCount.html(maxlimit - field_v.length);
            }
        }
    },
    toggleStretch: function (clickElem, targetElem) { // 展开收缩
        var $clickElem = $(clickElem);
        var $targetElem = $(targetElem);

        $clickElem.click(function () {
            if ($targetElem.is(":visible")) {
                $targetElem.slideUp();
                $(this).html('展开 <i class="icon-pull-down"></i>');
            } else {
                $targetElem.slideDown();
                $(this).html('收起 <i class="icon-pull-up"></i>');
            }
        })
    },
    /*
     * 会员信息必填信息和选填信息的相互隐藏显示，根据索引来对对应的项进行操作
     * @param element: 参与点击事件的对象
     * */
    togglePersonData: function (element) {
        var length = Math.ceil(($(element).length - 1) / 2);
        $(element).each(function () {
            $(this).click(function () {
                operate($(this));
            });
        });
        $(element + ':checked').each(function () {
            operate($(this));
        });
        function operate(that) {
            var index = $(element).index(that);
            //var name = $(this).attr('name').split;
            if (that.prop('checked')) {
                if (index > length) {
                    $(element).eq(index - length).parent().hide();
                } else {
                    $(element).eq(index + length).parent().hide();
                }
                that.parent().show();
            } else {
                if (index > length) {
                    $(element).eq(index - length).parent().show();
                } else {
                    $(element).eq(index + length).parent().show();
                }
            }
        }
    }
};

/*
 * 图表公共方法 echarts.js插件
 * */
var charts = {
    /*
     * 折线图
     * @param chartId
     * @param legend_data
     * @param xAxis_name
     * @param xAxis_data
     * @param yAxis_name
     * @param yAxis_data
     * @param chart_color
     * */
    line: function (chart_id, legend_data, xAxis_name, xAxis_data, yAxis_name, yAxis_data, chart_color) {
        var myChart = echarts.init(document.getElementById(chart_id));
        var color = ["#469DF7", "#3cb035", "#BAA7DF", "#D87A80"];

        option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legend_data
            },
            color: chart_color ? chart_color : color,
            noDataLoadingOption: {
                text: '暂无数据',
                effect: 'bubble',
                effectOption: {
                    effect: {
                        n: 0
                    }
                }
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    data: xAxis_data,
                    name: xAxis_name
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: yAxis_name
                }
            ],
            series: yAxis_data
        };
        myChart.setOption(option);
    },
    /*
     * 折线图--双X轴的对比图
     * @param chartId
     * @param legend_data
     * @param xAxis1_name  // 名字
     * @param xAxis1_data  // 数据
     * @param xAxis1_date //X轴数据之一（之前）
     * @param xAxis2_name  // 名字
     * @param xAxis2_data  // 数据
     * @param xAxis2_date //X轴数据之二（现在）
     * @param chart_color
     * */
    lineMultiXA: function (chart_id, legend_data, xAxis1_name, xAxis1_data, xAxis1_date, xAxis2_name, xAxis2_data, xAxis2_date, chart_color) {
        var myChart = echarts.init(document.getElementById(chart_id));
        var colors = chart_color || ["#469DF7", "#3cb035"];

        option = {
            color: colors,

            tooltip: {
                trigger: 'none',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: legend_data
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return xAxis2_name + ' ' + params.value
                                    + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                            }
                        }
                    },
                    data: xAxis2_date
                },
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return xAxis1_name + ' ' + params.value
                                    + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                            }
                        }
                    },
                    data: xAxis1_date
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: xAxis1_name,
                    type: 'line',
                    xAxisIndex: 1,
                    smooth: false,
                    data: xAxis1_data
                },
                {
                    name: xAxis2_name,
                    type: 'line',
                    smooth: false, //折线角是否圆滑
                    data: xAxis2_data
                }
            ]
        };

        myChart.setOption(option);
    },
    /*
     * 圆饼图
     * @param chartId
     * @param title_text
     * @param legend_data
     * @param yAxis_data
     * @param chart_color
     * */
    pie: function (chart_id, title_text, legend_data, yAxis_data, chart_color) {
        var myChart = echarts.init(document.getElementById(chart_id), 'macarons');

        option = {
            title: {
                text: title_text,
                x: 'center'
            },
            color: chart_color,
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: legend_data
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: false,
            series: yAxis_data
        };
        myChart.setOption(option);
    },
    /*
     * 柱状图
     * @param chartId
     * @param title_text
     * @param legend_data
     * @param yAxis_data
     * @param chart_color
     * */
    bar: function (chart_id, legend_data, xAxis_name, xAxis_data, yAxis_name, yAxis_data, chart_color) {
        var myChart = echarts.init(document.getElementById(chart_id));
        var color = chart_color || ["#469DF7"];

        option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legend_data
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            color: color,
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    name: xAxis_name,
                    data: xAxis_data
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: yAxis_name,
                    type: 'bar',
                    barWidth: 40,
                    data: yAxis_data
                }
            ]
        };
        myChart.setOption(option);
    },
    map: function (chart_id, legend_data, data) {
        var myChart = echarts.init(document.getElementById(chart_id));

        var seriesdata = [];

        if (legend_data && legend_data.length > 1) {
            for (var i = 0, len = legend_data.length; i < len; i++) {
                var dataObj = {
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    }
                };
                dataObj.name = legend_data[i];
                dataObj.data = data[i];

                seriesdata.push(dataObj);
            }
        }

        option = {
            title: {
                text: '',
                subtext: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: legend_data
            },
            visualMap: {
                min: 0,
                max: 2500,
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],           // 文本，默认为数值文本
                calculable: true
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: seriesdata
        };
        myChart.setOption(option);
    }
};
