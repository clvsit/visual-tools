<template>
    <div class="content-block">
        <h3 class="text-center" v-text="name"></h3>
        <hr/>
        <ul class="info-block">
            <li class="info-item">
                <b>文件名称：</b>
                <span v-text="content.name"></span>
            </li>
            <li class="info-item mt-10">
                <b>文件类型：</b>
                <span v-text="content.type"></span>
            </li>
        </ul>
        <h4 class="mt-20 text-center">【内容展示】</h4>
        <div id="showBlock" class="show-block">
            <div :class="{'hidden': content.type!=='json'}" id="leftJson"
                    class="show-json"></div>
            <div :class="{'hidden': content.type!=='video'}" class="show-video">
                <video id="leftVideo" :src="content.path" controls></video>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ContentShow",
    props: {
        name: {
            type: String,
            required: true
        },
        content: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.content-block {
    
    .info-block {
        padding-left: 20px;

        .info-item {
            height: 30px;
            line-height: 30px;
            list-style-type: circle;
            list-style-position: inside;
        }
    }

    .show-block {
        height: 500px;
        padding: 10px 20px;
        overflow: auto;

        .show-video video {
            width: 100%;
        }
    }

    .show-block::-webkit-scrollbar {
        width: 4px;
    }

    .show-block::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: rgba(0,0,0,0.2);
    }

    .show-block::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: rgba(0,0,0,0.1);
    }
}
</style>