/**
 * 设置
 */

$(function () {
    // 帮助提示
    var layerIndex = '';
    $(".qgj-help").hover(
        function () {
            layerIndex = layer.tips($(this).attr("data-value"), $(this), {
                tips: [1, '#000'],
                area: "450px",
                time: 0
            });
        },
        function () {
            layer.close(layerIndex);
        }
    );
    
    
    //时间插件
    layui.use('laydate', function() {
        var laydate = layui.laydate;

        initTime('#startTime');

        function initTime(startTime){
            var startStr = '';
            var start = {
                elem: startTime,
                type: 'time',
                format: 'HH:mm', //可任意组合
                done: function (date){
                    startStr = date;
                }
            };

            laydate.render(start);
        }

    });
    
});