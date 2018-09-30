/**
 * Created by Admin on 2017/12/26.
 */

$(function(){
    //点击除class为qie以外的元素隐藏状态切换
    $(document).click(function(){
        $(".qie").hide();
        $(".emoji").hide();
    });
    //点击显示表情选择卡
    $(".icon-Expression").click(function(event){
        event.stopPropagation();
        $(".emoji").show();
    });
    //点击class为qie的元素显示状态切换
    $(".zhuangtai").click(function(event){
        event.stopPropagation();
        $(".qie").show();
    });
    //离线在线切换
    $('.qie li').click(function(){
        $(".zhuangtai").text($(this).text())
    });

    //关闭聊天窗口
    $(".service_window_Close").click(function(){
        var wind = $(this).parent().parent(".service_window");
        wind.hide();;
        $(".list_click").removeClass("list_click");
    });
    //打开对应的聊天窗口
    //根据元素下标选择打开对应的窗口
    $(".service_list").click(function(){
        $(".list_click").removeClass("list_click");
        $(this).addClass("list_click none");
        console.log($(this).index());
        $(".service_window").hide();
        $(".service_window").eq($(this).index()-2).show();
    });
    //排队列表关闭
    $(".jiedai").click(function(){
        $(".san_ji_list").show();
    });
    //排队列表打开
    $(".fanhui").click(function(){
        $(".san_ji_list").hide();
    });
    //表情插件

    //发送
    $(".sub_btn").click(function(){
        //文本框中的表情与文字
        var str = $(".edit_text").val();
        //头像地址
        var Picture = "../../../img/logo.png";
        if(str!=""){
            //发送输入的聊天内容
            add_record(Picture,str,1);
            //清空输入
            $(".edit_text").val("");
        }else{
            alert("请输入需要发送的内容")
        }
    });

    //表情转换


    //窗口大小改变事件
    $(window).resize(function() {
        //改变窗口使聊天窗口滚动条保持在最下面
        scroll_bottom($(".news_win"));
    });
    //初始化使聊天窗口滚动条保持在最下面
    scroll_bottom($(".news_win"));


//切换
    $(".d_service").click(function(){
        $(".daohang_list").removeClass("daohan_di");
        $(this).addClass("daohan_di");
        $(".q_session_history").hide();
        $(".q_service").show();
    });
    $(".d_session_history").click(function(){
        $(".daohang_list").removeClass("daohan_di");
        $(this).addClass("daohan_di");
        $(".q_service").hide();
        $(".q_session_history").show();
    });

    //查看更多消息
    $(".more_news").click(function(){
        //文本框中的表情与文字
        var str = "555";
        //头像地址
        var Picture = "../../../img/logo.png";
        add_record(Picture,str,2);
    });
    //滚轮事件
    //for Firefox
    document.getElementById("debug").addEventListener("DOMMouseScroll", mousewheelHandler, true);
    //for Chrome Safari
    document.getElementById("debug").addEventListener("mousewheel", mousewheelHandler, true);
    //加载emoji表情
    renderEmoji();
    //文本框输入emoji
    $(".emo").click(function(){
        var text_emo = $(".edit_text").val();
        text_emo += decode($(this).html());
        $(".edit_text").val(text_emo) ;
    });
});

//发送消息方法add_state==1
//查看消息记录方法add_state==2
function add_record(Picture,str,add_state){
    var cont = "<div class='dialogue_list dialogue_right'><div class='dialogue_img'><img src='" +
        Picture +
        "'/></div><div class='dialogue_list_cont'><div class='jiao'></div><div class='dialogue_cont_text'>" +
        str + "</div></div></div>";
    if(add_state == 1){
        $(".max_duihua").append(cont);
        //滚动条固定
        scroll_bottom($(".news_win"))
    }else if(add_state == 2){
        $(".max_duihua").prepend(cont);
    }
}
//解析存储的emoji表情
function parse(arg) {
    if (typeof ioNull !='undefined') {
        return  ioNull.emoji.parse(arg);
    }
    return '';
};
//反解析（web上，图片数据转为emoji字符编码存储）
function decode(htmlStr) {
    if (typeof ioNull == 'undefined') {
        return '';
    }
    var tempStr = htmlStr, unis = '', $imgs = $('<div>').append(htmlStr).find('img');
    $.each($imgs , function (i, o) {
        var $img = $(o);
        var unicode16 = '0x' + $img.attr('unicode16'); //十六进制
        unicode16 = ioNull.emoji.decodeChar(unicode16);
        //unis += unicode16;
        tempStr = tempStr.replace($('<div>').append($img).html(), unicode16);
    });
    //System.log(unis)
    return tempStr;
};
//示例生成emoji图片输入
function renderEmoji()
{
    var emos = getEmojiList()[0];//此处按需是否生成所有emoji
    var html = '<ul>';
    for (var j = 0; j < emos.length; j++) {
        var emo = emos[j];
        var data = 'data:image/png;base64,' + emo[2];
        if (j % 20 == 0) {
            html += '<li class="emo">';
        } else {
            html += '<li class="emo">';
        }
        html += '<img src="' + data + '"  unicode16="' + emo[1] + '" /></li>';
    }
    $(".emoji").html(html)
}

//鼠标滚动查看更多消息
// delta > 0 = 向上滚动
// delta < 0 = 向下滚动
function mousewheelHandler(e){
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if(delta > 0){
        if($(this).scrollTop()==0){
            //文本框中的表情与文字
            var str = "555";
            //头像地址
            var Picture = "../../../img/logo.png";
            add_record(Picture,str,2);
        }
    }
}

//滚动条保持底部
function scroll_bottom(o){
    o.scrollTop(o.prop("scrollHeight"))
}










