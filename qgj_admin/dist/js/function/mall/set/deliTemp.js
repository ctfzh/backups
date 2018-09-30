var isIE = (document.all) ? true : false;

var _$ = function (id) {
	return "string" == typeof id ? document.getElementById(id) : id;
};
var Class = {
    create: function() {
        return function() { this.initialize.apply(this, arguments); }
    }
};
var Extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
};
var Bind = function(object, fun) {
    return function() {
        return fun.apply(object, arguments);
    }
};
var BindAsEventListener = function(object, fun) {
    return function(event) {
        return fun.call(object, Event(event));
    }
};
function Event(e){
    var oEvent = isIE ? window.event : e;
    if (isIE) {
        oEvent.t = oEvent.srcElement;
        oEvent.pageX = oEvent.clientX + document.documentElement.scrollLeft;
        oEvent.pageY = oEvent.clientY + document.documentElement.scrollTop;
        oEvent.charCode = (oEvent.type == "keypress") ? oEvent.keyCode : 0;
        oEvent.preventDefault = function () { this.returnValue = false; };
        oEvent.detail = oEvent.wheelDelta / (-40);
        oEvent.stopPropagation = function(){ this.cancelBubble = true; };
        if(oEvent.type == "mouseout") {
            oEvent.relatedTarget = oEvent.toElement;
        }else if(oEvent.type == "mouseover") {
            oEvent.relatedTarget = oEvent.fromElement;
        }
    }
    return oEvent;
};
var CurrentStyle = function(element){
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
};
function addEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.addEventListener) {
    oTarget.addEventListener(sEventType, fnHandler, false);
    } else if (oTarget.attachEvent) {
    oTarget.attachEvent("on" + sEventType, fnHandler);
    } else {
    oTarget["on" + sEventType] = fnHandler;
    }
};
function removeEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.removeEventListener) {
    oTarget.removeEventListener(sEventType, fnHandler, false);
    } else if (oTarget.detachEvent) {
    oTarget.detachEvent("on" + sEventType, fnHandler);
    } else {
    oTarget["on" + sEventType] = null;
    }
};

//拖放程序
var Drag = Class.create();
Drag.prototype = {
	//拖放对象
	initialize: function(drag, options) {
		this.Drag = _$(drag);//拖放对象
		this._x = this._y = 0;//记录鼠标相对拖放对象的位置
		this._marginLeft = this._marginTop = 0;//记录margin
		//事件对象(用于绑定移除事件)
		this._fM = BindAsEventListener(this, this.Move);
		this._fS = Bind(this, this.Stop);
		this.SetOptions(options);
		this.Limit = !!this.options.Limit;
		this.mxLeft = parseInt(this.options.mxLeft);
		this.mxRight = parseInt(this.options.mxRight);
		this.mxTop = parseInt(this.options.mxTop);
		this.mxBottom = parseInt(this.options.mxBottom);
		this.LockX = !!this.options.LockX;
		this.LockY = !!this.options.LockY;
		this.Lock = !!this.options.Lock;
		this.onStart = this.options.onStart;
		this.onMove = this.options.onMove;
		this.onStop = this.options.onStop;
		this._Handle = _$(this.options.Handle) || this.Drag;
		this._mxContainer = _$(this.options.mxContainer) || null;
		this.Drag.style.position = "absolute";
		//透明
		if(isIE && !!this.options.Transparent){
			//填充拖放对象
			with(this._Handle.appendChild(document.createElement("div")).style){
				width = height = "100%"; backgroundColor = "#fff"; filter = "alpha(opacity:0)";
			}
		}
		addEventHandler(this._Handle, "mousedown", BindAsEventListener(this, this.Start));
	},
	//设置默认属性
	SetOptions: function(options) {
		this.options = {//默认值
			Handle:"",//设置触发对象（不设置则使用拖放对象）
			Limit:false,//是否设置范围限制(为true时下面参数有用,可以是负数)
			mxLeft:0,//左边限制
			mxRight:9999,//右边限制
			mxTop:0,//上边限制
			mxBottom:9999,//下边限制
			mxContainer:"",//指定限制在容器内
			LockX:false,//是否锁定水平方向拖放
			LockY:false,//是否锁定垂直方向拖放
			Lock:false,//是否锁定
			Transparent:false,//是否透明
			onStart:function(){},//开始移动时执行
			onMove:function(){},//移动时执行
			onStop:function(){}//结束移动时执行
		};
		Extend(this.options, options || {});
	},
	//准备拖动
	Start: function(oEvent) {
		if(this.Lock){ return; }
		if(this.Limit){
			//修正错误范围参数
			this.mxRight = Math.max(this.mxRight, this.mxLeft + this.Drag.offsetWidth);
			this.mxBottom = Math.max(this.mxBottom, this.mxTop + this.Drag.offsetHeight);
			//如果有容器必须设置position为relative来相对定位，并在获取offset之前设置
			!this._mxContainer || CurrentStyle(this._mxContainer).position == "relative" || (this._mxContainer.style.position = "relative");
		}
		//记录鼠标相对拖放对象的位置
		this._x = oEvent.clientX - this.Drag.offsetLeft;
		this._y = oEvent.clientY - this.Drag.offsetTop;
		//记录margin
		this._marginLeft = parseInt(CurrentStyle(this.Drag).marginLeft) || 0;
		this._marginTop = parseInt(CurrentStyle(this.Drag).marginTop) || 0;
		//mousemove时移动 mouseup时停止
		addEventHandler(document, "mousemove", this._fM);
		addEventHandler(document, "mouseup", this._fS);
		if(isIE){
			//焦点丢失
			addEventHandler(this._Handle, "losecapture", this._fS);
			//设置鼠标捕获
			this._Handle.setCapture();
		}else{
			//焦点丢失
			addEventHandler(window, "blur", this._fS);
			//阻止默认动作
			oEvent.preventDefault();
		};
		//附加程序
		this.onStart();
	},

	//拖动
	Move: function(oEvent) {
		//判断是否锁定
		if(this.Lock){ this.Stop(); return; };
		//清除选择
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		//设置移动参数
		var iLeft = oEvent.clientX - this._x, iTop = oEvent.clientY - this._y;
		//设置范围限制
		if(this.Limit){
			//设置范围参数
			var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
			//如果设置了容器，再修正范围参数
			if(!!this._mxContainer){
				mxLeft = Math.max(mxLeft, 0);
				mxTop = Math.max(mxTop, 0);
				mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
				mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
			};
			//修正移动参数
			iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
			iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
		}
		//设置位置，并修正margin
		if(!this.LockX){ this.Drag.style.left = iLeft - this._marginLeft + "px"; }
		if(!this.LockY){ this.Drag.style.top = iTop - this._marginTop + "px"; }
		//附加程序
		this.onMove();
	},
	//停止拖动
	Stop: function() {
		//移除事件
		removeEventHandler(document, "mousemove", this._fM);
		removeEventHandler(document, "mouseup", this._fS);
		if(isIE){
			removeEventHandler(this._Handle, "losecapture", this._fS);
			this._Handle.releaseCapture();
		}else{
			removeEventHandler(window, "blur", this._fS);
		};
		//附加程序
		this.onStop();
	}
};

//缩放程序
var Resize = Class.create();
Resize.prototype = {
	//缩放对象
	initialize: function(obj, options) {
		this._obj = _$(obj);//缩放对象
		this._right = this._down = this._left = this._up = 0;//坐标参数
		this._scale = 1;//比例参数
		this._touch = null;//当前触发对象

		var _style = CurrentStyle(this._obj);
		this._xBorder = (parseInt(_style.borderLeftWidth) || 0) + (parseInt(_style.borderRightWidth) || 0);
		this._yBorder = (parseInt(_style.borderTopWidth) || 0) + (parseInt(_style.borderBottomWidth) || 0);
		//事件对象(用于移除事件)
		this._fR = BindAsEventListener(this, this.Resize);
		this._fS = Bind(this, this.Stop);
		this.SetOptions(options);
		this.Max = !!this.options.Max;
		this.mxLeft = Math.round(this.options.mxLeft);
		this.mxRight = Math.round(this.options.mxRight);
		this.mxTop = Math.round(this.options.mxTop);
		this.mxBottom = Math.round(this.options.mxBottom);
		this.Min = !!this.options.Min;
		this.minWidth = Math.round(this.options.minWidth);
		this.minHeight = Math.round(this.options.minHeight);
		this.Scale = !!this.options.Scale;
		this.onResize = this.options.onResize;
		this._obj.style.position = "absolute";
	},

	//设置默认属性
	SetOptions: function(options) {
		this.options = {
			Max:false,     //是否设置范围限制(为true时下面mx参数有用)
			mxLeft:0,       //左边限制
			mxRight:9999,  //右边限制
			mxTop:0,       //上边限制
			mxBottom:9999, //下边限制
			Min:false,    //是否最小宽高限制(为true时下面min参数有用)
			minWidth:50,   //最小宽度
			minHeight:50, //最小高度
			Scale:false, //是否按比例缩放
			onResize:function(){}//缩放时执行
		};
		Extend(this.options, options || {});
	},

	//设置触发对象
	Set: function(resize, side) {
		var resize = _$(resize), _fun;
		if(!resize) return;
		//根据方向设置 _fun是缩放时执行的程序
		switch (side.toLowerCase()) {
			case "up" :
			_fun = this.Up;
			break;
			case "down" :
			_fun = this.Down;
			break;
			case "left" :
			_fun = this.Left;
			break;
			case "right" :
			_fun = this.Right;
			break;

			case "left-up" :
			_fun = this.LeftUp;
			break;
			case "right-up" :
			_fun = this.RightUp;
			break;
			case "left-down" :
			_fun = this.LeftDown;
			break;
			case "right-down" :
			default :
			_fun = this.RightDown;
		};
		//设置触发对象
		addEventHandler(resize, "mousedown", BindAsEventListener(this, function(e){
			this._fun = _fun; this._touch = resize; this.Start(e);
		}));
	},

	//准备缩放
	Start: function(e) {
		//防止冒泡
		e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
		//计算样式初始值
		/////////////////////
		//计算样式初始值
		this._styleWidth = this._obj.offsetWidth - this._xBorder;
		this._styleHeight = this._obj.offsetHeight - this._yBorder;
		this._styleLeft = this._obj.offsetLeft;
		this._styleTop = this._obj.offsetTop;
		this._styleLeftWidth = this._styleWidth + this._styleLeft;
		this._styleTopHeight = this._styleHeight + this._styleTop;
		//alert(this._styleWidth +"="+ this._styleLeft);
		//计算当前边的对应另一条边的坐标 例如右边缩放时需要左边界坐标
		this._left = e.clientX - this._styleWidth;
		this._right = e.clientX + this._styleWidth;
		this._up = e.clientY - this._styleHeight;
		this._down = e.clientY + this._styleHeight;
		//$("aa").innerHTML+="aa:"+this._right +"="+ this._e.clientX+"<br>";
		//设置缩放比例
		if(this.Scale){
			this._scale = this._styleWidth / this._styleHeight;
			this._scaleX = this._styleLeft + this._styleWidth / 2;
			this._scaleY = this._styleTop + this._styleHeight / 2;
			if(this.Max){
				this._mxScaleWidth = Math.min((this._scaleX - this.mxLeft), (this.mxRight - this._scaleX)) * 2;
				this._mxScaleHeight = Math.min((this._scaleY - this.mxTop), (this.mxBottom - this._scaleY)) * 2;
			}
		}
		//如果有范围 先计算好范围内最大宽度和高度
		if(this.Max){
			this._mxRightWidth = this.mxRight - this._styleLeft - this._xBorder;
			this._mxDownHeight = this.mxBottom - this._styleTop - this._yBorder;
			this._mxTopHeight = this._styleTopHeight - this.mxTop;
			this._mxLeftWidth = this._styleLeftWidth - this.mxLeft;
		};
		//mousemove时缩放 mouseup时停止
		addEventHandler(document, "mousemove", this._fR);
		addEventHandler(document, "mouseup", this._fS);
		if(isIE){
			//焦点丢失
			addEventHandler(this._touch, "losecapture", this._fS);
			//设置鼠标捕获
			this._touch.setCapture();
		}else{
			//焦点丢失
			addEventHandler(window, "blur", this._fS);
			//阻止默认动作
			e.preventDefault();
		};
	},

	//缩放
	Resize: function(e) {
		//没有触发对象的话返回
		if(!this._touch) return;
		//清除选择
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		//执行缩放程序
		this._e = e;
		this._fun();
		//设置样式
		//因为计算用的offset是把边框算进去的所以要减去
		//宽度设置必须大于等于0否则ie出错
		this._obj.style.width = this._styleWidth + "px";
		this._obj.style.height = this._styleHeight + "px";
		this._obj.style.top = this._styleTop + "px";
		this._obj.style.left = this._styleLeft + "px";
		//附加程序
		this.onResize();
	},
	///////////////////////////////////////////
	//绑定程序
	//右边
	Up: function() {
		this.RepairY(this._down - this._e.clientY, this._mxTopHeight);
		this._styleTop = this._styleTopHeight - this._styleHeight;
		this.TurnDown(this.Down);
	},
	//右边
	Down: function() {
		this.RepairY(this._e.clientY - this._up, this._mxDownHeight);
		this.TurnUp(this.Up);
	},
	//////////////////////
	//右边
	Right: function() {
		this.RepairX(this._e.clientX - this._left, this._mxRightWidth);
		this.TurnLeft(this.Left);
	},
	//右边
	Left: function() {
		this.RepairX(this._right - this._e.clientX, this._mxLeftWidth);
		this._styleLeft = this._styleLeftWidth - this._styleWidth;
		this.TurnRight(this.Right);
	},
	////////////////////////////////////
	TurnRight: function(fun) {
		if(!(this.Min || this._styleWidth)){
			//切换到另一边
			this._fun = fun;
			this._left = this._right;
			this.Max && (this._mxRightWidth = this.mxRight - this._styleLeft - this._xBorder);
			return true;
		}
	},
	TurnLeft: function(fun) {
		if(!(this.Min || this._styleWidth)){
			//切换到另一边
			this._fun = fun;
			this._right = this._left;
			this._styleLeftWidth = this._styleLeft;
			this.Max && (this._mxLeftWidth = this._styleLeft - this.mxLeft);
			return true;
		}
	},
	TurnUp: function(fun) {
		if(!(this.Min || this._styleHeight)){
			//切换到另一边
			this._fun = fun;
			this._down = this._up;
			this._styleTopHeight = this._styleTop;
			this.Max && (this._mxTopHeight = this._styleTop - this.mxTop);
			return true;
		}
	},
	TurnDown: function(fun) {
		if(!(this.Min || this._styleHeight)){
			//切换到另一边
			this._fun = fun;
			this._up = this._down;
			this.Max && (this._mxDownHeight = this.mxBottom - this._styleTop - this._yBorder);
			return true;
		}
	},
	//////////////////////////////
	//右边
	RepairX: function(iWidth,mxWidth) {
		iWidth = this.RepairWidth(iWidth, mxWidth);
		if(this.Scale){
			var iHeight = Math.round(iWidth / this._scale), temp = this.RepairHeight(iHeight, this._mxScaleHeight);
			if(temp != iHeight){ iHeight = temp; iWidth = Math.round(iHeight * this._scale); }
			this._styleHeight = iHeight;
			this._styleTop = this._scaleY - iHeight / 2;
		}
		this._styleWidth = iWidth;
	},
	//右边
	RepairY: function(iHeight,mxHeight) {
		iHeight = this.RepairHeight(iHeight, mxHeight);
		if(this.Scale){
			var iWidth = Math.round(iHeight * this._scale), temp = this.RepairWidth(iWidth, this._mxScaleWidth);
			if(temp != iWidth){ iWidth = temp; iHeight = Math.round(iWidth / this._scale); }
			this._styleWidth = iWidth;
			this._styleLeft = this._scaleX - iWidth / 2;
		}
		this._styleHeight = iHeight;
	},
	/////////////////////////
	//右边
	RepairHeight: function(iHeight, mxHeight) {
		iHeight = Math.min(this.Max ? mxHeight : iHeight, iHeight);
		iHeight = Math.max(this.Min ? this.minHeight : iHeight, iHeight, 0);
		return iHeight;
	},
	//右边
	RepairWidth: function(iWidth, mxWidth) {
		iWidth = Math.min(this.Max ? mxWidth : iWidth, iWidth);
		iWidth = Math.max(this.Min ? this.minWidth : iWidth, iWidth, 0);
		return iWidth;
	},
	//////////////////////////
	//右边
	RightDown: function() {
		this.RepairAngle(
			this._e.clientX - this._left, this._mxRightWidth,
			this._e.clientY - this._up, this._mxDownHeight
		);
		this.TurnLeft(this.LeftDown) || this.TurnUp(this.RightUp);
	},
	//右边
	RightUp: function() {
		this.RepairAngle(
			this._e.clientX - this._left, this._mxRightWidth,
			this._down - this._e.clientY, this._mxTopHeight
		);
		this._styleTop = this._styleTopHeight - this._styleHeight;
		this.TurnLeft(this.LeftUp) || this.TurnDown(this.RightDown);
	},
	//右边
	LeftDown: function() {
		this.RepairAngle(
			this._right - this._e.clientX, this._mxLeftWidth,
			this._e.clientY - this._up, this._mxDownHeight
		);
		this._styleLeft = this._styleLeftWidth - this._styleWidth;
		this.TurnRight(this.RightDown) || this.TurnUp(this.LeftUp);
	},
	//右边
	LeftUp: function() {
		this.RepairAngle(
			this._right - this._e.clientX, this._mxLeftWidth,
			this._down - this._e.clientY, this._mxTopHeight
		);
		this._styleTop = this._styleTopHeight - this._styleHeight;
		this._styleLeft = this._styleLeftWidth - this._styleWidth;
		this.TurnRight(this.RightUp) || this.TurnDown(this.LeftDown);
	},
	///////////////////////////////
	//右边
	RepairAngle: function(iWidth,mxWidth,iHeight,mxHeight) {
		iWidth = this.RepairWidth(iWidth, mxWidth);
		iHeight = this.Scale ? Math.round(iWidth / this._scale) : iHeight;
		var temp = this.RepairHeight(iHeight, mxHeight);
		if(temp != iHeight){ iHeight = temp; this.Scale && (iWidth = Math.round(iHeight * this._scale)); }
		this._styleWidth = iWidth;
		this._styleHeight = iHeight;
	},
	////////////////////////////////////////////////
	//停止缩放
	Stop: function() {
	//移除事件
		removeEventHandler(document, "mousemove", this._fR);
		removeEventHandler(document, "mouseup", this._fS);
		if(isIE){
			removeEventHandler(this._touch, "losecapture", this._fS);
			this._touch.releaseCapture();
		}else{
			removeEventHandler(window, "blur", this._fS);
		}
		this._touch = null;
	}
};
