/**
 * Created by zhangedward on 15/4/14.
 */
var AnimationType = {
    None: 0,
    Shrink: 1,
    Scale: 2
};


var YZSlide = {
    Type_Image: createjs.LoadQueue.IMAGE,
    manifestObj: null,
    loadingQueue: null,
    currentIndex: 0,
    startPointY: 0,
    pageSlided: false,
    pageReachEnd: null,
    pageReachStart: null,
    pageReach: null,
    previousImgHeight: 0,
    bgImgHeight: [],
    animationType: AnimationType.None,

    /*
     初始化
     animationType，动画类型
     cbPageReachStart，当到达第一页时的回调函数
     cbPageReachEnd，当到达最后一页时调用
     */
    init: function(animationType, cbPageReachStart, cbPageReach, cbPageReachEnd){
        "use strict";
        $(".container").append("<div class='loading_gif'><img src='img/ajax-loader.gif'></div>");

        if (animationType != undefined){
            YZSlide.animationType = animationType;
        }
        if (cbPageReachEnd != undefined){
            YZSlide.pageReachEnd = cbPageReachEnd;
        }
        if (cbPageReach != undefined){
            YZSlide.pageReach = cbPageReach;
        }
        if (cbPageReachStart != undefined){
            YZSlide.pageReachStart = cbPageReachStart;
        }
        YZSlide.loadingQueue = new createjs.LoadQueue(false);
        YZSlide.loadingQueue.on("complete", YZSlide.loadingComplete, this);
    },

    /*
     载入资源，目前仅支持图片
     */
    loadManifest: function(bgImgManifest){
        "use strict";
        YZSlide.manifestObj = bgImgManifest;

        YZSlide.loadingQueue.loadManifest(bgImgManifest);
    },

    /*
     载入资源完成回调
     */
    loadingComplete: function(evt){
        "use strict";
        $(".loading_gif").remove();

        var imgHeight = 0;
        var marginTop = 0;
        var nextTop = 0;
        var index = 0;
        YZSlide.manifestObj.forEach(function(obj){
            //计算每一个page的高度
            var imgObj = YZSlide.loadingQueue.getResult(obj.id);
            var scaledHeight = $(window).width() / imgObj.width * imgObj.height;
            if (scaledHeight > $(window).height()){
                imgHeight = scaledHeight;
                marginTop = ($(window).height() - scaledHeight) / 2;
            }
            else{
                imgHeight = $(window).height();
            }
            YZSlide.bgImgHeight.push(imgHeight);

            $("#" + obj.id).append(YZSlide.loadingQueue.getResult(obj.id));
            $("#" + obj.id + " img").height(imgHeight);
            $("#" + obj.id + " img").css("margin-top", marginTop + "px");

            $("#" + obj.id).parent().css("top", nextTop + "px");
            nextTop += $(window).height();

            //添加第一page的底图
            if (index++ == 0 && null != YZSlide.pageReachStart){
                YZSlide.pageReachStart();
            }
        });
    },

    /*
     触摸开始事件
     */
    touchstart: function(evt){
        "use strict";
        evt.preventDefault();
        evt.stopPropagation();

        YZSlide.startPointY = evt.originalEvent.touches[0].pageY;
    },

    /*
     触摸移动事件
     */
    touchmove: function(evt){
        "use strict";
        evt.preventDefault();
        evt.stopPropagation();

        if (!YZSlide.pageSlided){
            var currentPointY = evt.originalEvent.changedTouches[0].pageY;
            var deltaY = currentPointY - YZSlide.startPointY;

            //手指滑动中处理中
            YZSlide.onPageSliding(deltaY);
        }
    },

    /*
     触摸结束事件
     */
    touchend: function(evt){
        "use strict";
        var currentPointY = evt.originalEvent.changedTouches[0].pageY;
        var deltaY = currentPointY - YZSlide.startPointY;

        //手指离开屏幕后开始动画滑动page
        YZSlide.slidePage(deltaY);

        YZSlide.startPointY = evt.originalEvent.changedTouches[0].pageY;
    },

    /*
     动画结束后的处理
     */
    afterPageSlided: function(){
        "use strict";
        YZSlide.previousImgHeight = 0;

        if (YZSlide.currentIndex == 0){
            if (null != YZSlide.pageReachStart){
                YZSlide.pageReachStart();
            }
        }
        else if (YZSlide.currentIndex == $(".page").length){
            if (null != YZSlide.pageReachEnd){
                YZSlide.pageReachEnd();
            }
        }
        else{
            if (null != YZSlide.pageReach){
                YZSlide.pageReach(YZSlide.currentIndex);
            }
        }
        YZSlide.pageSlided = false;
    },

    /*
     动画结束隐藏后
     */
    afterPageHidden: function(){
        "use strict";
        YZSlide.previousImgHeight = 0;

        YZSlide.pageSlided = false;
    },

    /*
     触摸未离开屏幕时的动画
     */
    onPageSliding: function(deltaY){
        "use strict";
        //向上滑动
        if (YZSlide.currentIndex < YZSlide.manifestObj.length - 1 && deltaY < 0){
            //$(".page").eq(YZSlide.currentIndex).show();
            $(".page").eq(YZSlide.currentIndex + 1).show();

            //压缩效果
            if (YZSlide.animationType == AnimationType.Shrink){
                //$(".page").eq(YZSlide.currentIndex).height($(window).height() + deltaY);
                //$(".page").eq(YZSlide.currentIndex).find(".page_bg").find("img").height(YZSlide.bgImgHeight[YZSlide.currentIndex] * ($(window).height() + deltaY) / $(window).height());
            }
            else if (YZSlide.animationType == AnimationType.Scale){//缩放效果
                //var scale = ($(window).height() + deltaY) / $(window).height();

                //$(".page").eq(YZSlide.currentIndex).height($(window).height() + deltaY);
                // $(".page").eq(YZSlide.currentIndex).width($(window).width() * scale);
                // $(".page").eq(YZSlide.currentIndex).css("left", ($(window).width() - $(window).width() * scale) / 2);
                //$(".page").eq(YZSlide.currentIndex).find(".page_bg").find("img").height(YZSlide.bgImgHeight[YZSlide.currentIndex] * scale);
            }

            $(".page").eq(YZSlide.currentIndex + 1).css("top", $(window).height() + deltaY);
        }
        else if (YZSlide.currentIndex > 0 && deltaY > 0){//向下滑动
            $(".page").eq(YZSlide.currentIndex - 1).show();
            //$(".page").eq(YZSlide.currentIndex).show();

            //压缩效果
            if (YZSlide.animationType == AnimationType.Shrink) {
                $(".page").eq(YZSlide.currentIndex - 1).height(deltaY);
                $(".page").eq(YZSlide.currentIndex - 1).find(".page_bg").find("img").height(deltaY);
            }
            else if (YZSlide.animationType == AnimationType.Scale){//缩放效果
                //var scale = ($(window).height() - deltaY) / $(window).height();

                $(".page").eq(YZSlide.currentIndex - 1).css("left", "0px");
                $(".page").eq(YZSlide.currentIndex - 1).css("top", deltaY - $(window).height() + "px");

                //$(".page").eq(YZSlide.currentIndex).height($(window).height() - deltaY);
                //$(".page").eq(YZSlide.currentIndex).width($(window).width() * scale);
                //$(".page").eq(YZSlide.currentIndex).css("left", $(window).width() * (1 - scale) / 2);
                //$(".page").eq(YZSlide.currentIndex).find(".page_bg").find("img").height(YZSlide.bgImgHeight[YZSlide.currentIndex] * scale);
            }

            $(".page").eq(YZSlide.currentIndex).css("top", deltaY);
        }
    },

    /*
     动画页面
     */
    slidePage: function(deltaY){
        "use strict";

        //向上滑动
        if (YZSlide.currentIndex < YZSlide.manifestObj.length - 1 && deltaY < 0) {
            if ($(".page").eq(YZSlide.currentIndex + 1).offset().top < $(window).height() * 4 / 5){
                //压缩效果
                if (YZSlide.animationType == AnimationType.Shrink) {
                    //$(".page").eq(YZSlide.currentIndex).animate({height: "0px"});
                    //$(".page").eq(YZSlide.currentIndex).find(".page_bg").find("img").animate({height: "0px"});
                }
                else if (YZSlide.animationType == AnimationType.Scale) {//缩放效果
                    //$(".page").eq(YZSlide.currentIndex).animate({height: "0px", width: "0px", left: $(window).width() / 2 + "px"});
                    //$(".page").eq(YZSlide.currentIndex).find(".page_bg").find("img").animate({height: "0px"});
                }

                //将显示的页面效果
                $(".page").eq(YZSlide.currentIndex + 1).animate({top: "0px"}, function () {
                    if (YZSlide.animationType == AnimationType.Shrink) {
                    }
                    else if (YZSlide.animationType == AnimationType.Scale) {
                        //恢复上一页位置到初始位置
                        $(".page").eq(YZSlide.currentIndex).height($(window).height() + "px");
                        $(".page").eq(YZSlide.currentIndex).width($(window).width() + "px");
                        $(".page").eq(YZSlide.currentIndex).css("left", "0px");
                        $(".page").eq(YZSlide.currentIndex).find(".page_bg").find("img").height(YZSlide.bgImgHeight[YZSlide.currentIndex] + "px");
                    }

                    YZSlide.pageSlided = true;
                    YZSlide.currentIndex++;
                    YZSlide.afterPageSlided();
                });
            }
            else{
                $(".page").eq(YZSlide.currentIndex).animate({height: $(window).height() + "px", width: $(window).width() + "px", left: "0px"});
                $(".page").eq(YZSlide.currentIndex).find(".page_bg").find("img").animate({height: YZSlide.bgImgHeight[YZSlide.currentIndex] + "px"});

                $(".page").eq(YZSlide.currentIndex + 1).animate({top: $(window).height() + "px"}, function () {
                    YZSlide.pageSlided = true;
                    YZSlide.afterPageHidden();
                });
            }
        }
        else if (YZSlide.currentIndex > 0 && deltaY > 0){//向下滑动
            if ($(".page").eq(YZSlide.currentIndex).offset().top > $(window).height() / 5){
                if (YZSlide.animationType == AnimationType.Shrink) {
                    $(".page").eq(YZSlide.currentIndex - 1).animate({height: $(window).height()});
                    $(".page").eq(YZSlide.currentIndex - 1).find(".page_bg").find("img").animate({height: YZSlide.bgImgHeight[YZSlide.currentIndex - 1]});

                    $(".page").eq(YZSlide.currentIndex).animate({top: $(window).height() + "px"}, function(){
                        YZSlide.pageSlided = true;
                        YZSlide.currentIndex--;
                        YZSlide.afterPageSlided();
                    });
                }
                else if (YZSlide.animationType == AnimationType.Scale) {
                    $(".page").eq(YZSlide.currentIndex - 1).animate({height: $(window).height(), width: $(window).width(), left: "0px", top: "0px"});
                    $(".page").eq(YZSlide.currentIndex - 1).find(".page_bg").find("img").animate({height: YZSlide.bgImgHeight[YZSlide.currentIndex - 1]});

                    $(".page").eq(YZSlide.currentIndex).animate({top: $(window).height() + "px", width: "0px", height: "0px", left: $(window).width() / 2 + "px"}, function(){
                        //恢复下一页位置到底部
                        $(".page").eq(YZSlide.currentIndex).height($(window).height());
                        $(".page").eq(YZSlide.currentIndex).width($(window).width());
                        $(".page").eq(YZSlide.currentIndex).css("left", "0px");
                        $(".page").eq(YZSlide.currentIndex).find(".page_bg").find("img").animate({height: YZSlide.bgImgHeight[YZSlide.currentIndex]});

                        YZSlide.pageSlided = true;
                        YZSlide.currentIndex--;
                        YZSlide.afterPageSlided();
                    });
                }
                else{
                    $(".page").eq(YZSlide.currentIndex).animate({top: $(window).height() + "px"}, function(){
                        YZSlide.pageSlided = true;
                        YZSlide.currentIndex--;
                        YZSlide.afterPageHidden();
                    });
                }
            }
            else{
                if (YZSlide.animationType == AnimationType.Shrink) {
                    $(".page").eq(YZSlide.currentIndex - 1).animate({height: "0px"});
                    $(".page").eq(YZSlide.currentIndex - 1).find(".page_bg").find("img").animate({height: "0px"});

                    $(".page").eq(YZSlide.currentIndex).find(".page_bg").find("img").animate({height: YZSlide.bgImgHeight[YZSlide.currentIndex]});
                    $(".page").eq(YZSlide.currentIndex).animate({top: "0px", height: $(window).height() + "px"}, function(){
                        YZSlide.pageSlided = true;
                        YZSlide.afterPageSlided();
                    });
                }
                else if (YZSlide.animationType == AnimationType.Scale){
                    $(".page").eq(YZSlide.currentIndex - 1).animate({height: $(window).height() + "px", width: $(window).width + "px", top: -$(window).height() + "px", left: "0px"});
                    $(".page").eq(YZSlide.currentIndex - 1).find(".page_bg").find("img").animate({height: YZSlide.bgImgHeight[YZSlide.currentIndex]});

                    $(".page").eq(YZSlide.currentIndex).find(".page_bg").find("img").animate({height: YZSlide.bgImgHeight[YZSlide.currentIndex]});
                    $(".page").eq(YZSlide.currentIndex).animate({top: "0px", width: $(window).width() + "px", height: $(window).height() + "px", left: "0px"}, function(){
                        YZSlide.pageSlided = true;
                        YZSlide.afterPageSlided();
                    });
                }
                else{
                    $(".page").eq(YZSlide.currentIndex).animate({top: "0px"}, function(){
                        YZSlide.pageSlided = true;
                        YZSlide.afterPageHidden();
                    });
                }
            }
        }
    }
}