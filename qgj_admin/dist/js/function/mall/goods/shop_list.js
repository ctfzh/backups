function checkedAll(where){
    var name = where.attr('name');
    var bool = where.prop('checked');
    $('input[name="'+name+'[]"]').prop('checked',bool);
}

function doSearchGoods(status,where){
    where.parents('ul').find('li').each(function(){
        $(this).removeClass('active');
    });
    where.parent().addClass('active');
    $('input[name=status]').val(status);
    $('.form-search').submit();
}

function setGoods(url) {
    var get_id_array = '';
    $('input[name="goodsId[]"]').each(function () {
        if($(this).is(":checked")){
            get_id_array = get_id_array + $(this).val() + ',';
        }
    });

    if(get_id_array == ''){
        layer.alert('请选择商品');
    }else{
        location.href=url+'&ids='+get_id_array;
    }
};

$(function () {
    //点击复制链接
    $('.input-group-addon').click(function () {
        var url = $('#qrcode_url');
        url.select();
        document.execCommand("Copy"); // 执行浏览器复制命令
    });

    //点击隐藏二维码
    $('.close').click(function () {
        $(".qgj-tips").hide();
        $('#qrcode_div').hide();
        $('.img-responsive').attr('src', '');
        $('#download_qrcode').attr('href', '');
    });

    //点击链接显示二维码
    $(".ML-link").click(function () {
        var url = $(this).attr('data-url');
        var pos = $(this).offset();
        var top = $(this).height() + pos.top + 5;
        var left = pos.left - $(".qgj-tips").width()-90;
        $('#qrcode_url').val(url);
        $(".qgj-tips").css({
            left: left,
            top: top
        }).show();

        $("#qrcode_div").show();
        $(".img-responsive").attr('src', '/goods/goods/show-qrcode.html?url='+encodeURI(url));
    });

    //删除商品
    $("#del_good").click(function () {
        layer.confirm('商品删除后将无法恢复，确定删除？', {
            title:'提示',
            btn: ['确认','取消'] //按钮
        }, function(index){
            //点击确认执行内容
            layer.close(index);//关闭弹出框
        });
    });
});