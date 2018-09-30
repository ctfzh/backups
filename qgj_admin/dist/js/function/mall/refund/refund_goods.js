//退货退款

$(function () {
    //地址操作
    (function ($) {
        //手机验证
        var checkTelephone = util.check.checkTelephone();
        //区域验证
        $.validator.addMethod("checkRegion",function(value,element,params){
            return $('#province').val() != '' && $('#city').val() != '' && $('#region').val() != '';
        },"请选择门店地址");

        //添加收货地址弹出框显示执行的内容
        $("#modal_address").on('show.bs.modal', function () {
            //隐藏地址选择弹出框
            $("#modal_refund01").modal('hide');
        });

        //删除地址
        $(document).on('click','.js-del-addr', function () {
            $(this).parent().remove();
        });

        //设置默认地址
        $(document).on('click','.js-service_set-addr', function () {
            $(this).parent().parent().find("li").removeClass('active').end().find("input").prop("checked",false);
            $(this).parent().addClass('active').find("input").prop("checked",true);
        });

        //验证表单
        $("#btn_add_addr").click(function () {
            if(validate.form()){
                //得到表单元素
                var form = $("#form_add_addr").serializeArray();
                //设置地址
                setAddr('.js-add-addr', form);
                //隐藏添加地址弹出框
                $("#modal_address").modal('hide');
                //显示地址选择弹出框
                $("#modal_refund01").modal('show');
            }
        });

        var validate = $("#form_add_addr").validate({
            debug: false, //false状态表单就能提交
            rules:{
                name:{
                    required: true
                },
                phone:{
                    required: true,
                    checkTelephone: true
                },
                province: {
                    checkRegion: true
                },
                address: {
                    required: true
                }
            },
            messages:{
                name:{
                    required:"请填写用户名"
                },
                phone:{
                    required: '请输入手机号码',
                    checkTelephone: '输入的手机格式不正确'
                },
                province: {
                    checkRegion: '请选择地区'
                },
                address: {
                    required: '请填写详细地址'
                }
            },
            errorPlacement: function(error, element) {
                error.appendTo(element.parent());
            },
            errorClass: "text-danger"
        });

        //设置地址
        function setAddr(element,value) {
            var province = $("#"+ value[2].name + " option:selected").text();
            var city = $("#"+ value[3].name + " option:selected").text();
            var region = $("#"+ value[4].name + " option:selected").text();
            var temp = '<li> ' +
                '<label><input type="radio" name="radio_address"> ' +
                '【'+ value[0].value +' 收】' +
                province + ' ' + city + ' ' + region + ' ' + value[1].value + ' ' + value[5].value +
                '</label> <a href="javascript:;" class="del-addr js-del-addr">删除</a> ' +
                '<span class="default-addr">默认地址</span> ' +
                '<a href="javascript:;" class="service_set-addr js-service_set-addr">设为默认</a> ' +
                '</li>';

            $(element).parent().before(temp);
        }
    })(jQuery);
});
