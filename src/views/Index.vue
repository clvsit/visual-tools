<template>
  <div id="app" class="background">
    <div class="main-container">
      <div class="row">
        <div class="sidebar">
          <img
            class="decorate decorate-sakura"
            src="../assets/images/left_sakura1.png"
            alt="decorate"
          />
          <img
            class="sidebar-logo"
            src="../assets/images/logo.png"
            alt="logo"
          />
          <div class="h4 sidebar-title">可视化工具箱</div>
          <ul class="sidebar-menu">
            <li
              @click="panelType = 1"
              class="sidebar-menu-item"
              :class="{ active: panelType === 1 }"
            >
              <i class="glyphicon glyphicon-picture"></i>
              <span class="ml-5">图片处理</span>
            </li>
            <li
              @click="panelType = 2"
              class="sidebar-menu-item"
              :class="{ active: panelType === 2 }"
            >
              <i class="glyphicon glyphicon-film"></i>
              <span class="ml-5">视频处理</span>
            </li>
            <li
              @click="panelType = 3"
              class="sidebar-menu-item"
              :class="{ active: panelType === 3 }"
            >
              <i class="glyphicon glyphicon-file"></i>
              <span class="ml-5">文件处理</span>
            </li>
            <li
              @click="panelType = 4"
              class="sidebar-menu-item"
              :class="{ active: panelType === 4 }"
            >
              <i class="glyphicon glyphicon-usd"></i>
              <span class="ml-5">业务相关</span>
            </li>
          </ul>
          <i class="glyphicon glyphicon-tower sidebar-bottom-logo"></i>
        </div>
        <div class="main">
          <div v-if="panelType === 1">
            <div class="main-header">
              <div class="header-box">
                <div class="header-title">
                  <i class="glyphicon glyphicon-tag"></i>
                  <span class="title ml-10">序列标注</span>
                </div>
              </div>
              <div class="delimiter"></div>
            </div>
            <div class="main-body">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <div class="swiper-item">
                      <img
                        src="../assets/images/pic_picture_1.png"
                        alt="图片遮罩处理"
                      />
                      <div class="caption">
                        <h2>图片遮罩处理</h2>
                        <p class="caption-desc">
                          使用遮罩块对图片指定区域进行遮罩
                        </p>
                      </div>
                      <div class="swiper-item-footer">
                        <p class="text-right">
                          <a
                            @click="linkTo('modify')"
                            class="btn btn-default"
                            role="button"
                            >进入</a
                          >
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="swiper-pagination"></div>
              </div>
            </div>
          </div>
          <div v-else-if="panelType === 2">
            <div class="main-header">
              <div class="header-box">
                <div class="header-title">
                  <i class="glyphicon glyphicon-film"></i>
                  <span class="title ml-10">视频处理</span>
                </div>
              </div>
              <div class="delimiter"></div>
            </div>
            <div class="main-body">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <div class="swiper-item">
                      <img
                        src="../assets/images/pic_video_1.jpg"
                        alt="视频比对"
                      />
                      <div class="caption">
                        <h2>视频比对</h2>
                        <p class="caption-desc">同时比对两个视频的效果。</p>
                      </div>
                      <div class="swiper-item-footer">
                        <p class="text-right">
                          <a
                            @click="linkTo('video/compare')"
                            class="btn btn-default"
                            role="button"
                            >进入</a
                          >
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="swiper-pagination"></div>
              </div>
            </div>
          </div>
          <div v-else-if="panelType === 3">
            <div class="main-header">
              <div class="header-box">
                <div class="header-title">
                  <i class="glyphicon glyphicon-file"></i>
                  <span class="title ml-10">文件处理</span>
                </div>
              </div>
              <div class="delimiter"></div>
            </div>
            <div class="main-body">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <div class="swiper-item">
                      <img
                        src="../assets/images/pic_video_1.jpg"
                        alt="视频比对"
                      />
                      <div class="caption">
                        <h2>文件比对工具</h2>
                        <p class="caption-desc">
                          比对两个文件夹内同名文件差异的工具
                        </p>
                      </div>
                      <div class="swiper-item-footer">
                        <p class="text-right">
                          <a
                            @click="linkTo('file/compare')"
                            class="btn btn-default"
                            role="button"
                            >进入</a
                          >
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="swiper-pagination"></div>
              </div>
            </div>
          </div>
          <div v-else-if="panelType === 4">
            <div class="main-header">
              <div class="header-box">
                <div class="header-title">
                  <i class="glyphicon glyphicon-usd"></i>
                  <span class="title ml-10">业务相关</span>
                </div>
              </div>
              <div class="delimiter"></div>
            </div>
            <div class="main-body">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <div class="swiper-item">
                      <img
                        src="../assets/images/pic_video_1.jpg"
                        alt="视频比对"
                      />
                      <div class="caption">
                        <h2>ASR 纠错工具</h2>
                        <p class="caption-desc">查看当前 ASR 纠错功能的效果</p>
                      </div>
                      <div class="swiper-item-footer">
                        <p class="text-right">
                          <a
                            @click="linkTo('business/asr_correct')"
                            class="btn btn-default"
                            role="button"
                            >进入</a
                          >
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="swiper-pagination"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "~@/assets/style/base.scss";
@import "~@/assets/style/index.scss";

.ul, .li {
  padding-left: 0;
}

.sidebar {
  position: relative;
  width: 200px;
  height: 600px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;

  .decorate {
    position: absolute;
    z-index: 1;
  }

  .decorate-sakura {
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
  }

  .sidebar-logo {
    margin-top: 40px;
    margin-left: 60px;
    width: 80px;
  }

  .sidebar-title {
    text-align: center;
    font-weight: 900;
  }

  .sidebar-menu {
    height: 330px;
    margin-top: 70px;
    padding-left: 0;
    list-style: None;

    .active {
      background-color: rgba(0, 0, 0, 0.9);
      color: #fff;
    }

    .active:hover {
      background-color: rgba(0, 0, 0, 0.5);
      color: #000;
    }

    .sidebar-menu-item {
      height: 40px;
      line-height: 40px;
      padding-left: 50px;
      cursor: pointer;
      transition: all 0.25s ease-in-out;

      .glyphicon {
        font-size: 14px;
      }

      span {
        font-size: 16px;
        font-weight: 800;
      }
    }

    .sidebar-menu-item:hover {
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
    }
  }

  .sidebar-bottom-logo {
    font-size: 32px;
    color: #000;
    margin-left: 84px;
    cursor: pointer;
  }

  //   .main-body .thumbnail:hover {
  //     box-shadow: 0 3px 5px 3px rgba(0, 0, 0, 0.5);
  //   }

  //   .main-body .thumbnail .caption-desc {
  //     width: 100%;
  //     height: 50px;
  //     line-height: 25px;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     display: -webkit-box;
  //     -webkit-line-clamp: 2;
  //     -webkit-box-orient: vertical;
  //   }
}

/* 右侧主体区域 */
.main {
  width: 900px;
  height: 600px;
  background-color: #fff;

  .main-header {
    width: 100%;
    height: 60px;
    padding: 0 20px;

    .header-box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .header-title {
      display: flex;
      flex-direction: row;
      width: 300px;
      height: 60px;
      line-height: 60px;
      padding-left: 10px;

      i {
        font-size: 20px;
        margin-top: 20px;
      }

      .title {
        font-size: 24px;
      }
    }
  }

  .main-body {
    height: 530px;
    margin-top: 10px;
    padding: 20px;
    overflow: hidden;

    .swiper-container {
      width: 100%;
      height: 100%;

      .swiper-item {
        position: relative;
        width: 100%;
        height: 100%;
        transition: all 0.25s linear;

        img {
          height: 256px;
          box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.4);
          border-radius: 10px;
        }

        .swiper-item-footer {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 50px;
          padding: 10px 0;
          border-top: 1px solid rgba(0, 0, 0, 0.1);

          .btn-default {
            background-color: #000;
            color: #fff;
          }
        }
      }
    }

    .swiper-pagination {
      position: relative;
    }
  }
}
</style>

<script>
// import { defineComponent } from '@vue/composition-api'

export default {
  name: "Index",
  data() {
    return {
      panelType: 1,
      panel: {
        width: 600,
        height: 400,
        marginLeft: 0,
        marginTop: 0,
      },
      setting: {
        backgroundColor: "#7e7979",
      },
      requestUrl: "",
    };
  },
  watch: {
    "setting.backgroundColor"() {
      $("#flowerC").css("background-color", this.setting.backgroundColor);
    },
  },
  created() {
    let _this = this;

    this.$nextTick(() => {
      this.createSwiper();
      this.getSetting();

      $("#flowerC").css("background-color", this.setting.backgroundColor);
    });

    $.getJSON({
      url: "/static/config/config.json",
      method: "GET",
      success(resp) {
        _this.requestUrl = resp.requestUrl;
      },
      fail(error) {
        $("#modal").modal();
        this.alert = {
          type: "alert-danger",
          message: error,
        };
        setTimeout(function () {
          $("#modal").modal("hide");
        }, 3000);
      },
    });
  },
  methods: {
    linkTo(url) {
      window.open(url, "_blank");
    },
    createSwiper() {
      const swiper = new Swiper(".swiper-container", {
        direction: "horizontal",
        followFinger: false,
        speed: 800,
        mousewheel: true,
        spaceBetween: 30,
        pagination: {
          el: ".swiper-pagination",
        },
        on: {
          init: function (swiper) {
            slide = this.slides.eq(0);
            slide.addClass("ani-slide");
          },
          transitionStart: function () {
            for (i = 0; i < this.slides.length; i++) {
              slide = this.slides.eq(i);
              slide.removeClass("ani-slide");
            }
          },
          transitionEnd: function () {
            slide = this.slides.eq(this.activeIndex);
            slide.addClass("ani-slide");
          },
        },
      });
    },
    enterSettingPage() {
      let _this = this;

      this.panelType = 99;

      this.$nextTick(() => {
        console.log($("#colorPicker"));
        $("#colorPicker")
          .css("background-color", this.setting.backgroundColor)
          .paigusu(
            {
              color: _this.setting.backgroundColor,
            },
            function (event, obj) {
              $(event).css("background-color", "#" + obj.hex);
              _this.setting.backgroundColor = "#" + obj.hex;
              _this.saveSetting();
            }
          );
      });
    },
    showSidebarFunc() {
      const funcIconList = $("#sidebarBottom").find(".func-icon"),
        funcIcon1 = funcIconList.eq(0);

      funcIconList.removeClass("sr-only");
      funcIcon1.css("top", "-75px");

      setTimeout(() => {
        funcIcon1.addClass("animate__heartBeat");
      }, 750);
    },
    saveSetting() {
      localStorage.setItem("setting", JSON.stringify(this.setting));
    },
    getSetting() {
      this.setting = JSON.parse(localStorage.getItem("setting")) || {};

      if (!this.setting.backgroundColor) {
        this.setting.backgroundColor = "#7e7979";
      }
    },
  },
};
</script>
