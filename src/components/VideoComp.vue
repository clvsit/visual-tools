<template>
  <div class="video-component">
    <h3 v-text="name"></h3>
    <hr />
    <div class="video-input-box">
      <label for="videoPath" class="control-label sr-only">视频地址：</label>
      <input
        v-model="path"
        id="videoPath"
        type="text"
        class="form-control wd-80-percent"
        placeholder="视频地址"
      />
      <div @click="getVideo" class="btn btn-default">确定</div>
    </div>
    <video id="videoDom" src="" controls :style="{'height': height + 'px'}"></video>
  </div>
</template>

<style lang="scss" scoped>
.video-input-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 15px 0;

    .btn-default {
        background-color: #000;
        color: #fff;
    }
}

video {
    width: 100%;
}
</style>

<script>
export default {
    name: "videoPlay",
    props: {
        name: {
            type: String,
            required: true
        },
        height: {}
    },
    data() {
        return {
            path: "",
            videoDom: null
        }
    },
    created() {
        let _this = this;

        this.$nextTick(() => {
            _this.videoDom = document.getElementById("videoDom");
        });
    },
    methods: {
        getVideo() {
            this.videoDom.src = this.path;
        },
        play() {
            this.videoDom.play();
        },
        stop() {
            this.videoDom.pause();
        },
        setSpeed(speed) {
            this.videoDom.playbackRate = Number(speed);
        },
        setTime(time) {
            const videoDom = document.getElementById("videoDom");
            videoDom.currentTime = time;
        }
    }
}
</script>