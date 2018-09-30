/**
 * 分销商招募
 */

$(function () {
    //文本编辑器初始化
    let ue = UE.getEditor('container',{
        initialFrameWidth: "100%",
        initialFrameHeight: 300,
        toolbars: [
            ['bold', 'source', 'fontsize','paragraph','rowspacingtop','rowspacingbottom','lineheight', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc','edittable','edittd', 'link', 'insertimage']
        ]
    });

    ue.ready(function() {//编辑器初始化完成再赋值
        ue.setContent($(".js-regions").html());  //赋值给UEditor
    });
    //当编辑器里的内容改变时执行方法
    ue.addListener("contentChange",function(){
        let $regions = $(".js-regions");
        $regions.html(ue.getContent());
    });

    //颜色选择
    util.setColor({
        target: '.js-regions', //选择后颜色作用的对象
        element: '.color-set',   //颜色选取对象
        el_reset:'.reset-color',  //重置颜色对象
    });
    //是否全屏
    $(document).on('click', '.js-isFullscreen',function () {
        let $regions = $(".js-regions");
        if($(this).prop("checked")){
            $regions.removeClass("p15");
        }else{
            $regions.addClass("p15");
        }
    });
});