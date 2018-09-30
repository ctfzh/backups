/*
 * 小程序用户列表
 * */

$(function () {
    //备注修改
    $(".remark-group").each(function () {
        util.remarkClick($(this));
    });

    util.daterangepicker("timeLately");  //最近访问时间
    $("#timeFirst").daterangepicker({ //首次访问时间
        timePicker: false,
        singleDatePicker: false,
        opens:"left",
        format: "YYYY/MM/DD"
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

