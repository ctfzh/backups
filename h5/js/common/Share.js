/**
 * Created by Admin on 2017/11/23.
 */
$(function(){
    //图片延时加载
    Echo.init({
        offset: 100,//离可视区域多少像素的图片可以被加载
        throttle: 0 //图片延时多少毫秒加载
    });
    //弹出导航,禁止滚动
    $(".navlogo").click(function(){
        var a = $(document).scrollTop();
        $("body").addClass("ov");
        $("body").css({"top" : "-" + a +"px"});
        $(".header").addClass("nav_click");
    });
    $(".nh_Close").click(function(){
        var b = $("body").offset().top;
        $("body").removeClass("ov");
        $(document).scrollTop(-b);
        $(".header").removeClass("nav_click");
    });
})
