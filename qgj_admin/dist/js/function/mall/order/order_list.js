$(function () {
    //全选/单选
    util.ckAll('.js-single-ck','.js-all-ck');

    //表单验证提交
    $("#button").click(function () {
        if(validate.form()){
            console.log(0)
        }
    });

    $("#print_express,#print_send_out_allGoods").on("show.bs.modal",function () {
        $(".order-num").html($(".js-single-ck:checked").length)
    });

    $(".js-remark").click(function () {
        var id = $(this).attr("data-id");
        layer.prompt(
            {
                title: '备注',
                formType: 2,
                value:'fff',
                maxlength: 100
            }
            , function(pass, index){
            $("#remark"+ id).html(pass);
            layer.close(index);
        });
    });

});

var validate = $("#form_goods").validate({
    debug: false, //false状态表单就能提交
    rules:{
        single_ck:{
            required: true
        },
        wuliu:{
            required: true
        },
        dkdkdk:{
            required: true
        }
    },
    messages:{
        single_ck:{
            required:"请填写用户名"
        },
        wuliu:{
            required:"11111"
        },
        dkdkdk:{
            required: '2525225'
        }
    },
    errorPlacement: function(error, element) {
        if (element.is(":checkbox")||element.is(":radio")){
            error.appendTo($(".table-error"));
        }else {
            error.appendTo(element.parent());
        }
    },
    errorClass: "text-danger"
});
