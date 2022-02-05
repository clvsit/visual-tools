<template>
    <nav-comp title="视频比对工具"></nav-comp>

    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                <div class="input-container">
                    <h3>功能区域</h3>
                    <hr/>
                    <div class="list-group">
                        <div class="list-group-item no-border flex-space-between">
                            <div @click="play()" class="btn btn-default">
                                <i class="glyphicon glyphicon-play"></i>
                                全部播放
                            </div>
                            <div @click="stop()" class="btn btn-default">
                                <i class="glyphicon glyphicon-pause"></i>
                                全部暂停
                            </div>
                        </div>
                        <div class="list-group-item no-border">
                            <label class="control-label">倍速设置：</label>
                            <input v-model="setting.speed" type="number" class="form-control" min="0.5" max="2.0" step="0.1" />
                        </div>
                        <div class="list-group-item no-border">
                            <label class="control-label">时间设置：</label>
                            <input v-model="setting.time" type="text" class="form-control" placeholder="请按照 hh:mm:ss 格式输入跳转时间点" />
                        </div>
                        <div class="list-group-item no-border">
                            <div @click="setSetting" class="btn btn-default">提交</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="input-container flex-space-between">
                    <video-comp ref="video1" class="col-md-6" name="1 号视频区域" height="550"></video-comp>
                    <video-comp ref="video2" class="col-md-6" name="2 号视频区域" height="550"></video-comp>
                </div>
            </div>
            <div class="col-md-3">
                <history-comp ref="historyComp" save-name="video_compare"></history-comp>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/base.scss";

</style>

<script>
import NavComp from "@/components/NavComp.vue"
import HistoryComp from "@/components/HistoryComp.vue"
import VideoComp from "@/components/VideoComp.vue"

export default {
    name: "videoCompare",
    components: {
        NavComp,
        HistoryComp,
        VideoComp
    },
    data() {
        return {
            setting: {
                speed: 1.0,
                time: ""
            }
        }
    },
    created() {
        let _this = this;

        this.$nextTick(() => {
            _this.$refs.historyComp.getHistoryList();
        });
        
    },
    methods: {
        play() {
            this.$refs.video1.play();
            this.$refs.video2.play();
        },
        stop() {
            this.$refs.video1.stop();
            this.$refs.video2.stop();
        },
        setSetting() {
            const timeSplit = this.setting.time.split(":"),
                currentTime = Number(timeSplit[0]) * 3600 + Number(timeSplit[1]) * 60 + Number(timeSplit[2])

            this.$refs.video1.setSpeed(Number(this.setting.speed));
            this.$refs.video2.setSpeed(Number(this.setting.speed));
            this.$refs.video1.setTime(currentTime);
            this.$refs.video2.setTime(currentTime);
        }
    }
}
</script>