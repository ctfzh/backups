/*
 * crm模块
 * */

$(function () {
    //备注修改
    $(".remark-group").each(function () {
        util.remarkClick($(this));
    });

    //会员信息必填信息和选填信息的相互隐藏显示
    util.togglePersonData(".ck-personData");

    /*
     * 添加会员卡
     * */
    // 颜色选择
    $("input[name='coverRadio']").click(function () {
        var index = parseInt($(this).attr('data-index')) + 1;
        $(".card-cover").hide();
        $("#js-card-cover-type" + index).show();
    });
    $(".js-DropdownBt").click(function (e) {
        stopPropagation(e);
        $(this).parent().addClass('open');
    });
    $(".js-dropdownList li").click(function (e) {
        $(this).parent().parent().removeClass('open');
        var color = $(this).find("a").attr('data-value');
        $(".js-bt-label").css({'background-color': color, 'background-image': 'none'}).html(color);
        $("#jsCardPic").css({'background-color': color, 'background-image': 'none'});
        if($("input[name='color']")){
            $("input[name='color']").val(color)
        }
    });
    $(document).click(function () {
        $("#js-colorpicker").removeClass('open');
    });

    // 滚动置顶
    util.setScrollFixed('.jsMenuList', 'menuListFixed');

    //可用时段
    (function () {
        var $addTimePeriod = $(".js-add-time-period"); //添加时间操作对象
        var $delTimePeriod = $(".js-del-time-period"); //删除时间操作对象
        var $jsTimeLabel = $(".jsTimeLabel");

        // 可用时段切换
        $("input[name='timeRadio']").change(function () {
            if ($(this).attr('data-index') == "1") {
                $(".js-times").show();
            } else {
                $(".js-times").hide();
            }
        });
        //时间添加
        $(document).on("click", ".js-add-time-period", function () {
            var $timeRange = $(this).prev().prev();

            var temp = '<span class="mr10">' +
                '<input type="text" class="form-control w100 inline-block">' +
                ' 至 ' +
                '<input type="text" class="form-control w100 inline-block">' +
                '</span>';

            if(!$timeRange.children().length){
                $jsTimeLabel.show();
                $delTimePeriod.show();
            }else if($timeRange.children().length == 1){
                $addTimePeriod.hide();
                $timeRange.append(temp);
            }else{
                $timeRange.append(temp);
            }
        });
        $(document).on("click",".js-del-time-period", function () {
            var children = $(this).prev().children();

            $addTimePeriod.show();
            if(children.length){
                children.eq(children.length-1).remove();
            }
            if(children.length == 1){
                $delTimePeriod.hide();
                $jsTimeLabel.hide();
            }
        });
    })();

    // 商户介绍(选填)
    (function(){
        var $jsCardMInfo = $("#jsCardMInfo");

        $jsCardMInfo.click(function () {
            if($(this).attr("data-index") == "0"){
                $(this).attr("data-index", "1").html("展开");
                $(this).parent().parent().children(".form-group").hide();

            }else{
                $(this).attr('data-index', "0").html("收缩");
                $(this).parent().parent().children(".form-group").show();
            }
        });
    })();

    //图文介绍
    (function(){
        // 文字限制
        $(".jsCdATextarea").on('keyup keydown', function () {
            util.textLimit($(this),"#jsImageTextHint",5000)
        });

        //添加
        $(".card-article-add").click(function () {
            initAddPic(0);
            $(".js-card-article-editor").show();
        });

        //取消
        $(".jsCdATCancel").click(function () {
            initAddPic(1);
            $(".js-card-article-editor").hide();
        });

        //图片编辑
        $(document).on("click","#jsCardArticleEdit",function () {
            initAddPic(0,$(".jsCardArticlePicImg").attr("src"));
            $(".js-card-article-editor").show();
        });

        // 添加图文信息清空
        function initAddPic(num, src){
            var src = src || '';
            var $cardArticleAdd = $(".card-article-add");
            var $cdArticleImg = $(".card-article-img");
            if(num == 0){
                $cardArticleAdd.addClass('editting').css("cursor","default");
            }else{
                $cardArticleAdd.removeClass('editting').css("cursor","pointer");
            }
            $cdArticleImg.removeClass("cd-article-has-img").find("img").attr("src", src);
            if(src){
                $cdArticleImg.addClass("cd-article-has-img");
            }
        }
    })();

    // //入口操作
    (function(){
        var $jsEditUrlLeft = $("#jsEditUrlLeft"); //左侧插入对象
        var $jsEdidUrlAdd = $("#jsEdidUrlAdd"); //添加入口对象
        var temp = '<li class="list-group-item">' +
            '<div class="pull-right tips-pre"><span>引导语</span> <i class="icon-arrow-right font-bold"></i> </div>'+
            '<span class="js_url_name">自定义入口(选填)</span>'+
            '</li>';
        var cloneEditUrl = '';
        var length = 0;

        // 添加入口
        $jsEdidUrlAdd.click(function () {
            clone();
            if($(this).parent().parent().children().length < 4){
                $(this).parent().before(cloneEditUrl);
                $jsEditUrlLeft.append(temp);
            }else{
                layer.msg('已经达到添加的上限');
            }

            $("#jsEditUrlLeft").show();
        });

        // 字数限制
        $(document).on("keyup keydown", ".js-textlimit0", function (e) {
            var index = $(".js-textlimit0").index($(this));
            var value = $(this).val();
           util.textLimit($(this),$(this).next().find("em"),5);
            $(".js_url_name").eq(index).html(value);
        });
        $(document).on("keyup keydown", ".js-textlimit1", function () {
            var index = $(".js-textlimit0").index($(this));
            var value = $(this).val();
            util.textLimit($(this),$(this).next().find("em"),6)
            $(".tips-pre").eq(index).find("span").html(value);
        });

        // 删除入口
        $(document).on("click", ".jsEditUrlDel", function () {
            length = $(".edit-url-item").length;
            if(length > 1){
                $jsEditUrlLeft.children().eq(length-1).remove();
                $(this).parent().parent().remove();
            }
        });

        function clone() {
            length = $(".edit-url-item").length;
            cloneEditUrl = $(".edit-url-item").eq(0).clone();
            cloneEditUrl.find('input[type="text"]').val(''); //清除所有空
            cloneEditUrl.find('.title').prepend('<a href="javascript:;" class="pull-right jsEditUrlDel">删除</a>');
            cloneEditUrl.find('input[type="radio"]').each(function (index) {
                var index = 3*length+index+1;
                $(this).attr("name","jumpType" + length)
                    .attr('id','js-jump'+ index);
                $(this).parent().attr("for",'js-jump'+ index);
            });

            switch (length){
                case 0:
                    cloneEditUrl.find(".name").html("入口一");
                    break;
                case 1:
                    cloneEditUrl.find(".name").html("入口二");
                    break;
                case 2:
                    cloneEditUrl.find(".name").html("入口三");
                    break;
            }
            return cloneEditUrl;
        }

    })();

});

// 事件阻止冒泡
function stopPropagation(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
}


// 上传图片初始化
function uploadInit() {
    var $filePicker = $("#filePicker1");
    $filePicker.html('');
    $filePicker.imgUploader({
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        fileNumLimit: 1,
        fileSingleSizeLimit: 5,
        server: '', //图片上传路径
        inputName: 'license_pic'
    })
}