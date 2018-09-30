/*
 *  渠道模块
 * */

$(function () {
    // 自动回复菜单切换
    $('#replayMenu li').click(function () {
        var index = $(this).index();
        var dataIndex = $(this).attr('data-index');
        $(this)
            .find('a')
            .addClass('text-black')
            .end()
            .siblings().find('a').removeClass('text-black');
        $('#replayBD').children().removeClass('show').eq(index).addClass('show');
        $("#imageTextInput").val(dataIndex);
        if ($(this).find("i").hasClass("icon-text")) {
            $('#replayFT').addClass('show');
        } else {
            $('#replayFT').removeClass('show');
        }
    });
    // 文字字数限制
    $('#replayText').on('keyup keydown', function () {
        util.textLimit('#replayText','#maxlimit',false)
    });

    // 图文库选中状态
    $('.imgt-wrap-modal .list').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    // 初始化瀑布流
    if ($('.masonry').length > 0) {
        util.masonryInit('.masonry', '.list', 20);
    }
    //素材加载
    $('#modalImgtext, #modalNewtext').on('shown.bs.modal', function () {
        setTimeout(function () {
            util.masonryInit('.imgt-wrap-modal', '.list', 20);
        },150)
    });

    //tab切换效果
    util.tab('.tab-title','active');
});




/**
 * 设置公共插件 值
 * @param data
 */
function setComponents(data) {
    var jsonData = JSON.parse(data);
    var index;
    if (jsonData.content_type == 1) {
        index = 0;
        if (jsonData.content_detail != '') {
            $('input[name="media_id"]').val(jsonData.content_detail);
            $("#replayBD .imgt-wrap").prepend(getImgtextHtml(jsonData.content_detail)).show().prev().hide();
        }
    }
    if (jsonData.content_type == 2) {
        index = 1;
        $('#replayText').val(jsonData.content_detail);
    }
    if (jsonData.content_type == 3) {
        index = 2;
        $("#material_upload_image").hide();
        $('.uploader .img').show();
        $(".uploaded-img").attr('src', jsonData.img);
        $('input[name="media_id"]').val(jsonData.content_detail);
    }

    $('input[name="image_text_input"]').val(jsonData.content_type);
    $('#replayMenu li').eq(index).siblings().find('a').removeClass('text-black');
    $('#replayMenu li').eq(index).find('a').addClass('text-black');
    $('#replayBD').children().removeClass('show').eq(index).addClass('show');
}

//获取弹出框元素
function getImgtextHtml(index){
    var html = '';
    $("#modalNewtext .list").each(function () {
        if($(this).attr("data-index") == index){
            html = $(this).clone();
        }
    });

    return html;
}

//常用链接保存
function link_save(url) {
    $("input[name=url]").val(url);
}

//弹出框图文素材保存
function new_save() {
    $("#replayBD .imgt-wrap").prepend('<div class="list">'+$(".list.active").html()+'</div>').show().prev().hide();
    $('input[name="media_id"]').val($(".list.active").find("input").val());
}



//弹出框图文素材删除
function new_delete(_this) {
    $(_this).parent().prev().remove();
    $(_this).parent().parent().hide()
    $(_this).parent().parent().prev().show();
    $("input[name='media_id']").val('');
}

//删除卡券
function card_coupon_delete(_this) {
    $(_this).parent().parent().parent().prev().show();
    $(_this).parent().parent().parent().hide();
    $("input[name='media_id']").val('');
}