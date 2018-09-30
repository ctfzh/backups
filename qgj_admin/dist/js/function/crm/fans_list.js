/*
 * 粉丝列表
 * */

$(function () {
    //备注修改
    $(".remark-group").each(function () {
        util.remarkClick($(this));
    });

    util.ckAll('.ckSingle', '.ckAll')

    //静态分组添加
    $(".jsULCreateGroup").click(function () {
        $(this).hide().next().show();
    });
    $(".jsULCancelGroup").click(function () {
        $(this).parent().hide().prev().show();
    });
    $(".jsULAddGroup").click(function () {
        $(this).parent().hide().prev().show();
        $(this).prev().val();
    });

    //创建动态分组点击事件
    $('#dynamic_group_btn').click(function () {
        var reg = /^[\u4e00-\u9fffa-zA-Z0-9]{1,15}$/;//最多只能输入15个字符
        var rule = JSON.stringify($('.form-search').serializeArray());//转成json字符串的筛选条件
        var dynamic_group_name = $('#dynamic_group_name').val();//动态分组名称
        if (dynamic_group_name == '') {
            layer.msg('请输入动态分组名称');
            return false;
        }
        if (!reg.test(dynamic_group_name)) {
            layer.msg('动态分组名称不能超过15个字符');
            return false;
        }

        $.ajax({
            'type': 'get',
            'url' : '/crm/group/add-dynamic-group.html',
            'data': {name: dynamic_group_name, rule: rule},
            'success': function (data) {
                if (data == 'success') {
                    layer.msg('创建动态分组成功');
                } else {
                    layer.msg('创建动态分组失败');
                    return false;
                }
            }
        });

    });

    //显示/隐藏高级选项
    $(".toggleStretch").click(function (e) {
        if(e.target.dataset.index == "1"){
            $('.isToggleItem').show();
            $(this).attr("data-index","0").html("隐藏高级选项");
        }else{
            $('.isToggleItem').hide();
            $(this).attr("data-index","1").html("显示高级选项");
        }
    });

});

/*
 * 备注编辑
 * @param element: 元素
 * */
function remarkClick(element) {
    var $inputWrap = $(element).next();
    var $input = $inputWrap.find('input');  // 输入内容的input对象
    var $elementhild = $(element).children().eq(0); // 显示内容的对象
    $(element).click(function () {
        $(this).hide();
        $inputWrap.show();
        $input.focus();
        if($elementhild.html() != '备注'){
            $input.val($elementhild.html());
        }
    });
    $input.on('keyup keydown',function () {
        util.textLimit($(this));
    });
    $input.on('blur', function () {
        $inputWrap.hide();
        $(element).show();

        var id = $(this).parents('tr').eq(0).find('input').val();
        if (id == null) {
            id = $('#id').val();
        }
        var obj = $input;
        var remark = $(obj).val();
        var last_value = $(obj).attr('last-value');
        $.ajax({
            'type': 'get',
            'url' : 'set-remark.html',
            'data': {id: id, remark: remark},
            'success': function (data) {
                if (data == 'success') {
                    $elementhild.text(remark);
                    $(obj).attr('last-value', remark);
                } else {
                    if (last_value) {
                        $elementhild.text(last_value);
                    } else {
                        $elementhild.text('备注');
                    }
                    alert(data);
                }
            }
        });
    });
};

