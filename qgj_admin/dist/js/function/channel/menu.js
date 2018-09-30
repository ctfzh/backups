//渠道---自定义菜单
//------------------------


//排序后，改变原有的序号
function changeInputNameNum() {
    var menuParent = $(".js-parent-menu"); //得到父元素
    var childInput = '';
    //循环父元素，取得id,
    menuParent.each(function (index) {
        childInput = $(this).find("input[type='hidden']");
        childInput.each(function () {
            if($(this)){
                $(this).attr("name", $(this).attr("name").replace(/\d+/g, index));
            }
        });
    });
}

/**
 * 删除父级菜单
 */
function delParentMenu() {
    var a = $("#menu-manage .menu-parent-item").length;
    var $sortBtn = $(".js-menu-sort-btn");
    $(".js-add-parent-menu").css('width', (3 - a) * 33.333 + '%');
    a < 2 ? $sortBtn.prop("disabled", true).addClass("disabled")
        : $sortBtn.prop("disabled", false).removeClass("disabled");
}

/**
 * 计算字符串的长度
 * @param str
 * @returns {number}
 */
function getStrLength(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
            len += 2;
        } else {
            len++;
        }
    }
    return len;
}
/**
 * 检验菜单管理-> 菜单名称
 * @param name
 * @param num
 * @returns {boolean}
 */
function checkMenuName(name, num) {
    var $nameError = $("#menu-manage").find(".js-menu-name-error");
    if (name === "") {
        $nameError.show();
        $nameError.html("菜单名称不能为空！");
        return false;
    } else if (getStrLength(name) > num) {
        $nameError.show();
        $nameError.html("菜单名称格式错误！");
        return false;
    } else {
        $nameError.hide();
        return true;
    }
}
/**
 * 用于根据radio内容变化
 * @param el1
 * @param el2
 */
function boxSwitch(el1, el2) {
    el1.click(function () {
        var menuParentActive = $(".menu-parent-item").filter(".active");
        var menuChildActive = $(".menu-child-item").filter(".active");
        var curObj = $(".js-parent-menu").data("curObj");
        var curObjChild = $(".menu-child-item").data("curObj");
        var n = $(this).attr("n");
        el2.hide();
        el2.eq(n-1).show();
        $("#menuCon-error").hide();
        $(menuParentActive).children("input").eq(2).val(parseInt(n) + 1);
        $(menuChildActive).children("input").eq(2).val(parseInt(n) + 1);
    })
}

$(function () {
    // 渠道管理的菜单管理
    (function channelMenu() {
        var $menuManage = $("#menu-manage");
        var $addPrentMenu = $menuManage.find(".js-add-parent-menu"); //父菜单添加按钮
        var $sortBtn = $menuManage.find(".js-menu-sort-btn");
        var $parentCon = $menuManage.find(".menu-parent-content");
        var $commonCon = $menuManage.find(".menu-common-content");
        var $emptyTip = $menuManage.find(".menu-empty-tip");
        var $nameError = $menuManage.find(".js-menu-name-error");
        var $titleInput = $menuManage.find(".js-title-input");
        var $urlInput = $menuManage.find(".js-url-input");  //右侧url点击对象
        var $textareaInput = $menuManage.find(".js-textarea-input");  //右侧url点击对象
        var $menuName = $menuManage.find(".js-menu-name");
        var $imageTextInputError = $('.js-image_text_input_error'); // 菜单内容的错误提示
        var $valide = 'success';

        // 删除菜单
        $(".js-del-menu").click(function () {
            var menuParentActive = $(".menu-parent-item").filter(".active"); //父菜单
            var menuChildActive = $(".menu-child-item").filter(".active");
            var length, mid;

            layer.confirm('删除后菜单下设置的内容将被删除', {
                title: "温馨提示",
                offset: 100,
                btn: ['确定', '取消'] //按钮
            }, function () {
                layer.msg('成功删除菜单', {offset: 100, time: 1000});

                menuChildActive.length && menuChildActive.remove();
                menuParentActive.length && menuParentActive.remove() && $addPrentMenu.show();
                delParentMenu();
                $(".menu-child-box").hide();
                $parentCon.hide();
                $commonCon.hide();
                $emptyTip.show();

                // 重新赋值序号
                $(".menu-parent-item").each(function(index){
                    $(this).children("input[type=hidden]").attr('name','menu['+ index +'][main]');
                    $(this).find('.menu-child-item input').attr('name','menu['+ index +'][sub][]');
                })
            });
        });

        //验证表单
        function formInvalide() {
            //查找左侧所有input
            var inputAll = $('.menu-parent input[type=hidden]');
            inputAll.each(function () {
                var data = $(this).val();
                if (data) {
                    data = JSON.parse(data);

                    if (valideparams(data) == false) {
                        $(".menu-child-box").hide();
                        $(this).parent().click();
                        $('#replayMenu li').eq(data.image_text_input-1).click();
                        var menuChildBox = $(this).parents('.menu-child-box');
                        if (menuChildBox) {
                            menuChildBox.show();
                        }

                        $valide = 'fail';
                        return false;
                    } else {
                        $valide = 'success';
                    }
                }
            });

            if ($valide == 'success') {
                $('#formMenuR').submit();
            }
        };

        //返回当前active对象是一级菜单并且有二级菜单的条件结果
        function getparentFlag(){
            var menuParentActive = $(".menu-parent-item").filter(".active"); //父菜单
            var flag = menuParentActive && menuParentActive.find('.menu-child-item').length > 0;
            return flag;
        }

        function valideparams(data) {
            var flag = 'success';

            if (data.name == '') {
                $("#nameError").show().html('菜单名称不能为空');
                flag = 'fail';
            }

            // 当前active对象是一级菜单并且有二级菜单的时候就不进行判断
            if(!getparentFlag()){
                if (data.menu_content == 1) {
                    if (data.image_text_input == 1 && data.media_id == ''){
                        $imageTextInputError.show().html('请选择图文消息');
                        flag = 'fail';
                    }
                    if(data.image_text_input == 2 && data.content == ''){
                        $imageTextInputError.show().html('请填写文字');
                        flag = 'fail';
                    }
                    if(data.image_text_input == 3 && data.wechat_img == ''){
                        $imageTextInputError.show().html('请选择图片');
                        flag = 'fail';
                    }
                } else {
                    if (data.url == '') {
                        $imageTextInputError.show().html('请输入链接');
                        flag = 'fail';
                    }
                }
            }

            if (flag == 'success') {
                return true;
            } else {
                return false;
            }
        }

        //清空数据
        function clearData() {
            $('input[type="text"],textarea,.hidden_img').val(''); //所有右侧表单元素清空
            $('.js-menu-con-switch').eq(0).trigger('click'); //菜单内容清除
            $('.js-send-type li').eq(0).trigger('click'); //图文菜单恢复到第一个tab
            $('#replayBD').children().eq(0).find('.row').show().next().hide(); //图文菜单恢复到第一个子对象

            //菜单内容选项卡
            $('#imageTextInput').val(2);
        }

        //获取表单数据，转成json 存到数组中
        function setArrData() {
            var data = {};
            var $menuElement = '';
            var t = getparentFlag() ? $("input[name='name']").serializeArray() : $("input[type='text'],textarea,.hidden_img").serializeArray();
            var prevMenu = ''; //获取之前对象

            $menuElement = $(".menu-parent").find(".active");

            if ($menuElement) {
                $.each(t, function () {
                    data[this.name] = this.value;
                });

                data['menu_content'] = $("input[name='menu_content']:checked").val();

                $menuElement.children("input").val(JSON.stringify(data));
            }
        }

        function getMenuId(){
            var menuId = "";
            var $menuElement = $(".menu-parent").find(".active");

            if ($menuElement.hasClass("menu-parent-item")) {
                menuId = $(".js-parent-menu").index($menuElement);
            } else if ($menuElement.hasClass("menu-child-item")) {
                menuId = $(".js-parent-menu").index($menuElement.parents(".js-parent-menu")) + '_' + $(".menu-child-item").index($menuElement);
            }
            return menuId;
        }

        //获取表单值并赋值
        function getArrData() {
            // 获取id，然后查找数据并赋值
            var $menuElement = $(".menu-parent").find(".active");
            var data = $menuElement.children("input").val();
            var index;
            if(data){
                data = JSON.parse(data);
                for(var key in data){
                    var obj = $('[name="'+ key +'"]');
                    if(obj.attr("type") == 'radio' || obj.attr("type") == 'checkbox'){
                        $('[name="'+ key +'"][value="' + data[key] + '"]').prop("checked",true).click();
                    }else{
                        obj.val(data[key]);
                    }
                }

                if(data.menu_content == 1) {
                    if (data.image_text_input != '') {
                        //图文
                        if(data.image_text_input == '1') {
                            index = 0;
                            $("#replayBD .imgt-wrap").find('.list').remove().end().prepend(getImgtextHtml(data.media_id)).show().prev().hide();
                        }

                        //文字
                        if(data.image_text_input == '2') {
                            index = 1;
                            $('input[name="content"]').val(data.content);
                        }

                        //图片
                        if(data.image_text_input == '3') {
                            index = 2;
                            $("#material_upload_image").hide();
                            $('.uploader .img').show();
                            $(".uploaded-img").attr('src', data.url_img);
                            $('input[name="media_id"]').val(data.media_id);
                        }

                        $('input[name="image_text_input"]').val(data.image_text_input);
                        $('#replayMenu li').eq(index).siblings().find('a').removeClass('text-black');
                        $('#replayMenu li').eq(index).find('a').addClass('text-black');
                        $('#replayBD').children().removeClass('show').eq(index).addClass('show');
                    }
                }
            }
        }

        /**
         * 子菜单点击执行操作
         * @param el
         */
        function subMenuClick(el) {
            $parentCon.show();
            $commonCon.show();

            setArrData(); //把之前的值加入到里面
            $(".menu-child-item").removeClass("active");
            $(".js-parent-menu").removeClass("active");
            el.addClass("active"); //添加主菜单active
            getArrData(); //赋值;

            $(".js-menu-name-tip").html("字数不超过8个汉字或16个字母");
        }

        /**
         * 添加父级的菜单
         * @returns {boolean}
         */
        function addParentMenu(_this) {
            var index = $(".menu-parent-item").length;
            var $el = $('<li class="menu-parent-item js-parent-menu">' +
                '<div class="menu-parent-name-wrap"><i class="icon-plus hidden"></i><span class="menu-parent-name">菜单名称</span></div> ' +
                '<div class="menu-child-box" style="display: none;"> ' +
                '<ul class="menu-child sortable js-child-menu"> ' +
                '<li class="add-menu-box unsortable js-add-menu"><i class="icon-plus"></i></li> ' +
                '</ul> ' +
                '<i class="arrow arrow_out"></i> ' +
                '<i class="arrow arrow_in"></i> ' +
                '</div>' +
                '<input type="hidden" name="menu['+ index +'][main]" value="" class="hidden-left">'+
                '</li>');

            $el.insertBefore($addPrentMenu);
            $el.click();

            var a = $("#menu-manage .menu-parent-item").length;
            if (a === 3) {
                $addPrentMenu.hide();
                return false;
            }
            $addPrentMenu.css('width', (3 - a) * 33.333 + '%');
        }

        // 父菜单切换
        $(document).on("click", ".js-parent-menu", function () {
            var name = $(this).find(".menu-parent-name").html();
            setArrData(); //把之前的值加入到里面
            $(".menu-child-item").removeClass("active"); //清除所有子菜单的active
            clearData(); // 清除数据
            $(this).addClass("active").siblings().removeClass("active"); //添加主菜单active
            getArrData($(this)); //赋值;
            $(".js-parent-menu").find(".menu-child-box").hide(); //所有子框的都隐藏
            $(this).find(".menu-child-box").show(); //当前的子框显示
            var childLength = $(this).find(".menu-child-box .menu-child-item").length;
            //if (sortable) {
            if (childLength > 0) {
                $parentCon.show();
                $commonCon.hide(); // 菜单内容
            } else {
                $parentCon.show();
                $commonCon.show();
            }
            $emptyTip.hide(); //右侧"请点击左侧菜单进行编辑操作"内容隐藏
            //}
            // 菜单标题切换
            $(".js-menu-name-tip").html("字数不超过5个汉字或10个字母");


            $(".js-menu-con-switch").eq($(this).children("input").eq(2).val() - 1).attr("checked", true).click();
            $(".menu-content-type li").removeClass("active").eq($(this).children("input").eq(3).val() - 1).addClass("active").click();
        });

        $("#menu-save-btn").click(function () {
            //判断是否具有发布权限
            var right = checkFunctionRightsWindow('05', '0501', '050102');
            if(right){
                setArrData(); //把之前的值加入到里面
                formInvalide();
            }else{
                layer.alert('您没有该权限');
            }
        });

        // 父级菜单增加
        $(".js-add-parent-menu").click(function () {
            addParentMenu($(this));
            delParentMenu();

        });

        /**
         * 显示隐藏三角箭头
         */
        function hideArrow() {
            $(".js-child-menu").each(function () {
                if (!$(this).find(".menu-child-item").length) {
                    $(this).siblings(".arrow").hide();
                }
            })
        }

        // 父级菜单切换
        var sortable = true;

        // 点击排序按钮
        $sortBtn.click(function () {
            var $parentMenu = $menuManage.find(".js-parent-menu");
            var $childMenu = $menuManage.find(".menu-child-item");
            if (sortable) {
                hideArrow();
                $(this).html("完成");
                $(".sortable").sortable({
                    disabled: false,
                    cursorAt: {left: 5, top: 5},
                    items: "li:not(.unsortable)" //进行排序
                });
                $parentMenu.removeClass("active");
                $childMenu.removeClass("active");
                $parentMenu.find(".fa-bars").removeClass("hidden");
                $parentMenu.find(".add-menu-box").hide();
                $parentCon.hide();
                $commonCon.hide();
                $emptyTip.show();
                $emptyTip.find("p").html("请通过拖拽左边的菜单进行排序");
                sortable = false;
            } else {
                changeInputNameNum();
                sortable = true;
                $(this).html("菜单排序");
                $(".sortable").sortable({
                    disabled: true
                });
                $emptyTip.find("p").html("请点击左侧菜单进行编辑操作");
                $parentMenu.find(".fa-bars").addClass("hidden");
                $parentMenu.find(".add-menu-box").show();
                $parentMenu.find(".arrow").show();
            }
        });

        //增加子菜单
        $(document).on("click", ".js-add-menu", function (e) {
            var parentIndex = $(".menu-parent-item").index($(this).parents('.js-parent-menu'))
            e.stopPropagation();
            if ($(this).siblings().length >= 5) {
                layer.msg('子菜单已达到上限，不能再添加了!', {
                    offset: 100,
                    time: 2000
                });
                return false;
            }
            var $menuChild = $('<li class="menu-child-item">' +
                '<div class="menu-child-name-wrap"><i class="fa fa-bars hidden"></i>' +
                '<span class="menu-child-name">菜单名称</span>' +
                '</div>' +
                '<input type="hidden" name="menu['+ parentIndex +'][sub][]" value="" class="hidden-left">'+
                '</li>');
            $menuChild.insertBefore($(this));
            subMenuClick($menuChild);
            clearData(); // 清除数据
        });

        // 子菜单点击事件
        $(document).on("click", ".js-child-menu .menu-child-item", function (e) {
            //if (sortable) {
            e.stopPropagation();
            subMenuClick($(this));
            $(".js-del-menu").show();
            //}
        });

        // 菜单输入事件
        $titleInput.keyup(function () {
            var menuParentActive = $(".menu-parent-item").filter(".active");
            var menuChildActive = $(".menu-child-item").filter(".active");
            var name = $(this).val().trim();
            //$menuName.html(name);
            if (menuParentActive.length > 0) {
                menuParentActive.find(".menu-parent-name").html(name);
                //给左边菜单name赋值
                menuParentActive.children("input").eq(0).val(name);
                checkMenuName(name, 10);
            }
            if (menuChildActive.length > 0) {
                menuChildActive.find(".menu-child-name").html(name);
                menuChildActive.children("input").eq(0).val(name);
                checkMenuName(name, 16);
            }
        });

        //文字输入事件
        $textareaInput.keyup(function () {
            var menuParentActive = $(".menu-parent-item").filter(".active");
            var menuChildActive = $(".menu-child-item").filter(".active");
            var textarea = $(this).val().trim();
            if (menuParentActive.length) {
                //给左边菜单name赋值
                menuParentActive.children("input").eq(4).val(textarea);
            }
            if (menuChildActive.length) {
                menuChildActive.children("input").eq(4).val(textarea);
            }
        });

        //url输入事件
        $urlInput.keyup(function () {
            var menuParentActive = $(".menu-parent-item").filter(".active");
            var menuChildActive = $(".menu-child-item").filter(".active");
            var url = $(this).val().trim();
            if (menuParentActive.length) {
                //给左边菜单name赋值
                menuParentActive.children("input").eq(5).val(url);
            }
            if (menuChildActive.length) {
                menuChildActive.children("input").eq(5).val(url);
            }
        });

    })();

    // 菜单管理 -> 菜单内容切换
    boxSwitch($(".js-menu-con-switch"), $(".js-menu-con"));

    //跳转小程序选择
    $("#btnWx_applet").click(function () {  //弹出框确定后
        let _checked = $(".js-radio_wxapplet:checked");  //选中对象
        let _name = _checked.parent().parent().find("#name_" + _checked.val()).html();
        let $linkSelect = $(".link-select");

        $linkSelect.show().find("span").eq(1).html(_name); //给名字赋值
        $linkSelect.find("input").val(_checked.val());  // 给隐藏域赋值

        $('a[href="#modalWx_applet"]').html("重新选择");
    });
    $(".js-del_wxapplet").click(function () { //关闭小程序所选的内容
        $(this).parent().parent().hide();
        $('a[href="#modalWx_applet"]').html("选择小程序");
    });
});