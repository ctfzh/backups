/*
 * 关键词回复js文件
 * */
(function () {

    //回车添加关键词
    $(document).on('keydown', function (e) {
        if(e && e.keyCode==13){ // enter 键
            var v = $("#jskwrAdd").val();
            var keyWords = $("input[name='key_words']");
            if (v != '') {
                var key_words = keyWords.val();
                var len = key_words.split(",").length-1;

                var temp = '<li class="badge"><span>'+ v +'</span><em>×</em></li>';
                $("#jskwrAddPos").append(temp);
                $("#jskwrAdd").val('');
                if(key_words == '') {
                    key_words = ','+v+',';
                } else {
                    key_words = key_words+v+',';
                }
                keyWords.val(key_words);
            }
        }
    });
    //删除关键词
    $(document).on('click', '#jskwrAddPos em', function () {
        $(this).parent().remove();
        var keyWords = $("input[name='key_words']").val();
        var keyval = $(this).prev().text() + ',';
        console.log(key_words);

        var key_words1 = keyWords.replace(new RegExp(keyval, 'g'), "");
        $("input[name='key_words']").val(key_words1);
    });

    // 搜索匹配类型选择
    $(".search-match a").click(function () {
        var index = $(this).index();
        $("input[name='key_words_type']").val(index+1);
        $(this).addClass('text-primary').siblings().removeClass('text-primary');
    });

    //初始化关键字类型
    var key_words_type = $("input[name='key_words_type']").val();
    var index1 =  key_words_type -1;
    $(".search-match a").eq(index1).addClass('text-primary').siblings().removeClass('text-primary');

})();

//表单验证码
$(function () {
    // console.log(validate.form());
    $("#save-btn").click(function () {
        if(validate.form()){
            var image_text_input = $("input[name='image_text_input']").val();
            var media_id = $("input[name='media_id']").val();
            var content = $("textarea[name='content']").val();
            var wechat_img = $("input[name='wechat_img']").val();
            var $imageTextInputError = $('.js-image_text_input_error'); // 菜单内容的错误提示

            if (image_text_input == 1 && media_id == ''){
                $imageTextInputError.show().html('请选择图文消息');
                return false;
            }
            if(image_text_input == 2 && content == ''){
                $imageTextInputError.show().html('请填写文字');
                return false;
            }
            if(image_text_input == 3 && wechat_img == ''){
                $imageTextInputError.show().html('请选择图片');
                return false;
            }
            $(".form-horizontal").submit();
        }
    });
});

var validate = $(".form-horizontal").validate({
    debug: false, //调试模式取消submit的默认提交功能
    rules:{
        title:{
            required:true,
            maxlength: 30
        },
        key_words:{
            required:true
        }
    },
    messages:{
        title:{
            required: "请填写规则名",
            maxlength: '规则名最多{0}个字'
        },
        key_words:{
            required: "请填写关键词"
        }
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent());
    },
    errorClass: "text-danger mt5",
    ignore:""
});