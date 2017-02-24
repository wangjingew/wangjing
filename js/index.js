/**
 * Created by zhangedward on 15/4/14.
 */

var context2d;
var DEFAULT_BG_IMG_WIDTH = 720;
var DEFAULT_BG_IMG_HEIGHT = 1136;
$(function(){

    //音乐控制
    var musicElement = document.getElementById("myAudio");
    var musicBuff=0;
    var ev = event || window.event;
    $(".musicC").on("touchstart",function(){
        if(musicElement.paused){
            musicElement.play();
            $(".musicC").addClass("on");
            musicBuff=0;
        }else{
            musicElement.pause();
            $(".musicC").removeClass("on");
            musicBuff=1;
        }
    });
    function checkVideo(){
        if($(".video_mk").is(":hidden")){
            if(musicBuff==0){
                musicElement.play();
                $(".musicC").html("音乐:开");
            }
            $(".musicC").show();
        }else{
            musicElement.pause();
            $(".musicC").html("音乐:关");
            $(".musicC").hide();
        }
    }

    function bindEvent() {
        var a = [],
            b = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()),
            c = b ? "touchstart": "mousedown",
            d = b ? "touchmove": "mouseup",
            e = b ? "touchend":"mouseup";
        a = [b, c, d,e];
        return a;
    }







    "use strict";
    YZSlide.init(AnimationType.Scale, reachStart, reachIndex, reachEnd);

    YZSlide.loadManifest([
        {id: "page_1_bg", src: "images/p1_bg.jpg", type: YZSlide.Type_Image},
        {id: "page_2_bg", src: "images/p2_bg.jpg", type: YZSlide.Type_Image},
        {id: "page_3_bg", src: "images/p3_bg.jpg", type: YZSlide.Type_Image},
        {id: "page_4_bg", src: "images/p4_bg.jpg", type: YZSlide.Type_Image},
        {id: "page_5_bg", src: "images/p5_bg.jpg", type: YZSlide.Type_Image},
        {id: "page_6_bg", src: "images/p6_bg.jpg", type: YZSlide.Type_Image},
        {id: "page_7_bg", src: "images/p7_bg.jpg", type: YZSlide.Type_Image},
        {id: "page_8_bg", src: "images/p8_bg.jpg", type: YZSlide.Type_Image}

    ]);

    $("#page_1_arrow").show();
    $("#page_1_canvas").css("border-radius", $("#page_1_canvas").width() / 2);
    var page1Canvas = document.getElementById("page_1_canvas");
    context2d = page1Canvas.getContext("2d");
    context2d.fillStyle = "rgba(255, 255, 255, 0)";
    context2d.fillRect(0, 0, 400, 400);

    //$("#page_1_canvas").bind("touchstart", scratchStart);
    //$("#page_1_canvas").bind("touchmove", scratchMove);
    $(".container").bind("touchstart", YZSlide.touchstart);
    $(".container").bind("touchmove", YZSlide.touchmove);
    $(".container").bind("touchend", YZSlide.touchend);

    //微信js api准备
    $.get(
        "http://wx.yunzhu.me/api/js.php?action=sign&wid=fivedimension&url=" + location.href,
        function(data){
            var signObject = eval("(" + data + ")");
            wx.config({
                debug: false,
                appId: signObject.appId,
                timestamp: signObject.timestamp,
                nonceStr: signObject.nonceStr,
                signature: signObject.signature,
                jsApiList:[
                    "onMenuShareAppMessage",
                    "onMenuShareTimeline"
                ]
            });
        }
    );


    $("#book_visit").bind("touchstart", function(){
        location.href = "http://zh.youpengchina.com/ticket/app/index.php?wid=xweibo@shjoycity.com&id=10";
    });

    $("#succulent_culture").bind("touchstart", function(){
        location.href = "http://joycity.normcoregroup.com";
    });
});


var previous_point = {x: 0, y: 0};
var scratch_count = 0;

function scratchStart(evt){
    "use strict";

    previous_point.x = evt.originalEvent.touches[0].pageX;
    previous_point.y = evt.originalEvent.touches[0].pageY;

    evt.preventDefault();
    evt.stopPropagation();
}

function scratchMove(evt){
    "use strict";
    if (scratch_count == -1){
        return;
    }

    var scaleX = 400 / $("#page_1_canvas").width();
    var scaleY = 400 / $("#page_1_canvas").height();

    context2d.globalCompositeOperation = 'destination-out';
    context2d.strokeStyle = "white";
    context2d.lineCap = "round";
    context2d.lineWidth = 32;
    context2d.moveTo((previous_point.x - $("#page_1_canvas").offset().left) * scaleX, (previous_point.y - $("#page_1_canvas").offset().top) * scaleY);
    context2d.lineTo((evt.originalEvent.touches[0].pageX - $("#page_1_canvas").offset().left) * scaleX, (evt.originalEvent.touches[0].pageY - $("#page_1_canvas").offset().top) * scaleY);
    context2d.stroke();

    previous_point.x = evt.originalEvent.touches[0].pageX;
    previous_point.y = evt.originalEvent.touches[0].pageY;

    if (scratch_count++ > 0){
        scratch_count = -1;

        $("#page_1_arrow").show();
        $("#page_1_canvas").hide();
        $(".container").bind("touchstart", YZSlide.touchstart);
        $(".container").bind("touchmove", YZSlide.touchmove);
        $(".container").bind("touchend", YZSlide.touchend);
    }

    evt.preventDefault();
    evt.stopPropagation();
}

function reachStart(){
    "use strict";
    $(".page").eq(0).show();
    $("#slide_arrow_down").hide();
    $("#slide_arrow_up").show();
    $("#page_1_title").show();

    $("#page_1_desc_0").fadeIn(function(){
        $("#page_1_desc_1").fadeIn(function(){
            $("#page_1_desc_2").fadeIn(function(){
                $("#page_1_desc_3").fadeIn(function(){
                    $("#page_1_desc_4").fadeIn(function(){
                        $("#page_1_desc_5").fadeIn();
                    });
                });
            });
        });
    });
}

function reachIndex(pageIndex){
    "use strict";

    $("#page_" + pageIndex + "_text").hide();
    $("#page_" + pageIndex + "_title").hide();
    $("#page_" + (pageIndex + 1) + "_text").show();
    if (pageIndex + 2 > YZSlide.manifestObj.length - 1){
        $("#page_0_text").show();
        $("#page_0_title").hide();
    }
    else{
        $("#page_" + (pageIndex + 2) + "_text").hide();
        $("#page_" + (pageIndex + 2) + "_title").hide();
    }
    if (pageIndex > 0){//不是第一页
        $("#page_1_desc_0").hide();
        $("#page_1_desc_1").hide();
        $("#page_1_desc_2").hide();
        $("#page_1_desc_3").hide();
        $("#page_1_desc_4").hide();
        $("#page_1_desc_5").hide();
    }
    if (pageIndex < 8){//不是最后一页
        $("#page_9_text_0").hide();
        $("#page_9_text_1").hide();
        $("#page_9_text_2").hide();
    }
    if (pageIndex == 1){//第2页
        $("#page_2_text_0").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $("#page_2_text_1").addClass("animated fadeInUp");
            $("#page_2_text_1").show();
        });
        $("#page_2_text_1").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $("#page_2_text_2").addClass("animated fadeInUp");
            $("#page_2_text_2").show();
        });
        $("#page_2_text_0").addClass("animated fadeInUp");
        $("#page_2_text_0").show();
    }
    else{
        $("#page_2_text_0").removeClass("animated fadeInUp");
        $("#page_2_text_0").hide();
        $("#page_2_text_1").removeClass("animated fadeInUp");
        $("#page_2_text_1").hide();
        $("#page_2_text_2").removeClass("animated fadeInUp");
        $("#page_2_text_2").hide();
    }
    if (pageIndex == 4){//第5页
        $("#page_5_text_0").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $("#page_5_text_1").addClass("animated fadeInUp");
            $("#page_5_text_1").show();
        });
        $("#page_5_text_1").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $("#page_5_text_2").addClass("animated fadeInUp");
            $("#page_5_text_2").show();
        });
        $("#page_5_text_0").addClass("animated fadeInUp");
        $("#page_5_text_0").show();
    }
    else{
        $("#page_5_text_0").removeClass("animated fadeInUp");
        $("#page_5_text_0").hide();
        $("#page_5_text_1").removeClass("animated fadeInUp");
        $("#page_5_text_1").hide();
        $("#page_5_text_2").removeClass("animated fadeInUp");
        $("#page_5_text_2").hide();
    }
    if (pageIndex == 5){//第6页
        $("#page_6_text_0").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $("#page_6_text_1").addClass("animated fadeInUp");
            $("#page_6_text_1").show();
        });
        $("#page_6_text_1").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $("#page_6_text_2").addClass("animated fadeInUp");
            $("#page_6_text_2").show();
        });
        $("#page_6_text_0").addClass("animated fadeInUp");
        $("#page_6_text_0").show();
    }
    else{
        $("#page_6_text_0").removeClass("animated fadeInUp");
        $("#page_6_text_0").hide();
        $("#page_6_text_1").removeClass("animated fadeInUp");
        $("#page_6_text_1").hide();
        $("#page_6_text_2").removeClass("animated fadeInUp");
        $("#page_6_text_2").hide();
    }

}

function reachEnd(){
    "use strict";
    $("#slide_arrow_down").show();
    $("#slide_arrow_up").hide();
}

//微信分享
wx.ready(function(){
    wx.onMenuShareAppMessage({
        title: '第五空间',
        desc: '第五空间是一个超越四维时空的存在',
        link: 'http://wx.yunzhu.me/custdev/fivespace/brand/index.html', // 分享链接
        imgUrl: 'http://wx.yunzhu.me/custdev/fivespace/brand/images/logo.jpg', // 分享图标
        success: function () {
            //confirmShared();
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareTimeline({
        title: '第五空间是一个超越四维时空的存在',
        link: 'http://wx.yunzhu.me/custdev/fivespace/brand/index.html', // 分享链接
        imgUrl: 'http://wx.yunzhu.me/custdev/fivespace/brand/images/logo.jpg',
        success: function () {
            //confirmShared();
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});