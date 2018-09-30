/**
 * 门店管理组
 */
$(function () {

    //时间
    $('#time').daterangepicker({
        timePicker: false,
        opens: 'left',
        format: 'YYYY/MM/DD',
        dateLimit: true,
        maxDate: moment()
    });

    //操作列表添加'
    $("input[name='roleType']").click(function (){
        if ($(this).val() == "1"){
            $('#storePwd').show();
        }else{
            $('#storePwd').hide();
        }
    });

    //收款账号
    $(".js-isVisibile").click(function (e){
        if (e.target.dataset.index == "1"){
            $('.js-visibile-wrap').show();
        }else{
            $('.js-visibile-wrap').hide();
        }
    });

    /**
     *
     * IE低版本和火狐对input type="number"的兼容
     * 可按的按键包括数字（键盘上字母上的数字和小键盘中的数字）、删除键、Tab切换键、减号按键、小数点键
     */
    $(".inputNumber").on("keydown", function (event) {
        var event = event.which ? event.which : window.event.keyCode;
        if (event == 8 || event == 9 || event == 109 || event == 110 || (event >= 48 && event <= 57) || (event >= 96 && event <= 105)) {
            return true;
        } else {
            return false;
        }
    });

    //门店收款码弹出框
    $('.storeQrcode').on('show.bs.modal', function (event) {
        var $target = $(event.relatedTarget);  //触发器对象
        var src = $target.find("img").attr("src");
        var modal = $(this);
        modal.find('.modal-body img').attr('src', src);
        modal.find('.modal-body a').attr('href', src);
    });

});

//营业时间
(function (window, $, undefined) {
    var shophours = function (options) {

        var temp = '<div class="time-picker-item js-time-area-editing">' +
            '<div class="inline-block">' +
            '<div class="time">' +
            '<select class="form-control form-control-inline w48 js-hour"><option>00</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option></select>' +
            ' 时 ' +
            '<select class="form-control form-control-inline w48 js-minute"><option>00</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option><option>32</option><option>33</option><option>34</option><option>35</option><option>36</option><option>37</option><option>38</option><option>39</option><option>40</option><option>41</option><option>42</option><option>43</option><option>44</option><option>45</option><option>46</option><option>47</option><option>48</option><option>49</option><option>50</option><option>51</option><option>52</option><option>53</option><option>54</option><option>55</option><option>56</option><option>57</option><option>58</option><option>59</option></select>' +
            ' 分 ~ ' +
            '<select class="form-control form-control-inline w48 js-hour"><option>00</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option></select>' +
            ' 时 ' +
            '<select class="form-control form-control-inline w48 js-minute"><option>00</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option><option>22</option><option>23</option><option>24</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option><option>32</option><option>33</option><option>34</option><option>35</option><option>36</option><option>37</option><option>38</option><option>39</option><option>40</option><option>41</option><option>42</option><option>43</option><option>44</option><option>45</option><option>46</option><option>47</option><option>48</option><option>49</option><option>50</option><option>51</option><option>52</option><option>53</option><option>54</option><option>55</option><option>56</option><option>57</option><option>58</option><option>59</option></select>' +
            ' 分' +
            '</div> ' +
            '<div class="week">' +
            '<div class="cur-week js-cur-week"></div>' +
            '<div class="inline-block js-select-week">' +
            '<label class="week-item js-week-item">' +
            '<input type="checkbox" name="week_day" value="1">' +
            '<span>周一</span>' +
            '</label>' +
            '<label class="week-item js-week-item">' +
            '<input type="checkbox" name="week_day" value="2">' +
            '<span>周二</span>' +
            '</label>' +
            '<label class="week-item js-week-item">' +
            '<input type="checkbox" name="week_day" value="3">' +
            '<span>周三</span>' +
            '</label>' +
            '<label class="week-item js-week-item">' +
            '<input type="checkbox" name="week_day" value="4">' +
            '<span>周四</span>' +
            '</label>' +
            '<label class="week-item js-week-item">' +
            '<input type="checkbox" name="week_day" value="5">' +
            '<span>周五</span>' +
            '</label>' +
            '<label class="week-item js-week-item">' +
            '<input type="checkbox" name="week_day" value="6">' +
            '<span>周六</span>' +
            '</label>' +
            '<label class="week-item js-week-item">' +
            '<input type="checkbox" name="week_day" value="7">' +
            '<span>周日</span>' +
            '</label>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<label class="mr20"><input type="checkbox" class="qkj-checkbox js-24hours"> 24小时营业</label>' +
            '<div class="btn-wrap"><a href="javascript:;" class="js-sure">确认</a> | <a href="javascript:;" class="js-cancel">取消</a></div>' +
            '<div class="btn-wrap" style="display:none"><a href="javascript:;" class="js-edit">编辑</a> | <a href="javascript:;" class="js-del">删除</a></div>' + '</div>';
        var weekValArr = [],
            $timePickerItemAdd = $(".time-picker-item-add"),
            oldActiveVal = [];  //操作前记录之前选中的值

        function init() {
            var json = JSON.parse($("#timeAreaHidden").val()),
                $timeArea = $(".time-area"), $timeAreaEditing = '', $curWeek = '';

            if(json){$timeArea.html('')}; //清除
            $.each(json, function (i,o) {
                $timeArea.append(temp);
                $timeAreaEditing = $(".js-time-area-editing");
                $curWeek = $timeAreaEditing.find(".js-cur-week");

                $timeAreaEditing.find("select").attr("disabled","disabled");
                $timeAreaEditing.find(".js-hour")[0].options[parseInt(o.time_area_start_hour.split(":")[0])].selected = true;
                $timeAreaEditing.find(".js-minute")[0].options[parseInt(o.time_area_start_hour.split(":")[1])].selected = true;
                $timeAreaEditing.find(".js-hour")[1].options[parseInt(o.time_area_end.split(":")[0])].selected = true;
                $timeAreaEditing.find(".js-minute")[1].options[parseInt(o.time_area_end.split(":")[1])].selected = true;
                $timeAreaEditing.find(".btn-wrap").eq(0).hide().next().show();
                if(o.is_all_day == "1"){
                    $timeAreaEditing.find(".js-24hours").prop("checked",true);
                }
                $curWeek.html('').show(); //周期文字项清空并显示
                $timeAreaEditing.find(".js-select-week").hide(); //周期选择项隐藏
                $.each(o.week, function (j,o1) {
                    $timeAreaEditing.find(".js-week-item").eq(o1-1).addClass("active");
                    switch(o1){
                        case "1":
                            $curWeek.append("周一、");
                            break;
                        case "2":
                            $curWeek.append("周二、");
                            break;
                        case "3":
                            $curWeek.append("周三、");
                            break;
                        case "4":
                            $curWeek.append("周四、");
                            break;
                        case "5":
                            $curWeek.append("周五、");
                            break;
                        case "6":
                            $curWeek.append("周六、");
                            break;
                        case "7":
                            $curWeek.append("周日、");
                            break;
                    }
                });
                weekValArr.concat(o.week); //合并数组
                $curWeek.html($curWeek.html().substr(0,$curWeek.html().length-1)); //清楚最后一个
                $timeAreaEditing.removeClass("js-time-area-editing");
            });
            if(json.length >2){
                $timeArea.append('<a href="javascript:;" class="time-picker-item-add" style="display: none">增加营业时间</a>')
            }else{
                $timeArea.append('<a href="javascript:;" class="time-picker-item-add">增加营业时间</a>')
            }
        }
        init();  //初始化
        storeWeek(); //存储所有选中周期

        //增加时间段
        $(document).on('click',".time-picker-item-add",function () {
            if($(this).parent().find(".time-picker-item").length <= 2 ){
                $(this).before(temp);
                setWeekDisabled();
            }

            $(this).hide();
        });
        //周期选择
        $(document).on('click',".js-week-item",function (i) {
            if($(this).hasClass('active')){
                $(this).removeClass('active');
            }else if(!$(this).hasClass('disabled')){
                $(this).addClass('active');
            }
        });
        //确定 禁用
        $(document).on('click',".js-sure",function () {
            var flag = '',
                $timePickerItem = $(this).parents(".time-picker-item"),
                $weekItem = $timePickerItem.find(".js-week-item"),
                $24hours = $timePickerItem.find(".js-24hours"),
                $timePickerItemAdd = $(".time-picker-item-add");

            if($24hours.prop("checked")){ //24小时营业时间是否选中
                if(isSelectWeek($weekItem)){
                    weekValArr = [];  //清空数据
                    storeWeek(); //存储所有选中的周期
                    sureOper($(this)); //赋值操作

                    if($(".time-picker-item").length <=2 && weekValArr.length<7){
                        $timePickerItemAdd.show();
                    }
                }else{
                    layer.msg("请选择某天的营业时间");
                }
            }else{
                flag = compareTime($(this));
                if(flag){
                    if(isSelectWeek($weekItem)){
                        weekValArr = [];  //清空数据
                        storeWeek(); //存储所有选中的周期
                        sureOper($(this)); //赋值操作
                        if($(".time-picker-item").length <=2 && weekValArr.length<7){
                            $timePickerItemAdd.show();
                        }
                    }else{
                        layer.msg("请选择某天的营业时间");
                    }
                }else{
                    $timePickerItemAdd.hide();
                }
            }

        });
        //取消
        $(document).on('click',".js-cancel",function () {
            var $timePickerItem = $(this).parents(".time-picker-item"),
                $curWeek = $timePickerItem.find(".js-cur-week");

            if($curWeek.html()){
                $timePickerItem.find(".js-week-item").each(function (i) {
                    //如果i不在之前的oldActiveVal里，并且有class=“active”的；就清除class
                    if(!util.contains(oldActiveVal,i) && $(this).hasClass("active")){
                        $(this).removeClass("active");
                    }
                });
                sureOper($(this)); //赋值操作
            }else{
                $(this).parents(".time-area").find(".time-picker-item-add").show();  //增加营业时间按钮显示
                $(this).parents(".time-picker-item").remove(); //时间段选择隐藏
            }
        });
        //删除
        $(document).on('click',".js-del",function () {
            var $timePickerItem = $(this).parents(".time-picker-item"),
                $self = $(this);

            layer.confirm('确定删除吗？', {
                btn: ['确定','取消'] //按钮
            }, function(index){
                $timePickerItem.find(".js-week-item").each(function () {
                    if($(this).hasClass('active')){
                        util.removeByValue(weekValArr,$(this).find("input").val());
                    }
                });

                $self.parents(".time-area").find(".time-picker-item-add").show();  //增加营业时间按钮显示
                $self.parents(".time-picker-item").remove(); //时间段选择隐藏
                layer.close(index);
            });

        });
        //编辑 取消禁用
        $(document).on('click',".js-edit",function () {
            $(".time-picker-item-add").hide();  //增加营业时间隐藏

            //如果有其他项未确认，则提示，否则编辑
            if($(".js-time-area-editing").length){
                layer.msg("请先确定其他的营业时间");
            }else{
                var $timePickerItem = $(this).parents(".time-picker-item"),
                    $24hours = $timePickerItem.find(".js-24hours");  //24小时营业时间显示

                //清空数组，并把当前的周期里有包含class="active"存放起来
                oldActiveVal = []; //清空
                $timePickerItem.find(".js-week-item").each(function (i) {
                    if($(this).hasClass("active")){
                        oldActiveVal.push(i);
                    }
                });

                $timePickerItem.addClass("js-time-area-editing");  //添加当前一个编辑项标志
                $timePickerItem.find(".js-cur-week").hide();  //隐藏周期文字显示项
                $timePickerItem.find(".js-select-week").show(); //显示周期选择项
                $(this).parent().hide().prev().show();  //编辑操作隐藏，确认操作显示
                //如果24小时营业时间为选中状态。则时分选择禁用状态不取消
                if(!$24hours.prop("checked")){
                    $timePickerItem.find("select").removeAttr("disabled","disabled");  //禁用时间选择
                }
                setWeekDisabled(); //设置周期选择项里哪些禁用
            }
        });
        //24小时营业
        $(document).on('click',".js-24hours",function () {
            var $timePickerItem = $(this).parents(".time-picker-item"),
                $hour = $timePickerItem.find(".js-hour"),
                $minute = $timePickerItem.find(".js-minute");

            if($timePickerItem.hasClass("js-time-area-editing")){
                if($(this).prop("checked")){
                    $hour.attr("disabled","disabled");
                    $minute.attr("disabled","disabled");
                }else{
                    $hour.removeAttr("disabled","disabled");
                    $minute.removeAttr("disabled","disabled")
                }
            }
            if($(this).prop("checked")){
                $hour[0].options[0].selected = true;  //第二项小时最后一项选中
                $minute[0].options[0].selected = true;//第二项分钟最后一项选中
                $hour[1].options[23].selected = true;  //第二项小时最后一项选中
                $minute[1].options[59].selected = true;//第二项分钟最后一项选中
            }
        });

        //比较时间
        function compareTime(self) {
            var flag = false;
            var $hour = self.parents(".time-picker-item").find(".js-hour");
            var $minute = self.parents(".time-picker-item").find(".js-minute");
            var hourArr = [],minuteArr=[];

            $.each($hour,function (i,o) {
                hourArr.push($(o).val());
            });

            $.each($minute,function (i,o) {
                minuteArr.push($(o).val());
            });

            //比较小时
            if(hourArr[0] > hourArr[1] || (hourArr[0] == hourArr[1] && minuteArr[0] >= minuteArr[1])){
                layer.msg("结束时间必须大于开始时间");
                flag = false;
            }else{
                flag = true;
            }

            return flag;
        }
        //当前操作项是否有选择某天
        function isSelectWeek(items) {
            var flag = true;

            items.each(function () {
                if($(this).hasClass('active')) {
                    flag = true;
                    return false;
                }else{
                    flag = false;
                }
            });

            return flag;
        }
        //存储所有选中的周期
        function storeWeek() {
            $(".js-week-item").each(function () {
                if($(this).hasClass('active')) {
                    weekValArr.push($(this).find("input").val());
                }
            });
        }
        //设置已选的周期为禁用状态
        function setWeekDisabled(){
            var arr = $(".js-time-area-editing").find('.js-week-item');
            arr.removeClass("disabled"); //先去除之前设置的样式

            $.each(weekValArr,function (i,o) {
                arr.each(function (j) {
                    if(o == $(this).find("input").val()){
                        if(!$(this).hasClass("active")){
                            $(this).addClass("disabled");
                        }
                    }
                })
            })
        }
        //确定操作
        function sureOper($self) {
            var $timePickerItem = $self.parents(".time-picker-item"),
                $curWeek = $timePickerItem.find(".js-cur-week"),
                $weekItem = $timePickerItem.find(".js-week-item"),
                textActive = '';

            $self.parent().hide().next().show();  //编辑按钮组显示
            $weekItem.each(function (o) { //获取当前项选中的值
                if($(this).hasClass('active')) {
                    textActive += $(this).find("span").html() + "、";
                }
            });

            $curWeek.html(textActive.substr(0,textActive.length-1)); //选中的周期赋值给内容
            $timePickerItem.find(".js-cur-week").show().next().hide();  //隐藏周期选择内容
            $timePickerItem.find("select").attr("disabled","disabled");  //禁用时间选择
            $self.parents(".time-picker-item").removeClass("js-time-area-editing");  //编辑状态去除
        }

    };

    window.shophours = window.shophours || shophours;
})(window, jQuery);