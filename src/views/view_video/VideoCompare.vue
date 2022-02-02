<template>
    <nav-comp title="视频比对工具"></nav-comp>

    <div class="container-fluid mt-20">
        <div class="row">
            
            <div class="col-md-6">
                <div class="input-container flex-space-between">
                    <video-comp class="col-md-6" name="1 号视频区域" height="550"></video-comp>
                    <video-comp class="col-md-6" name="2 号视频区域" height="550"></video-comp>
                </div>
            </div>
            <div class="col-md-3">
                <history-comp></history-comp>
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

        }
    },
    methods: {

    }
}
</script>