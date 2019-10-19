/**
 * author: 施建新
 * day: 2019-10-13
 * version：v1.0
 * 依赖于jQuery，在js中调用swiper({})
 * imgList(Array): 图片路径
 * animationType：轮播方式,fade/animate,默认animate
 * width/height：轮播图宽度和高度,默认父级宽度和高度
 * btnColor：左右按钮颜色
 * btnSize：左右按钮大小
 * btnPosition：左右按钮距离两边的距离
 * liSize：底部按钮的大小
 * liColor：底部按钮的颜色
 * liPosition：底部按钮距离底部的距离
 * liActiveColor：底部按钮选中后的颜色
 * liMargin：底部按钮左右间距
 * turnTime：轮播方式为animate时的图片滑动时间
 * delay：轮播延迟时间
 * fadeTime：轮播方式为fade时的图片变化时间
 * auto：是否自动轮播
 * direction：设置左右轮播,pre/next,默认next
 * mouseEnter：鼠标移入是否停止轮播,boolean,默认true
 */
(function($) {
  function Swiper(obj) {
    this.wrap = obj.wrap;
    this.imgList = obj.images;
    this.imgNum = obj.images.length;
    this.animationType = obj.animationType || "animate";
    this.width = obj.width || $(this.wrap).width();
    this.height = obj.height || $(this.wrap).height();
    this.btnColor = obj.btnColor || "#fff";
    this.btnSize = obj.btnSize || 5;
    this.btnPosition = obj.btnPosition || 20;
    this.liSize = obj.liSize || 20;
    this.liPosition = obj.liPosition || 30;
    this.liColor = obj.liColor || "#fff";
    this.liActiveColor = obj.liActiveColor || "#000";
    this.liMargin = obj.liMargin || 20;
    this.turnTime = obj.turnTime || 0.3;
    this.delay = obj.delay || 3000;
    this.fadeTime = obj.fadeTime || 500;
    this.auto = obj.auto === undefined ? true : obj.auto;
    this.direction = obj.direction || "next";
    this.mouseEnter = obj.mouseEnter === undefined ? true : obj.mouseEnter;
    this.nowIndex = 0; // 当前图片的索引
    this.lock = true; //添加锁，确保图片被完整滑动
    this.timer = null; //设置定时器
    this.createDom();
    this.initStyle();
    this.bindEvent();
    if (this.auto) {
      this.sliderAuto();
    };
  }
  // 创建Dom
  Swiper.prototype.createDom = function() {
    const $ul = $('<ul class="swiper"></ul>');
    const $oUl = $('<ul class="oUl"></ul>');
    this.imgList.forEach(item => {
      const $li = $(`<li><a href="#"><img src="${item}"></img></a></li>`);
      const $oli = $("<li></li>");
      $ul.append($li);
      $oUl.append($oli);
    });
    // 如果是无缝轮播图，则多创建一张图片
    if (this.animationType === "animate") {
      $(`<li><a href=#><img src="${this.imgList[0]}"></img></a></li>`).appendTo(
        $ul
      );
    }
    const $leftBtn = $('<span class="leftBtn">&lt;</span>');
    const $rightBtn = $('<span class="rightBtn">&gt;</span>');
    $(this.wrap)
      .append($ul)
      .append($oUl)
      .append($leftBtn)
      .append($rightBtn);
  };
  // 初始化dom样式
  Swiper.prototype.initStyle = function() {
    // 防止用户没有设置
    $("*", this.wrap).css({
      margin: 0,
      padding: 0,
      listStyle: "none",
      fontSize: 0
    });
    $(this.wrap).css({
      position: "relative",
      overflow: "hidden"
    });
    $(".swiper", this.wrap).css({
      width:
        this.animationType === "animate"
          ? (this.imgNum + 1) * this.width
          : this.width,
      height: this.height,
      position: "absolute",
      left: 0
    });
    $(".swiper li", this.wrap).css({
      display: "inline-block",
      width: this.width,
      height: this.height
    });
    $(".swiper li img", this.wrap).css({
      width: this.width,
      height: this.height
    });
    $(".leftBtn, .rightBtn", this.wrap).css({
      display: "block",
      position: "absolute",
      fontSize: this.btnSize + "px",
      color: this.btnColor,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      userSelect: "none"
    });
    $(".leftBtn", this.wrap).css({
      left: this.btnPosition + "px"
    });
    $(".rightBtn", this.wrap).css({
      right: this.btnPosition + "px"
    });
    $(".oUl", this.wrap).css({
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      bottom: this.liPosition + "px"
    });
    $(".oUl li", this.wrap).css({
      width: this.liSize,
      height: this.liSize,
      borderRadius: "50%",
      backgroundColor: this.liColor,
      display: "inline-block",
      margin: `0 ${this.liMargin + "px"}`
    }).eq(this.nowIndex).css({
        backgroundColor: this.liActiveColor
    });
  };
  // 图片轮播
  Swiper.prototype.move = function(dir) {
    if (this.lock) {
      this.lock = false;
      switch (dir) {
        case "prev":
          if (this.animationType === "animate") {
            if (this.nowIndex === 0) {
              $(".swiper", this.wrap).css({
                left: -this.width * this.imgNum - 1
              });
              this.nowIndex = this.imgNum - 1;
            } else {
              this.nowIndex--;
            }
          } else if (this.animationType === "fade") {
            if (this.nowIndex === 0) {
              this.nowIndex = this.imgNum - 1;
            } else {
              this.nowIndex--;
            }
          }
          break;
        case "next":
          if (this.animationType === "animate") {
            if (this.nowIndex === this.imgNum) {
              $(".swiper", this.wrap).css({
                left: 0
              });
              this.nowIndex = 1;
            } else {
              this.nowIndex++;
            }
          } else if (this.animationType === "fade") {
            if (this.nowIndex === this.imgNum - 1) {
              this.nowIndex = 0;
            } else {
              this.nowIndex++;
            }
          }
          break;
        default:
          this.nowIndex = dir;
      }
      if (this.animationType === "animate") {
        $(".swiper", this.wrap).animate(
          {
            left: -this.width * this.nowIndex
          },
          this.turnTime + "s",
          () => {
            //重置锁
            this.lock = true;
          }
        );
      } else if (this.animationType === "fade") {
        $(".swiper li", this.wrap)
          .fadeOut(this.fadeTime)
          .eq(this.nowIndex)
          .fadeIn(this.fadeTime, () => {
            this.lock = true;
          });
      }
      $(".oUl > li", this.wrap)
        .css({
          backgroundColor: this.liColor
        })
        .eq(this.nowIndex % this.imgNum)
        .css({
          backgroundColor: this.liActiveColor,
        });
    }
  };
  // 绑定事件
  Swiper.prototype.bindEvent = function() {
    $(".leftBtn", this.wrap).on("click", () => {
      this.move("prev");
    });
    $(".rightBtn", this.wrap).on("click", () => {
      this.move("next");
    });
    if (this.auto && this.mouseEnter) {
      $(this.wrap)
        .on("mouseenter", () => {
          clearInterval(this.timer);
        })
        .on("mouseleave", () => {
          this.sliderAuto();
        });
    }
  };
  // 自动轮播
  Swiper.prototype.sliderAuto = function() {
    this.timer = setInterval(() => {
      if (this.direction === "next") {
        $(".rightBtn", this.wrap).trigger("click");
      } else if (this.direction === "pre") {
        $(".leftBtn", this.wrap).trigger("click");
      }
    }, this.delay);
  };
  $.fn.extend({
    swiper: function(obj) {
      obj.wrap = this;
      new Swiper(obj);
    }
  });
})($);
