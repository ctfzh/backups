$(function () {

    $("#button").click(function () {
        if($("#loginForm").valid()){
            $("#cmxform").submit();
        }
    });

});

var validate = $("#loginForm").validate({
    debug: true, //调试模式取消submit的默认提交功能
    rules:{
        userInput:{
            required:true
        },
        inputPassword:{
            required:true,
            rangelength:[3,10]
        }
    },
    messages:{
        userInput:{
            required:"请填写用户名"
        },
        inputPassword:{
            required: "请填写密码",
            rangelength: "密码最小长度:{0}, 最大长度:{1}。"
        }
    },
    errorClass: "text-danger"

});
