/**
 * 商城概要
 */
$(function () {
    //访问商城
    $(".ML-link").click(
        function (e) {
            util.qjgTips($(this),".qgj-tips");
        }
    );
    $(".qgj-tips .close").click(function () {
            $(this).parent().hide();
    });

    //商城名称编辑
    $(".remark-group").each(function () {
        remarkClick($(this),'#btnName');
    });

    $("#uploadsss").uploadify({
        'swf': '../../../js/lib/uploadify/uploadify.swf',
        'script': 'UploadHandler.ashx',
        'cancelImg': '../../js/lib/uploadify/uploadify-cancel.png',
        'folder': 'UploadFile',
        'queueID': 'fileQueue',
        'wrapClass': '',
        'buttonClass':'',
        'buttonText':'从图片库中选择',
        'auto': false,
        'multi': true
    });

});

function remarkClick(element,btn) {
    var $inputWrap = $(element).next();
    var $input = $inputWrap.find('input');  // 输入内容的input对象
    var $elementhild = $(element).children().eq(0); // 显示内容的对象

    //文本点击
    $(element).click(function () {
        $(this).hide();
        $inputWrap.show();
        $input.focus();
        if($elementhild.html() != '商城名称'){
            $input.val($elementhild.html());
        }
    });
    //输入框输入
    $input.on('keyup keydown',function () {
        util.textLimit($(this));
    });
    $(btn).on('click', function () {
        $inputWrap.hide();  //输入框隐藏
        $(element).show();  //文字框隐藏

        var remark = $input.val();
        $.ajax({
            'type': 'get',
            'url' : 'set-remark.html',
            'data': remark,
            'success': function (data) {
                if (data == 'success') {
                    $elementhild.text(remark);
                }
            }
        });
    });
};
