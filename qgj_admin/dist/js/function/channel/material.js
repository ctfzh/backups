//添加选项
$(".mater-btn").click(function(){
    var num = $(".m-box-item").size(); //获得当前的数量
    var lastId = parseInt(getMaxNum(".m-box-item"))+1; //获取最大值 并+1

    //大于最大数后不能添加
    if(num>=8){
        layer.msg('你最多只可以加入8篇文章！');
        return false;
    }else{
        $(".js-material-num").html(7-num);
    }

    //获取最后一个对象的html,并赋值给新的对象，id以0开始的所以赋值当前对象的数量给它，然后插入之前最后一条记录的后面
    var insertObj = $('<div class="m-box-item" id="imageText'+ lastId +'">'+$('.m-box-item:last').html()+'</div>');
    insertObj.find(".mbi-title").html('标题');
    insertObj.find("img").attr("src","");
    insertObj.insertAfter($('.m-box-item:last'));
    $(".m-box-item:last-child");

    //清空所有input的值
    $('.m-box-item input').val('');
    var reg = /\d+/g;

    //替换name里data后面的数字
    $('.m-box-item:last input').each(function(){
        var nameResult = $(this).attr("name").replace(reg,lastId);
        $(this).attr("name",nameResult);
    });
    insertObj.click();
});


(function () {
    var $materialNum = $(".js-material-num");
    var materialL = ".material-add .m-box-item";
    var $materialL = $(materialL);

    //getArrData();

    // 左侧点击，右侧出现
    $(document).on("click", materialL, function () {
        var index = $(this).index();
        setArrData(); //把之前的值加入到里面
        clearData(); // 清除数据
        $(".m-box-item").removeClass('active');
        $(this).addClass('active');
        getArrData(); //赋值;
    });

    //control控制---鼠标滑上去
    $(document).on('mouseover mouseout',materialL,function (event) {
        if(event.type == 'mouseover'){
            $(this).find(".control").show();
        }else if(event.type == 'mouseout'){
            $(this).find(".control").hide();
        }
    });
    //control控制---点击向上排序
    $(document).on('click','.js-material-up',function () {
        var element_parent = $(this).parents('.m-box-item');
        changeAttr(element_parent,true);
    });
    //control控制---点击向下排序
    $(document).on('click','.js-material-down',function () {
        var element_parent = $(this).parents('.m-box-item');
        changeAttr(element_parent,false);
    });

    //删除素材项
    $(document).on('click', '.js-material-del', function () {
        var parent = $(this).parents(".m-box-item");
        parent.prev().click();
        parent.remove();
    });

    //右侧点击后赋值给左侧 右侧的隐藏域赋值
    $("input[name='title']").on('keyup keydown change paste blur', function () {
        var $materialActive = $(".material-add .m-box-item").filter(".active");
        $materialActive.find(".mbi-title").html($(this).val());
        util.textLimit($(this),$(this).next().find("em"),false);
    });
    //作者
    $("input[name='author']").on('keyup keydown', function () {
        util.textLimit($(this),$(this).next().find("em"),false);
    });
})();

//位置改变后，对应的属性也要改变
function changeAttr(el,flag) {
    var $moveObj_prev = flag ? el.prev() : el.next(),  //上一个对象
        $moveObj_inputName = el.find("input").attr("name"),
        $moveObj_id = el.attr("id"),
        $moveObj_prev_inputName = $moveObj_prev.find("input").attr("name"),
        $moveObj_prev_id = $moveObj_prev.attr("id");

    el.attr("id",$moveObj_prev_id).find("input[type='hidden']").attr("name", $moveObj_prev_inputName);
    $moveObj_prev.attr("id",$moveObj_id).find("input[type='hidden']").attr("name", $moveObj_inputName);

    flag ? $moveObj_prev.before(el) : $moveObj_prev.after(el);
}

//获取表单数据，转成json 存到数组中
function setArrData() {
    var t = $("input[type='text'],textarea, .hidden_img").serializeArray();
    var data = {};

    $.each(t, function () {
        if (this.name != '_csrf') {
            data[this.name] = this.value;
        }
    });

    $(".m-box-item.active").find('input').val(JSON.stringify(data));
}

//清空数据
function clearData() {
    //清空所有值
    $("input[type='text'],textarea, .hidden_img").val('');
    UE.getEditor('right_content').setContent('');
}

//获取表单值并赋值
function getArrData() {
    // 获取id，然后查找数据并赋值
    var arrData = $(".m-box-item.active").find('input').val();
    var t = $(".form-horizontal");

    if (arrData) {
        var obj1 = $.parseJSON(arrData);
        $(".m-box-item.active .mbi-title").html(obj1['title']);
        $(".m-box-item.active").find('img').attr("src",obj1['wechat_img']);
        for(var i in obj1) {
            if (i == 'digest') {
                $(t).find("textarea[name='"+i+"']").val(obj1[i]);
            } if(i == 'content') {
                UE.getEditor('right_content').setContent(obj1[i]);
            }else{
                $(t).find("input[name='"+i+"']").val(obj1[i]);
            }
        }
    }
}

//获得对象id里的最大值
function getMaxNum(obj){
    var arr = new Array();
    var arrMax;

    //把值放入数组里
    $(obj).each(function(){
        arr.push($(this).attr("id").slice(9));
    });

    //获取最大值
    arrMax = arr[0];
    for(var i=1;i<arr.length;i++){
        if(arrMax<arr[i]){
            arrMax=arr[i];
        }
    }
    arr = []; //清空数组
    return arrMax;
}

$("#news-save-btn").click(function () {
    setArrData(); //把之前的值加入到里面
    
    if (formInvalide()) {
        $('.form-horizontal').submit();
    }
});

//验证表单
function formInvalide() {
    //查找左侧所有input
    var inputAll = $('.mater-box input[type=hidden]');
    var flag = 'success';
    inputAll.each(function () {
        var data = $(this).val();
        if (data) {
            data = JSON.parse(data);
            if (!valideparams(data)) {
                $(this).parent().click();
                flag = 'fail';
                return false;
            }
        }
    });

    if (flag == 'success') {
        return true;
    } else {
        return false;
    }
}

function valideparams(data) {
    var name = '';
    var flag = 'success';
    for(name in data){
        if(!data[name]){
            $('.'+ name +'Error').show();
            flag = 'fail';
        }else{
            $('.jsInputError').hide();
        }
    }

    if (flag == 'success') {
        return true;
    } else {
        return false;
    }
}