/**
 * Created by Bei on 2017/7/6.
 */

/**
 * 检查功能权限
 * @param modules
 * @param controller
 * @param fun
 * @param url
 */
function checkFunctionRights(modules, controller, fun, url) {
    var flag = false;
    $.ajax({
        'type': 'get',
        'async': false,
        'url': '/home/check-function-rights.html',
        'data': {modules: modules, controller: controller, function: fun},
        'success': function (data) {
            if (data == 'success') {
                flag = true;
            }
        }
    });
    if (flag) {
        window.location.href = url;
    } else {
        layer.alert('您没有该权限');
    }
}

/**
 *  弹出框类功能权限检查方法
 * @param obj
 * @param attr
 * @param val
 * @param modules
 * @param controller
 * @param fun
 */
function boxFunctionRights(obj, attr, val, modules, controller, fun) {
    var flag = false;
    $.ajax({
        'type': 'get',
        'async': false,
        'url': '/home/check-function-rights.html',
        'data': {modules: modules, controller: controller, function: fun},
        'success': function (data) {
            if (data == 'success') {
                flag = true;
            }
        }
    });
    if (flag) {
        $(obj).attr(attr, val);
    } else {
        $(obj).removeAttr(attr);
        layer.alert('您没有该权限');
    }
}

/**
 *  确认提醒类功能权限检查方法
 * @param modules
 * @param controller
 * @param fun
 * @param url
 * @param text
 */
function verify(modules, controller, fun, url, text) {
    layer.confirm(text, {
        btn: ['确定', '取消'] //按钮
    }, function(index) {
        checkFunctionRights(modules, controller, fun, url);
        layer.close(index);
    });
}

//检查功能权限弹出框
function checkFunctionRightsWindow(modules, controller, fun) {
    var flag = false;
    $.ajax({
        'type': 'get',
        'async': false,
        'url': '/home/check-function-rights.html',
        'data': {modules: modules, controller: controller, function: fun},
        'success': function (data) {
            if (data == 'success') {
                flag = true;
            }
        }
    });
    return flag;
}