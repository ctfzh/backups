/*
* 账号设置
* */
$(function () {
    $(".del-account").click(function () {
        layer.confirm('<p>删除操作不可恢复。</p><p>删除后，帐号不能登录做任何操作。</p>', {
            title: '提示',
            btn: ['确认','取消'] //按钮
        }, function(){
            $.ajax({
                'type': 'get',
                'url': '/system/account/account-delete.html',
                'async' : false,
                'data': {account_id: $('#account_id').val()},
                'success': function (data) {
                    location.reload();
                }
            });

            //location.reload();
        });
    })

    //修改密码
    $('.modify-password').click(function () {
        var value = $(this).attr('data-value').split(",");
        var $modifyPwd = $('#modifyPwd');
        //id
        $modifyPwd.find('#account_id').val(value[2]);
        //账号，账号名称
        $modifyPwd.find('#account').html(value[1]);
        $modifyPwd.find('#accountName').html(value[0]);
    });


    /*
     * 门店选择
     * */

    //所有多选框点击事件
    $(".treeAll input").click(function () {
        if($(this).parent().hasClass('treeAll')){
            if($(this).prop("checked")){
                $(this).parent().find("input").prop("checked", true)
            }else{
                $(this).parent().find("input").prop("checked", false)
            }
        }else{
            //获取当前的数字
            var num = $(this).attr('class').split('_')[1];
            if($(this).prop("checked")){
                //不是最后一级的情况下
                if(num != 3){
                    $(this).parent().parent().find('input').prop("checked", true);
                }
                //循环向上打勾
                while (num-- && num > 0){
                    $(this).parents(".level_" + num).find("input.level_" + num).prop("checked", true);
                }
                //’全部‘勾选上
                $(this).parents('.treeAll').find(".inputAll").prop("checked", true);
            }else{

                //假如是1 并且 第一级的所有都没勾选
                if(num == 1 && $(this).parents(".level_1").parent().find("input.level_1:checked").length == 0){
                    $(this).parents('.treeAll').find(".inputAll").prop("checked", false);
                }

                //不是最后一级的情况下
                if(num != 3){
                    $(this).parent().parent().find('input').prop("checked", false);
                }else if($(this).parent().parent().parent().find("input.level_" + num + ":checked").length == 0){
                    $(this).parent().parent().parent().find("input.level_" + (num-1)).prop("checked", false);
                }

                //当前对象的同级都没有勾选的话，循环取消所有父级的勾选
                if($(this).parents(".level_1").find("input.level_" + num + ":checked").length == 0){
                    while (num-- && num > 0){
                        $(this).parents(".level_" + num).find("input.level_" + num).prop("checked", false);
                    }
                    //当所有一级都不选中的话，全选取消
                    if($('.treeAll').find("input.level_1:checked").length == 0){
                        $(this).parents('.treeAll').find(".inputAll").prop("checked", false);
                    }
                }
            }
        }
    });
});